/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/m/library","sap/ui/core/Control","sap/ui/core/ResizeHandler","sap/ui/Device","sap/m/FlexBox","sap/base/Log","./InteractiveDonutChartSegment","sap/m/IllustratedMessage","./InteractiveDonutChartRenderer","sap/ui/core/Core","sap/ui/core/Theming"],function(jQuery,e,t,i,s,a,n,r,o,l,d,S,h){"use strict";var p=i.extend("sap.suite.ui.microchart.InteractiveDonutChart",{metadata:{library:"sap.suite.ui.microchart",properties:{displayedSegments:{type:"int",group:"Appearance",defaultValue:3},selectionEnabled:{type:"boolean",group:"Behavior",defaultValue:true},showError:{type:"boolean",group:"Appearance",defaultValue:false},errorMessageTitle:{type:"string",group:"Appearance"},errorMessage:{type:"string",group:"Appearance"}},defaultAggregation:"segments",aggregations:{segments:{type:"sap.suite.ui.microchart.InteractiveDonutChartSegment",multiple:true,bindable:"bindable"}},events:{selectionChanged:{parameters:{selectedSegments:{type:"sap.suite.ui.microchart.InteractiveDonutChartSegment[]"},segment:{type:"sap.suite.ui.microchart.InteractiveDonutChartSegment"},selected:{type:"boolean"}}},press:{}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}}},renderer:d});p.SEGMENT_CSSCLASS_SELECTED="sapSuiteIDCLegendSegmentSelected";p.SEGMENT_CSSCLASS_HIGHLIGHT="sapSuiteIDCLegendSegmentHover";p.CHART_SEGMENT_LABEL_MAXLENGTH=7;p.CHART_SEGMENT={CSSCLASS:"sapSuiteIDCChartSegment",CSSCLASS_HIGHLIGHT:"sapSuiteIDCChartSegmentHighlight",CSSCLASS_SELECTED:"sapSuiteIDCChartSegmentSelected"};p.CHART_SEGMENT_GHOST={CSSCLASS:"sapSuiteIDCChartSegmentGhost",CSSCLASS_HIGHLIGHT:"sapSuiteIDCChartSegmentGhostHighlight",CSSCLASS_SELECTED:"sapSuiteIDCChartSegmentGhostSelected"};p.AREA_HEIGHT_INTERACTIVE_MINVALUE=48;p.AREA_HEIGHT_INTERACTIVE_MINVALUE_COMPACT=32;p.AREA_HEIGHT_SMALLFONT=36;p.AREA_HEIGHT_SMALLFONT_COMPACT=32;p.AREA_HEIGHT_MINVALUE=18;p.LEGEND_HEIGHT_PADDING=6;p.CHART_HEIGHT_MINVALUE=110;p.CHART_WIDTH_MINVALUE=130;p.CHART_WIDTH_HIDEDONUT_MINVALUE=220;p.CHART_WIDTH_LEGENDPADDING_MINVALUE=300;p.CHART_WIDTH_FULLWIDTH_SMALLFONT_MINVALUE=180;p.prototype.onclick=function(e){if(!this.getSelectionEnabled()){return}if(this._bInteractiveMode){var t=jQuery(e.target),i=t.data("sap-ui-idc-selection-index"),s=this.getAggregation("segments"),a=this.$().find(".sapSuiteIDCLegendSegment"),n;if(!(i>=0)){i=t.closest(".sapSuiteIDCLegendSegment").data("sap-ui-idc-selection-index")}if(isNaN(i)||i<0||i>=s.length){return}this._toggleSelected(i);n=a.index(this.$().find(".sapSuiteIDCLegendSegment[tabindex='0']"));this._switchTabindex(n,i,a)}else{this.firePress()}};p.prototype.onsapup=function(e){var t=this.$().find(".sapSuiteIDCLegendSegment");var i=t.index(e.target);if(t.length>0){this._switchTabindex(i,i-1,t)}e.preventDefault();e.stopImmediatePropagation()};p.prototype.onsapdown=function(e){var t=this.$().find(".sapSuiteIDCLegendSegment");var i=t.index(e.target);if(t.length>0){this._switchTabindex(i,i+1,t)}e.preventDefault();e.stopImmediatePropagation()};p.prototype.onsaphome=function(e){var t=this.$().find(".sapSuiteIDCLegendSegment");var i=t.index(e.target);if(i!==0&&t.length>0){this._switchTabindex(i,0,t)}e.preventDefault();e.stopImmediatePropagation()};p.prototype.onsapend=function(e){var t=this.$().find(".sapSuiteIDCLegendSegment");var i=t.index(e.target);var s=t.length;if(i!==s-1&&s>0){this._switchTabindex(i,s-1,t)}e.preventDefault();e.stopImmediatePropagation()};p.prototype.onsapenter=function(e){if(this._bInteractiveMode){var t=this.$().find(".sapSuiteIDCLegendSegment").index(e.target);if(t!==-1){this._toggleSelected(t)}e.preventDefault();e.stopImmediatePropagation()}else{this.firePress()}};p.prototype.onsapleft=p.prototype.onsapup;p.prototype.onsapright=p.prototype.onsapdown;p.prototype.onsapspace=p.prototype.onsapenter;p.prototype.getTooltip_AsString=function(){var t=this.getTooltip_Text();if(!t){t=this._createTooltipText()}else if(e._isTooltipSuppressed(t)){t=null}return t};p.prototype.getSelectedSegments=function(){var e,t;e=this.getAggregation("segments");t=[];for(var i=0;i<e.length;i++){if(e[i].getSelected()){t.push(e[i])}}return t};p.prototype.setSelectedSegments=function(e){var t,i,s;t=this.getAggregation("segments");this._deselectAllSelectedSegments();if(!e){return this}if(e instanceof o){e=[e]}if(Array.isArray(e)){s=e.length;for(var a=0;a<s;a++){i=this.indexOfAggregation("segments",e[a]);if(i>=0&&t[i]){t[i].setProperty("selected",true,true)}else{r.warning("Method setSelectedSegments called with invalid InteractiveDonutChartSegment element")}}}this.invalidate();return this};p.prototype.init=function(){this._oRb=S.getLibraryResourceBundle("sap.suite.ui.microchart");this._bThemeApplied=false;this._oIllustratedMessageControl=new l({illustrationSize:t.IllustratedMessageSize.Base,illustrationType:t.IllustratedMessageType.NoData});S.ready(this._handleCoreInitialized.bind(this))};p.prototype.onBeforeRendering=function(){this._bCompact=this._isCompact();this._bInteractiveMode=true;this._errorMessage=this.getErrorMessage();this._errorMessageTitle=this.getErrorMessageTitle();this._oIllustratedMessageControl.setTitle(this._errorMessageTitle);this._oIllustratedMessageControl.setDescription(this._errorMessage);var e=this.getSegments();this._iVisibleSegments=Math.min(this.getDisplayedSegments(),e.length);this._setResponsivenessData();var i=this.$().find(".sapSuiteIDCChartSegment, .sapSuiteIDCLegendSegment, .sapSuiteIDCChartSegmentGhost");i.off();if(!this.data("_parentRenderingContext")&&typeof this.getParent==="function"){this.data("_parentRenderingContext",this.getParent())}this._deregisterResizeHandler();this._bSemanticTooltip=false;for(var s=0;s<this._iVisibleSegments;s++){if(e[s].getColor()!==t.ValueColor.Neutral){this._bSemanticTooltip=true;break}}};p.prototype.onAfterRendering=function(){this._adjustToParent(this.$());e._checkControlIsVisible(this,this._onControlIsVisible)};p.prototype._onControlIsVisible=function(){if(this._bInteractiveMode){this._sResizeHandlerId=s.register(this,this._onResize.bind(this));this._onResize();if(this.$().length>0){var e=this._isCompact();if(e!==this._bCompact){this._bCompact=e;this.invalidate()}}if(a.system.desktop){this._attachHoverHandlers()}}};p.prototype.exit=function(){this._deregisterResizeHandler();this._oIllustratedMessageControl.destroy()};p.prototype._handleCoreInitialized=function(){h.attachApplied(this._handleThemeApplied.bind(this))};p.prototype._deselectAllSelectedSegments=function(){var e=this.getAggregation("segments");for(var t=0;t<e.length;t++){if(e[t].getSelected()){e[t].setProperty("selected",false,true)}}};p.prototype._attachHoverHandlers=function(){var e=this,t=this.$().find(".sapSuiteIDCChartSegment, .sapSuiteIDCLegendSegment, .sapSuiteIDCChartSegmentGhost");t.on({mousemove:function(){e._handleHoverSync(jQuery(this).data("sap-ui-idc-selection-index"))},mouseleave:function(){e._handleHoverSync(jQuery(this).data("sap-ui-idc-selection-index"),true)}})};p.prototype._handleHoverSync=function(e,t){if(this._bInteractiveMode){var i=this.getAggregation("segments"),s=i[e].getSelected();this._setSegmentInteractionState(p.CHART_SEGMENT,e,s,t);this._setSegmentInteractionState(p.CHART_SEGMENT_GHOST,e,s,t);this._setLegendEntryInteractionState(e,s,t,i[e])}};p.prototype._setSegmentInteractionState=function(e,t,i,s){var a=this.$().find("."+e.CSSCLASS+"[data-sap-ui-idc-selection-index='"+t+"']");a.removeClass(e.CSSCLASS_SELECTED);a.removeClass(e.CSSCLASS_HIGHLIGHT);if(a.length>0&&a[0].children.length>0){a[0].children[0].style.visibility="hidden"}if(!s){a.addClass(e.CSSCLASS_HIGHLIGHT);if(a.length>0&&a[0].children.length>0){a[0].children[0].style.visibility="visible"}}if(i){a.addClass(e.CSSCLASS_SELECTED)}};p.prototype._setLegendEntryInteractionState=function(e,t,i,s){var a=this.$().find(".sapSuiteIDCLegendSegment[data-sap-ui-idc-selection-index='"+e+"']");a.removeClass(p.SEGMENT_CSSCLASS_SELECTED);a.removeClass(p.SEGMENT_CSSCLASS_HIGHLIGHT);a.removeAttr("title");if(!i){a.addClass(p.SEGMENT_CSSCLASS_HIGHLIGHT);a.attr("title",s.getTooltip_AsString())}if(t){a.addClass(p.SEGMENT_CSSCLASS_SELECTED)}};p.prototype._switchModeInteractive=function(e){var t=this.$(),i=false;if(e<this._iAreaHeightInteractiveMinValue){i=true;if(this._bInteractiveMode){this._bInteractiveMode=false;t.addClass("sapSuiteIDCNonInteractive");if(this.getSelectionEnabled()){var s=t.find(".sapSuiteIDCLegendSegment[tabindex='0']");this._iActiveElement=t.find(".sapSuiteIDCLegendSegment").index(s);s.removeAttr("tabindex");t.attr("tabindex","0")}t.attr({role:"button","aria-multiselectable":"false","aria-disabled":!this._isChartEnabled()})}}else if(!this._bInteractiveMode){i=true;this._bInteractiveMode=true;t.removeClass("sapSuiteIDCNonInteractive");if(this.getSelectionEnabled()){t.removeAttr("tabindex");if(!this._iActiveElement||this._iActiveElement<0){this._iActiveElement=0}t.find(".sapSuiteIDCLegendSegment").eq(this._iActiveElement).attr("tabindex","0")}t.attr({role:"listbox","aria-multiselectable":"true","aria-disabled":!this._isChartEnabled()})}if(i){if(this._isChartEnabled()){t.removeAttr("title");this._addInteractionAreaTooltip()}else{t.find(".sapSuiteIDCChartSegment title, .sapSuiteIDCChartSegmentGhost title").remove();t.find(".sapSuiteIDCLegendSegment").removeAttr("title");t.attr("title",this.getTooltip_AsString())}}};p.prototype._addInteractionAreaTooltip=function(){var e,t,i,s=this.$(),a=this.getSegments();s.find(".sapSuiteIDCChartSegment, .sapSuiteIDCChartSegmentGhost").each(function(s,n){t=jQuery(n);i=parseInt(t.attr("data-sap-ui-idc-selection-index"));e=jQuery("<div></div>").text(a[i].getTooltip_AsString());t.html("<title>"+e.getEncodedText()+"</title>")});s.find(".sapSuiteIDCLegendSegment").each(function(e,s){t=jQuery(s);i=parseInt(t.attr("data-sap-ui-idc-selection-index"));t.attr("title",a[i].getTooltip_AsString())})};p.prototype._onResize=function(){var e,t,i=this.$(),s=i.find(".sapSuiteIDCLegendSegment"),a=i.find(".sapSuiteIDCChart"),n=parseInt(a.css("padding-right"))+parseInt(a.css("padding-left")),r=i.height(),o=i.width();if(this._bInteractiveMode){t=2}else{t=1}e=(r-p.LEGEND_HEIGHT_PADDING-s.length*t)/s.length;s.height(e+"px");if(o<p.CHART_WIDTH_MINVALUE||r<p.CHART_HEIGHT_MINVALUE||e<p.AREA_HEIGHT_MINVALUE){i.css("visibility","hidden");return}i.css("visibility","");if(o<p.CHART_WIDTH_HIDEDONUT_MINVALUE){i.addClass("sapSuiteIDCFullWidth");if(o<p.CHART_WIDTH_FULLWIDTH_SMALLFONT_MINVALUE){i.addClass("sapSuiteIDCFullWidthSmallFont")}else{i.removeClass("sapSuiteIDCFullWidthSmallFont")}}else{i.removeClass("sapSuiteIDCFullWidth");if(a.innerWidth()<a.innerHeight()){i.find(".sapSuiteIDCChartSVG").css("width","100%").css("height",a.innerWidth()+"px")}else{i.find(".sapSuiteIDCChartSVG").css("height","100%").css("width",a.innerHeight()-n+"px")}if(o<p.CHART_WIDTH_LEGENDPADDING_MINVALUE){i.addClass("sapSuiteIDCSmallLegendPadding")}else{i.removeClass("sapSuiteIDCSmallLegendPadding")}}if(e<this._iAreaHeightSmallFontMinValue){i.addClass("sapSuiteIDCSmallFont")}else{i.removeClass("sapSuiteIDCSmallFont")}this._handleLegendEntrySizing();this._switchModeInteractive(e)};p.prototype._handleLegendEntrySizing=function(){var e=this.$().find(".sapSuiteIDCLegend"),t=e.find(".sapSuiteIDCLegendLabel"),i=e.find(".sapSuiteIDCLegendValue"),s=0;i.each(function(){var e=jQuery(this).outerWidth(true);s=Math.max(s,e)});t.css("width","calc(100% - "+s+"px)");i.css("width",s+"px")};p.prototype._isChartEnabled=function(){return this.getSelectionEnabled()&&this._bInteractiveMode};p.prototype._isCompact=function(){return jQuery("body").hasClass("sapUiSizeCompact")||this.$().is(".sapUiSizeCompact")||this.$().closest(".sapUiSizeCompact").length>0};p.prototype._toggleSelected=function(e){var t=this.getSegments()[e],i=!t.getSelected(),s=this.$("interactionArea-"+e),a=this.$().find("."+p.CHART_SEGMENT.CSSCLASS+"[data-sap-ui-idc-selection-index='"+e+"']"),n=this.$().find("."+p.CHART_SEGMENT_GHOST.CSSCLASS+"[data-sap-ui-idc-selection-index='"+e+"']");t.setProperty("selected",i,true);s.attr("aria-selected",t.getSelected());if(i){s.addClass(p.SEGMENT_CSSCLASS_SELECTED);a.addClass(p.CHART_SEGMENT.CSSCLASS_SELECTED);n.addClass(p.CHART_SEGMENT_GHOST.CSSCLASS_SELECTED)}else{s.removeClass(p.SEGMENT_CSSCLASS_SELECTED);a.removeClass(p.CHART_SEGMENT.CSSCLASS_SELECTED);n.removeClass(p.CHART_SEGMENT_GHOST.CSSCLASS_SELECTED)}this.fireSelectionChanged({selectedSegments:this.getSelectedSegments(),segment:t,selected:i})};p.prototype._switchTabindex=function(e,t,i){if(e!==t&&e>=0&&e<i.length&&t>=0&&t<i.length){i.eq(e).removeAttr("tabindex");i.eq(t).attr("tabindex","0");i.eq(t).trigger("focus")}};p.prototype._adjustToParent=function(e){var t=this.data("_parentRenderingContext");if(t&&t instanceof n){var i=t.$();var s=parseFloat(i.innerWidth());var a=parseFloat(i.innerHeight());e.outerWidth(s);e.outerHeight(a)}};p.prototype._setResponsivenessData=function(){if(this._bCompact){this._iAreaHeightInteractiveMinValue=p.AREA_HEIGHT_INTERACTIVE_MINVALUE_COMPACT;this._iAreaHeightSmallFontMinValue=p.AREA_HEIGHT_SMALLFONT_COMPACT}else{this._iAreaHeightInteractiveMinValue=p.AREA_HEIGHT_INTERACTIVE_MINVALUE;this._iAreaHeightSmallFontMinValue=p.AREA_HEIGHT_SMALLFONT}};p.prototype._handleThemeApplied=function(){this._bThemeApplied=true;this._bCompact=this._isCompact()};p.prototype._deregisterResizeHandler=function(){if(this._sResizeHandlerId){s.deregister(this._sResizeHandlerId);this._sResizeHandlerId=null}};p.prototype._createTooltipText=function(){var e=true,t,i="",s=this.getSegments();for(var a=0;a<this._iVisibleSegments;a++){if(!s[a]){break}t=s[a]._getSegmentTooltip();if(t){i+=(e?"":"\n")+t;e=false}}return i};return p});
//# sourceMappingURL=InteractiveDonutChart.js.map