sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "sap/ui/model/json/JSONModel"
    ],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.Products", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                
                //table model
                let tableModel = new JSONModel({
                    mod : "SingleSelectMaster"
                });
                tableModel.setDefaultBindingMode('OneWay');
                this.getView().setModel(tableModel, 'table');
                
                window.t = this.byId('products_table');


            },


            onPressCreateProduct: function () {
                // this.comp.getRouter().navTo("");
            }
        });
    }
);