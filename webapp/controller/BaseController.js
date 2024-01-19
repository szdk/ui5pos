sap.ui.define([
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.BaseController", {
            onInit: function () {
                let comp = this.getOwnerComponent();

                //redirect to setup page if odata service hasn't been setup
                if (!comp.getModel("main")) {
                    comp.getRouter().navTo("setup");
                }
            }
            
        });
    }
);