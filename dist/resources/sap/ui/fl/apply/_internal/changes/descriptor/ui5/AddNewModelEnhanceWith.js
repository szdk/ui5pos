/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/changes/descriptor/ApplyUtil","sap/base/util/ObjectPath"],function(e,t){"use strict";var s={applyChange(s,a){var i=a.getContent().modelId;var n=e.formatBundleName(s["sap.app"].id,a.getTexts().i18n);var p=s["sap.ui5"].models[i];if(p){if(p.type&&p.type==="sap.ui.model.resource.ResourceModel"){if(!(p.settings&&p.settings.enhanceWith)){t.set("settings.enhanceWith",[],p)}var r=p.settings.enhanceWith;r.push({bundleName:n})}}return s},skipPostprocessing:true};return s});
//# sourceMappingURL=AddNewModelEnhanceWith.js.map