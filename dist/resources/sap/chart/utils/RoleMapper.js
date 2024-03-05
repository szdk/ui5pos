/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/chart/data/TimeDimension","sap/chart/utils/MeasureSemanticsUtils","sap/chart/utils/ChartUtils","sap/chart/utils/DateFormatUtil","sap/chart/data/MeasureSemantics","sap/chart/ChartLog","sap/ui/thirdparty/jquery"],function(e,t,a,r,i,s,jQuery){"use strict";function n(e){this._bTimeFed=false}n.prototype.toFeedingId=function(t){if(t instanceof e&&!this._bTimeFed){this._bTimeFed=true;return"timeAxis"}else{return"@context"}};function u(e){return a.CONFIG.timeChartTypes.indexOf(e)>-1}function c(e,t,a){var r={actualValues:[],targetValues:[]};jQuery.each(e,function(e,a){if(a.actual){r.actualValues.push(t[a.actual]);a.valueAxisID="actualValues"}if(a.projected){r.actualValues.push(t[a.projected]);a.valueAxisID="actualValues"}if(a.reference){if(a.actual||a.projected){r.targetValues.push(t[a.reference]);a.valueAxisID="targetValues"}else{r.actualValues.push(t[a.reference]);a.valueAxisID="actualValues"}}});delete a["@semanticBulletMsrs"];jQuery.extend(a,r)}function l(e,t){var a=t["@semanticBulletMsrs"];if(a){var r={actualValues:[]};for(var i=0;i<a.length;i++){r.actualValues.push(a[i])}for(var i=0;i<e.length;i++){e[i].valueAxisID="actualValues"}delete t["@semanticBulletMsrs"];jQuery.extend(t,r)}}n.semantics={hasSemanticMeasures:function(e){return Object.keys(e.msrs).some(function(t){var a=false;var r=e.msrs[t];a=r.some(function(e){if(e.getSemantics){var t=e.getSemantics();return t&&t!=="actual"}});return a})},semanticPatternMsrs:function(e,a,i){var n=[],o=[],f={},m,d;var h=u(a)&&(e.dims.timeAxis&&e.dims.timeAxis.length===1);var p;var v;if(h){var g=e.dims.timeAxis[0];p=g.getProjectedValueStartTime&&g.getProjectedValueStartTime();if(p){var x=g.getTimeUnit();if(x==="fiscalyearperiod"||x==="fiscalyear"){v=p}else{var j=r.getInstance(x);if(j){if(j.parse(p)){v=j.parse(p).getTime()}}else{v=new Date(p).getTime()}}}}var O=["valueAxis","valueAxis2"];var y=Object.keys(e.msrs).sort(function(e,t){return O.indexOf(e)-O.indexOf(t)});var S=this.hasSemanticMeasures(e);y.forEach(function(r){var u=e.msrs[r],c;d=null;jQuery.extend(true,f,u.reduce(function(e,t){e[t.getName()]=t;return e},{}));if(a&&a.indexOf("bullet")>-1&&e.invisibleMsrs){c=e.invisibleMsrs.filter(function(e){return e.getSemantics()==="actual"&&e.getSemanticallyRelatedMeasures()})}if(jQuery.isEmptyObject(e.dims)){d=new s("error","Semantic Pattern","Semantic Pattern doesn't work when there is no dimension.");i=i||true}else if(e.dims.color&&e.dims.color.length>0){d=new s("error","Semantic Pattern","Semantic pattern doesn't work when there is series dimension.");i=i||true}var l;l=t.getTuples(u,c,i);if(a&&(a.indexOf("stacked_column")>-1||a.indexOf("stacked_bar")>-1)){var o=false;if(h&&p){if(!v){d=new s("error","Semantic Pattern","The value of projectedValueStartTime is invalid.");d.display();o=true}for(var m=0;m<l.length;m++){if(l[m].hasOwnProperty("actual")){if(!l[m].hasOwnProperty("projected")){o=true;break}if(l[m].hasOwnProperty("reference")){o=true;break}}else{o=true;break}}}else{var g="";if(l[0].hasOwnProperty("actual")){g="actual"}else if(l[0].hasOwnProperty("projected")){g="projected"}else if(l[0].hasOwnProperty("reference")){g="reference"}if(g==="projected"||g==="reference"){for(var m=0;m<l.length;m++){if(!l[m].hasOwnProperty(g)){o=true;break}}}else{for(var m=0;m<l.length;m++){if(l[m].hasOwnProperty("projected")||l[m].hasOwnProperty("reference")){o=true;break}}}}if(a.indexOf("dual")>-1&&y.length<=1){o=false}if(o){d=new s("error","Semantic Pattern","Actual, forecast or target can't be stacked in one bar or column.");i=true;l=t.getTuples(u,c,i)}}l.forEach(function(e){e.valueAxisID=r});if(S&&i&&d){d.display()}n=n.concat(l)});if(a&&a.indexOf("bullet")>-1){h=h&&n.some(function(e){return e.actual&&e.projected});m=n.some(function(e){return e.actual&&e.projected||e.actual&&e.reference||e.projected&&e.reference});if(m&&!h){c(n,f,e.msrs)}else{l(n,e.msrs)}}if(!i&&h){d=null;var w=[];var b=function(e){var t=w.indexOf(e.getName())===-1;if(!t){o.push(e)}return t};for(var P=0;P<n.length;P++){var T=n[P];if(p){if(v){var V=e.msrs[T.valueAxisID];if(T.actual&&T.projected){T.timeAxis=e.dims.timeAxis[0].getName();T.projectedValueStartTime=v;T.semanticMsrName=T.actual+"-"+T.projected;w.push(T.actual);w.push(T.projected);V.push(f[T.actual].clone().setName(T.semanticMsrName));if(n.length===1&&a.indexOf("combination")>-1){d=new s("error","Semantic Pattern","Do not satisfy the minimum number of measure to work "+"with Projected Value Start Time in Time Series Combination.")}}e.msrs[T.valueAxisID]=V.filter(b)}else{d=new s("error","Semantic Pattern","The value of projectedValueStartTime is invalid.")}}}if(d){d.display()}}if(n.length>0&&!i){var A=[];var M=["actual","projected","semanticMsrName","reference"];n.forEach(function(e){for(var t=0;t<M.length;t++){if(e[M[t]]){A.push(e[M[t]])}}});jQuery.each(e.msrs,function(t){e.msrs[t].sort(function(e,t){return A.indexOf(e.getName())-A.indexOf(t.getName())})})}return{semanticTuples:n,contexts:o}}};return n});
//# sourceMappingURL=RoleMapper.js.map