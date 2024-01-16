sap.ui.define([
    "sap/ui/core/UIComponent",
],
function (UIComponent, models) {
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

            alert("Component loaded");
        }
    });
}
);