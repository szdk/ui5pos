sap.ui.define([
    "ui5pos/szdk/controller/BaseController"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.order.Orders", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                window.orders = this;
                
            }
        });
    }
);