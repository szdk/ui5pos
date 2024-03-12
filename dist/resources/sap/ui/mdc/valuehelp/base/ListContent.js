/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/valuehelp/base/Content","sap/ui/mdc/enums/ConditionValidated"],function(e,t){"use strict";const n=e.extend("sap.ui.mdc.valuehelp.base.ListContent",{metadata:{library:"sap.ui.mdc",properties:{caseSensitive:{type:"boolean",defaultValue:false},useFirstMatch:{type:"boolean",group:"Behavior",defaultValue:true},useAsValueHelp:{type:"boolean",group:"Behavior",defaultValue:true}},aggregations:{},events:{}}});n.prototype.init=function(){e.prototype.init.apply(this,arguments);this._oObserver.observe(this,{properties:["caseSensitive"]})};n.prototype.observeChanges=function(t){if(t.name==="caseSensitive"){this.handleFilterValueUpdate(t)}e.prototype.observeChanges.apply(this,arguments)};n.prototype.getCount=function(e){let n=0;for(let i=0;i<e.length;i++){const o=e[i];if(o.isEmpty!==true&&o.validated===t.Validated){n++}}return n};n.prototype.getListBinding=function(){throw new Error("ListContent: Every listcontent must implement this method.")};n.prototype.getRelevantContexts=function(e){throw new Error("ListContent: Every listcontent must implement this method.")};return n});
//# sourceMappingURL=ListContent.js.map