/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/theming/Parameters","../common/utils/SelectionDetailUtil"],function(t,e,r){"use strict";var a=t.extend("sap.viz.ui5.controls.chartpopover.ShapeMarker",{metadata:{library:"sap.viz",properties:{type:"string",color:"string",markerSize:"int",showWithLine:"string",lineInfo:"object",stroke:"object",pattern:"string"}},renderer:{apiVersion:2,render:function(t,a){var i=a.getMarkerSize()?a.getMarkerSize():10;var o=i/2,n=o,s=i,l=i;if(a._isShowWithLine()){o=i;s=i*2;i=6}var p={rx:i/2,ry:i/2,type:a.getType(),borderWidth:0};t.openStart("div").openEnd();t.openStart("svg").attr("width",s+"px").attr("height",l+"px").attr("focusable","false").openEnd();if(a._isShowWithLine()){var h=a.getLineInfo(),d=e.get(h.lineColor);if(!d){d=h.lineColor?h.lineColor:a.getColor()}if(h.lineType==="dotted"||h.lineType==="dash"){t.openStart("line").attr("x1",0).attr("y1",n).attr("x2",s).attr("y2",n).attr("stroke-width",2).attr("stroke-dasharray","5, 3")}else if(h.lineType==="dot"){var f=Math.floor(s/2);f=f&1?f:f-1;if(f<3){f=3}var g=s/f;t.openStart("line").attr("x1",g/2).attr("y1",n).attr("x2",s).attr("y2",n).attr("stroke-dasharray","0,"+g*2).attr("stroke-width",g).attr("stroke-linecap","round")}else{t.openStart("line").attr("x1",0).attr("y1",n).attr("x2",s).attr("y2",n).attr("stroke-width",2)}t.attr("stroke",d);t.openEnd().close("line")}if(p.type){t.openStart("path").attr("d",r.generateShapePath(p));var c=a.getPattern();if(!c){t.attr("fill",a.getColor())}else if(c==="noFill"){var y=e.get("sapUiChartBackgroundColor");if(y==="transparent"){y="white"}t.attr("fill",y);t.attr("stroke",a.getColor());t.attr("stroke-width","1px")}else{t.attr("fill",c)}t.attr("transform","translate("+o+","+n+")");t.openEnd().close("path")}t.close("svg");t.close("div")}}});a.prototype._isShowWithLine=function(){return this.getShowWithLine()==="line"&&this.getLineInfo()};return a});
//# sourceMappingURL=ShapeMarker.js.map