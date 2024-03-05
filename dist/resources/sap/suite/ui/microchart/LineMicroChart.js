/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/m/library","sap/ui/core/Control","sap/ui/core/ResizeHandler","sap/ui/events/KeyCodes","sap/base/Log","sap/suite/ui/microchart/MicroChartUtils","sap/suite/ui/microchart/LineMicroChartLine","./LineMicroChartRenderer","sap/ui/core/Core","sap/ui/core/Theming"],function(jQuery,e,t,i,a,o,s,r,l,n,h,p){"use strict";var u=i.extend("sap.suite.ui.microchart.LineMicroChart",{metadata:{library:"sap.suite.ui.microchart",properties:{size:{type:"sap.m.Size",group:"Appearance",defaultValue:"Auto"},threshold:{type:"float",group:"Appearance",defaultValue:0},showThresholdLine:{type:"boolean",group:"Appearance",defaultValue:true},showThresholdValue:{type:"boolean",group:"Appearance",defaultValue:false},thresholdDisplayValue:{type:"string",group:"Appearance"},minXValue:{type:"float",group:"Appearance"},maxXValue:{type:"float",group:"Appearance"},minYValue:{type:"float",group:"Appearance"},maxYValue:{type:"float",group:"Appearance"},leftTopLabel:{type:"string",group:"Data",defaultValue:null},rightTopLabel:{type:"string",group:"Data",defaultValue:null},leftBottomLabel:{type:"string",group:"Data",defaultValue:null},rightBottomLabel:{type:"string",group:"Data",defaultValue:null},showTopLabels:{type:"boolean",defaultValue:true},showBottomLabels:{type:"boolean",defaultValue:true},color:{type:"any",group:"Appearance",defaultValue:"Neutral"},showPoints:{type:"boolean",group:"Appearance",defaultValue:false},width:{type:"sap.ui.core.CSSSize",group:"Misc"},height:{type:"sap.ui.core.CSSSize",group:"Misc"},hideOnNoData:{type:"boolean",group:"Appearance",defaultValue:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},defaultAggregation:"points",aggregations:{points:{type:"sap.suite.ui.microchart.LineMicroChartPoint",multiple:true,bindable:"bindable",forwarding:{getter:"_getInternalLine",aggregation:"points"}},lines:{type:"sap.suite.ui.microchart.LineMicroChartLine",multiple:true,bindable:"bindable"},_line:{type:"sap.suite.ui.microchart.LineMicroChartLine",multiple:false,visibility:"hidden"}},events:{press:{}}},renderer:n});u.THRESHOLD_LOOK_XS=1.125;u.THRESHOLD_LOOK_S=3.5;u.THRESHOLD_LOOK_M=4.5;u.THRESHOLD_LOOK_L=5.875;u.THRESHOLD_WIDTH_NO_LABEL=6;u.prototype.ontap=function(e){this.firePress()};u.prototype.onkeydown=function(e){if(e.which===o.SPACE){e.preventDefault()}};u.prototype.onkeyup=function(e){if(e.which===o.ENTER||e.which===o.SPACE){this.firePress();e.preventDefault()}};u.prototype.attachEvent=function(e,t,a,o){i.prototype.attachEvent.call(this,e,t,a,o);if(this.hasListeners("press")){this.$().attr("tabindex",0).addClass("sapSuiteUiMicroChartPointer")}return this};u.prototype.detachEvent=function(e,t,a){i.prototype.detachEvent.call(this,e,t,a);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer")}return this};u.prototype.onclick=function(){this.firePress()};u.prototype.onsapspace=u.prototype.onclick;u.prototype.onsapenter=u.prototype.onclick;u.prototype._getAccessibilityControlType=function(){return this._oRb.getText("ACC_CTR_TYPE_LINEMICROCHART")};u.prototype.getThreshold=function(){if(this._bThresholdNull){return null}else{return this.getProperty("threshold")}};u.prototype.init=function(){this._minXScale=null;this._maxXScale=null;this._minYScale=null;this._maxYScale=null;this._fNormalizedThreshold=0;this._bScalingValid=false;this._bThresholdNull=false;this._bNoTopLabels=false;this._bNoBottomLabels=false;this._oRb=h.getLibraryResourceBundle("sap.suite.ui.microchart");this.setAggregation("tooltip","((AltText))",true);this._bThemeApplied=false;h.ready(this._handleCoreInitialized.bind(this))};u.prototype._handleCoreInitialized=function(){p.attachApplied(this._handleThemeApplied.bind(this))};u.prototype._handleThemeApplied=function(){this._bThemeApplied=true;this.invalidate();p.detachApplied(this._handleThemeApplied.bind(this))};u.prototype.onBeforeRendering=function(){if(this._hasData()){this._setModeFlags();this._normalizePoints()}this._unbindMouseEnterLeaveHandler()};u.prototype.onAfterRendering=function(){this._sResizeHandlerId=a.register(this,this._onResize.bind(this));this._onResize();this._bindMouseEnterLeaveHandler()};u.prototype.exit=function(){this._deregisterResizeHandler()};u.prototype.validateProperty=function(e,t){if(e==="threshold"){this._bThresholdNull=t===null}if(t===null||t===undefined){return i.prototype.validateProperty.apply(this,[e,null])}if(e==="color"&&!this.isColorCorrect(t)){s.warning("Color property of LineMicroChart must be of type sap.m.ValueCSSColor either as single value or as composite value (above: value, below: value)");t=null}else if(["minXValue","maxXValue","minYValue","maxYValue"].indexOf(e)>=0){if(!jQuery.isNumeric(t)){s.warning("Property "+e+" of LineMicroChart is not numeric and it will be reset to default");t=null}}return i.prototype.validateProperty.apply(this,[e,t])};u.prototype._getInternalLine=function(){var e=this.getAggregation("_line");if(!e){e=new l;this.setAggregation("_line",e)}return e};u.prototype._getLines=function(){var e=this.getAggregation("_line");return e&&e._getPoints().length>0?[e]:this.getLines()};u.prototype._setModeFlags=function(){var e;this._minXScale=Infinity;this._maxXScale=-Infinity;if(this._bThresholdNull){this._minYScale=Infinity;this._maxYScale=-Infinity}else{this._minYScale=this._maxYScale=this.getThreshold()}this._getLines().forEach(function(i){e=i._getPoints();i._bFocusMode=false;i._bSemanticMode=false;for(var a=0;a<e.length;a++){this._minXScale=Math.min(e[a].getX(),this._minXScale);this._maxXScale=Math.max(e[a].getX(),this._maxXScale);this._minYScale=Math.min(e[a].getY(),this._minYScale);this._maxYScale=Math.max(e[a].getY(),this._maxYScale);if(e[a].getMetadata().getName()==="sap.suite.ui.microchart.LineMicroChartEmphasizedPoint"){i._bFocusMode=true;if(e[a].getColor()!==t.ValueColor.Neutral&&e[a].getShow()){i._bSemanticMode=true}}}if(!i._bFocusMode){i._bSemanticMode=i.getColor()&&i.getColor().above&&i.getColor().below&&!this._bThresholdNull}if(i._bFocusMode&&i._bSemanticMode&&i.getColor()!==t.ValueColor.Neutral){s.info("Property Color of LineMicroChart has no effect if EmphasizedPoints with colors different from Neutral are used.")}if(i._bFocusMode&&i.getShowPoints()){s.info("Property ShowPoints of LineMicroChart has no effect if EmphasizedPoints are used.")}if(i.getColor()&&i.getColor().above&&i.getColor().below&&this._bThresholdNull){s.info("Property Color of LineMicroChart has no effect if it is composed of colors for above and below when property Threshold is null")}},this);var i=this.getLeftTopLabel(),a=this.getRightTopLabel(),o=this.getLeftBottomLabel(),r=this.getRightBottomLabel();this._bNoBottomLabels=r.length===0&&o.length===0;this._bNoTopLabels=i.length===0&&a.length===0};u.prototype._normalizePoints=function(){var e=this._minXScale,t=this._maxXScale,i=this._minYScale,a=this._maxYScale;if(jQuery.isNumeric(this.getMinXValue())){this._minXScale=this.getMinXValue();if(!jQuery.isNumeric(this.getMaxXValue())&&this._minXScale>t){s.error("Property minXValue of LineMicroChart must be smaller to at least one X value of the points aggregation if property maxXValue is not set")}}if(jQuery.isNumeric(this.getMaxXValue())){this._maxXScale=this.getMaxXValue();if(!jQuery.isNumeric(this.getMinXValue())&&this._maxXScale<e){s.error("Property maxXValue of LineMicroChart must be greater to at least one X value of the points aggregation if property minXValue is not set")}}if(jQuery.isNumeric(this.getMinYValue())){this._minYScale=this.getMinYValue();if(!jQuery.isNumeric(this.getMaxYValue())&&this._minYScale>a){s.error("Property minYValue of LineMicroChart must be greater to threshold or at least one Y value of the points aggregation if property maxYValue is not set")}}if(jQuery.isNumeric(this.getMaxYValue())){this._maxYScale=this.getMaxYValue();if(!jQuery.isNumeric(this.getMinYValue())&&this._maxYScale<i){s.error("Property maxYValue of LineMicroChart must be smaller to threshold or at least one Y value of the points aggregation if property minYValue is not set")}}if(this.getMaxYValue()<this.getMinYValue()){s.error("Property maxYValue of LineMicroChart must not be smaller to minYValue")}if(this.getMaxXValue()<this.getMinXValue()){s.error("Property maxXValue of LineMicroChart must not be smaller to minXValue")}var o,r=this._maxXScale-this._minXScale,l=this._maxYScale-this._minYScale,n,h;this._bScalingValid=r>=0&&l>=0;if(this._bScalingValid){this._getLines().forEach(function(e){o=e._getPoints();e._aNormalizedPoints=[];for(var t=0;t<o.length;t++){if(this._minXScale===this._maxXScale&&o[t].getX()===this._maxXScale){n=50}else{n=(o[t].getX()-this._minXScale)/r*100}if(this._minYScale===this._maxYScale&&o[t].getY()===this._maxYScale){h=50}else{h=(o[t].getY()-this._minYScale)/l*100}e._aNormalizedPoints.push({x:n,y:h})}},this);this._fNormalizedThreshold=(this.getThreshold()-this._minYScale)/l*100}};u.prototype._onResize=function(){var e=this.$(),t=parseInt(e.width()),i=parseInt(e.height()),a=e.find(".sapSuiteLMCLeftTopLabel, .sapSuiteLMCRightTopLabel"),o=e.find(".sapSuiteLMCThresholdLabel");e.removeClass("sapSuiteLMCNoLabels sapSuiteLMCLookM sapSuiteLMCLookS sapSuiteLMCLookXS");if(t<=this.convertRemToPixels(u.THRESHOLD_WIDTH_NO_LABEL)){e.addClass("sapSuiteLMCNoLabels")}if(this.getShowTopLabels()){e.removeClass("sapSuiteLMCNoTopLabels")}if(this.getShowBottomLabels()){e.removeClass("sapSuiteLMCNoBottomLabels")}if(i<this.convertRemToPixels(u.THRESHOLD_LOOK_S)){e.addClass("sapSuiteLMCLookXS")}else if(i<this.convertRemToPixels(u.THRESHOLD_LOOK_M)){e.addClass("sapSuiteLMCLookS")}else if(i<this.convertRemToPixels(u.THRESHOLD_LOOK_L)){e.addClass("sapSuiteLMCLookM")}if(this.getShowThresholdValue()){e.removeClass("sapSuiteLMCNoThresholdLabel")}if(this._isAnyLabelTruncated(a)){e.addClass("sapSuiteLMCNoTopLabels")}if(this._isAnyLabelTruncated(o)){e.addClass("sapSuiteLMCNoThresholdLabel")}this._adjustThresholdLabelPos()};u.prototype._adjustThresholdLabelPos=function(){var e=this.$();var t=e.find(".sapSuiteLMCThresholdLabelWrapper").height();var i=e.find(".sapSuiteLMCThresholdLabel");var a=i.outerHeight();var o=t*(100-this._fNormalizedThreshold)*.01;var s=o-a/2;if(s<0){s=0}else if(s+a>t){s=t-a}i.css("top",s*100/t+"%")};u.prototype._getAltHeaderText=function(e){var t=this._oRb.getText("LINEMICROCHART");if(e){t+=" "+this._oRb.getText("IS_ACTIVE")}t+="\n";if(!this._hasData()){t+=this._oRb.getText("NO_DATA");return t}var i=this.getLeftTopLabel();var a=this.getLeftBottomLabel();var o=this.getRightTopLabel();var s=this.getRightBottomLabel();var r=true;if(i||a){t+=this._oRb.getText("LINEMICROCHART_START")+": "+a+" "+i;r=false}if(o||s){t+=(r?"":"\n")+this._oRb.getText("LINEMICROCHART_END")+": "+s+" "+o}return t};u.prototype._addTitleAttribute=function(){if(!this.$().attr("title")&&this._hasData()){this.$().attr("title",this.getTooltip_AsString())}};u.prototype._removeTitleAttribute=function(){if(this.$().attr("title")){this.$().removeAttr("title")}};u.prototype._bindMouseEnterLeaveHandler=function(){this.$().on("mouseenter.tooltip",this._addTitleAttribute.bind(this));this.$().on("mouseleave.tooltip",this._removeTitleAttribute.bind(this))};u.prototype._unbindMouseEnterLeaveHandler=function(){this.$().off("mouseenter.tooltip");this.$().off("mouseleave.tooltip")};u.prototype._deregisterResizeHandler=function(){if(this._sResizeHandlerId){a.deregister(this._sResizeHandlerId);this._sResizeHandlerId=null}};u.prototype._hasData=function(){return this._getLines().length>0};u.prototype.firePress=function(){if(this._hasData()){i.prototype.fireEvent.call(this,"press",arguments)}};r.extendMicroChart(u);return u});
//# sourceMappingURL=LineMicroChart.js.map