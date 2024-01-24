sap.ui.define([
    "sap/ui/core/UIComponent",
    "ui5pos/szdk/models/models",
],
function (UIComponent, models, MockServer) {
    "use strict";

    return UIComponent.extend("ui5pos.szdk.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            this.getRouter().initialize();

            // ======================================== MODELS  ======================================== 
            this.setModel(models.createDeviceModel(), "device");
            this.setModel(models.createSettingsModel(), "settings");

            // change app title
            this.getRouter().attachTitleChanged(function(oEvent) {
                var title = oEvent.getParameter("title");
                document.title = title;
            });
        }
    });
}
);