/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/base/util/isEmptyObject","sap/base/Log","sap/ui/fl/changeHandler/condenser/Classification"],function(e,t,n){"use strict";var i={};var r="visible";i.applyChange=function(n,i,o){var a=n.getContent();if(e(a)){t.error("Change does not contain sufficient information to be applied");return Promise.reject("Change does not contain sufficient information to be applied")}var s=i.getAvailableActions().find(function(e){return e.getKey()===a.key});if(!s){t.error("Item with key "+a.key+" not found in the availableAction aggregation");return Promise.reject("Item with key "+a.key+" not found in the availableAction aggregation")}var f=o.modifier;return Promise.resolve().then(f.getProperty.bind(f,s,r)).then(function(e){f.setProperty(s,"visibleChangedByUser",n.getLayer()==="USER");f.setVisible(s,a.visible);n.setRevertData({key:a.key,originalValue:e})})};i.completeChangeContent=function(t,n,i){if(e(n.content)){throw new Error("oSpecificChangeInfo.content should be filled")}if(!n.content.key){throw new Error("In oSpecificChangeInfo.content.key attribute is required")}if(n.changeType==="addLink"){if(n.content.visible!==true){throw new Error("In oSpecificChangeInfo.content.visible attribute should be 'true'")}}else if(n.changeType==="removeLink"){if(n.content.visible!==false){throw new Error("In oSpecificChangeInfo.content.visible attribute should be 'false'")}}t.setContent(n.content)};i.revertChange=function(n,i,r){var o=n.getContent();if(e(o)){t.error("Change does not contain sufficient information to be applied");return false}var a=i.getAvailableActions().find(function(e){return e.getKey()===o.key});if(!a){t.error("Item with key "+o.key+" not found in the availableAction aggregation");return false}var s=n.getRevertData();if(s){r.modifier.setProperty(a,"visibleChangedByUser",n.getLayer()==="USER");r.modifier.setVisible(a,s.originalValue);n.resetRevertData()}else{t.error("Attempt to revert an unapplied change.")}};i.getCondenserInfo=function(e){return{affectedControl:{id:e.getContent().key,idIsLocal:true},uniqueKey:r,classification:n.Reverse}};return i},true);
//# sourceMappingURL=LinkFlex.js.map