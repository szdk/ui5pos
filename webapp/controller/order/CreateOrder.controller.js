sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "sap/ui/model/json/JSONModel"
    ],
    function (
        Controller,
        JSONModel
        ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.order.CreateOrder", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                // this.comp.getRouter().getRoute('create_order').attachPatternMatched(this.defaultPatternMatched.bind(this));

                // ========= models ============================
                this.configModel = new JSONModel({
                    input : {
                        mode : 'input',
                        lock_quantity : false,
                        lock_discount : false,
                    }
                });
                this.getView().setModel(this.configModel, 'config');

                this.dataModel = new JSONModel({
                    input : {
                        productID : '',
                        quantity : 1,
                        discount : 0,
                        discount_type : 'usd',
                    }
                });
                this.getView().setModel(this.dataModel, 'data');

                this.orderModel = new JSONModel({
                    total : 0,
                });
                this.getView().setModel(this.orderModel, 'order');

                
            }
        });
    }
);