/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
    "sap/ui/test/matchers/Matcher",
    "sap/ui/test/matchers/Ancestor"
], function(Matcher, Ancestor) {
    "use strict";


    return function waitForSelectWithSelectedTextOnPanel(sSelectedItemText, oPanel, oSettings) {

        oSettings = oSettings || {};

        oSettings.errorMessage = oSettings.errorMessage || "No sap.m.ComboBox with selected text '" + sSelectedItemText + "' found";

        var oMatcher = new Matcher();
        oMatcher.isMatching = function(oControl) {
            if (!oControl.getSelectedItem()) {
                return sSelectedItemText === "";
            }
            return oControl.getSelectedItem().getText() === sSelectedItemText;
        };

        return this.waitFor({
            controlType: "sap.m.ComboBox",
            matchers: [
                oMatcher,
                new Ancestor(oPanel, false)
            ],
            success: function(aSelects) {
                if (oSettings.success) {
                    oSettings.success.call(this, aSelects[0]);
                }
            },
            actions: oSettings.actions ? oSettings.actions : [],
            errorMessage: oSettings.errorMessage
        });
    };

});