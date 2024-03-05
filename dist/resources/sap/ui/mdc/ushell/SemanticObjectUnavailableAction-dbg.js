/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'sap/ui/core/Element'
], function(Element) {
	"use strict";

	/**
	 * Constructor for a new SemanticObjectUnavailableAction.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class Type for...
	 * @extends sap.ui.core.Element
	 * @version 1.120.3
	 * @constructor
	 * @private
	 * @since 1.120
	 * @alias sap.ui.mdc.link.SemanticObjectUnavailableAction
	 */
	const SemanticObjectUnavailableAction = Element.extend("sap.ui.mdc.link.SemanticObjectUnavailableAction", /** @lends sap.ui.mdc.link.SemanticObjectUnavailableAction.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				semanticObject: {
					type: "string"
				},
				actions: {
					type: "string[]",
					defaultValue: []
				}
			}
		}
	});

	return SemanticObjectUnavailableAction;

});
