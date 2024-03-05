/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/ui/core/Control","sap/suite/ui/microchart/library","sap/suite/ui/microchart/BulletMicroChart","sap/suite/ui/microchart/BulletMicroChartData","sap/m/library","sap/ui/comp/smartmicrochart/SmartMicroChartBase","./SmartMicroChartRenderer"],function(t,a,e,i,o,n,r,s){"use strict";var h=n.ValueColor;var l=r.extend("sap.ui.comp.smartmicrochart.SmartBulletMicroChart",{metadata:{library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartmicrochart/SmartBulletMicroChart.designtime",properties:{enableAutoBinding:{type:"boolean",group:"Misc",defaultValue:false}}},renderer:s});l._CRITICAL_COLOR=h.Critical;l._ERROR_COLOR=h.Error;l.prototype._CHART_TYPE=["Bullet"];l.prototype.init=function(){this._bIsInitialized=false;this._bMetaModelLoadAttached=false;this.setProperty("chartType","Bullet",true);this.setAggregation("_chart",new i({showValueMarker:true}),true)};l.prototype.setShowLabel=function(t){if(this.getShowLabel()!==t){this.setProperty("showLabel",t,true);var a=this.getAggregation("_chart");a.setProperty("showActualValue",t,true);a.setProperty("showTargetValue",t,true);a.setProperty("showDeltaValue",t,true);a.setProperty("showValueMarker",t,true);this.invalidate()}return this};l.prototype.onBeforeRendering=function(){var t=this.getAggregation("_chart");t.setSize(this.getSize(),true);t.setWidth(this.getWidth(),true);t.setHeight(this.getHeight(),true)};l.prototype._createAndBindInnerChart=function(){this._bindValueProperties();this._bindActualValue();this._bindChartThresholds();this._updateAssociations.call(this);this._setMode()};l.prototype._setMode=function(){if(this._hasMember(this,"_oDataPointAnnotations.Visualization.EnumMember")){if(this._oDataPointAnnotations.Visualization.EnumMember===r._DELTABULLET){this.getAggregation("_chart").setMode(e.BulletMicroChartModeType.Delta)}}};l.prototype._bindValueProperties=function(){var t,a,e=this.getAggregation("_chart");if(this._hasMember(this,"_oDataPointAnnotations.TargetValue.Path")){e.bindProperty("targetValue",{path:this._oDataPointAnnotations.TargetValue.Path,type:"sap.ui.model.odata.type.Decimal"});var i=this._getLabelNumberFormatter.call(this,this._oDataPointAnnotations.TargetValue.Path);e.bindProperty("targetValueLabel",{path:this._oDataPointAnnotations.TargetValue.Path,formatter:i.format.bind(i)})}if(this._hasMember(this,"_oDataPointAnnotations.ForecastValue.Path")){e.bindProperty("forecastValue",{path:this._oDataPointAnnotations.ForecastValue.Path,type:"sap.ui.model.odata.type.Decimal"})}if(this._oDataPointAnnotations.MaximumValue){if(this._oDataPointAnnotations.MaximumValue.hasOwnProperty("Path")){e.bindProperty("maxValue",{path:this._oDataPointAnnotations.MaximumValue.Path,type:"sap.ui.model.odata.type.Decimal"})}else if(this._oDataPointAnnotations.MaximumValue.hasOwnProperty("Decimal")){t=parseFloat(this._oDataPointAnnotations.MaximumValue.Decimal);e.setMaxValue(t,true)}}if(this._oDataPointAnnotations.MinimumValue){if(this._oDataPointAnnotations.MinimumValue.hasOwnProperty("Path")){e.bindProperty("minValue",{path:this._oDataPointAnnotations.MinimumValue.Path,type:"sap.ui.model.odata.type.Decimal"})}else if(this._oDataPointAnnotations.MinimumValue.hasOwnProperty("Decimal")){a=parseFloat(this._oDataPointAnnotations.MinimumValue.Decimal);e.setMinValue(a,true)}}};l.prototype._bindActualValue=function(){var t=this.getAggregation("_chart"),a=this._getLabelNumberFormatter.call(this,this._oDataPointAnnotations.Value.Path);var e=new o({value:{path:this._oDataPointAnnotations.Value.Path,type:"sap.ui.model.odata.type.Decimal"},color:{parts:[this._oDataPointAnnotations.Value&&this._oDataPointAnnotations.Value.Path||"",this._oDataPointAnnotations.Criticality&&this._oDataPointAnnotations.Criticality.Path||""],formatter:this._getValueColor.bind(this)}});t.setAggregation("actual",e,true);t.bindProperty("actualValueLabel",{path:this._oDataPointAnnotations.Value.Path,formatter:a.format.bind(a)})};l.prototype._bindChartThresholds=function(){var t,a;if(this._hasMember(this._oDataPointAnnotations,"CriticalityCalculation.ImprovementDirection.EnumMember")){a=this._oDataPointAnnotations.CriticalityCalculation;t=a.ImprovementDirection.EnumMember;if(t!==r._MINIMIZE&&a.DeviationRangeLowValue&&a.DeviationRangeLowValue.Path){this._bindThresholdAggregation(a.DeviationRangeLowValue.Path,l._ERROR_COLOR)}if(t!==r._MINIMIZE&&a.ToleranceRangeLowValue&&a.ToleranceRangeLowValue.Path){this._bindThresholdAggregation(a.ToleranceRangeLowValue.Path,l._CRITICAL_COLOR)}if(t!==r._MAXIMIZE&&a.ToleranceRangeHighValue&&a.ToleranceRangeHighValue.Path){this._bindThresholdAggregation(a.ToleranceRangeHighValue.Path,l._CRITICAL_COLOR)}if(t!==r._MAXIMIZE&&a.DeviationRangeHighValue&&a.DeviationRangeHighValue.Path){this._bindThresholdAggregation(a.DeviationRangeHighValue.Path,l._ERROR_COLOR)}}};l.prototype._bindThresholdAggregation=function(t,a){var e=new o({value:{path:t,type:"sap.ui.model.odata.type.Decimal"},color:a});this.getAggregation("_chart").addAggregation("thresholds",e,true)};return l});
//# sourceMappingURL=SmartBulletMicroChart.js.map