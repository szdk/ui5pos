/*
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/chart/AutoScaleMode","sap/chart/ScaleBehavior","sap/chart/ChartLog","sap/chart/utils/ChartUtils"],function(e,i,a,t){"use strict";var m={};m.getValueAxisScaleSetting=function(m,s,r,u){var n=r.filter(function(e){return u.indexOf(e.getName())!==-1});var l,o,f={};n.forEach(function(e){o=e.getName();l=e._getFixedRole();if(l==="axis1"||l==="axis2"){if(!f[l]){f[l]={measures:[],min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY}}f[l].measures.push(o)}});var c,x=s&&s.scaleBehavior===i.FixedScale,S=t.isStackedLikeChart(m)&&n.length>1,h=s&&s.fixedScaleSettings&&s.fixedScaleSettings.measureBoundaryValues||{};if(x){if(S){var g=s&&s.fixedScaleSettings&&s.fixedScaleSettings.stackedMultipleMeasureBoundaryValues||[];if(g&&g.length>0){var v=function(e){return g.filter(function(i){return i.measures&&i.measures.length>0&&i.measures.sort().toString()===e.measures.sort().toString()})};for(var d in f){if(f.hasOwnProperty(d)){var p=f[d];var y=v(p);if(y&&y.length>0){c=y[y.length-1].boundaryValues;if(c&&(isFinite(c.minimum)&&typeof c.minimum=="number")||isFinite(c.maximum)&&typeof c.maximum=="number"){p.min=c.minimum;p.max=c.maximum}}}}}}else{n.forEach(function(e){l=e._getFixedRole();if(l==="axis1"||l==="axis2"){o=e.getName();c=h[o];if(!c||!(isFinite(c.minimum)&&typeof c.minimum=="number")||!(isFinite(c.maximum)&&typeof c.maximum=="number")){f[l].min=Number.NEGATIVE_INFINITY;f[l].max=Number.POSITIVE_INFINITY}else{if(f[l].min>c.minimum){f[l].min=c.minimum}if(f[l].max<c.maximum){f[l].max=c.maximum}}}})}}x=false;var I=[],N=t.isBulletChart(m);for(var d in f){if(f.hasOwnProperty(d)){var p=f[d];var b=!(isFinite(p.min)&&typeof p.min=="number"&&isFinite(p.max)&&typeof p.max=="number");var F=d==="axis1"?"valueAxis":"valueAxis2";if(N){F="actualValues"}if(b){if(s&&s.scaleBehavior===i.FixedScale){new a("error","Chart.ValueAxisScale",F+" was switched to auto scale, because minimum or maximum value is missing in measure").display()}}else if(p.min>p.max){new a("error","Chart.ValueAxisScale",F+" was switched to auto scale, because minimum value exceeds maximum value").display()}else{x=true}I.push({feed:F,type:"linear",min:b?"auto":p.min,max:b?"auto":p.max})}}var V={};if(!x){var A=true,w=false;if(s&&s.autoScaleSettings&&s.autoScaleSettings.zeroAlwaysVisible===false){A=false}if(s&&s.autoScaleSettings&&s.autoScaleSettings.syncWith===e.VisibleData){w=true}V={plotArea:{adjustScale:!A},interaction:{syncValueAxis:w}}}return{scale:I,property:V}};return m});
//# sourceMappingURL=ValueAxisScaleUtils.js.map