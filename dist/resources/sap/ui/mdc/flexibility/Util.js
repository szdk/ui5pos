/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/util/loadModules","sap/m/p13n/Engine"],function(n,e){"use strict";const t={};t.APPLY="apply";t.REVERT="revert";function i(n){const e=n&&n.getUIArea&&n.getUIArea();if(e&&!n._bInvalidationSuppressed){n._bInvalidationSuppressed=e.suppressInvalidationFor(n)}}function o(n){const e=n&&n.getUIArea&&n.getUIArea();if(e&&n._bInvalidationSuppressed){e.resumeInvalidationFor(n);delete n._bInvalidationSuppressed}}function a(n,t){if(n.isA){e.getInstance().trace(n,{selectorElement:n,changeSpecificData:{changeType:t.getChangeType(),content:t.getContent()}});if(!n._pPendingModification&&n._onModifications instanceof Function){n._pPendingModification=e.getInstance().waitForChanges(n).then(function(){const t=e.getInstance().getTrace(n);e.getInstance().clearTrace(n);delete n._pPendingModification;o(n);return n._onModifications(t)})}}}t.createChangeHandler=function(e){const o=e.apply instanceof Function&&e.apply;const r=e.revert instanceof Function&&e.revert;const c=e.complete instanceof Function&&e.complete;if(!o||!r){throw new Error("Please provide atleast an apply and revert function!")}return{changeHandler:{applyChange:function(n,e,r){i(e);return o(n,e,r,t.APPLY).then(function(){a(e,n)})},completeChangeContent:function(n,e,t){if(c){c(n,e,t)}},revertChange:function(n,e,o){i(e);return r(n,e,o,t.REVERT).then(function(){a(e,n)})},onAfterXMLChangeProcessing:function(e,t){return t.modifier.getProperty(e,"delegate").then(function(i){if(i){return n(i.name).then(function(n){const i=n[0];if(i.onAfterXMLChangeProcessing instanceof Function){i.onAfterXMLChangeProcessing(e,t)}})}})},getCondenserInfo:e.getCondenserInfo},layers:{USER:true}}};return t});
//# sourceMappingURL=Util.js.map