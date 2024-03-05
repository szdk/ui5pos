/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Column","./library","sap/ui/core/Element","sap/ui/model/type/Boolean","sap/ui/model/type/DateTime","sap/ui/model/type/Float","sap/ui/model/type/Integer","sap/ui/model/type/Time","./utils/TableUtils","sap/base/Log"],function(e,t,r,i,a,n,o,p,s,u){"use strict";var l=t.GroupEventType;function g(e){return s.isA(e,"sap.ui.table.AnalyticalTable")}var d=e.extend("sap.ui.table.AnalyticalColumn",{metadata:{library:"sap.ui.table",properties:{leadingProperty:{type:"string",group:"Misc",defaultValue:null},summed:{type:"boolean",group:"Misc",defaultValue:false},inResult:{type:"boolean",group:"Misc",defaultValue:false},showIfGrouped:{type:"boolean",group:"Appearance",defaultValue:false},groupHeaderFormatter:{type:"function",group:"Appearance",defaultValue:null},grouped:{type:"boolean",group:"Appearance",defaultValue:false}}}});d._DEFAULT_FILTERTYPES={Time:new p({UTC:true}),DateTime:new a({UTC:true}),Float:new n,Integer:new o,Boolean:new i};d.prototype._setGrouped=function(e){var t=this._getTable();var r=e?l.group:l.ungroup;this.setGrouped(e);t.fireGroup({column:this,groupedColumns:t._aGroupedColumns,type:r})};d.prototype._isAggregatableByMenu=function(){var e=this._getTable(),t=e.getBinding(),r=t&&t.getAnalyticalQueryResult();return e&&r&&r.findMeasureByPropertyName(this.getLeadingProperty())};d.prototype.setGrouped=function(e){var t=this.getParent();if(g(t)){if(e){t._addGroupedColumn(this.getId())}else{t._removeGroupedColumn(this.getId())}}var r=this.setProperty("grouped",e);this._updateColumns();return r};d.prototype.setSummed=function(e){var t=this.setProperty("summed",e,true);this._updateTableAnalyticalInfo();return t};d.prototype.setVisible=function(t){e.prototype.setVisible.call(this,t);this._updateColumns();return this};d.prototype.getLabel=function(){var e=this.getAggregation("label");try{if(!e){if(!this._oBindingLabel){var t=this.getParent();if(g(t)){var r=t.getBinding();if(r){this._oBindingLabel=s._getTableTemplateHelper().createLabel();this.addDependent(this._oBindingLabel);s.Binding.metadataLoaded(t).then(function(){this._oBindingLabel.setText(r.getPropertyLabel(this.getLeadingProperty()))}.bind(this))}}}e=this._oBindingLabel}}catch(e){u.warning(e)}return e};d.prototype.getFilterProperty=function(){var e=this.getProperty("filterProperty");if(!e){var t=this.getParent();if(g(t)){var r=t.getBinding();var i=this.getLeadingProperty();if(r&&r.getFilterablePropertyNames().indexOf(i)>-1){e=i}}}return e};d.prototype.getSortProperty=function(){var e=this.getProperty("sortProperty");if(!e){var t=this.getParent();if(g(t)){var r=t.getBinding();var i=this.getLeadingProperty();if(r&&r.getSortablePropertyNames().indexOf(i)>-1){e=i}}}return e};d.prototype.getFilterType=function(){var e=this.getProperty("filterType");if(!e){var t=this.getParent();if(g(t)){var r=t.getBinding();var i=this.getLeadingProperty(),a=r&&r.getProperty(i);if(a){switch(a.type){case"Edm.Time":e=d._DEFAULT_FILTERTYPES["Time"];break;case"Edm.DateTime":case"Edm.DateTimeOffset":e=d._DEFAULT_FILTERTYPES["DateTime"];break;case"Edm.Single":case"Edm.Double":case"Edm.Decimal":e=d._DEFAULT_FILTERTYPES["Float"];break;case"Edm.SByte":case"Edm.Int16":case"Edm.Int32":case"Edm.Int64":e=d._DEFAULT_FILTERTYPES["Integer"];break;case"Edm.Boolean":e=d._DEFAULT_FILTERTYPES["Boolean"];break}}}}return e};d.prototype._updateColumns=function(e,t){var r=this.getParent();if(g(r)){r._updateColumns(e,t)}};d.prototype._updateTableAnalyticalInfo=function(e){var t=this.getParent();if(t&&g(t)&&!t._bSuspendUpdateAnalyticalInfo){t.updateAnalyticalInfo(e)}};d.prototype._updateTableColumnDetails=function(){var e=this.getParent();if(e&&g(e)&&!e._bSuspendUpdateAnalyticalInfo){e._updateTableColumnDetails()}};d.prototype.shouldRender=function(){if(!this.getVisible()||!this.getTemplate()){return false}return(!this.getGrouped()||this._bLastGroupAndGrouped||this.getShowIfGrouped())&&(!this._bDependendGrouped||this._bLastGroupAndGrouped)};d.prototype.getTooltip_AsString=function(){if(!this.getTooltip()){return this._getDefaultTooltip()}return r.prototype.getTooltip_AsString.apply(this)};d.prototype.getTooltip_Text=function(){var e=r.prototype.getTooltip_Text.apply(this);if(!this.getTooltip()||!e){e=this._getDefaultTooltip()}return e};d.prototype._getDefaultTooltip=function(){var e=this.getParent();if(g(e)&&!e._getHideStandardTooltips()){var t=e.getBinding();if(t&&this.getLeadingProperty()){return t.getPropertyQuickInfo(this.getLeadingProperty())}}return null};d.prototype._menuHasItems=function(){var t=function(){var e=this.getParent();var t=e.getBinding();var r=t&&t.getAnalyticalQueryResult();return e&&r&&r.findMeasureByPropertyName(this.getLeadingProperty())}.bind(this);return e.prototype._menuHasItems.apply(this)||t()};d.prototype.isFilterableByMenu=function(){var e=this.getFilterProperty();if(!e||!this.getShowFilterMenuEntry()){return false}var t=this.getParent();if(g(t)){var r=t.getBinding();if(r){if(r.getFilterablePropertyNames().indexOf(e)>-1&&r.getProperty(e)){return true}}}return false};d.prototype.isGroupableByMenu=function(){var e=this.getParent();if(g(e)){var t=e.getBinding();if(t){var r=t.getAnalyticalQueryResult();if(r&&r.findDimensionByPropertyName(this.getLeadingProperty())&&t.getSortablePropertyNames().indexOf(this.getLeadingProperty())>-1&&t.getFilterablePropertyNames().indexOf(this.getLeadingProperty())>-1){return true}}}return false};d.prototype._isGroupableByMenu=function(){return this.isGroupableByMenu()};d.prototype._setCellContentVisibilitySettings=function(){};d.prototype._applySorters=function(){this._updateTableAnalyticalInfo(true);e.prototype._applySorters.apply(this,arguments)};return d});
//# sourceMappingURL=AnalyticalColumn.js.map