/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/viz/library","./core/BaseChart","./StackedColumnRenderer"],function(e,t){"use strict";var i=t.extend("sap.viz.ui5.StackedColumn",{metadata:{library:"sap.viz",aggregations:{general:{type:"sap.viz.ui5.types.RootContainer",multiple:false},interaction:{type:"sap.viz.ui5.types.controller.Interaction",multiple:false},title:{type:"sap.viz.ui5.types.Title",multiple:false},legendGroup:{type:"sap.viz.ui5.types.Legend",multiple:false},legend:{type:"sap.viz.ui5.types.legend.Common",multiple:false},toolTip:{type:"sap.viz.ui5.types.Tooltip",multiple:false},xyContainer:{type:"sap.viz.ui5.types.XYContainer",multiple:false},dataLabel:{type:"sap.viz.ui5.types.Datalabel",multiple:false},yAxis:{type:"sap.viz.ui5.types.Axis",multiple:false},xAxis:{type:"sap.viz.ui5.types.Axis",multiple:false},background:{type:"sap.viz.ui5.types.Background",multiple:false},plotArea:{type:"sap.viz.ui5.types.StackedVerticalBar",multiple:false}},events:{selectData:{},deselectData:{},showTooltip:{deprecated:true},hideTooltip:{deprecated:true},initialized:{}},vizChartType:"viz/stacked_column"}});return i});
//# sourceMappingURL=StackedColumn.js.map