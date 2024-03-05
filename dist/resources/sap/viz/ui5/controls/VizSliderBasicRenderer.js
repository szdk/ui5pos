/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/base/i18n/Localization"],function(e){"use strict";var t={apiVersion:2};t.CSS_CLASS="sapVizSlider";t.render=function(e,i){var n=i.getEnabled(),a=i.getTooltip_AsString(),s=t.CSS_CLASS;e.openStart("div",i);this.addClass(e,i);if(!n){e.class(s+"Disabled")}e.style("width",i.getWidth());if(a&&i.getShowHandleTooltip()){e.attr("title",a)}e.openEnd();e.openStart("div",i.getId()+"-inner");this.addInnerClass(e,i);if(!n){e.class(s+"InnerDisabled")}e.openEnd();if(i.getProgress()){this.renderProgressIndicator(e,i)}this.renderHandles(e,i);e.close("div");if(i.getEnableTickmarks()){this.renderTickmarks(e,i)}else{this.renderLabels(e,i)}if(i.getName()){this.renderInput(e,i)}e.close("div")};t.renderProgressIndicator=function(e,t){e.openStart("div",t.getId()+"-progress");this.addProgressIndicatorClass(e,t);e.style("width",t._sProgressValue);e.attr("aria-hidden","true");e.openEnd();e.close("div")};t.renderHandles=function(e,t){this.renderHandle(e,t,{id:t.getId()+"-handle"});if(t.getShowAdvancedTooltip()){this.renderTooltips(e,t)}};t.renderHandle=function(t,i,n){var a=i.getEnabled();if(n&&n.id!==undefined){t.openStart("span",n.id)}else{t.openStart("span")}if(i.getShowHandleTooltip()&&!i.getShowAdvancedTooltip()){this.writeHandleTooltip(t,i)}this.addHandleClass(t,i);t.style(e.getRTL()?"right":"left",i._sProgressValue);this.writeAccessibilityState(t,i);if(a){t.attr("tabindex","0")}t.openEnd();t.close("span")};t.renderTooltips=function(e,i){e.openStart("div",i.getId()+"-TooltipsContainer").class(t.CSS_CLASS+"TooltipContainer").style("left","0%").style("right","0%").style("min-width","0%").openEnd();this.renderTooltip(e,i,i.getInputsAsTooltips());e.close("div")};t.renderTooltip=function(e,i,n){if(n&&i._oInputTooltip){e.renderControl(i._oInputTooltip.tooltip)}else{e.openStart("span",i.getId()+"-Tooltip").class(t.CSS_CLASS+"HandleTooltip").style("width",i._iLongestRangeTextWidth+"px").openEnd().close("span")}};t.writeHandleTooltip=function(e,t){e.attr("title",t.toFixed(t.getValue()))};t.renderInput=function(e,i){e.voidStart("input",i.getId()+"-input");e.attr("type","text");e.class(t.CSS_CLASS+"Input");if(!i.getEnabled()){e.attr("disabled","disabled")}e.attr("name",i.getName());e.attr("value",i.toFixed(i.getValue()));e.voidEnd()};t.writeAccessibilityState=function(e,t){e.accessibilityState(t,{role:"slider",orientation:"horizontal",valuemin:t.toFixed(t.getMin()),valuemax:t.toFixed(t.getMax()),valuenow:t.toFixed(t.getValue())})};t.renderTickmarks=function(e,i){var n,a,s,r,l,o,d,S=i.getAggregation("scale");if(!i.getEnableTickmarks()||!S){return}o=Math.abs(i.getMin()-i.getMax());d=i.getStep();r=S.getTickmarksBetweenLabels();a=S.calcNumTickmarks(o,d,i._CONSTANTS.TICKMARKS.MAX_POSSIBLE);s=i._getPercentOfValue(S.calcTickmarksDistance(a,i.getMin(),i.getMax(),d));e.openStart("ul").class(t.CSS_CLASS+"Tickmarks").openEnd();this.renderTickmarksLabel(e,i,i.getMin());for(n=0;n<a;n++){if(r&&n>0&&n%r===0){l=n*s;this.renderTickmarksLabel(e,i,i._getValueOfPercent(l))}e.openStart("li").class(t.CSS_CLASS+"Tick").style("width",s+"%").openEnd().close("li")}e.openStart("li").class(t.CSS_CLASS+"Tick").style("width","0%").openEnd().close("li");this.renderTickmarksLabel(e,i,i.getMax());e.close("ul")};t.renderTickmarksLabel=function(i,n,a){var s=n._getPercentOfValue(a);var r=e.getRTL()?"right":"left";a=n.toFixed(a,n.getDecimalPrecisionOfNumber(n.getStep()));i.openStart("li").class(t.CSS_CLASS+"TickLabel");i.style(r,s+"%");i.openEnd();i.openStart("div").class(t.CSS_CLASS+"Label").openEnd();i.text(""+a);i.close("div");i.close("li")};t.addClass=function(e,i){e.class(t.CSS_CLASS)};t.addInnerClass=function(e,i){e.class(t.CSS_CLASS+"Inner")};t.addProgressIndicatorClass=function(e,i){e.class(t.CSS_CLASS+"Progress")};t.addHandleClass=function(e,i){e.class(t.CSS_CLASS+"Handle")};t.renderLabels=function(e,t){};return t},true);
//# sourceMappingURL=VizSliderBasicRenderer.js.map