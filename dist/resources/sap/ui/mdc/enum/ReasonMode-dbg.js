/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides enumeration sap.ui.mdc.enum.ReasonMode
sap.ui.define(function() {
	"use strict";


	/**
	 * Enumeration of the possible reasons for the search event.
	 *
	 * @enum {string}
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 * @since 1.111.0
	 * @alias sap.ui.mdc.enum.ReasonMode
	 * @deprecated since 1.115.0 - please see {@link sap.ui.mdc.enums.ReasonMode}
	 */
	const ReasonMode = {
		/**
		 * The applied variant is marked as Apply Automatically.
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		Variant: "Variant",

		/**
		 * Enter pressed in filter field.
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		Enter: "Enter",

		/**
		 * Go button pressed.
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		Go: "Go",

		/**
		 * Used if the mentioned reasons are not applicable.
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		Unclear: ""
	};

	return ReasonMode;

}, /* bExport= */ true);
