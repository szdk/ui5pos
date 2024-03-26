sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    ],
    function (
        Controller,
        JSONModel,
        Device
        ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.order.CreateOrder", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                this.comp.getRouter().getRoute('create_order').attachPatternMatched(() => {
                    this.comp.getModel('nav').setProperty('/sideNav/expandableMin', 1260);
                });

                // ========= models ============================
                this.configModel = new JSONModel({
                    input : {
                        mode : 'input',
                        lock_quantity : false,
                        lock_discount : false,
                    },
                    auto_print : false,
                });
                this.getView().setModel(this.configModel, 'config');

                this.dataModel = new JSONModel({
                    input : {
                        productID : '',
                        quantity : 1,
                        discount : 0,
                        discount_type : 'usd',
                    },
                    previous_orders : [
                        {order_id : 10003, phone : '9876543210', order_total : 30.27},
                        {order_id : 10002, phone : '9876543210', order_total : 54.00},
                        {order_id : 10001, phone : '9876543210', order_total : 99.99}
                    ],
                });
                this.getView().setModel(this.dataModel, 'data');

                this.orderModel = new JSONModel({
                    total : 100000,
                    total_price : 0,
                    total_discount : 0,
                    items : [
                        {name : 'Gumbo Mix', price : 14.99, discount : 0, quantity : 4, total: 59.96, editted : false},
                        {name : 'Chiuawa', price : 9.00, discount : 0.15, quantity : 9, total: 12.15, editted : false}
                    ],
                    customer_phone : '',
                    customer_name : '',
                    customer_address : '',
                    customer_city : '',
                    customer_postal_code: '',
                    customer_country : '',
                });
                this.getView().setModel(this.orderModel, 'order');

                
            }
        });
    }
);