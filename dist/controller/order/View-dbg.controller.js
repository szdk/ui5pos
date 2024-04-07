sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/util/Table",
    "ui5pos/szdk/controller/order/Helper",
    "sap/ui/model/json/JSONModel",
    "sap/m/ObjectNumber",
    "sap/m/Text",
    "sap/m/Link",
    "sap/m/Title",
    "sap/ui/core/CustomData",
    ],
    function (
        Controller,
        TableGenerator,
        Helper,
        JSONModel,
        ObjectNumber,
        Text,
        Link,
        Title,
        CustomData
    ) {
        "use strict";
        return Controller.extend("ui5pos.szdk.controller.order.View", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                
                //==================== set busy on server request =============================
                this.getView().setBusyIndicatorDelay(0);
                this.comp.szdk_serviceCreated.then((s) => s.attachRequestSent(() => this.getView().setBusy(true)));
                this.comp.szdk_serviceCreated.then((s) => s.attachRequestCompleted(() => this.getView().setBusy(false)));
                
                //======================== attach pattern =====================================
                this.comp.getRouter().getRoute('view_order').attachPatternMatched(this.patternMatched.bind(this));
            },

            patternMatched : function (evt) {
                if (!this.defaultPatternMatched(evt)) return;
                this.comp.getModel('nav').setProperty('/sideNav/selectedKey', `nav_item_route_orders`);

                this.orderID = null;

                const notFound = () => {
                    this.comp.getRouter().getTarget('notFound').display();
                };

                let arg = evt.getParameter('arguments');
                let id = arg && arg.id && ("" + arg.id).length > 0 ? arg.id : null;

                if (id) {
                    this.comp.getModel('service').createBindingContext(`/Orders(${id})`, {
                        expand : 'Customer'
                    },
                    (context) => {
                        if (!context) {
                            notFound();
                            return;
                        }
                        //order found
                        this.orderID = parseInt(id);
                        this.getView().setBindingContext(context, 'service');
                        
                        document.title = this.i18n.getText('order_view_title', [this.orderID]);

                        if (!this.order_details_table) {
                            this.createOrderDetailTable(id);
                        } else if (this.order_details_table_id != id) {
                            this.updateOrderDetailTable(id);
                        } 


                    }, true);
                } else {
                    notFound();
                }

            },

            createOrderDetailTable : function (order_id) {
                this.order_details_table_id = order_id;
                this.byId('order_view_page').setHeaderExpanded(true);
                let columns = [
                    {id : 'ProductID', label : this.i18n.getText('product_id'), path : 'ProductID', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"/*, width:"5em"*/}},
                    {id : 'ProductName', label : this.i18n.getText('product_name'), path : 'Product/ProductName', header: {/*minScreenWidth:"XXLarge", width:"5em"*/}},
                    {id : 'UnitPrice', label : this.i18n.getText('product_unitPrice'), path : 'UnitPrice', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                    {id : 'Quantity', label : this.i18n.getText('order_quantity'), path : 'Quantity', header: {minScreenWidth:"Tablet", demandPopin:true, popinDisplay:"Inline"}},
                    {id : 'Discount', label : this.i18n.getText('order_discount'), path : 'Discount', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                    {id : 'NetPrice', label : this.i18n.getText('order_net_price'), path : 'UnitPrice', header: {hAlign : "End"}},
                ].map((v) => ({
                    id : this.getView().createId(v.id),
                    cell: {bindingPath : v.path},
                    header : {header : v.label, ...v.header},
                    p13n : {key : v.id, label: v.label, path : v.path},
                    excel : {label : v.label, property : v.path}
                }));

                columns[1].cell.control = new Link({
                    text : "{Product/ProductName}",
                    customData : [new CustomData({key : "id", value : "{ProductID}"})],
                    wrapping : true,
                    press : (evt) => {
                        let link = evt.getSource();
                        if (!link) return;
                        let id = link.data('id');
                        if (id)
                            this.comp.getRouter().navTo("view_product", {id});
                    }});

                columns[2].cell.control = new ObjectNumber({unit:"USD"});
                columns[2].cell.control.bindProperty('number', {
                    parts:[{path:'UnitPrice'},{value:'USD'}],
                    type: 'sap.ui.model.type.Currency',
                    formatOptions: {showMeasure:false}
                });

                columns[4].cell.control = new Text({text: "{= ${Discount} === 0 ? 0 : ( (${Discount} * 100) + ' %' )}"});
                columns[5].cell.control = new ObjectNumber({unit:"USD"});
                columns[5].cell.control.bindProperty('number', {
                    parts:[{path:'UnitPrice'},{path:'Quantity'},{path:'Discount'}],
                    type: this.inputCheck.order.netPrice,
                    formatOptions: {showMeasure:false}
                });
                delete columns[5].excel;

                this.order_details_table = new TableGenerator({
                    id : this.getView().createId('order_details_table'),
                    i18n : this.i18n,
                    model : this.comp.getModel('service'),
                    properties : {
                        busyIndicatorDelay : 0,
                        mode : sap.m.ListMode.None,
                        rememberSelections:true,
                        growing:true,
                        growingThreshold:1000,
                        sticky: ['HeaderToolbar','ColumnHeaders'],
                        popinLayout: sap.m.PopinLayout.Block,
                        alternateRowColors: false,
                    },
                    itemsBinding : {
                        path : `/Orders(${order_id})/Order_Details`,
                        parameters : {
                            expand : 'Product'
                        }
                    },
                    customToolbar : {
                        start : [new Title({text : this.i18n.getText('order_view_items_header')})],
                        // end : [filterButton]
                    },
                    toolbar : {
                        p13n : {
                            Columns : true,
                            Sorter : true,
                            Groups : true,
                        },
                        excel : this.comp.getModel('settings').getProperty('/odata/useMock') ? 2 : 1,
                        growSize : false,
                        pin : true
                    },
                    columns
                });
                this.byId('table_container').removeAllContent();
                this.byId('table_container').addContent(this.order_details_table.getTable());
                //todo add navigation
                // this.order_details_table.getTable().attachItemPress
            },
            updateOrderDetailTable : function (order_id) {
                this.order_details_table_id = order_id;
                this.byId('order_view_page').setHeaderExpanded(true);
                this.order_details_table.data.itemsBinding.path = `/Orders(${order_id})/Order_Details`;
                this.order_details_table.refreshBinding();
            },
            onOpenAction : function (evt) {
                this.byId('view_order_actionSheet').openBy(evt.getSource());
            },
            onEdit : function (evt) {
                this.comp.getRouter().navTo("create_order", {edit : this.orderID});
            },
            onDelete : function (evt) {
                this.showErrorDialog({
                    title: this.i18n.getText('confirm_delete'),
                    message: this.i18n.getText('order_view_confirm_delete', [this.orderID]),
                    onConfirm: () => {
                        Helper.delete({
                            model : this.comp.getModel('service'),
                            orderId : this.orderID
                        }).then(() => {
                            // this.comp.getRouter().navTo("orders");
                            this.goBack("orders");
                        })
                        .catch(() => {
                            this.showErrorDialog();
                        });
                    }
                });
                
            },
            onPrint : function () {
                Helper.print({model : this.comp.getModel('service'), order_id : this.orderID, i18n : this.i18n})
                    .catch(() => this.showErrorDialog());
            }
        });
    }
);