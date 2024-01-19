sap.ui.define([
        "ui5pos/szdk/controller/BaseController",
        "sap/ui/model/json/JSONModel",
    ],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.Setup", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                
                let comp = this.getOwnerComponent();

                //move to home page if odata has already been setup
                if (comp.getModel("main")) {
                    comp.getRouter().navTo("home");
                }

                let odataTypeModel = new JSONModel({
                    odataType : "2"
                });
                this.getView().setModel(odataTypeModel, 'local');
            },

            temp : function (e) {
                window.e = e;
                console.log(e);
            }
            
        });
    }
);