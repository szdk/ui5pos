sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History"
    ],
    function (
            Controller,
            History
        ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.BaseController", {
            onInit: function () {
                // methods/properties which are used too often can be defined here, so that all child controllers will inherit the same by default
                this.comp = this.getOwnerComponent();
                this.i18n = this.comp.getModel('lang').getResourceBundle();
            },

            goBack: function (defaultPage = "home", parameters = {}) {
                let prev = History.getInstance().getPreviousHash();
                if (prev !== undefined)
                    window.history.go(-1);
                else
                    this.comp.getRouter().navTo(defaultPage, parameters, true);
            }
            
        });
    }
);