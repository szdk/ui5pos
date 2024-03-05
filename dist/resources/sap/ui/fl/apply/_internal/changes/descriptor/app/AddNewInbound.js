/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/ui/fl/util/DescriptorChangeCheck"],function(n){"use strict";function o(n){var o=Object.keys(n.inbound);if(o.length>1){throw new Error("It is not allowed to add more than one inbound")}if(o.length<1){throw new Error("Inbound does not exist")}if(o[0]===""){throw new Error("The ID of your inbound is empty")}return o[o.length-1]}var r={applyChange(r,e){r["sap.app"].crossNavigation||={};r["sap.app"].crossNavigation.inbounds||={};var a=e.getContent();var i=o(a);var t=r["sap.app"].crossNavigation.inbounds[i];if(!t){n.checkIdNamespaceCompliance(i,e);r["sap.app"].crossNavigation.inbounds[i]=a.inbound[i]}else{throw new Error(`Inbound with ID "${i}" already exist.`)}return r}};return r});
//# sourceMappingURL=AddNewInbound.js.map