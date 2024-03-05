/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/m/MultiComboBox",
	"sap/m/MultiComboBoxRenderer",
	"sap/ui/comp/util/ComboBoxUtils",
	"sap/m/inputUtils/ListHelpers"
], function(
	BaseMultiComboBox,
	MultiComboBoxRenderer,
	ComboBoxUtils,
	ListHelpers
) {
	"use strict";

	var sTOKEN_KEY = ListHelpers.CSS_CLASS + "Token";

	/**
	 * Constructor for a new <code>SmartFilterBar/SFBMultiComboBox</code>.
	 *
	 * @class Extends the functionalities in sap.m.MultiComboBox
	 * @extends sap.m.MultiComboBox
	 * @constructor
	 * @protected
	 * @alias sap.ui.comp.smartfilterbar.SFBMultiComboBox
	 */
	 var SFBMultiComboBox = BaseMultiComboBox.extend("sap.ui.comp.smartfilterbar.SFBMultiComboBox",
	 {
		metadata: {
			library: "sap.ui.comp",
			interfaces: [
				"sap.ui.comp.IDropDownTextArrangement"
			],
			properties: {
				/**
				 * Sets the <code>value</code> property formatting according to the <code>com.sap.vocabularies.UI.v1.TextArrangementType</code> from the ValueList property.
				 */
				textArrangement: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				}
			}
		},
		renderer: MultiComboBoxRenderer
	 });

	 SFBMultiComboBox.prototype.onBeforeRendering = function () {
		BaseMultiComboBox.prototype.onBeforeRendering.apply(this, arguments);
		this._parseCurrentValue();
		this._processTextArrangement();
	};

	SFBMultiComboBox.prototype._processTextArrangement = function (){
		var i,
			oToken,
			sSelectedKey,
			oSelectedItem,
			sNewValue,
			aSelectedKeys = this.getSelectedKeys(),
			sTextArrangement = this.getTextArrangement();

		if (!sTextArrangement || aSelectedKeys.length === 0) {
			return;
		}

		for (i = 0; i < aSelectedKeys.length; i++) {
			sSelectedKey = aSelectedKeys[i];
			oSelectedItem = this.getItemByKey("" + sSelectedKey);

			sNewValue = ComboBoxUtils.formatDisplayBehaviour(oSelectedItem, sTextArrangement);

			if (sNewValue) {
				oToken = oSelectedItem.data(sTOKEN_KEY);
				if (oToken && oToken.isA("sap.m.Token")) {
					oToken.setText(sNewValue);
				}
			}
		}
	};

	//BCP: 2280125535 - converting the value to token if that is possible
	//This logic is needed for scenario with In parameters otherwise the
	//value will be left as text in the field
	SFBMultiComboBox.prototype._parseCurrentValue = function() {
		var sCurrentValue = this.getValue();

		if (sCurrentValue) {
			this.addSelectedKeys([sCurrentValue]);
			this.setValue("");
		}
	};

	SFBMultiComboBox.prototype.useHighlightItemsWithContains = function() {
		return true;
	};

	return SFBMultiComboBox;
});
