/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"],function(e){"use strict";var t={};t.applyChange=async function(e,t,n){const a=e.getContent();const o=n.modifier;const i=await o.getStashed(t);e.setRevertData({originalValue:i});const r=o.setStashed(t,false,n.appComponent)||t;if(a.parentAggregationName){const e=a.parentAggregationName;const t=o.getParent(r);await o.moveAggregation(t,e,t,e,r,a.index,n.view)}return r};t.revertChange=function(e,t,n){var a=e.getRevertData();n.modifier.setStashed(t,a.originalValue);e.resetRevertData()};t.completeChangeContent=function(e,t){if(t.content){e.setContent(t.content)}};t.getCondenserInfo=function(t){return{affectedControl:t.getSelector(),classification:e.Reverse,uniqueKey:"stashed"}};return t});
//# sourceMappingURL=UnstashControl.js.map