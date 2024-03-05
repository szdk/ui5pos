/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/m/P13nFilterPanel","sap/ui/comp/p13n/P13nConditionPanel","sap/ui/layout/form/SimpleForm","sap/m/library","sap/m/P13nFilterItem","sap/ui/comp/p13n/P13nOperationsHelper","sap/m/P13nFilterPanelRenderer","sap/ui/layout/library"],function(e,t,i,n,o,a,s,r){"use strict";var l=n.P13nPanelType,p=n.P13nConditionOperation;var d=r.form.SimpleFormLayout;var u=e.extend("sap.ui.comp.p13n.P13nFilterPanel",{metadata:{library:"sap.ui.comp.p13n",properties:{maxIncludes:{type:"string",group:"Misc",defaultValue:"-1"},maxExcludes:{type:"string",group:"Misc",defaultValue:"-1"},maxConditions:{type:"string",group:"Misc",defaultValue:"-1"},defaultOperation:{type:"string",group:"Misc",defaultValue:null}}},renderer:s.renderer});u.prototype.setConditions=function(e){this._oConditionPanel.setConditions(e);return this};u.prototype.getConditions=function(){return this._oConditionPanel.getConditions()};u.prototype.setContainerQuery=function(e){this.setProperty("containerQuery",e);this._oConditionPanel.setContainerQuery(e);return this};u.prototype.setLayoutMode=function(e){this.setProperty("layoutMode",e);this._oConditionPanel.setLayoutMode(e);return this};u.prototype.validateConditions=function(){return this._oConditionPanel.validateConditions()};u.prototype.removeInvalidConditions=function(){this._oConditionPanel.removeInvalidConditions()};u.prototype.removeValidationErrors=function(){this._oConditionPanel.removeValidationErrors()};u.prototype.setIncludeOperations=function(e,t,i){t=t||"default";this.bEnhanceInclude=!i;this._aIncludeOperations[t]=e;if(this._oConditionPanel){this._oConditionPanel.setOperations(this._aIncludeOperations[t],t)}};u.prototype.getIncludeOperations=function(e){if(this._oConditionPanel){return this._oConditionPanel.getOperations(e,false)}};u.prototype.setExcludeOperations=function(e,t,i){t=t||"default";this.bEnhanceExclude=!i;this._aExcludeOperations[t]=e;if(this._oConditionPanel){this._oConditionPanel.setOperations(this._aExcludeOperations[t],t,true)}};u.prototype.getExcludeOperations=function(e){if(this._oConditionPanel){return this._oConditionPanel.getOperations(e,true)}};u.prototype.setKeyFields=function(e,t){this._aKeyFields=e;if(this._oConditionPanel){e.some(function(e){if(e.isDefault){this._oConditionPanel.setAutoAddNewRow(true)}}.bind(this));this._oConditionPanel.setKeyFields&&this._oConditionPanel.setKeyFields(e)}};u.prototype.setMaxConditions=function(e){this.setProperty("maxConditions",e);if(this._oConditionPanel){this._oConditionPanel.setMaxConditions(e)}return this};u.prototype.setMaxIncludes=function(e){this.setProperty("maxIncludes",e);this._updateIncludeOperations();return this};u.prototype.setMaxExcludes=function(e){this.setProperty("maxExcludes",e);this._updateExcludeOperations();return this};u.prototype._updatePanel=function(){};u.prototype.setDefaultOperation=function(e){this.setProperty("defaultOperation",e);if(this._oConditionPanel){this._oConditionPanel.setDefaultOperation(e)}return this};u.prototype.init=function(){this.setType(l.filter);this.setTitle(sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("FILTERPANEL_TITLE"));this._aKeyFields=[];this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._aIncludeOperations={};this._aExcludeOperations={};this.bEnhanceExclude=true;this.bEnhanceInclude=true;this._oPanel=new i({layout:d.ResponsiveGridLayout});this._oConditionPanel=new t({maxConditions:this.getMaxConditions(),alwaysShowAddIcon:false,layoutMode:this.getLayoutMode(),dataChange:this._handleDataChange(),defaultOperation:this.getDefaultOperation()});this._oConditionPanel._sAddRemoveIconTooltipKey="FILTER";this._oPanel.addContent(this._oConditionPanel);this.addAggregation("content",this._oPanel);if(!this._oOperationsHelper){this._oOperationsHelper=new a}this._updateOperations()};u.prototype.onBeforeRendering=function(){var e=[],t,i,n=this.getEnableEmptyOperations();if(this._bUpdateRequired){this._bUpdateRequired=false;var o=this.getMessageStrip();if(o){o.addStyleClass("sapUiResponsiveMargin");this.insertAggregation("content",o,0)}t=[];i=(this.getBindingInfo("items")||{}).model;var a=function(e,t,i){var n=i.getBinding(e),o;if(n&&t){return t.getObject()[n.getPath()]}o=i.getMetadata();return o.hasProperty(e)?o.getProperty(e).get(i):o.getAggregation(e).get(i)};this.getItems().forEach(function(o){var s=o.getBindingContext(i),r,l,p;if(o.getBinding("key")){s.getObject()[o.getBinding("key").getPath()]=o.getKey()}t.push(r={key:o.getColumnKey(),text:a("text",s,o),tooltip:a("tooltip",s,o),maxLength:a("maxLength",s,o),type:a("type",s,o),typeInstance:a("typeInstance",s,o),formatSettings:a("formatSettings",s,o),precision:a("precision",s,o),scale:a("scale",s,o),isDefault:a("isDefault",s,o),values:a("values",s,o)});if(n){l=o.getNullable();p={};Object.keys(r).forEach(function(e){p[e]=r[e]});e.push(p);this._enhanceFieldOperationsWithEmpty(r,l);this._modifyFieldOperationsBasedOnMaxLength(p)}this._modifyFieldOperationsBasedOnMaxLength(r)},this);this.setKeyFields&&this.setKeyFields(t,e);var s=[];i=(this.getBindingInfo("filterItems")||{}).model;this.getFilterItems().forEach(function(e){var t=e.getBindingContext(i);if(e.getBinding("key")&&t){t.getObject()[e.getBinding("key").getPath()]=e.getKey()}s.push({key:e.getKey(),keyField:a("columnKey",t,e),operation:a("operation",t,e),value1:a("value1",t,e),value2:a("value2",t,e),exclude:a("exclude",t,e)})});this.setConditions(s)}};u.prototype._updateOperations=function(){this._updateIncludeOperations();this._updateExcludeOperations()};u.prototype._updateIncludeOperations=function(){if(this.getMaxIncludes()==="0"){this._oOperationsHelper.getIncludeTypes().forEach(function(e){this.setIncludeOperations([],e)}.bind(this))}else{this._oOperationsHelper.getIncludeTypes().forEach(function(e){this.setIncludeOperations(this._oOperationsHelper.getIncludeOperationsByType(e),e)}.bind(this))}};u.prototype._updateExcludeOperations=function(){if(this.getMaxExcludes()==="0"){this._oOperationsHelper.getExcludeTypes().forEach(function(e){this.setExcludeOperations([],e)}.bind(this))}else{this._oOperationsHelper.getExcludeTypes().forEach(function(e){this.setExcludeOperations(this._oOperationsHelper.getExcludeOperationsByType(e),e)}.bind(this))}};u.prototype._modifyFieldOperationsBasedOnMaxLength=function(e){var t;if(e.maxLength===1||e.maxLength==="1"){t=e.operations?e.operations:this._oConditionPanel.getOperations(e.type);e.operations=[];t.forEach(function(t){if([p.Contains,p.StartsWith,p.EndsWith].indexOf(t)===-1){e.operations.push(t)}},this)}};u.prototype._enhanceFieldOperationsWithEmpty=function(e,t){var i,n,o=e&&e.typeInstance&&e.typeInstance.oConstraints&&e.typeInstance.oConstraints.isDigitSequence,a=e&&e.typeInstance&&(e.typeInstance.sFiscalType==="IsFiscalPeriod"||e.typeInstance.sFiscalType==="IsFiscalYearPeriod");if(["string","stringdate","guid"].indexOf(e.type)>-1||["date","datetime"].indexOf(e.type)>-1&&t&&!(o&&a)&&!this.bIsSingleIntervalRange){i=this._oConditionPanel.getOperations(e.type,false).slice();n=this._oConditionPanel.getOperations(e.type,true).slice();if(i.length===0){i=this._oConditionPanel.getOperations("default",false)}if(n.length===0){n=this._oConditionPanel.getOperations("default",true)}if(i.indexOf(p.Empty)===-1&&this.getMaxIncludes()!=="0"&&this.bEnhanceInclude){i.push(p.Empty)}if(n.indexOf(p.NotEmpty)===-1&&this.getMaxExcludes()!=="0"&&this.bEnhanceExclude){n.push(p.NotEmpty)}if(!Array.isArray(e.operations)){e.operations=[]}e.operations=e.operations.concat(i).concat(n)}};u.prototype._handleDataChange=function(){var e=this;return function(t){var i=t.getParameter("newData"),n=t.getParameter("operation"),a=t.getParameter("key"),s=t.getParameter("index"),r;switch(n){case"update":r=e.getFilterItems()[s];if(r){r.setExclude(i.exclude);r.setColumnKey(i.keyField);r.setOperation(i.operation);r.setValue1(i.value1);r.setValue2(i.value2)}e.fireUpdateFilterItem({key:a,index:s,filterItemData:r});e.fireFilterItemChanged({reason:"updated",key:a,index:s,itemData:{columnKey:i.keyField,operation:i.operation,exclude:i.exclude,value1:i.value1,value2:i.value2}});break;case"add":if(s>=0){s++}r=new o({columnKey:i.keyField,exclude:i.exclude,operation:i.operation});r.setValue1(i.value1);r.setValue2(i.value2);e._bIgnoreBindCalls=true;e.fireAddFilterItem({key:a,index:s,filterItemData:r});e.fireFilterItemChanged({reason:"added",key:a,index:s,itemData:{columnKey:i.keyField,operation:i.operation,exclude:i.exclude,value1:i.value1,value2:i.value2}});e._bIgnoreBindCalls=false;break;case"remove":e._bIgnoreBindCalls=true;e.fireRemoveFilterItem({key:a,index:s});e.fireFilterItemChanged({reason:"removed",key:a,index:s});e._bIgnoreBindCalls=false;break;default:throw"Operation'"+n+"' is not supported yet"}e._notifyChange()}};u.prototype.getConditionPanel=function(){return this._oConditionPanel};u.prototype.setInnerTitle=function(e){this._oPanel&&this._oPanel.setHeaderText(e)};u.prototype.setSuggestCallback=function(e){if(this._oConditionPanel){this._oConditionPanel.setSuggestCallback(e)}};return u});
//# sourceMappingURL=P13nFilterPanel.js.map