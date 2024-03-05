/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/ui/core/Control","sap/suite/ui/microchart/DeltaMicroChart","sap/ui/comp/smartmicrochart/SmartMicroChartBase","sap/base/Log","./SmartMicroChartRenderer"],function(t,a,i,n,e,o){"use strict";var r=n.extend("sap.ui.comp.smartmicrochart.SmartDeltaMicroChart",{metadata:{library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartmicrochart/SmartDeltaMicroChart.designtime",properties:{enableAutoBinding:{type:"boolean",group:"Misc",defaultValue:false}}},renderer:o});r.prototype._CHART_TYPE=["Delta"];r.prototype.init=function(){this._bIsInitialized=false;this._bMetaModelLoadAttached=false;this.setProperty("chartType",this._CHART_TYPE,true);this.setAggregation("_chart",new i,true)};r.prototype.onBeforeRendering=function(){var t=this.getAggregation("_chart");t.setSize(this.getSize(),true);t.setWidth(this.getWidth(),true)};r.prototype._createAndBindInnerChart=function(){if(this._aDataPointAnnotations.length<2){e.error("Two DataPoint annotation are needed! Cannot create the SmartColumnMicroChart");return}if(!(this._aDataPointAnnotations[0].Value&&this._aDataPointAnnotations[0].Value.Path&&this._aDataPointAnnotations[1].Value&&this._aDataPointAnnotations[1].Value.Path)){e.error("Value DataPoint annotation missing! Cannot create the SmartColumnMicroChart");return}this.bindProperties();this._updateAssociations()};r.prototype.bindProperties=function(){var t=this.getAggregation("_chart"),a=this._getLabelNumberFormatter.call(this,this._aDataPointAnnotations[0].Value.Path),i=this._getLabelNumberFormatter.call(this,this._aDataPointAnnotations[1].Value.Path);t.bindProperty("value1",{path:this._aDataPointAnnotations[0].Value.Path,type:"sap.ui.model.odata.type.Decimal",events:{change:this._onBindingDataChange.bind(this)}});t.bindProperty("value2",{path:this._aDataPointAnnotations[1].Value.Path,type:"sap.ui.model.odata.type.Decimal",events:{change:this._onBindingDataChange.bind(this)}});t.bindProperty("displayValue1",{path:this._aDataPointAnnotations[0].Value.Path,formatter:a.format.bind(a)});t.bindProperty("displayValue2",{path:this._aDataPointAnnotations[1].Value.Path,formatter:a.format.bind(i)});if(this._aDataPointAnnotations[0].Title&&this._aDataPointAnnotations[0].Title.Path){t.bindProperty("title1",{path:this._aDataPointAnnotations[0].Title.Path})}if(this._aDataPointAnnotations[1].Title&&this._aDataPointAnnotations[1].Title.Path){t.bindProperty("title2",{path:this._aDataPointAnnotations[1].Title.Path})}if(this._aDataPointAnnotations[0].Criticality&&this._aDataPointAnnotations[0].Criticality.Path){t.bindProperty("color",{path:this._aDataPointAnnotations[0].Criticality.Path,formatter:this._mapCriticalityTypeWithColor.bind(this)})}};r.prototype._onBindingDataChange=function(){var t=this.getAggregation("_chart"),a=this._getLabelNumberFormatter.call(this,this._aDataPointAnnotations[0].Value.Path);t.setDeltaDisplayValue(a.format(t._getDeltaValue()));this._updateAssociations()};return r});
//# sourceMappingURL=SmartDeltaMicroChart.js.map