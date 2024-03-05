/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e={};e.getPersistencyKey=e=>{if(e){var t=e.getVariantManagement&&e.getVariantManagement()||e;if(t.getPersonalizableControlPersistencyKey){return t.getPersonalizableControlPersistencyKey()}return t.getPersistencyKey&&t.getPersistencyKey()}return undefined};e.getDefaultVariantId=e=>{const t=e.defaultVariants;const n=t.toReversed().find(t=>e.variants.some(e=>t?.getContent().defaultVariantName===e.getId()));return n?.getContent().defaultVariantName||""};return e});
//# sourceMappingURL=Utils.js.map