sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/util/Table",
    ],
    function (Controller, myTable) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.order.Orders", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                window.orders = this;

                this.comp.szdk_serviceCreated.then((model) => {
                    this.tableGenerator = new myTable({
                        i18n : this.i18n,
                        model,
                        id : this.getView().createId('orders_main_table'),
                        properties : {
                            growing : true,
                            mode : sap.m.ListMode.SingleSelectMaster,
                        },
                        itemsBinding : {
                            path : '/Orders'
                        },
                        toolbar : {
                            p13n : {
                                Columns : true,
                                Sorter : true,
                                Groups : true,
                            },
                            excel : 2,
                            growSize : true,
                            pin : true,
                        },
                        columns : [
                            ['OrderID', 'Order ID'],
                            ['OrderDate', 'Order Date'],
                            ['Freight', 'Total'],
                            ['CustomerID', 'Customer ID'],
                        ].map((val) => {
                            return {
                                id : this.getView().createId(val[0]),
                                p13n : {key : val[0], label : val[1], path : val[0]},
                                cell : {bindingPath : val[0]},
                                header : {header : val[1]},
                                excel : {label : val[1], property : val[2] || val[0]}
                            };
                        }),
                    });
                    
                    this.tableGenerator2 = new myTable({
                        i18n : this.i18n,
                        model,
                        id : this.getView().createId('orders_main_table2'),
                        properties : {
                            mode : sap.m.ListMode.SingleSelectMaster,
                            sticky : ['HeaderToolbar']
                        },
                        itemsBinding : {
                            path : '/Products',
                            parameters : {expand : 'Category'}
                        },
                        toolbar : {
                            p13n : {
                                Columns : true,
                                Sorter : true,
                                Groups : true,
                            },
                            excel : 2,
                            growSize : true,
                            pin : true,
                        },
                        columns : [
                            ['ProductID', 'Product ID'],
                            ['CategoryName', 'Category', 'Category/CategoryName'],
                            ['UnitPrice', 'Price'],
                        ].map((val) => {
                            return {
                                id : this.getView().createId(val[0] + '2'),
                                p13n : {key : val[0] + '2', label : val[1], path : val[2] || val[0]},
                                cell : {bindingPath : val[2] || val[0]},
                                header : {header : val[1]},
                                excel : {label : val[1], property : val[2] || val[0]}
                            };
                        }),
                    });

                    this.byId('temp1').addItem(this.tableGenerator.getTable());
                    this.byId('temp2').addItem(this.tableGenerator2.getTable());
                });
                
            }
        });
    }
);