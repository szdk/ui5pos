/*
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */

/**
 * String data type that supports field-control and don't parse/format empty string and null values.
 *
 * @name sap.ui.comp.smartfield.type.StringNullable
 * @author SAP SE
 * @version 1.120.3
 * @experimental
 * @private
 * @extends sap.ui.comp.smartfield.type.String
 */
sap.ui.define(["sap/ui/comp/smartfield/type/String" ], function(StringBase) {
	"use strict";

	var StringNullable = StringBase.extend("sap.ui.comp.smartfield.type.StringNullable", {
		constructor: function(oFormatOptions, oConstraints) {
			oFormatOptions = Object.assign({parseKeepsEmptyString: true}, oFormatOptions);

			StringBase.call(this, oFormatOptions, oConstraints);
		}
	});

	StringNullable.prototype.formatValue = function (sValue, sTargetType) {
		if (sValue === null && this.getPrimitiveType(sTargetType) === "string") {
			return null;
		}

		return StringBase.prototype.formatValue.call(this, sValue, sTargetType);
	};

	StringNullable.prototype.getName = function() {
		return "sap.ui.comp.smartfield.type.StringNullable";
	};

	return StringNullable;
});
