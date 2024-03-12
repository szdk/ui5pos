/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/p13n/subcontroller/FilterController","sap/ui/core/library","sap/ui/core/ShortcutHintsMixin","sap/ui/Device","sap/ui/mdc/Control","sap/base/Log","sap/base/util/merge","sap/ui/model/base/ManagedObjectModel","sap/ui/base/ManagedObjectObserver","sap/ui/mdc/condition/ConditionModel","sap/ui/mdc/condition/Condition","sap/ui/mdc/condition/ConditionConverter","sap/ui/mdc/util/IdentifierUtil","sap/ui/mdc/util/FilterUtil","sap/ui/mdc/filterbar/PropertyHelper","sap/ui/mdc/enums/ReasonMode","sap/ui/mdc/enums/FilterBarValidationStatus","sap/ui/mdc/enums/OperatorName","sap/ui/fl/apply/api/ControlVariantApplyAPI","sap/m/library","sap/m/Button","./FilterBarBaseRenderer"],function(t,e,i,n,r,o,s,a,l,h,d,c,p,u,f,g,_,y,m,F,b,C){"use strict";const I=e.ValueState;const S=r.extend("sap.ui.mdc.filterbar.FilterBarBase",{metadata:{library:"sap.ui.mdc",designtime:"sap/ui/mdc/designtime/filterbar/FilterBarBase.designtime",defaultAggregation:"filterItems",interfaces:["sap.ui.mdc.IFilterSource","sap.ui.mdc.IFilter","sap.ui.mdc.IxState"],properties:{delegate:{type:"object",defaultValue:{name:"sap/ui/mdc/FilterBarDelegate",payload:{modelName:undefined,collectionName:""}}},liveMode:{type:"boolean",defaultValue:false},showMessages:{type:"boolean",group:"Misc",defaultValue:true},showGoButton:{type:"boolean",defaultValue:true},filterConditions:{type:"object",defaultValue:{}},propertyInfo:{type:"object",defaultValue:[]},suspendSelection:{type:"boolean",defaultValue:false},_filterCount:{type:"string",visibility:"hidden"}},aggregations:{filterItems:{type:"sap.ui.mdc.FilterField",multiple:true},basicSearchField:{type:"sap.ui.mdc.FilterField",multiple:false},layout:{type:"sap.ui.mdc.filterbar.IFilterContainer",multiple:false,visibility:"hidden"}},associations:{variantBackreference:{type:"sap.ui.fl.variants.VariantManagement",multiple:false}},events:{search:{parameters:{reason:{type:"sap.ui.mdc.enums.ReasonMode"}}},filtersChanged:{parameters:{conditionsBased:{type:"boolean"},filtersText:{type:"string"},filtersTextExpanded:{type:"string"}}}}},renderer:C});const P=F.ButtonType;S.INNER_MODEL_NAME="$sap.ui.filterbar.mdc.FilterBarBase";S.CONDITION_MODEL_NAME="$filters";S.prototype.init=function(){r.prototype.init.apply(this,arguments);this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");this._createInnerModel();this._oObserver=new l(this._observeChanges.bind(this));this._oObserver.observe(this,{aggregations:["filterItems","basicSearchField"]});this._createInnerLayout();this.getEngine().register(this,{controller:{Filter:new t({control:this})}});this._fResolveInitialFiltersApplied=undefined;this._oInitialFiltersAppliedPromise=new Promise(function(t){this._fResolveInitialFiltersApplied=t}.bind(this));this._bIgnoreChanges=false;this._aOngoingChangeAppliance=[];this._bSearchTriggered=false;this._bIgnoreQueuing=false};S.prototype._createInnerLayout=function(){this._cLayoutItem=null;this._oFilterBarLayout=null;this._btnAdapt=null;this.setAggregation("layout",this._oFilterBarLayout,true)};S.prototype._isPhone=function(){return n.system.phone?true:false};S.prototype._isLiveMode=function(){if(this._isPhone()){return false}return this.getLiveMode()};S.prototype._getConditionModel=function(){return this._oConditionModel};S.prototype._getSearchButton=function(){if(!this._btnSearch){this._btnSearch=new b(this.getId()+"-btnSearch",{text:this._oRb.getText("filterbar.GO"),press:this.onSearch.bind(this),type:P.Emphasized});i.addConfig(this._btnSearch,{addAccessibilityLabel:true,message:this._oRb.getText("filterbar.GoBtnShortCutHint")},this)}return this._btnSearch};S.prototype.getConditionModelName=function(){return this._getConditionModelName()};S.prototype._getConditionModelName=function(){return S.CONDITION_MODEL_NAME};S.prototype._createConditionModel=function(){this._oConditionModel=new h;this.setModel(this._oConditionModel,this._getConditionModelName())};S.prototype.applySettings=function(t,e){this._setPropertyHelperClass(f);this._setupPropertyInfoStore("propertyInfo");this._applySettings(t,e);Promise.all([this.awaitPropertyHelper()]).then(function(){if(!this._bIsBeingDestroyed){this._applyInitialFilterConditions()}}.bind(this))};S.prototype._applySettings=function(t,e){r.prototype.applySettings.apply(this,arguments);this._createConditionModel();this._oConditionModel.attachPropertyChange(this._handleConditionModelPropertyChange,this)};S.prototype._waitForMetadata=function(){return this._retrieveMetadata().then(function(){this._applyInitialFilterConditions()}.bind(this))};S.prototype.setIgnoreQueuing=function(t){this._bIgnoreQueuing=t};S.prototype.getIgnoreQueuing=function(){return this._bIgnoreQueuing};S.prototype.setSuspendSelection=function(t){this.setProperty("suspendSelection",t);if(!t){if(this._bSearchTriggered&&!this.getIgnoreQueuing()){this.triggerSearch()}this._bSearchTriggered=false;this.setIgnoreQueuing(false)}return this};S.prototype._createInnerModel=function(){this._oModel=new a(this);this.setModel(this._oModel,S.INNER_MODEL_NAME);return this};S.prototype.getCurrentState=function(){const t={};t.filter=s({},this.getFilterConditions());const e=this.getFilterItems();const i=[];e.forEach(function(t){i.push({name:t.getPropertyKey()})});t.items=i;return t};S.prototype.getAssignedFilterNames=function(){let t,e=null;const i=this._getConditionModel();if(i){e=[];const n=i.getConditions("$search");if(n&&n.length>0){e.push(this._oRb.getText("filterbar.ADAPT_SEARCHTERM"))}this._getNonHiddenPropertyInfoSet().forEach(function(n){t=p.getPropertyKey(n);const r=i.getConditions(t);if(r&&r.length>0){e.push(n.label||t)}})}return e};S.prototype._getAssignedFiltersText=function(){const t={};t.filtersText=this._getAssignedFiltersCollapsedText(this.getAssignedFilterNames());t.filtersTextExpanded=this._getAssignedFiltersExpandedText();return t};S.prototype._getAssignedFiltersExpandedText=function(){let t=0,e=0;const i=this._getConditionModel();if(i){const n=i.getAllConditions();for(const i in n){const r=this._getPropertyByName(i);if(r&&!r.hiddenFilter&&n[i].length>0){++t;if(!(i==="$search"&&this.getAggregation("basicSearchField")||this._getFilterField(i))){++e}}}}if(!t&&!e){return this._oRb.getText("filterbar.ADAPT_NOTFILTERED")}if(!e){if(t===1){return this._oRb.getText("filterbar.ADAPT_FILTER_WITH_NON_HIDDEN",[t])}return this._oRb.getText("filterbar.ADAPT_FILTERS_WITH_NON_HIDDEN",[t])}if(t===1){return this._oRb.getText("filterbar.ADAPT_FILTER_WITH_HIDDEN",[t,e])}return this._oRb.getText("filterbar.ADAPT_FILTERS_WITH_HIDDEN",[t,e])};S.prototype._getAssignedFiltersCollapsedText=function(t){let e;t=t||[];if(t.length){e=Object.keys(t).map(function(e){return t[e]}).join(", ");if(t.length===1){return this._oRb.getText("filterbar.ADAPT_FILTER_COLLAPSED",[t.length,e])}return this._oRb.getText("filterbar.ADAPT_FILTERS_COLLAPSED",[t.length,e])}return this._oRb.getText("filterbar.ADAPT_NOTFILTERED")};S.prototype.getAssignedFiltersText=function(){return this._getAssignedFiltersText()};S.prototype._reportModelChange=function(t){if(t.triggerFilterUpdate){this._handleAssignedFilterNames(false)}if(this.getLiveMode()||t.triggerSearch||this._bExecuteOnSelect){this._bExecuteOnSelect=false;this.triggerSearch()}else if(t.recheckMissingRequired){this._recheckMissingRequiredFields()}};S.prototype.getPropertyInfoSet=function(){return this.getPropertyHelper()?this.getPropertyHelper().getProperties():[]};S.prototype._addConditionChange=function(t){this._aOngoingChangeAppliance.push(this.getEngine().createChanges({control:this,applySequentially:true,applyAbsolute:true,key:"Filter",state:t}))};S.prototype._handleConditionModelPropertyChange=function(t){let e;const i=function(t,e){const i={};i[t]=this._stringifyConditions(t,s([],e));this._cleanupConditions(i[t]);return i}.bind(this);if(!this._bIgnoreChanges){const n=t.getParameter("path");if(n.indexOf("/conditions/")===0){const r=n.substring("/conditions/".length);const o=t.getParameter("value");if(this._getPropertyByName(r)){e=i(r,o)}else{e=this._retrieveMetadata().then(function(){return i(r,o)})}}}if(e){this._addConditionChange(e)}};S.prototype._toExternal=function(t,e){let i=s({},e);i=c.toString(i,t.typeConfig.typeInstance,this.getTypeMap());this._cleanupCondition(i);this._convertInOutParameters(e,i,"inParameters",c.toString);this._convertInOutParameters(e,i,"outParameters",c.toString);return i};S.prototype._toInternal=function(t,e){let i=s({},e);i=c.toType(i,t.typeConfig.typeInstance,this.getTypeMap());this._convertInOutParameters(e,i,"inParameters",c.toType);this._convertInOutParameters(e,i,"outParameters",c.toType);return i};S.prototype._convertInOutParameters=function(t,e,i,n){if(t[i]&&Object.keys(t[i]).length>0){Object.keys(t[i]).forEach(function(r){const s=r.startsWith("conditions/")?r.slice(11):r;const a=this._getPropertyByName(s);if(a){const o=d.createCondition(y.EQ,[t[i][r]]);const l=n(o,a.typeConfig.typeInstance,this.getTypeMap());if(!e[i]){e[i]={}}if(!r.startsWith("conditions/")){delete e[i][r];r="conditions/"+s}e[i][r]=l.values[0]}else{o.error("mdc.FilterBar._convertInOutParameters: could not find property for '"+s+"'")}}.bind(this))}};S.prototype._cleanupCondition=function(t){if(t){if(t.hasOwnProperty("isEmpty")){delete t.isEmpty}}};S.prototype._cleanupConditions=function(t){if(t){t.forEach(function(t){this._cleanupCondition(t)},this)}};S.prototype._stringifyCondition=function(t,e){let i=e;if(e&&e.values){if(e.values.length>0){i=this._toExternal(t,e)}else{i=s({},e);this._cleanupCondition(i)}}return i};S.prototype._stringifyConditions=function(t,e){const i=this._getPropertyByName(t);let n=e;if(i&&e){n=[];e.forEach(function(t){n.push(this._stringifyCondition(i,t))},this)}return n};S.prototype._internalizeConditions=function(t){const e=s({},t);Object.keys(e).forEach(function(t){e[t].forEach(function(i,n){const r=this._getPropertyByName(t);if(r){try{e[t][n]=this._toInternal(r,i)}catch(t){o.error(t.message)}}else{o.error("Property '"+t+"' does not exist")}},this)},this);return e};S.prototype._handleAssignedFilterNames=function(t){if(this._bIsBeingDestroyed){return}if(!t){if(this._btnAdapt){const t=this.getAssignedFilterNames();this.setProperty("_filterCount",this._oRb.getText(t.length?"filterbar.ADAPT_NONZERO":"filterbar.ADAPT",[t.length]),false)}}const e=this._getAssignedFiltersText();const i={conditionsBased:!t&&!this._bDoNotTriggerFiltersChangeEventBasedOnVariantSwitch,filtersText:e.filtersText,filtersTextExpanded:e.filtersTextExpanded};this._bDoNotTriggerFiltersChangeEventBasedOnVariantSwitch=false;this.fireFiltersChanged(i)};S.prototype.onReset=function(t){this._getConditionModel().removeAllConditions()};S.prototype.onSearch=function(t){if(!this._bSearchPressed){this._bSearchPressed=true;this._sReason=g.Go;this.triggerSearch().then(function(){this._bSearchPressed=false}.bind(this),function(){this._bSearchPressed=false}.bind(this))}};S.prototype.triggerSearch=function(){if(this.getSuspendSelection()){this._bSearchTriggered=true;return Promise.resolve()}return this.validate()};S.prototype._hasRetrieveMetadataToBeCalled=function(){return this.getPropertyHelper()===null||this.getPropertyHelper().getProperties().length===0&&!this.isPropertyHelperFinal()};S.prototype.validate=function(t){const e=!t;const i=function(){if(!this._oValidationPromise){this._oValidationPromise=new Promise(function(t,e){this._fResolvedSearchPromise=t;this._fRejectedSearchPromise=e}.bind(this));const t=function(){this._validate(e)};setTimeout(t.bind(this),0)}return this._oValidationPromise}.bind(this);return this.waitForInitialization().then(function(){if(this._hasRetrieveMetadataToBeCalled()){return this._retrieveMetadata().then(function(){return i()})}else{return i()}}.bind(this))};S.prototype._clearDelayedSearch=function(){if(this._iDelayedSearchId){clearTimeout(this._iDelayedSearchId);this._iDelayedSearchId=null}};S.prototype._checkAsyncValidation=function(){let t=_.NoError;if(this._aFIChanges&&this._aFIChanges.length>0){t=_.AsyncValidation}return t};S.prototype._checkOngoingChangeAppliance=function(){let t=_.NoError;if(this._aOngoingChangeAppliance&&this._aOngoingChangeAppliance.length>0){t=_.OngoingChangeAppliance}return t};S.prototype._getRequiredFilterFieldValueText=function(t){if(t){return this._oRb.getText("filterbar.REQUIRED_FILTER_VALUE_MISSING",[t.getLabel()])}else{return""}};S.prototype._recheckMissingRequiredFields=function(){this.getFilterItems().forEach(function(t){let e;if(t){if(t.getValueState()!==I.None&&t.getValueStateText()===this._getRequiredFilterFieldValueText(t)){if(!e){e=u.getRequiredFieldNamesWithoutValues(this)}if(e.indexOf(t.getPropertyKey())<0){t.setValueState(I.None)}}}}.bind(this))};S.prototype._checkRequiredFields=function(){let t=_.NoError;const e=u.getRequiredFieldNamesWithoutValues(this);e.forEach(function(e){const i=this._getFilterField(e);if(i){if(i.getValueState()===I.None){i.setValueState(I.Error);i.setValueStateText(this._getRequiredFilterFieldValueText(i))}}else{o.error("Mandatory filter field '"+e+"' not visible on FilterBarBase has no value.")}t=_.RequiredHasNoValue}.bind(this));return t};S.prototype._checkFieldsInErrorState=function(){let t=_.NoError;if(this._bFieldInErrorState){return _.FieldInErrorState}this.getFilterItems().some(function(e){if(e&&e.getValueState()!==I.None){if(e.getValueStateText()!==this._getRequiredFilterFieldValueText(e)){t=_.FieldInErrorState}}return t!==_.NoError}.bind(this));return t};S.prototype._hasAppliancePromises=function(){return this._aOngoingChangeAppliance&&this._aOngoingChangeAppliance.length>0?this._aOngoingChangeAppliance.slice():null};S.prototype._handleFilterItemSubmit=function(t){const e=t.getParameter("promise");if(e){this._sReason=g.Enter;e.then(function(){const t=this._hasAppliancePromises();if(!t){this.triggerSearch()}else{Promise.all(t).then(function(){if(!this.getLiveMode()){this.triggerSearch()}}.bind(this))}}.bind(this)).catch(function(t){o.error(t);this.triggerSearch().catch(function(t){})}.bind(this))}};S.prototype._handleFilterItemChanges=function(t){if(this._bIgnoreChanges){return}const e=t.oSource;if(e.getRequired()&&e.getValueState()===I.Error&&t.getParameter("valid")){e.setValueState(I.None);return}if(!this._aFIChanges){this._aFIChanges=[]}const i=e.getPropertyKey();this._aFIChanges.some(function(t,e){if(t.name===i){this._aFIChanges.splice(e,1);return true}return false}.bind(this));this._aFIChanges.push({name:i,promise:t.getParameter("promise")})};S.prototype.checkFilters=function(){let t=this._checkAsyncValidation();if(t!==_.NoError){return t}t=this._checkOngoingChangeAppliance();if(t!==_.NoError){return t}t=this._checkFieldsInErrorState();if(t!==_.NoError){return t}t=this._checkRequiredFields();if(t!==_.NoError){return t}return t};S.prototype._setFocusOnFirstErroneousField=function(){let t=null;this.getFilterItems().some(function(e){if(e.getValueState()!==I.None){t=e;setTimeout(e["focus"].bind(e),0)}return t!=null});return t};S.prototype._handleAsyncValidation=function(t,e){if(!e){e=this._validate.bind(this)}if(this._aFIChanges&&this._aFIChanges.length>0){const i=this._aFIChanges.slice();this._aFIChanges=null;const n=[];i.forEach(function(t){n.push(t.promise)});Promise.all(n).then(function(n){n.forEach(function(t,e){const n=this._getFilterField(i[e].name);if(n&&n.getRequired()&&n.getValueState()===I.Error){n.setValueState(I.None)}},this);e(t)}.bind(this),function(){this._bFieldInErrorState=true;e(t)}.bind(this)).catch(function(i){this._bFieldInErrorState=true;e(t)}.bind(this))}};S.prototype._handleOngoingChangeAppliance=function(t,e){if(!e){e=this._validate.bind(this)}if(this._aOngoingChangeAppliance&&this._aOngoingChangeAppliance.length>0){const i=this._aOngoingChangeAppliance.slice();this._aOngoingChangeAppliance=[];Promise.all(i).then(function(){const i=this._oApplyingChanges?this._oApplyingChanges:Promise.resolve();i.then(()=>e(t))}.bind(this),function(){this._bFieldInErrorState=true;e(t)}.bind(this)).catch(function(i){this._bFieldInErrorState=true;e(t)}.bind(this))}};S.prototype._determineValidationState=function(){return this.awaitControlDelegate().then(function(t){return t.determineValidationState(this,this.checkFilters())}.bind(this))};S.prototype._visualizeValidationState=function(t){if(this._oDelegate){this._oDelegate.visualizeValidationState(this,{status:t})}};S.prototype.getText=function(t){return this._oRb.getText(t)};S.prototype._restartCheckAndNotify=function(t){const e=this.checkFilters();this._checkAndNotify(t,e)};S.prototype._checkAndNotify=function(t,e){const i=function(){if(t){const t={reason:this._sReason?this._sReason:g.Unclear};this._sReason=g.Unclear;this.fireSearch(t)}}.bind(this);const n=function(){this._bFieldInErrorState=false;this._oValidationPromise=null;this._fRejectedSearchPromise=null;this._fResolvedSearchPromise=null}.bind(this);if(e===_.AsyncValidation){this._handleAsyncValidation(t,this._restartCheckAndNotify.bind(this));return}if(e===_.OngoingChangeAppliance){this._handleOngoingChangeAppliance(t,this._restartCheckAndNotify.bind(this));return}if(e===_.NoError){if(this._fResolvedSearchPromise){i();this._fResolvedSearchPromise()}}else if(this._fRejectedSearchPromise){this._setFocusOnFirstErroneousField();this._fRejectedSearchPromise()}this._visualizeValidationState(e);n()};S.prototype._validate=function(t){const e=function(){this._oValidationPromise=null;this._fRejectedSearchPromise=null;this._fResolvedSearchPromise=null}.bind(this);if(this.bIsDestroyed){e();return}this._determineValidationState().then(function(e){this._checkAndNotify(t,e)}.bind(this))};S.prototype.setInternalConditions=function(t){const e=this._getConditionModel();if(e){e.setConditions(t)}};S.prototype.getInternalConditions=function(){return this._getModelConditions(this._getConditionModel(),true)};S.prototype.waitForInitialization=function(){return Promise.all([this._oInitialFiltersAppliedPromise,this._oMetadataAppliedPromise])};S.prototype.initialized=function(){return this.waitForInitialization()};S.prototype.initializedWithMetadata=function(){if(!this._oMetadataAppliedPromise){this._retrieveMetadata()}return this.waitForInitialization()};S.prototype._getModelConditions=function(t,e,i){const n={};if(t){const r=s({},t.getAllConditions());for(const t in r){if(r[t]&&(i||r[t].length>0)){n[t]=r[t];if(!e){this._cleanupConditions(n[t]);const e=this._stringifyConditions(t,n[t]);n[t]=e}}}}return n};S.prototype._isPathKnown=function(t,e){let i,n;if(!this._getPropertyByName(t)){return false}for(i in e["inParameters"]){n=i.startsWith("conditions/")?i.slice(11):i;if(!this._getPropertyByName(n)){return false}}for(i in e["outParameters"]){n=i.startsWith("conditions/")?i.slice(11):i;if(!this._getPropertyByName(n)){return false}}return true};S.prototype._onModifications=function(t){if(t&&t.indexOf("Filter")===-1){return Promise.resolve()}let e;if(!this._oApplyingChanges){this._oApplyingChanges=new Promise(function(t){e=t})}return this._setXConditions(this.getFilterConditions()).then(function(){this._reportModelChange({triggerSearch:false,triggerFilterUpdate:true,recheckMissingRequired:true});e();this._oApplyingChanges=null}.bind(this))};S.prototype._setXConditions=function(t){if(t){let e=true;for(const i in t){const n=t[i];if(!this._isPathKnown(i,n)){e=false;break}}const i=e?Promise.resolve():this._retrieveMetadata();const n=this._getConditionModel();return i.then(function(){const e=this._internalizeConditions(t);const i=this._getModelConditions(n,true);n.detachPropertyChange(this._handleConditionModelPropertyChange,this);try{return this.getEngine().diffState(this,{Filter:i},{Filter:e}).then(function(t){Object.keys(t.Filter).forEach(function(e){t.Filter[e].forEach(function(t){if(t.filtered!==false){n.addCondition(e,t)}else{n.removeCondition(e,t)}})});n.attachPropertyChange(this._handleConditionModelPropertyChange,this)}.bind(this))}catch(t){o.error(t.message);n.attachPropertyChange(this._handleConditionModelPropertyChange,this)}}.bind(this))}else{return Promise.resolve()}};S.prototype._getXConditions=function(){return this._getModelConditions(this._getConditionModel(),false)};S.prototype._getRequiredPropertyNames=function(){const t=[];this._getNonHiddenPropertyInfoSet().forEach(function(e){if(e.required){t.push(p.getPropertyKey(e))}});return t};S.prototype._getNonRequiredPropertyNames=function(){const t=[];this._getNonHiddenPropertyInfoSet().forEach(function(e){if(!e.required){t.push(p.getPropertyKey(e))}});return t};S.prototype._insertFilterFieldtoContent=function(t,e){if(!this._cLayoutItem){return}const i=this._cLayoutItem;const n=new i;n.setFilterField(t);this._oFilterBarLayout.insertFilterField(n,e)};S.prototype._filterItemInserted=function(t){if(!t.getVisible()){return}if(t.setWidth){t.setWidth("")}this._applyFilterItemInserted(t);this._handleAssignedFilterNames(true)};S.prototype._applyFilterItemInserted=function(t){let e;e=this.indexOfAggregation("filterItems",t);if(this.getAggregation("basicSearchField")){e++}const i=e;const n=this.getFilterItems();for(let t=0;t<i;t++){if(!n[t].getVisible()){e--}}this._insertFilterFieldtoContent(t,e);if(!this._oObserver.isObserved(t,{properties:["visible"]})){this._oObserver.observe(t,{properties:["visible"]})}};S.prototype._filterItemRemoved=function(t){this._applyFilterItemRemoved(t.getPropertyKey());this._handleAssignedFilterNames(true)};S.prototype._applyFilterItemRemoved=function(t){this._removeFilterFieldFromContentByName(t)};S.prototype._removeFilterFieldFromContent=function(t){this._removeFilterFieldFromContentByName(t.getPropertyKey())};S.prototype._removeFilterFieldFromContentByName=function(t){const e=this._getFilterItemLayoutByName(t);if(e){this._oFilterBarLayout.removeFilterField(e);e.destroy()}};S.prototype._observeChanges=function(t){if(t.type==="aggregation"){if(t.name==="filterItems"){switch(t.mutation){case"insert":t.child.attachChange(this._handleFilterItemChanges,this);t.child.attachSubmit(this._handleFilterItemSubmit,this);this._filterItemInserted(t.child);break;case"remove":t.child.detachChange(this._handleFilterItemChanges,this);t.child.detachSubmit(this._handleFilterItemSubmit,this);this._filterItemRemoved(t.child);break;default:o.error("operation "+t.mutation+" not yet implemented")}}else if(t.name==="basicSearchField"){switch(t.mutation){case"insert":t.child.attachSubmit(this._handleFilterItemSubmit,this);this._insertFilterFieldtoContent(t.child,0);break;case"remove":t.child.detachSubmit(this._handleFilterItemSubmit,this);this._removeFilterFieldFromContent(t.child);break;default:o.error("operation "+t.mutation+" not yet implemented")}}}else if(t.type==="property"){let e;if(t.object.isA&&t.object.isA("sap.ui.mdc.FilterField")){e=t.object;if(e){if(t.current){this._filterItemInserted(e)}else{this._filterItemRemoved(e)}this._oFilterBarLayout.invalidate()}}}};S.prototype._getFilterItemLayout=function(t){return this._getFilterItemLayoutByName(t.getPropertyKey())};S.prototype._getFilterItemLayoutByName=function(t){let e=null;if(this._oFilterBarLayout){this._oFilterBarLayout.getFilterFields().some(function(i){if(i._getFieldPath()===t){e=i}return e!==null})}return e};S.prototype._getFilterField=function(t){let e=null;this.getFilterItems().some(function(i){if(i&&i.getPropertyKey()===t){e=i}return e!==null});return e};S.prototype._retrieveMetadata=function(){if(this.isPropertyHelperFinal()){return Promise.resolve()}if(this._oMetadataAppliedPromise){return this._oMetadataAppliedPromise}this._fResolveMetadataApplied=undefined;this._oMetadataAppliedPromise=new Promise(function(t,e){this._fResolveMetadataApplied=t;this._fRejectMetadataApplied=e}.bind(this));this.initControlDelegate().then(function(){if(!this._bIsBeingDestroyed){const t=function(t){t?this._fResolveMetadataApplied():this._fRejectMetadataApplied();this._fResolveMetadataApplied=null;this._fRejectMetadataApplied=null}.bind(this);if(this.isControlDelegateInitialized()){this.finalizePropertyHelper().then(function(){t(true)})}else{o.error("Delegate not initialized.");t(false)}}}.bind(this));return this._oMetadataAppliedPromise};S.prototype.setBasicSearchField=function(t){const e=this.getAggregation("basicSearchField");if(e){this.removeAggregation("basicSearchField",e)}this.setAggregation("basicSearchField",t);if(t){if(!this._oObserver.isObserved(t,{properties:["visible"]})){this._oObserver.observe(t,{properties:["visible"]})}}return this};S.prototype._getNonHiddenPropertyInfoSet=function(){const t=[];this.getPropertyInfoSet().every(function(e){if(!e.hiddenFilter){if(p.getPropertyKey(e)!=="$search"){t.push(e)}}return true});return t};S.prototype._getNonHiddenPropertyByName=function(t){let e=null;this._getNonHiddenPropertyInfoSet().some(function(i){if(p.getPropertyKey(i)===t){e=i}return e!=null});return e};S.prototype._cleanUpFilterFieldInErrorStateByName=function(t){let e=null;const i=this.getFilterItems();i.some(function(i){if(i.getPropertyKey()===t){e=i}return e!=null});if(e){this._cleanUpFilterFieldInErrorState(e)}};S.prototype.cleanUpAllFilterFieldsInErrorState=function(){this._getConditionModel().checkUpdate(true);const t=this.getFilterItems();t.forEach(function(t){this._cleanUpFilterFieldInErrorState(t)}.bind(this))};S.prototype._cleanUpFilterFieldInErrorState=function(t){if(t&&t.getValueState()!==I.None){t.setValueState(I.None)}};S.prototype._applyInitialFilterConditions=function(){this._bIgnoreChanges=true;this._applyFilterConditionsChanges().then(function(){this._bIgnoreChanges=false;this._reportModelChange({triggerFilterUpdate:true,triggerSearch:false});this._bInitialFiltersApplied=true;this._fResolveInitialFiltersApplied();this._fResolveInitialFiltersApplied=null}.bind(this))};S.prototype._applyFilterConditionsChanges=function(){let t;const e=this.getProperty("filterConditions");if(Object.keys(e).length>0){t=s({},e);return this._setXConditions(t)}return Promise.resolve()};S.prototype.setVariantBackreference=function(t){if(!this._hasAssignedVariantManagement()){this.setAssociation("variantBackreference",t);m.attachVariantApplied({selector:this,vmControlId:this.getVariantBackreference(),callback:this._handleVariantSwitch.bind(this),callAfterInitialVariant:true})}else{o.error("the association 'variant' may only be assigned once and may not change afterwards.")}};S.prototype._handleVariantSwitch=function(t){this._bExecuteOnSelect=this._getExecuteOnSelectionOnVariant(t);this._sReason=this._bExecuteOnSelect?g.Variant:g.Unclear;this._bDoNotTriggerFiltersChangeEventBasedOnVariantSwitch=false;if(t.hasOwnProperty("createScenario")&&t.createScenario==="saveAs"){this._bDoNotTriggerFiltersChangeEventBasedOnVariantSwitch=true}return this.awaitPendingModification().then(function(t){this.cleanUpAllFilterFieldsInErrorState();if(this._bInitialFiltersApplied&&t.indexOf("Filter")===-1){this._reportModelChange({triggerFilterUpdate:false,triggerSearch:this._bExecuteOnSelect})}}.bind(this))};S.prototype._getExecuteOnSelectionOnVariant=function(t){let e=false;const i=this._getAssignedVariantManagement();if(i){e=i.getApplyAutomaticallyOnVariant(t)}return e};S.prototype._hasAssignedVariantManagement=function(){return this._getAssignedVariantManagement()?true:false};S.prototype._getAssignedVariantManagement=function(){const t=this.getVariantBackreference();if(t){const e=sap.ui.getCore().byId(t);if(e&&e.isA("sap.ui.fl.variants.VariantManagement")){return e}}return null};S.prototype._getView=function(){return p.getView(this)};S.prototype.getConditions=function(){const t=this.getCurrentState().filter;if(t&&t["$search"]){delete t["$search"]}return t};S.prototype.getSearch=function(){const t=this._getConditionModel()?this._getConditionModel().getConditions("$search"):[];return t[0]?t[0].values[0]:""};S.prototype.exit=function(){if(this._hasAssignedVariantManagement()){m.detachVariantApplied({selector:this,vmControlId:this.getVariantBackreference()})}if(this.isControlDelegateInitialized()&&this.getControlDelegate().cleanup){this.getControlDelegate().cleanup(this)}r.prototype.exit.apply(this,arguments);this._clearDelayedSearch();this._oFilterBarLayout=null;this._cLayoutItem=null;this._btnAdapt=undefined;this._btnSearch=undefined;this._oRb=null;if(this._oModel){this._oModel.destroy();this._oModel=null}if(this._oConditionModel){this._oConditionModel.detachPropertyChange(this._handleConditionModelPropertyChange,this);this._oConditionModel.destroy();this._oConditionModel=null}this._oObserver.disconnect();this._oObserver=undefined;this._oDelegate=null;this._oFlexPromise=null;this._fResolveMetadataApplied=undefined;this._oMetadataAppliedPromise=null;this._oInitialFiltersAppliedPromise=null;this._oValidationPromise=null;this._aBindings=null;this._aFIChanges=null;this._aOngoingChangeAppliance=null};return S});
//# sourceMappingURL=FilterBarBase.js.map