/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([], function() {
	"use strict";

	var Utils = {};

	Utils.getPersistencyKey = (oControl) => {
		if (oControl) {
			var oVMControl = oControl.getVariantManagement && oControl.getVariantManagement() || oControl;
			if (oVMControl.getPersonalizableControlPersistencyKey) {
				return oVMControl.getPersonalizableControlPersistencyKey();
			}
			return oVMControl.getPersistencyKey && oVMControl.getPersistencyKey();
		}
		return undefined;
	};

	/**
	* Retrieves the default variant ID for a variant map.
	* Removed variants are filtered out.
	*
	* @param {object} mCompVariantsMap Prepared map for compVariants
	* @returns {string} ID of the default variant
	*/
	Utils.getDefaultVariantId = (mCompVariantsMap) => {
		const aDefaultVariantChanges = mCompVariantsMap.defaultVariants;
		const oChange = aDefaultVariantChanges.toReversed().find((oChange) => {
			return mCompVariantsMap.variants.some((oVariant) => {
				return oChange?.getContent().defaultVariantName === oVariant.getId();
			});
		});
		return oChange?.getContent().defaultVariantName || "";
	};

	return Utils;
});