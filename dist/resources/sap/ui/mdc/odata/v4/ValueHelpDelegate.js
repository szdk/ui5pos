/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../../ValueHelpDelegate","sap/base/Log","sap/ui/model/FilterType","sap/base/util/deepEqual","sap/ui/mdc/odata/v4/TypeMap"],function(e,t,n,i,r){"use strict";const s=Object.assign({},e);s.getTypeMap=function(e){return r};s.isSearchSupported=function(e,t,n){return!!n.changeParameters};s.updateBindingInfo=function(t,n,i){e.updateBindingInfo(t,n,i);if(n.getFilterFields()==="$search"){const e=n._getPriorityFilterBar();let r=n.isTypeahead()?n._getPriorityFilterValue():e&&e.getSearch();if(this.adjustSearch){r=this.adjustSearch(t,n.isTypeahead(),r)}i.parameters.$search=r||undefined}};s.updateBinding=function(e,t,i){const r=t.getRootBinding()||t;if(!r.isSuspended()){r.suspend()}t.changeParameters(i.parameters);t.filter(i.filters,n.Application);if(r.isSuspended()){r.resume()}};s.executeFilter=function(e,t,n){t.getContexts(0,n);return Promise.resolve(this.checkListBindingPending(e,t,n)).then(function(){return t})};s.checkListBindingPending=function(e,t,n){if(!t||t.isSuspended()){return false}return t.requestContexts(0,n).then(function(e){return e.length===0})};return s});
//# sourceMappingURL=ValueHelpDelegate.js.map