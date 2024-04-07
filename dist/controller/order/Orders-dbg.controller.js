sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/util/Table",
    "ui5pos/szdk/controller/util/F4Help",
    "ui5pos/szdk/controller/util/FilterDialog",
    "sap/m/ObjectNumber",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/ToolbarSeparator",
    "sap/m/Link",
    ],
    function (
        Controller,
        TableGenerator,
        F4Help,
        FilterDialog,
        ObjectNumber,
        ObjectIdentifier,
        Text,
        Input,
        Button,
        ToolbarSeparator,
        Link,
    ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.order.Orders", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                this.comp.getRouter().getRoute('orders').attachPatternMatched(this.defaultPatternMatched.bind(this));
                
                this.comp.szdk_serviceCreated.then((model) => {
                    let inputOpenOrder = new Input({
                        type : sap.m.InputType.Number,
                        placeholder: '{lang>order_id}',//this.i18n.getText('order_id'),
                        width : '9em'
                    });
                    
                    let buttonOpenOrder = new Button({
                        type: sap.m.ButtonType.Transparent ,
                        text: '{lang>open}',//this.i18n.getText('open'),
                        press : () => {
                            const error = () => {
                                inputOpenOrder.setValueStateText(this.i18n.getText('input_invalid_order_id'));
                                inputOpenOrder.setValueState(sap.ui.core.ValueState.Error);
                            };
                            let id = parseInt(inputOpenOrder.getValue());
                            if (!id) {
                                error();
                                return;
                            }
            
                            model.read(`/Orders(${id})`, {success : (data) => {
                                if (data && data.OrderID) {
                                    inputOpenOrder.setValueState(sap.ui.core.ValueState.None);
                                    inputOpenOrder.setValue('');
                                    this.comp.getRouter().navTo("view_order", {id : data.OrderID});
                                } else {
                                    error();
                                }
                            }, error : (err) => {
                                error();
                            }});
                        }
                    });

                    this.filterDialog = new FilterDialog({
                        i18n : this.i18n,
                        dialog : true,
                        title : '{lang>add_filters}',//this.i18n.getText('add_filters', undefined, true) || 'Add Filters',
                        onFilter : (filters) => {
                            tableGenerator.applyFilter(filters);
                        },
                        fields : [
                            {
                                path : 'OrderID',
                                label : '{lang>order_id}',//this.i18n.getText('order_id'),
                                type : sap.m.InputType.Number,
                                operators : [sap.ui.model.FilterOperator.EQ, sap.ui.model.FilterOperator.BT, sap.ui.model.FilterOperator.LT, sap.ui.model.FilterOperator.GT, sap.ui.model.FilterOperator.LE, sap.ui.model.FilterOperator.GE],
                            },
                            {
                                path : 'CustomerID',
                                label : '{lang>customer_id}',// this.i18n.getText('customer_id'),
                                onValueHelp : (input) => {
                                    F4Help.f4Table({
                                        i18n : this.i18n,
                                        ODataModel: model,
                                        entitySetPath: '/Customers',
                                        filterFields: [
                                            {path : 'CustomerID', label : this.i18n.getText('customer_id')},
                                            {path : 'ContactName', label : this.i18n.getText('customer_name')},
                                            {path : 'Phone', label : this.i18n.getText('customer_phone')},
                                        ],
                                        showFields: [
                                            {path : 'CustomerID', label : this.i18n.getText('customer_id')},
                                            {path : 'ContactName', label : this.i18n.getText('customer_name')},
                                            {path : 'Phone', label : this.i18n.getText('customer_phone')},
                                        ],
                                        returnFields: ['CustomerID'],
                                        title: this.i18n.getText('customer_select_single')
                                    }).then((selected) => {
                                        if (!selected || selected.length == 0) return;
                                        let id = selected[0].CustomerID;
                                        if (id) {
                                            input.setValue(id).setValueState(sap.ui.core.ValueState.None);
                                        }
                                    });
                                },
                            },
                            {
                                path : 'Customer/ContactName',
                                label : '{lang>customer_name}',//this.i18n.getText('customer_name'),
                            },
                            {
                                path : 'Customer/Phone',
                                label : '{lang>customer_phone}',//this.i18n.getText('customer_phone'),
                            },
                            {
                                path : 'OrderDate',
                                label : '{lang>order_date}',//this.i18n.getText('order_date'),
                                type : "Datetime",
                                operators : [sap.ui.model.FilterOperator.EQ, sap.ui.model.FilterOperator.BT, sap.ui.model.FilterOperator.LT, sap.ui.model.FilterOperator.GT, sap.ui.model.FilterOperator.LE, sap.ui.model.FilterOperator.GE],
                            },
                            {
                                path : 'Freight',
                                label : '{lang>order_total}',//this.i18n.getText('order_total'),
                                type : sap.m.InputType.Number,
                                operators : [sap.ui.model.FilterOperator.EQ, sap.ui.model.FilterOperator.BT, sap.ui.model.FilterOperator.LT, sap.ui.model.FilterOperator.GT, sap.ui.model.FilterOperator.LE, sap.ui.model.FilterOperator.GE],
                            }
                        ],
                    });
                    this.filterDialog.container.setModel(this.comp.getModel('lang'), 'lang');

                    let filterButton = new Button({icon: 'sap-icon://filter', type: sap.m.ButtonType.Transparent, tooltip : '{lang>filter}'/**this.i18n.getText('filter') */});
                    filterButton.attachPress(() => {
                        this.filterDialog.container.open();
                    });

                    let columns = [
                        {id : 'OrderID', label : 'order_id'/**this.i18n.getText('order_id') */, path : 'OrderID', header: {/*minScreenWidth:"XXLarge", width:"5em"*/}},
                        {id : 'ContactName', label : 'customer_name'/**this.i18n.getText('customer_name') */, path : 'Customer/ContactName', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                        {id : 'Phone', label : 'customer_phone'/**this.i18n.getText('customer_phone') */, path : 'Customer/Phone', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                        {id : 'OrderDate', label : 'order_date'/**this.i18n.getText('order_date') */, path : 'OrderDate', header: {minScreenWidth:"Tablet", demandPopin:true, popinDisplay:"Inline"}},
                        {id : 'OrderTime', label : 'order_time'/**this.i18n.getText('order_time') */, path : 'OrderDate', header: {minScreenWidth:"Tablet", demandPopin:true, popinDisplay:"Inline"}},
                        {id : 'Freight', label : 'order_total'/**this.i18n.getText('order_total') */, path : 'Freight', header: {hAlign : "End"}},
                    ].map((v) => ({
                        id : this.getView().createId(v.id),
                        cell: {bindingPath : v.path},
                        header : {header : `{lang>${v.label}}`, ...v.header},
                        p13n : {key : v.id, label: this.i18n.getText(v.label), path : v.path},
                        excel : {label : this.i18n.getText(v.label), property : v.path}
                    }));
                    columns[0].cell.control = new ObjectIdentifier({title : "{OrderID}"});
                    columns[1].cell.control = new Link({text : "{Customer/ContactName}", wrapping : true});
                    columns[3].cell.control = new Text({text: {
                        path : 'OrderDate',
                        type : 'sap.ui.model.odata.type.Date',
                        // formatOptions: {UTC:true}
                    }});
                    delete columns[3].excel;
                    // columns[2].p13n.label = this.i18n.getText('order_date_time');
                    columns[4].cell.control = new Text({text: {
                        path : 'OrderDate',
                        type : {
                            formatValue : (v) => (new Date(v).toTimeString().split(' ')[0])
                        },
                    }});
                    columns[4].p13n.sortable = false;
                    columns[4].p13n.groupable = false;
                    // delete columns[3].p13n;
                    columns[5].cell.control = new ObjectNumber({unit : "USD"});
                    columns[5].cell.control.bindProperty('number', {
                        parts:[{path:'Freight'},{value:'USD'}],
                        type: 'sap.ui.model.type.Currency',
                        formatOptions: {showMeasure:false}
                    });

                    let tableGenerator = new TableGenerator({
                        id: this.getView().createId('orders_table'),
                        i18n: this.i18n,
                        model,
                        columnListItem : {type : sap.m.ListType.Navigation},
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
                            start : [filterButton, new ToolbarSeparator(), inputOpenOrder, buttonOpenOrder]
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
                    tableGenerator.getTable().attachItemPress(this.onSelectionChange.bind(this));
                });
                
            },
            onSelectionChange : function (evt) {
                let params = evt.getParameters();
                if (!params.listItem || params.listItems && params.listItems.length != 1) return;

                let bindingContext = params.listItem.getBindingContext();
                let orderID = bindingContext ? bindingContext.getProperty('OrderID') : null;
                if (orderID !== null)
                    this.comp.getRouter().navTo("view_order", {id : orderID});
            }
        });
    }
);