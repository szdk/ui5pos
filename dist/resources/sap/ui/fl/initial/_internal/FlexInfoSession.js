/*
 * ! OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexState/ManifestUtils"],function(e){"use strict";var n={};var t="sap.ui.fl.info.";function r(e){return t+(e||"true")}n.get=function(t){var r=e.getFlexReferenceForControl(t);return n.getByReference(r)};n.getByReference=function(e){return JSON.parse(window.sessionStorage.getItem(r(e)))};n.set=function(t,r){if(t){var o=e.getFlexReferenceForControl(r);n.setByReference(t,o)}};n.setByReference=function(e,n){if(e){window.sessionStorage.setItem(r(n),JSON.stringify(e))}};n.remove=function(n){var t=e.getFlexReferenceForControl(n);window.sessionStorage.removeItem(r(t))};n.removeByReference=function(e){window.sessionStorage.removeItem(r(e))};return n});
//# sourceMappingURL=FlexInfoSession.js.map