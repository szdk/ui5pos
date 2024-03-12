/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/valuehelp/base/FilterableListContent","sap/ui/mdc/util/loadModules","sap/ui/mdc/util/Common","sap/base/Log","sap/ui/core/Element","sap/ui/mdc/enums/TableSelectionMode","sap/ui/mdc/enums/TableType","sap/ui/mdc/enums/ValueHelpSelectionType","sap/ui/mdc/enums/TableRowCountMode","sap/base/util/restricted/_throttle"],function(e,t,i,o,n,s,l,a,r,h){"use strict";const p=e.extend("sap.ui.mdc.valuehelp.content.MDCTable",{metadata:{library:"sap.ui.mdc",interfaces:["sap.ui.mdc.valuehelp.IDialogContent"],properties:{forceBind:{type:"boolean",defaultValue:false}},aggregations:{table:{type:"sap.ui.mdc.Table",multiple:false}},events:{},defaultAggregation:"table"}});p.prototype.init=function(){e.prototype.init.apply(this,arguments);this._oObserver.observe(this,{aggregations:["table"]});this._bRebindTable=false};p.prototype._setTableSelectionState=function(){this._bSelectionIsUpdating=true;const e=this._getAllCurrentContexts();if(e){this._oTable._setSelectedContexts(e.filter(function(e){return this._isContextSelected(e,this.getConditions())}.bind(this)))}this._bSelectionIsUpdating=false};p.prototype.handleConditionsUpdate=function(){if(!this._bIgnoreNextConditionChange){this._setTableSelectionState()}else{this._bIgnoreNextConditionChange=false}};p.prototype._handleUpdateFinished=function(e){if(this._oTable){this._handleRowBinding();if(!this._bQueryingContexts){this._setTableSelectionState()}}};p.prototype._handleUpdateFinishedThrottled=h(p.prototype._handleUpdateFinished,100,{leading:false});p.prototype._handleRowBinding=function(){const e=this._oTable.getRowBinding();if(e){this._resolvePromise("listBinding",e)}};p.prototype.observeChanges=function(t){if(t.name==="table"){const e=t.child;if(t.mutation==="remove"){this._oTable.detachEvent("_bindingChange",this._handleUpdateFinishedThrottled,this);this._oTable.detachEvent("selectionChange",this._handleSelectionChange,this);this._oTable=null}else{this._oTable=e;this._addPromise("listBinding");this._handleRowBinding();if(this._oTable.getAutoBindOnInit()){o.warning("Usage of autobound tables may lead to unnecessary requests.")}else if(this.getForceBind()){this._bRebindTable=true}e.addDelegate({onmouseover:function(e){const t=n.closestTo(e.target);if(t&&t.isA("sap.m.ColumnListItem")){t.setType("Active")}}});this._oTable.initialized().then(function(){this._oTable.attachEvent("_bindingChange",this._handleUpdateFinishedThrottled,this);this._oTable.attachEvent("selectionChange",this._handleSelectionChange,this)}.bind(this))}return}e.prototype.observeChanges.apply(this,arguments)};p.prototype._getAllCurrentContexts=function(){const e=this._oTable&&this._oTable.getRowBinding();if(e){return e.getAllCurrentContexts?e.getAllCurrentContexts():e.getContexts()}return undefined};p.prototype._handleSelectionChange=function(e){if(!this._bSelectionIsUpdating){this._bQueryingContexts=true;const e=this._getAllCurrentContexts();const t=e&&this._oTable.getSelectedContexts();this._bQueryingContexts=false;if(e){const i=this.getConditions();let o=i;let n=false;e.forEach(function(e){const s=this._findConditionsForContext(e,i);const l=!!s.length;const a=t.indexOf(e)>=0;if(!l&&a){const t=this.getItemFromContext(e);const i=t&&this.createCondition(t.key,t.description,t.payload);o=this.isSingleSelect()?[i]:o.concat(i);n=true}else if(l&&!a){o=o.filter(function(e){return s.indexOf(e)===-1});n=true}}.bind(this));if(n){this._prepareSelect(o,a.Set)}}}};p.prototype._prepareSelect=function(e,t){let i=typeof t==="string"&&t;i=i||(t?a.Add:a.Remove);this._bIgnoreNextConditionChange=true;this._fireSelect({type:i,conditions:e})};p.prototype._getTable=function(){return this._oTable};p.prototype.getContent=function(){return this._retrievePromise("wrappedContent",function(){return t(["sap/ui/layout/FixFlex","sap/m/VBox","sap/m/ScrollContainer"]).then(function(e){const t=e[0];const i=e[1];const o=e[2];if(!this._oContentLayout){this._oFilterBarVBox=new i(this.getId()+"-FilterBarBox",{visible:"{$this>/_filterBarVisible}"});this._oFilterBarVBox.addStyleClass("sapMdcValueHelpPanelFilterbar");this._oFilterBarVBox._oWrapper=this;this._oFilterBarVBox.getItems=function(){const e=this._oWrapper._getPriorityFilterBar.call(this._oWrapper);const t=e?[e]:[];return t};this._oTableBox=new i(this.getId()+"-TB",{height:"100%"});this._oTableBox.addStyleClass("sapMdcValueHelpPanelTableBox");this._oTableBox._oWrapper=this;this._oTableBox.getItems=function(){const e=this._oWrapper._oTable._isOfType(l.ResponsiveTable)?this._oWrapper._oScrollContainer:this._oWrapper._oTable;const t=e?[e]:[];return t};this._oContentLayout=new t(this.getId()+"-FF",{minFlexSize:200,fixContent:this._oFilterBarVBox,flexContent:this._oTableBox});this._oScrollContainer=new o(this.getId()+"-SC",{height:"calc(100% - 0.5rem)",width:"100%",vertical:true});this._oScrollContainer._oWrapper=this;this._oScrollContainer.getContent=function(){const e=[];const t=this._oWrapper&&this._oWrapper._oTable;if(t){e.push(t)}return e}}this.setAggregation("displayContent",this._oContentLayout);if(!this._getPriorityFilterBar()){return this._createDefaultFilterBar().then(function(){this._oFilterBarVBox.invalidate();return this._oContentLayout}.bind(this))}return this._oContentLayout}.bind(this))}.bind(this))};p.prototype.getListBinding=function(){const e=this.getTable();return e&&e.getRowBinding()};p.prototype._configureTable=function(){if(this._oTable){const t=e.prototype.isSingleSelect.apply(this);const i=this._oTable._getType();const o=this._getPriorityFilterBar();if(o&&this._oTable.getFilter()!==o.getId()){this._oTable.setFilter(o)}if(!this._oTable.getHeader()){this._oTable.setHeader(this._oResourceBundle.getText("valuehelp.TABLETITLENONUMBER"))}const n=t?s.SingleMaster:s.Multi;if(this._oTable.getSelectionMode()===s.None){this._oTable.setSelectionMode(n)}if(this._oTable.getSelectionMode()!==n){throw new Error("Table selectionMode needs to be "+n)}const a=this._oTable._isOfType(l.Table);if(a){const e=i.getRowCountMode();if(e===r.Auto){i.setRowCount(3)}}}};p.prototype.onShow=function(){e.prototype.onShow.apply(this,arguments)};p.prototype.onBeforeShow=function(t){this._configureTable();return Promise.resolve(e.prototype.onBeforeShow.apply(this,arguments)).then(function(){const e=this.getTable();if(e){const i=e.isTableBound();const o=i&&e._oTable.getShowOverlay();if(this._bRebindTable||o){e.rebind();this._bRebindTable=false}else if(t){if(e._isOfType(l.ResponsiveTable)){this._oScrollContainer.scrollTo(0,0)}else if(i){return e.scrollToIndex(0)}}}}.bind(this))};p.prototype.getScrollDelegate=function(){if(!this.isTypeahead()&&this._oScrollContainer){return this._oScrollContainer.getScrollDelegate()}return e.prototype.getScrollDelegate.apply(this,arguments)};p.prototype.isQuickSelectSupported=function(){return true};p.prototype.setParent=function(t){e.prototype.setParent.apply(this,arguments)};p.prototype.isSingleSelect=function(){if(this._oTable){if(this._oTable.getSelectionMode()===s.Multi){return false}else{return true}}else{return e.prototype.isSingleSelect.apply(this,arguments)}};p.prototype.exit=function t(o){i.cleanup(this,["_oContentLayout","_oFilterBarVBox","_oTableBox","_oResourceBundle","_oScrollContainer","_oTableHelper","_bSelectionIsUpdating","_sTableType","_oUITableSelectionPlugin","_oTable","_bRebindTable","_mKnownContexts","_bIgnoreNextConditionChange","_bQueryingContexts"]);e.prototype.exit.apply(this,arguments)};return p});
//# sourceMappingURL=MDCTable.js.map