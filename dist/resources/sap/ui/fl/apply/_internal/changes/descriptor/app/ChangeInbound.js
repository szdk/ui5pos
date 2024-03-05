/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/util/changePropertyValueByPath","sap/ui/fl/util/DescriptorChangeCheck"],function(n,e){"use strict";var t=["UPDATE","UPSERT"];var a=["title","subTitle","icon","signature/parameters/*"];var i={applyChange(i,r){var o=i["sap.app"].crossNavigation;var s=r.getContent();e.checkEntityPropertyChange(s,a,t);if(o&&o.inbounds){var p=o.inbounds[s.inboundId];if(p){n(s.entityPropertyChange,p)}else{throw new Error(`Nothing to update. Inbound with ID "${s.inboundId}" does not exist.`)}}else{throw new Error("sap.app/crossNavigation or sap.app/crossNavigation/inbounds sections have not been found in manifest.json")}return i}};return i});
//# sourceMappingURL=ChangeInbound.js.map