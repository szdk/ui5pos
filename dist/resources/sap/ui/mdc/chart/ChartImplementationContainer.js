/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","./ChartImplementationContainerRenderer","sap/ui/core/Core","sap/ui/thirdparty/jquery"],function(t,e,i,jQuery){"use strict";const o=t.extend("sap.ui.mdc.chart.ChartImplementationContainer",{metadata:{library:"sap.ui.mdc",interfaces:[],properties:{showNoDataStruct:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{content:{type:"sap.ui.core.Control",multiple:false},noDataContent:{type:"sap.ui.core.Control",multiple:false}},associations:{chartNoDataContent:{type:"sap.ui.core.Control",multiple:false}},events:{}},renderer:e});o.prototype.init=function(){this._updateVisibilities()};o.prototype.setShowNoDataStruct=function(t){this.setProperty("showNoDataStruct",t);this._updateVisibilities();return this};o.prototype.setContent=function(t){this.setAggregation("content",t);this._updateVisibilities();return this};o.prototype.setNoDataContent=function(t){this.setAggregation("noDataContent",t);this._updateVisibilities();return this};o.prototype.setChartNoDataContent=function(t){this.setAssociation("chartNoDataContent",t);this._updateVisibilities();return this};o.prototype.showOverlay=function(t){const e=this.$();let i=e.find(".sapUiMdcChartOverlay");if(t&&i.length===0){i=jQuery("<div>").addClass("sapUiOverlay sapUiMdcChartOverlay").css("z-index","1");e.append(i)}else if(!t){i.remove()}};o.prototype._getChartNoDataForRenderer=function(){return i.byId(this.getChartNoDataContent())};o.prototype._updateVisibilities=function(){const t=this.getShowNoDataStruct();if(this.getContent()){this.getContent().setVisible(!t)}if(this.getChartNoDataContent()){if(this.getNoDataContent()){this.getNoDataContent().setVisible(false)}i.byId(this.getChartNoDataContent()).setVisible(t)}else if(this.getNoDataContent()){this.getNoDataContent().setVisible(t)}};return o});
//# sourceMappingURL=ChartImplementationContainer.js.map