/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([], function() {
	"use strict";

	const Common = {
		cleanup: function (oTarget, aFields) {
			aFields.forEach(function (sField) {
				const oRemovable = oTarget[sField];
				if (oRemovable) {
					if (oRemovable.destroy && !oRemovable.bIsDestroyed) {
						oRemovable.destroy();
					}
					oTarget[sField] = null;
				}
			});
		}
	};

	return Common;

});
