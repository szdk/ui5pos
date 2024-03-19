sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/util/Table",
    "sap/m/ObjectNumber",
    "sap/m/Text",
    ],
    function (
        Controller,
        TableGenerator,
        ObjectNumber,
        Text
    ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.order.Orders", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                window.orders = this;

                this.comp.szdk_serviceCreated.then((model) => {
                    let columns = [
                        {id : 'OrderID', label : this.i18n.getText('order_id'), path : 'OrderID', header: {/*minScreenWidth:"XXLarge", width:"5em"*/}},
                        {id : 'Customer', label : this.i18n.getText('customer'), path : 'Customer/ContactName', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                        {id : 'OrderDate', label : this.i18n.getText('order_date'), path : 'OrderDate', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                        {id : 'OrderTime', label : this.i18n.getText('order_time'), path : 'OrderDate', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                        {id : 'Freight', label : this.i18n.getText('order_total'), path : 'Freight', header: {hAlign : "End"}},
                    ].map((v) => ({
                        id : this.getView().createId(v.id),
                        cell: {bindingPath : v.path},
                        header : {header : v.label, ...v.header},
                        p13n : {key : v.id, label: v.label, path : v.path},
                        excel : {label : v.label, property : v.path}
                    }));
                    columns[2].cell.control = new Text({text: {
                        path : 'OrderDate',
                        type : 'sap.ui.model.odata.type.Date',
                    }});
                    columns[2].p13n.label = this.i18n.getText('order_date_time');
                    columns[3].cell.control = new Text({text: {
                        path : 'OrderDate',
                        type : {
                            formatValue : (v) => (new Date(v).toTimeString().split(' ')[0])
                        },
                    }});
                    delete columns[3].p13n;
                    columns[4].cell.control = new ObjectNumber({unit : "USD"});
                    columns[4].cell.control.bindProperty('number', {
                        parts:[{path:'Freight'},{value:'USD'}],
                        type: 'sap.ui.model.type.Currency',
                        formatOptions: {showMeasure:false}
                    });

                    let tableGenerator = new TableGenerator({
                        id: this.getView().createId('orders_table'),
                        i18n: this.i18n,
                        model,
                        // columnListItem : {type : sap.m.ListType.Navigation},
                        properties : {
                            busyIndicatorDelay : 0,
                            mode : sap.m.ListMode.SingleSelectMaster,
                            rememberSelections:true,
                            growing:true,
                            growingThreshold:50,
                            sticky: ['HeaderToolbar','ColumnHeaders'],
                            popinLayout: sap.m.PopinLayout.Block,
                            alternateRowColors: false,
                        },
                        itemsBinding : {
                            path : '/Orders',
                            parameters : {
                                expand : 'Customer'
                            }
                        },
                        customToolbar : {
                            // start : [filterButton, new ToolbarSeparator(), inputOpenProduct, buttonOpenProduct]
                        },
                        toolbar : {
                            p13n : {
                                Columns : true,
                                Sorter : true,
                                Groups : true,
                            },
                            excel : this.comp.getModel('settings').getProperty('/odata/useMock') ? 2 : 1,
                            growSize : true,
                            pin : true
                        },
                        columns,
                    });
                    this.byId('table_container').addContent(tableGenerator.getTable());
                    // tableGenerator.getTable().attachItemPress(this.onSelectionChange.bind(this)); todo
                });
                
            }
        });
    }
);