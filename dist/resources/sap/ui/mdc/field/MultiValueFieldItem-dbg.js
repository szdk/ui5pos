/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'sap/ui/core/Element'
	], function(
		Element
	) {
	"use strict";

	/**
	 * Constructor for a new <code>MultiValueFieldItem</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class
	 * Base type for <code>MultiValueFieldItem</code> control.
	 * The {@link sap.ui.mdc.MultiValueField MultiValueField} holds its values as items. The <code>MultiValueFieldItem</code> element defines these items.
	 * @extends sap.ui.core.Element
	 * @version 1.120.3
	 * @constructor
	 * @since 1.93.0
	 * @public
	 * @alias sap.ui.mdc.field.MultiValueFieldItem
	 */
	const MultiValueFieldItem = Element.extend("sap.ui.mdc.field.MultiValueFieldItem", /** @lends sap.ui.mdc.field.MultiValueFieldItem.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				/**
				 * Key of the item.
				 */
				key: {
					type: "any",
					byValue: true
				},
				/**
				 * Description of the item.
				 */
				description: {
					type: "string"
				}
			},
			defaultProperty: "key"
		}
	});

	// use raw (unformatted) values for in-parameters
	MultiValueFieldItem.prototype.bindProperty = function(sName, oBindingInfo) {

		if (sName === "key" && !oBindingInfo.formatter) { // not if a formatter is used, as this needs to be executed
			oBindingInfo.targetType = "raw";
		}

		Element.prototype.bindProperty.apply(this, arguments);

	};

	return MultiValueFieldItem;

});
