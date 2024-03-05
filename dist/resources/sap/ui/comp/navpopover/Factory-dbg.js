/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */

/**
 * @namespace Factory to access <code>ushell</code> services.
 * @name sap.ui.comp.navpopover.Factory
 * @author SAP SE
 * @version 1.120.3
 * @private
 * @since 1.36.0
 */
sap.ui.define([
	'sap/ui/comp/library'
], function(CompLibrary) {
	"use strict";
	var Factory = {

        getUShellContainer: function() {
            return sap.ui.require("sap/ushell/Container");
        },
		getService: function(sServiceName, bAsync) {
            const oShellContainer = this.getUShellContainer();
            if (!oShellContainer) {
                return bAsync ? Promise.resolve(null) : null;
            }

            switch (sServiceName) {
                case "CrossApplicationNavigation":
                    return bAsync ? oShellContainer.getServiceAsync("CrossApplicationNavigation") : oShellContainer.getService("CrossApplicationNavigation");
                case "URLParsing":
                    return bAsync ? oShellContainer.getServiceAsync("URLParsing") : oShellContainer.getService("URLParsing");
                default:
                    return bAsync ? Promise.resolve(null) : null;
            }
		}
	};

	return Factory;
}, /* bExport= */true);
