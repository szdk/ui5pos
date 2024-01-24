/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/base/Object"], function(BaseObject) {
	"use strict";

	const mSupportedProperties = {
		ArchiveFormat: false,
		Border: false,
		CoverPage: false,
		DocumentDescriptionCollection: "",
		DocumentDescriptionReference: "",
		FitToPage: false,
		FontName: false,
		FontSize: false,
		HeaderFooter: false,
		IANATimezoneFormat: false,
		Margin: false,
		Padding: false,
		ResultSizeDefault: 20000,
		ResultSizeMaximum: 20000,
		Signature: false,
		Treeview: false
	};

	var PDFCapabilities = BaseObject.extend("sap.ui.export.util.PDFCapabilities", {
		constructor: function(mSettings) {
			mSettings = mSettings || {};

			for (const [sPropertyName, vDefaultValue] of Object.entries(mSupportedProperties)) {
				this[sPropertyName] = typeof mSettings[sPropertyName] === typeof vDefaultValue ? mSettings[sPropertyName] : vDefaultValue;
			}

			/* Provide temporary URL parameter for testing */
			if (window.location.search.includes("sap-ui-xx-pdf-tree")) {
				this.Treeview = true;
			}
		}
	});

	/**
	 * Checks whether the mandatory properties are maintained with suitable values.
	 *
	 * @returns {boolean} Returns true if mandatory properties are maintained
	 */
	PDFCapabilities.prototype.isValid = function() {
		return this["DocumentDescriptionReference"] && this["DocumentDescriptionCollection"] && this["ResultSizeMaximum"] > 0;
	};

	return PDFCapabilities;
});