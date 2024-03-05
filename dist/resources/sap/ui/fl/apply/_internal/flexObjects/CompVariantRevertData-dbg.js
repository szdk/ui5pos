/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/apply/_internal/flexObjects/RevertData"
], function(RevertData) {
	"use strict";

	/**
	 * CompVariantRevertData
	 *
	 * Class for storing information about reverting variants.
	 *
	 * @class
	 * @extends sap.ui.fl.apply._internal.flexObjects.RevertData
	 * @alias sap.ui.fl.apply._internal.flexObjects.CompVariantRevertData
	 * @private
	 * @ui5-restricted
	 * @since 1.87.0
	 */
	return RevertData.extend("sap.ui.fl.apply._internal.flexObjects.CompVariantRevertData", {
		metadata: {
			properties: {
				change: {type: "object" } // "sap.ui.fl.apply._internal.flexObjects.FlexObject"
			}
		}
	});
});