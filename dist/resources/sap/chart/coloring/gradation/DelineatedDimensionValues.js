/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/chart/coloring/ColoringUtils","sap/chart/data/MeasureSemantics","sap/chart/coloring/gradation/rankedMeasureValues/RankedMeasureUtils","sap/chart/ChartLog","sap/ui/thirdparty/jquery"],function(e,n,r,i,jQuery){"use strict";var a={};var o=r.SingleColorScheme.SUPPORTED_SINGLE_SCHEMES;var t=r.SingleColorScheme.SUPPORTED_SATURATIONS;var l="colorings.Gradation.DelineatedDimensionValues";var s=function(n,r,a,s){if(n.SingleColorScheme&&o.indexOf(n.SingleColorScheme)===-1){throw new i("error",l,'"SingleColorScheme" should be one of "'+o.join('" or "')+'".')}if(n.Saturation&&t.indexOf(n.Saturation)===-1){throw new i("error",l,'"Saturation" should be one of "'+t.join('" or "')+'".')}var c={};Object.keys(n).forEach(function(e){if(e!=="SingleColorScheme"&&e!=="Saturation"){c[e]=n[e]}});var u=jQuery.extend({},s);u.bHasOtherSeriesDim=e.hasOtherSeriesDim(r[0],a);u.type="Gradation";u.subType="DelineatedDimensionValues";e.checkColoringDimension(r,a,c,u);var h=c[r[0]];if(h){var d=h.Levels;if(!Array.isArray(d)||d.length<2||d.length>6){throw new i("error",l,'The number of dimension names contained in "Levels" should be between 2 to 6.')}if(e.hasDuplicatedValues(d)){throw new i("error",l,'The dimension names contained in "Levels" have duplicated values.')}}};a.qualify=function(e,n,r,i,a){s(e,n,i,a);var o=n[0],t;if(o){t={dim:o,setting:e}}return t};a.parse=function(e){var n=e.dim,r=e.setting;var i={callbacks:{},legend:{},singleColorScheme:r.SingleColorScheme||o[0],saturation:r.Saturation||t[0]};r[n].Levels.forEach(function(e){i.callbacks[e]=a.getCallback(n,e);i.legend[e]=e});return i};a.getCallback=function(e,n){return function(r){return r[e]===n}};a.getContextHandler=function(e){var n=e.dim,r=e.setting[n].Levels;return function(a){var o=a.getProperty(n);if(r.indexOf(o)===-1){e.chartLog=new i("error",l,"Dimension memeber, "+o+', should be configured in "Levels".')}}};return a});
//# sourceMappingURL=DelineatedDimensionValues.js.map