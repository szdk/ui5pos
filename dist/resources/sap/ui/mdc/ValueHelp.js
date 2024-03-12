/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/Element","sap/ui/mdc/mixin/PromiseMixin","sap/ui/mdc/condition/Condition","sap/ui/mdc/condition/FilterOperatorUtil","sap/ui/mdc/enums/ValueHelpSelectionType","sap/ui/model/base/ManagedObjectModel","sap/ui/base/ManagedObjectObserver","sap/ui/mdc/enums/ValueHelpPropagationReason"],function(e,t,i,n,o,s,a,r){"use strict";const l=e.extend("sap.ui.mdc.ValueHelp",{metadata:{library:"sap.ui.mdc",properties:{conditions:{type:"object[]",defaultValue:[],byValue:true},delegate:{type:"object",group:"Data",defaultValue:{name:"sap/ui/mdc/ValueHelpDelegate"}},filterValue:{type:"string",defaultValue:""},validateInput:{type:"boolean",defaultValue:true},_config:{type:"object",defaultValue:{},visibility:"hidden"},_valid:{type:"boolean",group:"Appearance",defaultValue:true,visibility:"hidden"}},aggregations:{dialog:{type:"sap.ui.mdc.valuehelp.IDialogContainer",multiple:false},typeahead:{type:"sap.ui.mdc.valuehelp.ITypeaheadContainer",multiple:false}},events:{select:{parameters:{conditions:{type:"object[]"},add:{type:"boolean"},close:{type:"boolean"}}},disconnect:{},closed:{},open:{parameters:{container:{type:"sap.ui.mdc.valuehelp.base.Container"}}},opened:{parameters:{container:{type:"sap.ui.mdc.valuehelp.base.Container"},itemId:{type:"string"}}},navigated:{parameters:{leaveFocus:{type:"boolean"},condition:{type:"object"},itemId:{type:"string"}}},switchToValueHelp:{},typeaheadSuggested:{parameters:{condition:{type:"object"},filterValue:{type:"string"},itemId:{type:"string"}}}},defaultProperty:"filterValue"}});l.prototype.init=function(){e.prototype.init.apply(this,arguments);this._oObserver=new a(C.bind(this));this._oObserver.observe(this,{aggregations:["typeahead","dialog"]});this.setBindingContext(null);this._oConditions={}};l.prototype.exit=function(){if(this._oManagedObjectModel){this._oManagedObjectModel.destroy();delete this._oManagedObjectModel}};l.prototype.invalidate=function(e){return};l.prototype.connect=function(e,t){if(this._oControl&&this._oControl!==e){this.close();this.setFilterValue("");this.setConditions([]);const e=this.getTypeahead();const t=this.getDialog();if(e){e.onConnectionChange()}if(t){t.onConnectionChange()}this.fireDisconnect()}this._oControl=e;this.setProperty("_config",t,true);O.call(this);return this};l.prototype.getControl=function(){return this._oControl};l.prototype.getDomRef=function(){const e=this.getTypeahead();const t=this.getDialog();if(e&&(e.isOpen()||e.isOpening())){return e.getDomRef()}else if(t&&(t.isOpen()||t.isOpening())){return t.getDomRef()}};l.prototype.getAriaAttributes=function(e){const t=this.getTypeahead();let i=this.getDialog();if(!i&&t&&t.getUseAsValueHelp()){i=t}const n=t&&t.isOpen();const o=i&&i.isOpen();const s=t&&t.getAriaAttributes(e);const a=i&&i.getAriaAttributes(e);let r;if(n){r=s.contentId}else if(o){r=a.contentId}const l=t&&s.ariaHasPopup||i&&a.ariaHasPopup;const c=t&&s.role||i&&a.role;const p=t&&s.roleDescription||i&&a.roleDescription;const u=!!i&&a.valueHelpEnabled;const g=t&&s.autocomplete||i&&a.autocomplete;return{contentId:r,ariaHasPopup:l,role:c,roleDescription:p,valueHelpEnabled:u,autocomplete:g}};l.prototype._retrieveDelegateContent=function(e,t){let i;if(!t){const i=e.getSelectedContent();t=i&&i.getId()}i=this._retrievePromise("delegateContent");const n=this.isOpen();if(!i||i&&n||i&&i.aggregation!==e.sParentAggregationName){const n=function(){return this._getControlDelegatePromise().then(function(i){return i.retrieveContent(this,e,t)}.bind(this))}.bind(this);const o=i&&i.isPending();i=this._addPromise("delegateContent",o?i.getInternalPromise().then(n):n);i.aggregation=e.sParentAggregationName}return i.getInternalPromise()};l.prototype._getControlDelegatePromise=function(e){return this._retrievePromise("delegate",this.initControlDelegate.bind(this))};l.prototype.open=function(e){const t=e?this.getTypeahead():b.call(this);const i=e?this.getDialog():this.getTypeahead();if(i&&t!==i&&(i.isOpen()||i.isOpening())){i.close()}if(t&&!t.isOpen()&&!t.isOpening()){t.open(this._retrieveDelegateContent(t),e);this.fireOpen({container:t})}};function c(e){const t=e.getSource();this._retrieveDelegateContent(t,e.getParameter("contentId"))}function p(e){this.fireSwitchToValueHelp()}l.prototype.close=function(){const e=this.getTypeahead();const t=this.getDialog();if(e&&e.isOpen()){e.close()}if(t&&t.isOpen()){t.close()}};l.prototype.toggleOpen=function(e){const t=this.getTypeahead();let i=this.getDialog();if(!e&&!i&&t&&t.getUseAsValueHelp()){i=t}const n=t&&t.isOpen();const o=i&&i.isOpen();if(e&&n||!e&&o){this.close()}else if(e&&t||!e&&i){this.open(e)}};l.prototype.isOpen=function(){const e=this.getTypeahead();const t=this.getDialog();return!!(e&&(e.isOpen()||e.isOpening())||t&&(t.isOpen()||t.isOpening()))};l.prototype.skipOpening=function(){const e=this.getTypeahead();const t=this.getDialog();if(e&&e.isOpening()){e.close()}if(t&&t.isOpening()){t.close()}};l.prototype.initBeforeOpen=function(e){};l.prototype.isTypeaheadSupported=function(){const e=this.getTypeahead();if(e){return this._retrieveDelegateContent(e).then(function(){return!!e&&e.isTypeaheadSupported()})}else{return Promise.resolve(false)}};l.prototype.shouldOpenOnFocus=function(){const e=b.call(this,true);return e&&e.shouldOpenOnFocus()};l.prototype.shouldOpenOnClick=function(){const e=b.call(this,true);return e&&e.shouldOpenOnClick()};l.prototype.isFocusInHelp=function(){const e=b.call(this);return e&&e.isFocusInHelp()};l.prototype.removeFocus=function(){const e=this.getTypeahead();if(e){e.removeFocus()}};l.prototype.navigate=function(e){const t=this.getTypeahead();if(t){const i=function(){if(t.shouldOpenOnNavigate()&&!t.isOpening()&&!t.isOpen()){return t.open(true).then(function(){t.navigate(e)})}return t.navigate(e)};const n=this._retrievePromise("navigate");const o=n&&!n.isSettled()&&n.getInternalPromise();this._addPromise("navigate",o?o.then(i):this._retrieveDelegateContent(t).then(i))}};l.prototype.isNavigationEnabled=function(e){const t=this.getTypeahead();if(t){const i=this.getDialog();const n=t.isOpen();if(n||!i){return t.isNavigationEnabled(e)}}return false};l.prototype.getItemForValue=function(e){const t=this.getTypeahead();if(t){return this._retrieveDelegateContent(t).then(function(){e.caseSensitive=e.hasOwnProperty("caseSensitive")?e.caseSensitive:false;const i=t.getItemForValue(e);return i})}else{return Promise.reject("No Typeahead")}};l.prototype.isValidationSupported=function(){const e=this.getTypeahead();return e&&e.isValidationSupported()};l.prototype.onControlChange=function(){if(this.isDestroyed()){return}u.call(this,r.ControlChange);O.call(this)};l.prototype.getIcon=function(){const e=this.getTypeahead();const t=this.getDialog();if(t){return t.getValueHelpIcon()}else if(e){return e.getValueHelpIcon()}};l.prototype.getMaxConditions=function(){const e=this.getProperty("_config");return e&&e.maxConditions||-1};l.prototype.getDisplay=function(){};l.prototype.getDataType=function(){};function u(e,t){const i=this.bDelegateInitialized&&this.getControlDelegate();if(i){i.onConditionPropagation(this,e,t||this.getProperty("_config"))}}function g(e){const t=e.getParameter("condition");this.fireNavigated({condition:t,itemId:e.getParameter("itemId"),leaveFocus:e.getParameter("leaveFocus")})}function d(e){const t=e.getParameter("condition");const i=e.getParameter("filterValue");const n=e.getParameter("itemId");this.fireTypeaheadSuggested({condition:t,filterValue:i,itemId:n})}function h(e){const t=e.getParameter("type");const i=e.getParameter("conditions")||[];let s;const a=this.getMaxConditions()===1;if(a){s=t===o.Remove?[]:i.slice(0,1)}if(t===o.Set){s=[].concat(a?i.slice(0,1):i)}if(t===o.Add){if(a){s=i.slice(0,1)}else{s=this.getConditions();for(let e=0;e<i.length;e++){s.push(i[e])}}}if(t===o.Remove){if(a){s=[]}else{s=this.getConditions();for(let e=0;e<i.length;e++){const t=n.indexOfCondition(i[e],s);if(t>=0){s.splice(t,1)}}}}if(s){this.setProperty("conditions",s,true)}}function f(e){if(this.getProperty("_valid")){const t=this.getMaxConditions()===1;const o=e.getParameter("close");const s=typeof o!=="undefined"?o:t;let a=this.getConditions();const l=!t&&!e.getSource().isMultiSelect();if(s){this.close()}a=i._removeEmptyConditions(a);a=i._removeInitialFlags(a);n.updateConditionsValues(a);this.fireSelect({conditions:a,add:l,close:s});u.call(this,r.Select)}}function y(e){this.close()}function m(e){this.fireOpened({container:e.getSource(),itemId:e.getParameter("itemId")})}function v(e){this._removePromise("delegateContent");this._removePromise("navigate");this.fireClosed()}function C(e){if(["typeahead","dialog"].indexOf(e.name)!==-1){const t=e.child;const i=e.mutation==="insert";const n=i?t.attachEvent.bind(t):t.detachEvent.bind(t);n("select",h,this);n("requestDelegateContent",c,this);n("confirm",f,this);n("cancel",y,this);n("opened",m,this);n("closed",v,this);if(t.attachRequestSwitchToDialog){n("requestSwitchToDialog",p,this)}if(t.attachNavigated){n("navigated",g,this)}if(t.attachTypeaheadSuggested){n("typeaheadSuggested",d,this)}if(i){if(!this._oManagedObjectModel){this._oManagedObjectModel=new s(this)}t.setModel(this._oManagedObjectModel,"$valueHelp")}}}function O(){const e=this._oControl?this._oControl.getBindingContext():null;this.setBindingContext(e)}function b(e){const t=this.getTypeahead();const i=!!t&&t.getUseAsValueHelp();const n=this.getDialog();if(e){return(i||n)&&t||n}else{return n||i&&t}}l.prototype._getFieldGroupIds=function(){const t=this.getControl();if(t){return t.getFieldGroupIds()}else{return e.prototype._getFieldGroupIds.apply(this,arguments)}};t.call(l.prototype);return l});
//# sourceMappingURL=ValueHelp.js.map