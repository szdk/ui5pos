sap.ui.define([
    "sap/ui/core/UIComponent",
    "ui5pos/szdk/models/models",
    "ui5pos/szdk/controller/util/Settings"
],
function (UIComponent, models, Settings) {
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

            // ========================================= Properties =================================
            this.szdk_serviceCreated = new Promise((r) => this.szdk_resolve_serviceCreated = r);

            // ======================================== MODELS  ======================================== 
            this.setModel(models.createDeviceModel(), "device");
            
            this.setModel(models.createNavModel(), "nav");
            this.getModel('nav').setDefaultBindingMode("OneWay");

            let settingsModel = models.createSettingsModel();
            this.setModel(settingsModel, "settings");
            Settings.loadFromLocal(settingsModel);

            // update theme when os theme changes
            if (window.matchMedia) {
                const onMediaQueryChange = () => {
                    if (settingsModel.getProperty('/theme') != 'auto') return;
                    Settings.updateTheme('auto');
                };
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onMediaQueryChange);
                window.matchMedia('(prefers-contrast: more)').addEventListener('change', onMediaQueryChange);
            }
            
            // change app title
            this.getRouter().attachTitleChanged(function(oEvent) {
                var title = oEvent.getParameter("title");
                document.title = title;
            });
        },

    });
}
);