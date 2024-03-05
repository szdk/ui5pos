/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/BaseDelegate","sap/ui/core/library"],function(e,t){"use strict";const n=Object.assign({},e);n.fetchProperties=function(e){return Promise.resolve([])};n.addItem=function(e,t,n){return Promise.resolve()};n.removeItem=function(e,t,n){return Promise.resolve(true)};n.validateState=function(e,n){const i=t.MessageType.None;return{validation:i,message:undefined}};n.onAfterXMLChangeProcessing=function(e,t){};n.determineValidationState=function(e){return e.checkValidationState?e.checkValidationState():-1};n.visualizeValidationState=function(e,t){};return n});
//# sourceMappingURL=AggregationBaseDelegate.js.map