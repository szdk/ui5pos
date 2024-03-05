/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Control","sap/ui/Device","sap/m/FlexBox","sap/suite/ui/microchart/MicroChartUtils","sap/m/library","sap/ui/core/ResizeHandler","./ComparisonMicroChartRenderer","sap/ui/core/Core","sap/ui/core/Theming"],function(jQuery,e,t,i,a,r,s,o,n,p,l){"use strict";var h=s.ValueColor;var u=e.ComparisonMicroChartViewType;var d=s.Size;var c=t.extend("sap.suite.ui.microchart.ComparisonMicroChart",{metadata:{library:"sap.suite.ui.microchart",properties:{size:{type:"sap.m.Size",group:"Misc",defaultValue:"Auto"},scale:{type:"string",group:"Misc",defaultValue:""},minValue:{type:"float",group:"Appearance",defaultValue:null},maxValue:{type:"float",group:"Appearance",defaultValue:null},view:{type:"sap.suite.ui.microchart.ComparisonMicroChartViewType",group:"Appearance",defaultValue:"Normal"},colorPalette:{type:"string[]",group:"Appearance",defaultValue:[]},shrinkable:{type:"boolean",group:"Misc",defaultValue:false},width:{type:"sap.ui.core.CSSSize",group:"Appearance"},height:{type:"sap.ui.core.CSSSize",group:"Appearance"},isResponsive:{type:"boolean",group:"Appearance",defaultValue:false},hideOnNoData:{type:"boolean",group:"Appearance",defaultValue:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},defaultAggregation:"data",aggregations:{data:{type:"sap.suite.ui.microchart.ComparisonMicroChartData",multiple:true,bindable:"bindable"}},events:{press:{}}},renderer:n});c.THRESHOLD_LOOK_XS=6;c.THRESHOLD_LOOK_S=8.25;c.THRESHOLD_LOOK_M=10.5;c.THRESHOLD_LOOK_L=12;c.prototype.attachEvent=function(e,i,a,r){t.prototype.attachEvent.call(this,e,i,a,r);if(this.hasListeners("press")){this.$().attr("tabindex",0).addClass("sapSuiteUiMicroChartPointer")}return this};c.prototype.detachEvent=function(e,i,a){t.prototype.detachEvent.call(this,e,i,a);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer")}return this};c.prototype.onclick=function(e){if(!this.fireBarPress(e)){this.firePress()}};c.prototype.fireBarPress=function(e){var t=jQuery(e.target);if(t&&t.attr("data-bar-index")){var i=parseInt(t.attr("data-bar-index"));var a=this.getData()[i];if(a&&a.hasListeners("press")){a.firePress();e.preventDefault();e.stopImmediatePropagation();var r=this.$().find(".sapSuiteCpMCChartBar");var s=r.index(this.$().find(".sapSuiteCpMCChartBar[tabindex='0']"));this._switchTabindex(s,i,r);return true}}return false};c.prototype.onsaptabprevious=function(){this.$().css("outline-color","")};c.prototype.onsaptabnext=function(){var e=this.$().next();if(e.hasClass("sapSuiteCpMC")&&e.attr("tabindex")){e.css("outline-color","")}};c.prototype.onsapenter=function(e){if(!this.fireBarPress(e)){this.firePress();e.preventDefault();e.stopImmediatePropagation()}};c.prototype.onsapspace=c.prototype.onsapenter;c.prototype.onsapup=function(e){var t=this.$().find(".sapSuiteUiMicroChartPointer");if(t.length>0){var i=t.index(e.target);this._switchTabindex(i,i-1,t)}e.preventDefault();e.stopImmediatePropagation()};c.prototype.onsapdown=function(e){var t=this.$().find(".sapSuiteUiMicroChartPointer");if(t.length>0){var i=t.index(e.target);this._switchTabindex(i,i+1,t)}e.preventDefault();e.stopImmediatePropagation()};c.prototype.onsaphome=function(e){var t=this.$().find(".sapSuiteUiMicroChartPointer");var i=t.index(e.target);if(i!==0&&t.length>0){this._switchTabindex(i,0,t)}e.preventDefault();e.stopImmediatePropagation()};c.prototype.onsapend=function(e){var t=this.$().find(".sapSuiteUiMicroChartPointer");var i=t.index(e.target),a=t.length;if(i!==a-1&&a>0){this._switchTabindex(i,a-1,t)}e.preventDefault();e.stopImmediatePropagation()};c.prototype.onsapleft=c.prototype.onsapup;c.prototype.onsapright=c.prototype.onsapdown;c.prototype.setMinValue=function(e){this._isMinValueSet=jQuery.isNumeric(e);return this.setProperty("minValue",this._isMinValueSet?e:NaN)};c.prototype.setMaxValue=function(e){this._isMaxValueSet=jQuery.isNumeric(e);return this.setProperty("maxValue",this._isMaxValueSet?e:NaN)};c.prototype.setSize=function(e){if(this.getSize()!==e){this.setProperty("size",e,false)}return this};c.prototype.init=function(){this._oRb=p.getLibraryResourceBundle("sap.suite.ui.microchart");this.setAggregation("tooltip","((AltText))",true);this._isMinValueSet=false;this._isMaxValueSet=false;this._bThemeApplied=false;p.ready(this._handleCoreInitialized.bind(this))};c.prototype._handleCoreInitialized=function(){l.attachApplied(this._handleThemeApplied.bind(this))};c.prototype._handleThemeApplied=function(){this._bThemeApplied=true;this.invalidate();l.detachApplied(this._handleThemeApplied.bind(this))};c.prototype.onBeforeRendering=function(){if(this._sChartResizeHandlerId){o.deregister(this._sChartResizeHandlerId)}this._unbindMouseEnterLeaveHandler()};c.prototype.onAfterRendering=function(){e._checkControlIsVisible(this,this._onControlIsVisible);this._bindMouseEnterLeaveHandler()};c.prototype._onControlIsVisible=function(){this._onResize();this._sChartResizeHandlerId=o.register(this,this._onResize.bind(this))};c.prototype.setBarPressable=function(e,t){if(t){var i=this._getBarAltText(e);this.$("chart-item-bar-"+e).addClass("sapSuiteUiMicroChartPointer").attr("tabindex",0).attr("title",i).attr("role","presentation").attr("aria-label",i)}else{this.$("chart-item-bar-"+e).removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer").removeAttr("title").removeAttr("role").removeAttr("aria-label")}};c.prototype._getAltHeaderText=function(e){var t=this._oRb.getText("COMPARISONMICROCHART");if(e){t+=" "+this._oRb.getText("IS_ACTIVE")}if(!this._hasData()){t+="\n"+this._oRb.getText("NO_DATA");return t}return t};c.prototype._getAltSubText=function(e){var t="";for(var i=0;i<this.getData().length;i++){var a=this.getData()[i],r=this._getBarAltText(i),s=a.getTooltip_AsString(),o="";if(!s){continue}o=s.split("((AltText))").join(r);if(o){t+=(e?"":"\n")+o;e=false}}return t};c.prototype._getAccessibilityControlType=function(){return this._oRb.getText("ACC_CTR_TYPE_COMPARISONMICROCHART")};c.prototype.exit=function(){o.deregister(this._sChartResizeHandlerId)};c.prototype._calculateChartData=function(){var e=[];var t=this.getData();var i=t.length;var a=0;var r=0;var s;var o;var n;var p;for(p=0;p<i;p++){var l=isNaN(t[p].getValue())?0:t[p].getValue();a=Math.max(a,l);r=Math.min(r,l)}if(this._isMinValueSet){r=Math.min(r,this.getMinValue())}if(this._isMaxValueSet){a=Math.max(a,this.getMaxValue())}s=a-r;o=s==0?0:Math.round(a*100/s);if(o==0&&a!=0){o=1}else if(o==100&&r!=0){o=99}n=100-o;for(p=0;p<i;p++){var h={};var u=isNaN(t[p].getValue())?0:t[p].getValue();h.value=s==0?0:Math.round(u*100/s);if(h.value==0&&u!=0){h.value=u>0?1:-1}else if(h.value==100){h.value=o}else if(h.value==-100){h.value=-n}if(h.value>=0){h.negativeNoValue=n;h.positiveNoValue=o-h.value}else{h.value=-h.value;h.negativeNoValue=n-h.value;h.positiveNoValue=o}e.push(h)}return e};c.prototype._getLocalizedColorMeaning=function(e){return h[e]&&e!="None"?this._oRb.getText(("SEMANTIC_COLOR_"+e).toUpperCase()):""};c.prototype._getBarAltText=function(e){var i=this.getData()[e],a=t.prototype.getTooltip_AsString.apply(i,arguments),r=this.getColorPalette().length?"":this._getLocalizedColorMeaning(i.getColor()),s=i.getTitle()+" "+(i.getDisplayValue()?i.getDisplayValue():i.getValue())+this.getScale()+" "+r;if(!a){return""}return a.split("((AltText))").join(s)};c.prototype._onResize=function(){this.$().find(".sapSuiteCpMCChartItem").show();this._resizeHorizontally();this._resizeVertically()};c.prototype._resizeVertically=function(){var e,t,i,a,r,s,o,n,p,l=this.getData(),h=this.$(),u,d=h.find(".sapSuiteCpMCChartItem"),c=h.find(".sapSuiteCpMCChartBar");d.css("margin-bottom","");d.css("height","");c.css("height","");if(l.length>0&&l[0].getDomRef()){e=l[0].getDomRef().getBoundingClientRect().height;t=parseFloat(l[0].$().css("margin-bottom"));i=c.height();s=h.width();o=this._getCurrentBaseWidth();if(o>0){n=o/e;e=s/n;d.css("height",e);n=o/t;t=s/n;d.css("margin-bottom",t);n=o/i;c.css("height",s/n)}a=h.find(".sapSuiteCpMCVerticalAlignmentContainer")[0].getBoundingClientRect().height;r=0;for(var f=0;f<l.length;f++){r+=e;if(r>a){l[f].$().hide()}r+=t}u=this.$().find(".sapSuiteCpMCVerticalAlignmentContainer .sapSuiteCpMCChartItem:visible:last");if(u.length===1&&!this.getShrinkable()){u.css("margin-bottom","");p=this.getDomRef().getBoundingClientRect().bottom-u[0].getBoundingClientRect().bottom;if(p<t){u.css("margin-bottom",p<0?0:p)}}}};c.prototype._resizeHorizontally=function(){var e=this.$();var t=0;var i=0;var a=this.$().find(".sapSuiteCpMCChartItemTitle");var r=this.$().find(".sapSuiteCpMCChartItemValue");var s;var o;e.removeClass("sapSuiteCpMCLookL sapSuiteCpMCLookM sapSuiteCpMCLookS sapSuiteCpMCLookXS sapSuiteCpMCLookWide");o=this._getCurrentLookClass();e.addClass(o);if(!e.hasClass("sapSuiteCpMCLookXS")){this._hideTruncatedLabels(".sapSuiteCpMCChartItemValue")}a.width("auto");r.width("auto");if(e.hasClass("sapSuiteCpMCLookWide")){a.each(function(){s=this.getBoundingClientRect();if(s.width>t){t=Math.ceil(s.width)}});a.width(t);r.each(function(){s=this.getBoundingClientRect();if(s.width>i){i=Math.ceil(s.width)}});r.width(i)}};c.prototype._getCurrentBaseWidth=function(){var e=this.$();var t=parseInt(e.width());var i;if(this.getView()===u.Wide||t>this.convertRemToPixels(c.THRESHOLD_LOOK_L)||this.getSize()!==d.Responsive){i=0}else if(t>this.convertRemToPixels(c.THRESHOLD_LOOK_M)){i=this.convertRemToPixels(c.THRESHOLD_LOOK_L)}else if(t>this.convertRemToPixels(c.THRESHOLD_LOOK_S)){i=this.convertRemToPixels(c.THRESHOLD_LOOK_M)}else if(t>this.convertRemToPixels(c.THRESHOLD_LOOK_XS)){i=this.convertRemToPixels(c.THRESHOLD_LOOK_S)}else{i=0}return i};c.prototype._getCurrentLookClass=function(){var e=this.$();var t=parseInt(e.width());var i;if(this._shouldUseWideView()){i="sapSuiteCpMCLookWide"}else if(this.getSize()!==d.Responsive){i="sapSuiteCpMCLook"+this._getSize()}else if(t>this.convertRemToPixels(c.THRESHOLD_LOOK_M)){i="sapSuiteCpMCLookL"}else if(t>this.convertRemToPixels(c.THRESHOLD_LOOK_S)){i="sapSuiteCpMCLookM"}else if(t>this.convertRemToPixels(c.THRESHOLD_LOOK_XS)){i="sapSuiteCpMCLookS"}else{i="sapSuiteCpMCLookXS"}return i};c.prototype._getSize=function(){var e=this.getSize();if(e===d.Auto){if(i.system.phone){e=d.S}else{e=d.M}}return e};c.prototype._shouldUseWideView=function(){var e=parseInt(this.$().width());return this.getView()===u.Wide||this.getView()===u.Responsive&&e>this.convertRemToPixels(c.THRESHOLD_LOOK_L)};c.prototype._hideTruncatedLabels=function(e){var t=this.$();var i=t.find(e);for(var a=0;a<i.length;a++){jQuery(i[a]).removeClass("sapSuiteCpMCChartItemHiddenLabel");if(this._isLabelTruncated(i[a])){jQuery(i[a]).addClass("sapSuiteCpMCChartItemHiddenLabel")}}};c.prototype._addTitleAttribute=function(){var t=this.getTooltip_AsString();if(!e._isTooltipSuppressed(t)&&this._hasData()){if(this._isResponsive()){this.$().find(".sapSuiteCpMCVerticalAlignmentContainer").attr("title",t)}else{this.$().attr("title",t)}}};c.prototype._removeTitleAttribute=function(){if(this._isResponsive()){this.$().find(".sapSuiteCpMCVerticalAlignmentContainer").removeAttr("title")}else{this.$().removeAttr("title")}};c.prototype._resolveFocus=function(e){var t=jQuery(e.target);if(t&&t.attr("data-bar-index")){var i=parseInt(t.attr("data-bar-index"));var a=this.getData()[i];if(a&&a.hasListeners("press")){this.$().css("outline-color","transparent")}else{this.$().css("outline-color","")}}else{this.$().css("outline-color","")}};c.prototype._switchTabindex=function(e,t,i){if(e>=0&&e<i.length&&t>=0&&t<i.length){i.eq(e).removeAttr("tabindex");i.eq(t).attr("tabindex","0").trigger("focus")}};c.prototype._bindMouseEnterLeaveHandler=function(){if(!this._oMouseEnterLeaveHandler){this._oMouseEnterLeaveHandler={mouseEnterChart:this._addTitleAttribute.bind(this),mouseLeaveChart:this._removeTitleAttribute.bind(this),mouseDownChart:this._resolveFocus.bind(this)}}this.$().on("mouseenter",this._oMouseEnterLeaveHandler.mouseEnterChart);this.$().on("mouseleave",this._oMouseEnterLeaveHandler.mouseLeaveChart);this.$().on("mousedown",this._oMouseEnterLeaveHandler.mouseDownChart)};c.prototype._unbindMouseEnterLeaveHandler=function(){if(this._oMouseEnterLeaveHandler){this.$().off("mouseenter",this._oMouseEnterLeaveHandler.mouseEnterChart);this.$().off("mouseleave",this._oMouseEnterLeaveHandler.mouseLeaveChart);this.$().off("mousedown",this._oMouseEnterLeaveHandler.mouseDownChart)}};c.prototype._hasData=function(){return this.getData().length>0};c.prototype.firePress=function(){if(this._hasData()){t.prototype.fireEvent.call(this,"press",arguments)}};r.extendMicroChart(c);return c});
//# sourceMappingURL=ComparisonMicroChart.js.map