/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/BaseDelegate","sap/ui/mdc/enums/LinkType"],function(e,n){"use strict";const i=Object.assign({},e);i.fetchLinkItems=function(e,n,i){return Promise.resolve(null)};i.fetchLinkType=function(e){return Promise.resolve({initialType:{type:n.Popover,directLink:undefined},runtimeType:null})};i.fetchAdditionalContent=function(e){return Promise.resolve([])};i.modifyLinkItems=function(e,n,i){return Promise.resolve(i)};i.beforeNavigationCallback=function(e,n){return Promise.resolve(true)};return i});
//# sourceMappingURL=LinkDelegate.js.map