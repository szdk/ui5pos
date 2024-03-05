/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library"],function(e){"use strict";const t={};t.isUserPersonalizationActive=function(e){return e._bUserPersonalizationActive===true};t.detectUserPersonalizationCompletion=function(e,t){if(!t.isOpen()){return}e._bUserPersonalizationActive=true;t.attachEventOnce("afterClose",function(){e.getEngine().waitForChanges(e).then(function(){delete e._bUserPersonalizationActive})})};t.openSettingsDialog=function(e){n(e,e.getActiveP13nModes())};t.openFilterDialog=function(e,t){return n(e,["Filter"],t)};function n(e,t,n){return e.finalizePropertyHelper().then(function(){const r=e.getEngine();if(e.getInbuiltFilter()){e.getInbuiltFilter().setVisibleFields(null)}return r.show(e,t,{close:function(){if(n){n()}r.waitForChanges(e).then(function(){delete e._bUserPersonalizationActive})}}).then(function(t){if(t){e._bUserPersonalizationActive=true}return t})})}t.createSortChange=function(t,n){t.getEngine().createChanges({control:t,key:"Sort",state:[{name:n.property,descending:n.sortOrder===e.SortOrder.Descending,sorted:n.sortOrder!==e.SortOrder.None}],applyAbsolute:true})};t.createGroupChange=function(e,t){const n=(e.getCurrentState().groupLevels||[]).some(function(e){return e.name==t.property});e.getEngine().createChanges({control:e,key:"Group",state:[{grouped:!n,name:t.property}],applyAbsolute:e._isOfType("ResponsiveTable")})};t.createFilterChange=function(e,t){e.getEngine().createChanges({control:e,key:"Filter",state:t.conditions,applyAbsolute:t.strategy})};t.createAggregateChange=function(e,t){const n=t.property in(e.getCurrentState().aggregations||{});e.getEngine().createChanges({control:e,key:"Aggregate",state:[{name:t.property,aggregated:!n}],applyAbsolute:false})};t.createColumnWidthChange=function(e,t){e.getEngine().createChanges({control:e,key:"ColumnWidth",state:[{name:t.column.getPropertyKey(),width:t.width}],applyAbsolute:false})};t.createColumnReorderChange=function(e,t){const n=e.indexOfColumn(t.column);if(n===t.index){return}e.getEngine().createChanges({control:e,key:"Column",state:[{name:t.column.getPropertyKey(),position:t.index}]})};return t});
//# sourceMappingURL=Personalization.js.map