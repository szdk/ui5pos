/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/Core","sap/m/library","sap/ui/base/ManagedObjectObserver","sap/ui/core/ResizeHandler","sap/ui/core/Configuration","sap/ui/core/InvisibleText","sap/ui/core/delegate/ScrollEnablement","sap/ui/Device","sap/ui/base/ManagedObject","sap/ui/dom/getScrollbarSize","sap/f/DynamicPageTitle","sap/f/DynamicPageHeader","./DynamicPageRenderer","sap/base/Log","sap/ui/dom/units/Rem","sap/ui/core/library"],function(e,t,i,r,a,n,s,o,l,d,h,p,_,g,u,c,f,H){"use strict";var S=r.PageBackgroundDesign;var y=t.extend("sap.f.DynamicPage",{metadata:{library:"sap.f",properties:{preserveHeaderStateOnScroll:{type:"boolean",group:"Behavior",defaultValue:false},headerExpanded:{type:"boolean",group:"Behavior",defaultValue:true},headerPinned:{type:"boolean",group:"Behavior",defaultValue:false},toggleHeaderOnTitleClick:{type:"boolean",group:"Behavior",defaultValue:true},showFooter:{type:"boolean",group:"Behavior",defaultValue:false},backgroundDesign:{type:"sap.m.PageBackgroundDesign",group:"Appearance",defaultValue:S.Standard},fitContent:{type:"boolean",group:"Behavior",defaultValue:false}},associations:{stickySubheaderProvider:{type:"sap.f.IDynamicPageStickyContent",multiple:false}},aggregations:{title:{type:"sap.f.DynamicPageTitle",multiple:false},header:{type:"sap.f.DynamicPageHeader",multiple:false},content:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.m.IBar",multiple:false},landmarkInfo:{type:"sap.f.DynamicPageAccessibleLandmarkInfo",multiple:false}},events:{pinnedStateChange:{parameters:{pinned:{type:"boolean"}}}},dnd:{draggable:false,droppable:true},designtime:"sap/f/designtime/DynamicPage.designtime"},renderer:u});function A(e){if(arguments.length===1){return e&&"length"in e?e.length>0:!!e}return Array.prototype.slice.call(arguments).every(function(e){return A(e)})}function T(e){var t;if(!e){return false}t=e.getBoundingClientRect();return!!(t.width&&t.height)}var E=H.AccessibleLandmarkRole;y.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE=.6;y.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE=.6;y.HEADER_MAX_ALLOWED_NON_SROLLABLE_ON_MOBILE=.3;y.BREAK_POINTS={DESKTOP:1439,TABLET:1024,PHONE:600};y.EVENTS={TITLE_PRESS:"_titlePress",TITLE_MOUSE_OVER:"_titleMouseOver",TITLE_MOUSE_OUT:"_titleMouseOut",PIN_UNPIN_PRESS:"_pinUnpinPress",VISUAL_INDICATOR_MOUSE_OVER:"_visualIndicatorMouseOver",VISUAL_INDICATOR_MOUSE_OUT:"_visualIndicatorMouseOut",HEADER_VISUAL_INDICATOR_PRESS:"_headerVisualIndicatorPress",TITLE_VISUAL_INDICATOR_PRESS:"_titleVisualIndicatorPress"};y.MEDIA={PHONE:"sapFDynamicPage-Std-Phone",TABLET:"sapFDynamicPage-Std-Tablet",DESKTOP:"sapFDynamicPage-Std-Desktop",DESKTOP_XL:"sapFDynamicPage-Std-Desktop-XL"};y.RESIZE_HANDLER_ID={PAGE:"_sResizeHandlerId",TITLE:"_sTitleResizeHandlerId",HEADER:"_sHeaderResizeHandlerId",CONTENT:"_sContentResizeHandlerId"};y.DIV="div";y.HEADER="header";y.FOOTER="footer";y.HEADER_CONTENT_PADDING_BOTTOM=f.toPx("1rem");y.SHOW_FOOTER_CLASS_NAME="sapFDynamicPageActualFooterControlShow";y.HIDE_FOOTER_CLASS_NAME="sapFDynamicPageActualFooterControlHide";y.NAVIGATION_CLASS_NAME="sapFDynamicPageNavigation";y.ARIA_ROLE_DESCRIPTION="DYNAMIC_PAGE_ROLE_DESCRIPTION";y.ARIA_LABEL_TOOLBAR_FOOTER_ACTIONS="ARIA_LABEL_TOOLBAR_FOOTER_ACTIONS";y.prototype.init=function(){this._bPinned=false;this._bHeaderInTitleArea=false;this._bExpandingWithAClick=false;this._bSuppressToggleHeaderOnce=false;this._headerBiggerThanAllowedHeight=false;this._oStickySubheader=null;this._bStickySubheaderInTitleArea=false;this._oScrollHelper=new l(this,this.getId()+"-content",{horizontal:false,vertical:true});this._oStickyHeaderObserver=null;this._oHeaderObserver=null;this._oTitleObserver=null;this._oSubHeaderAfterRenderingDelegate={onAfterRendering:function(){this._bStickySubheaderInTitleArea=false;this._cacheDomElements();this._adjustStickyContent()}};this._setAriaRoleDescription(i.getLibraryResourceBundle("sap.f").getText(y.ARIA_ROLE_DESCRIPTION))};y.prototype.onBeforeRendering=function(){if(!this._preserveHeaderStateOnScroll()){this._attachPinPressHandler()}this._attachTitlePressHandler();this._attachVisualIndicatorsPressHandlers();if(d.system.desktop){this._attachVisualIndicatorMouseOverHandlers();this._attachTitleMouseOverHandlers()}this._attachHeaderObserver();this._attachTitleObserver();this._addStickySubheaderAfterRenderingDelegate();this._detachScrollHandler();this._detachResizeHandlers();this._toggleAdditionalNavigationClass();this._setFooterAriaLabelledBy()};y.prototype.onAfterRendering=function(){var e,t;if(this.getPreserveHeaderStateOnScroll()){setTimeout(this._overridePreserveHeaderStateOnScroll.bind(this),0)}this._cacheDomElements();this._attachResizeHandlers();this._updateMedia(this._getWidth(this));this._attachScrollHandler();this._updateTitlePositioning();this._attachPageChildrenAfterRenderingDelegates();this._updatePinButtonState();this._hidePinButtonIfNotApplicable();if(!this.getHeaderExpanded()){this._snapHeader(false);e=this.getHeader()&&!this.getPreserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();if(e){t=this.$wrapper.scrollTop();this._setScrollPosition(t?t:this._getSnappingHeight())}else{this._toggleHeaderVisibility(false);this._moveHeaderToTitleArea()}}this._updateToggleHeaderVisualIndicators();this._updateTitleVisualState()};y.prototype.exit=function(){this._detachResizeHandlers();if(this._oScrollHelper){this._oScrollHelper.destroy()}if(this._oStickyHeaderObserver){this._oStickyHeaderObserver.disconnect()}if(this._oHeaderObserver){this._oHeaderObserver.disconnect()}if(this._oTitleObserver){this._oTitleObserver.disconnect()}if(this._oStickySubheader){this._oStickySubheader.removeEventDelegate(this._oSubHeaderAfterRenderingDelegate)}this._destroyInvisibleText()};y.prototype.setShowFooter=function(e){var t=this.setProperty("showFooter",e);this._toggleFooter(e);return t};y.prototype.setHeader=function(e){var t=this.getHeader();if(e===t){return this}this._detachHeaderEventListeners();return this.setAggregation("header",e)};y.prototype.destroyHeader=function(){this._detachHeaderEventListeners();return this.destroyAggregation("header")};y.prototype.destroyFooter=function(){this._destroyInvisibleText();return this.destroyAggregation("footer")};y.prototype._detachHeaderEventListeners=function(){var e=this.getHeader();if(e){if(this._oStickyHeaderObserver){this._oStickyHeaderObserver.disconnect()}if(this._oHeaderObserver){this._oHeaderObserver.disconnect()}this._deRegisterResizeHandler(y.RESIZE_HANDLER_ID.HEADER);e.detachEvent(y.EVENTS.PIN_UNPIN_PRESS,this._onPinUnpinButtonPress);this._bAlreadyAttachedPinPressHandler=false;e.detachEvent(y.EVENTS.HEADER_VISUAL_INDICATOR_PRESS,this._onCollapseHeaderVisualIndicatorPress);this._bAlreadyAttachedHeaderIndicatorPressHandler=false;e.detachEvent(y.EVENTS.VISUAL_INDICATOR_MOUSE_OVER,this._onVisualIndicatorMouseOver);e.detachEvent(y.EVENTS.VISUAL_INDICATOR_MOUSE_OUT,this._onVisualIndicatorMouseOut);this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler=false;this._bAlreadyAttachedStickyHeaderObserver=false;this._bAlreadyAttachedHeaderObserver=false}};y.prototype.setStickySubheaderProvider=function(e){var t,r=this.getStickySubheaderProvider();if(e===r){return this}t=i.byId(r);if(this._oStickySubheader&&t){t._returnStickyContent();t._setStickySubheaderSticked(false);this._oStickySubheader.removeEventDelegate(this._oSubHeaderAfterRenderingDelegate);this._bAlreadyAddedStickySubheaderAfterRenderingDelegate=false;this._oStickySubheader=null}this.setAssociation("stickySubheaderProvider",e);return this};y.prototype.setHeaderExpanded=function(e){e=this.validateProperty("headerExpanded",e);if(this._bPinned){return this}if(this.getHeaderExpanded()===e){return this}if(this.getDomRef()){this._titleExpandCollapseWhenAllowed()}this.setProperty("headerExpanded",e,true);this._updatePinButtonState();return this};y.prototype.setToggleHeaderOnTitleClick=function(e){var t=this.getHeaderExpanded(),i=this.setProperty("toggleHeaderOnTitleClick",e,true);e=this.getProperty("toggleHeaderOnTitleClick");this._updateTitleVisualState();this._updateToggleHeaderVisualIndicators();this._updateARIAStates(t);return i};y.prototype.setFitContent=function(e){var t=this.setProperty("fitContent",e,true);if(A(this.$())){this._updateFitContainer()}return t};y.prototype.getScrollDelegate=function(){return this._oScrollHelper};y.prototype._overridePreserveHeaderStateOnScroll=function(){if(this.$().width()===0||this.$().height()===0){return}var e=this._headerBiggerThanAllowedHeight,t;this._headerBiggerThanAllowedHeight=this._headerBiggerThanAllowedToBeFixed();t=e!==this._headerBiggerThanAllowedHeight;if(!this._headerBiggerThanAllowedHeight||!t){return}if(this.getHeaderExpanded()){this._moveHeaderToContentArea()}else{this._adjustSnap()}this._updateTitlePositioning()};y.prototype._toggleFooter=function(e){var t=this.getFooter(),r,a;if(!A(this.$())||!A(t)||!A(this.$footerWrapper)){return}a=i.getConfiguration().getAnimationMode();r=a!==s.AnimationMode.none&&a!==s.AnimationMode.minimal;if(A(this.$contentFitContainer)){this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainerFooterVisible",e)}this.$().toggleClass("sapFDynamicPageFooterVisible",e);if(r){this._toggleFooterAnimation(e,t)}else{this.$footerWrapper.toggleClass("sapUiHidden",!e)}this._updateTitlePositioning()};y.prototype._toggleFooterAnimation=function(e,t){this.$footerWrapper.on("webkitAnimationEnd animationend",this._onToggleFooterAnimationEnd.bind(this,t));if(e){this.$footerWrapper.removeClass("sapUiHidden")}t.toggleStyleClass(y.SHOW_FOOTER_CLASS_NAME,e);t.toggleStyleClass(y.HIDE_FOOTER_CLASS_NAME,!e)};y.prototype._onToggleFooterAnimationEnd=function(e){this.$footerWrapper.off("webkitAnimationEnd animationend");if(e.hasStyleClass(y.HIDE_FOOTER_CLASS_NAME)){this.$footerWrapper.addClass("sapUiHidden");e.removeStyleClass(y.HIDE_FOOTER_CLASS_NAME)}else{e.removeStyleClass(y.SHOW_FOOTER_CLASS_NAME)}};y.prototype._toggleHeaderInTabChain=function(e){var t=this.getTitle(),i=this.getHeader();if(!A(t)||!A(i)){return}i.$().css("visibility",e?"visible":"hidden");i.$().css("height",e?"":this._getHeaderHeight()+"px");i.$().css("overflow",e?"":"hidden")};y.prototype._snapHeader=function(e,t){var i=this.getTitle();if(this._bPinned&&!t){c.debug("DynamicPage :: aborted snapping, header is pinned",this);return}c.debug("DynamicPage :: snapped header",this);if(this._bPinned&&t){this._unPin(t);this._togglePinButtonPressedState(false)}if(A(i)){i._toggleState(false,t);if(e&&this._bHeaderInTitleArea){this._moveHeaderToContentArea(true)}}if(!A(this.$titleArea)){c.warning("DynamicPage :: couldn't snap header. There's no title.",this);return}this.setProperty("headerExpanded",false,true);this._adjustStickyContent();if(this._hasVisibleTitleAndHeader()){this.$titleArea.addClass(d.system.phone&&i.getSnappedTitleOnMobile()?"sapFDynamicPageTitleSnappedTitleOnMobile":"sapFDynamicPageTitleSnapped");this._updateToggleHeaderVisualIndicators();this._togglePinButtonVisibility(false);this._updateTitlePositioning()}this._toggleHeaderInTabChain(false);this._updateARIAStates(false);this._toggleHeaderBackground(true)};y.prototype._expandHeader=function(e,t){var i=this.getTitle();c.debug("DynamicPage :: expand header",this);if(A(i)){i._toggleState(true,t);if(e){this._moveHeaderToTitleArea(true)}}if(!A(this.$titleArea)){c.warning("DynamicPage :: couldn't expand header. There's no title.",this);return}this.setProperty("headerExpanded",true,true);this._adjustStickyContent();if(this._hasVisibleTitleAndHeader()){this.$titleArea.removeClass(d.system.phone&&i.getSnappedTitleOnMobile()?"sapFDynamicPageTitleSnappedTitleOnMobile":"sapFDynamicPageTitleSnapped");this._updateToggleHeaderVisualIndicators();if(!this.getPreserveHeaderStateOnScroll()&&!this._headerBiggerThanAllowedToPin()){this._togglePinButtonVisibility(true)}this._updateTitlePositioning()}this._toggleHeaderInTabChain(true);this._updateARIAStates(true);this._toggleHeaderBackground(false)};y.prototype._toggleHeaderVisibility=function(e,t){var i=this.getHeaderExpanded(),r=this.getTitle(),a=this.getHeader();if(this._bPinned&&!t){c.debug("DynamicPage :: header toggle aborted, header is pinned",this);return}if(A(r)){r._toggleState(i)}if(A(a)){a.$().toggleClass("sapFDynamicPageHeaderHidden",!e);this._updateTitlePositioning()}};y.prototype._toggleHeaderBackground=function(e){this.$headerInContentWrapper.toggleClass("sapFDynamicPageHeaderSolid",e)};y.prototype._moveHeaderToContentArea=function(e){var t=this.getHeader();if(A(t)){t.$().prependTo(this.$headerInContentWrapper);this._bHeaderInTitleArea=false;if(e){this._offsetContentOnMoveHeader()}this.fireEvent("_moveHeader")}};y.prototype._moveHeaderToTitleArea=function(e){var t=this.getHeader();if(A(t)){t.$().prependTo(this.$stickyPlaceholder);this._bHeaderInTitleArea=true;if(e){this._offsetContentOnMoveHeader()}this.fireEvent("_moveHeader")}};y.prototype._offsetContentOnMoveHeader=function(){var e=Math.ceil(this._getHeaderHeight()),t=this.$wrapper.scrollTop(),i;if(!e){return}i=this._bHeaderInTitleArea?t-e:t+e;i=Math.max(i,0);this._setScrollPosition(i,true)};y.prototype._isHeaderPinnable=function(){var e=this.getHeader();return e&&e.getPinnable()&&this.getHeaderExpanded()&&!this.getPreserveHeaderStateOnScroll()};y.prototype._updatePinButtonState=function(){var e=this.getHeaderPinned()&&this._isHeaderPinnable();this._togglePinButtonPressedState(e);if(e){this._pin()}else{this._unPin()}};y.prototype._pin=function(e){if(this._bPinned){return}this._bPinned=true;if(e){this.setProperty("headerPinned",true,true);this.fireEvent("pinnedStateChange",{pinned:true})}if(!this._bHeaderInTitleArea){this._moveHeaderToTitleArea(true);this._updateTitlePositioning()}this._updateToggleHeaderVisualIndicators();this.addStyleClass("sapFDynamicPageHeaderPinned")};y.prototype._unPin=function(e){if(!this._bPinned){return}this._bPinned=false;if(e){this.setProperty("headerPinned",false,true);this.fireEvent("pinnedStateChange",{pinned:false})}this._updateToggleHeaderVisualIndicators();this.removeStyleClass("sapFDynamicPageHeaderPinned")};y.prototype._togglePinButtonVisibility=function(e){var t=this.getHeader();if(A(t)){t._setShowPinBtn(e)}};y.prototype._togglePinButtonPressedState=function(e){var t=this.getHeader();if(A(t)){t._togglePinButton(e)}};y.prototype._hidePinButtonIfNotApplicable=function(){if(this._preserveHeaderStateOnScroll()){this._togglePinButtonVisibility(false)}};y.prototype._isHeaderPinnable=function(){var e=this.getHeader();return e&&e.getPinnable()&&this.getHeaderExpanded()&&!this.getPreserveHeaderStateOnScroll()};y.prototype._restorePinButtonFocus=function(){this.getHeader()._focusPinButton()};y.prototype._getScrollPosition=function(){return A(this.$wrapper)?Math.ceil(this.$wrapper.scrollTop()):0};y.prototype._setAriaRoleDescription=function(e){this._sAriaRoleDescription=e;return this};y.prototype._getAriaRoleDescription=function(){return this._sAriaRoleDescription};y.prototype._setScrollPosition=function(e,t){if(!A(this.$wrapper)){return}if(this._getScrollPosition()===e){return}if(t){this._bSuppressToggleHeaderOnce=true}if(!this.getScrollDelegate()._$Container){this.getScrollDelegate()._$Container=this.$wrapper}this.getScrollDelegate().scrollTo(0,e)};y.prototype._shouldSnapOnScroll=function(){return!this._preserveHeaderStateOnScroll()&&this._getScrollPosition()>=this._getSnappingHeight()&&this.getHeaderExpanded()&&!this._bPinned};y.prototype._shouldExpandOnScroll=function(){var e=this._needsVerticalScrollBar(),t=this._getScrollPosition(),i=t===0||t<this._getSnappingHeight();return!this._preserveHeaderStateOnScroll()&&i&&!this.getHeaderExpanded()&&!this._bPinned&&e};y.prototype._shouldStickStickyContent=function(){return!this.getHeaderExpanded()||this._preserveHeaderStateOnScroll()||this._bHeaderInTitleArea};y.prototype._headerScrolledOut=function(){return this._getScrollPosition()>=this._getSnappingHeight()};y.prototype._headerSnapAllowed=function(){return!this._preserveHeaderStateOnScroll()&&this.getHeaderExpanded()&&!this._bPinned};y.prototype._canSnapHeaderOnScroll=function(){return this._getMaxScrollPosition()>this._getSnappingHeight()};y.prototype._getSnappingHeight=function(){var e=this.getTitle(),t=e&&e.$expandWrapper,i=e&&e.$snappedWrapper,r=e&&e.$expandHeadingWrapper,a=e&&e.$snappedHeadingWrapper,n=t&&t.length?t.height():0,s=a&&a.length?a.height():0,o=r&&r.length?r.height():0,l=i&&i.length?i.height():0,d=Math.ceil(this._getHeaderHeight()||n+l+s+o)-y.HEADER_CONTENT_PADDING_BOTTOM;return d>0?d:0};y.prototype._getMaxScrollPosition=function(){var e,t;if(A(this.$wrapper)){e=this.$wrapper[0];t=Math.max(e.clientHeight,Math.ceil(e.getBoundingClientRect().height));return e.scrollHeight-t}return 0};y.prototype._needsVerticalScrollBar=function(){return Math.floor(this._getMaxScrollPosition())>1};y.prototype._getOwnHeight=function(){return this._getHeight(this)};y.prototype._getEntireHeaderHeight=function(){var e=0,t=0,i=this.getTitle(),r=this.getHeader();if(A(i)){e=i.$().outerHeight()}if(A(r)){t=r.$().outerHeight()}return e+t};y.prototype._headerBiggerThanAllowedToPin=function(e){if(!(typeof e==="number"&&!isNaN(parseInt(e)))){e=this._getOwnHeight()}return this._getEntireHeaderHeight()>y.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE*e};y.prototype._headerBiggerThanAllowedToBeFixed=function(){var e=this._getOwnHeight();return this._getEntireHeaderHeight()>y.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE*e};y.prototype._headerBiggerThanAllowedToBeExpandedInTitleArea=function(){var e=this._getEntireHeaderHeight(),t=this._getOwnHeight();if(t===0){return false}return d.system.phone?e>=y.HEADER_MAX_ALLOWED_NON_SROLLABLE_ON_MOBILE*t:e>=t};y.prototype._updateTitlePositioning=function(){if(!A(this.$wrapper)||!A(this.$titleArea)||this._getHeight(this)===0){return}var e=this._needsVerticalScrollBar(),t=this.$wrapper.get(0),r=this.$titleArea.get(0).getBoundingClientRect().height,a=this._getTitleAreaWidth(),n=p().width,s;t.style.paddingTop=r+"px";t.style.scrollPaddingTop=r+"px";this._oScrollHelper.setScrollPaddingTop(r);s="polygon(0px "+Math.floor(r)+"px, "+a+"px "+Math.floor(r)+"px, "+a+"px 0, 100% 0, 100% 100%, 0 100%)";if(i.getConfiguration().getRTL()){s="polygon(0px 0px, "+n+"px 0px, "+n+"px "+r+"px, 100% "+r+"px, 100% 100%, 0 100%)"}t.style.clipPath=s;this.toggleStyleClass("sapFDynamicPageWithScroll",e);setTimeout(this._updateFitContainer.bind(this),0)};y.prototype._updateFitContainer=function(e){var t=typeof e!=="undefined"?!e:!this._needsVerticalScrollBar();this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainer",t)};y.prototype._updateHeaderARIAState=function(e){var t=this.getHeader();if(A(t)){t._updateARIAState(e)}};y.prototype._updateTitleARIAState=function(e){var t=this.getTitle();if(A(t)){t._updateARIAState(e)}};y.prototype._updateARIAStates=function(e){this._updateHeaderARIAState(e);this._updateTitleARIAState(e)};y.prototype._applyContextualSettings=function(e){var t=e.contextualWidth;this._updateMedia(t);return h.prototype._applyContextualSettings.call(this,e)};y.prototype._updateMedia=function(e){if(!e){return}if(e<=y.BREAK_POINTS.PHONE){this._updateMediaStyle(y.MEDIA.PHONE)}else if(e<=y.BREAK_POINTS.TABLET){this._updateMediaStyle(y.MEDIA.TABLET)}else if(e<=y.BREAK_POINTS.DESKTOP){this._updateMediaStyle(y.MEDIA.DESKTOP)}else{this._updateMediaStyle(y.MEDIA.DESKTOP_XL)}};y.prototype._updateMediaStyle=function(e){Object.keys(y.MEDIA).forEach(function(t){var i=e===y.MEDIA[t];this.toggleStyleClass(y.MEDIA[t],i)},this)};y.prototype._toggleExpandVisualIndicator=function(e){var t=this.getTitle();if(A(t)){t._toggleExpandButton(e)}};y.prototype._focusExpandVisualIndicator=function(){var e=this.getTitle();if(A(e)){e._focusExpandButton()}};y.prototype._toggleCollapseVisualIndicator=function(e){var t=this.getHeader();if(A(t)){t._toggleCollapseButton(e)}};y.prototype._focusCollapseVisualIndicator=function(){var e=this.getHeader();if(A(e)){e._focusCollapseButton()}};y.prototype._updateToggleHeaderVisualIndicators=function(){var e,t,i,r=this._hasVisibleTitleAndHeader(),a=this.getHeader(),n=false;if(A(a)){n=!!a.getContent().length}if(!this.getToggleHeaderOnTitleClick()||!r){t=false;i=false}else{e=this.getHeaderExpanded();t=e;i=d.system.phone&&this.getTitle().getAggregation("snappedTitleOnMobile")?false:!e}i=i&&n;t=t&&n;this._toggleCollapseVisualIndicator(t);this._toggleExpandVisualIndicator(i);this._updateTitleVisualState()};y.prototype._updateHeaderVisualState=function(e,t){var i=this.getHeader();if(e&&this.getPreserveHeaderStateOnScroll()){this._overridePreserveHeaderStateOnScroll()}if(!this._preserveHeaderStateOnScroll()&&i){if(this._headerBiggerThanAllowedToPin(t)||d.system.phone){this._unPin();this._togglePinButtonVisibility(false);this._togglePinButtonPressedState(false)}else{this._togglePinButtonVisibility(true);this._updatePinButtonState()}if(this.getHeaderExpanded()&&this._bHeaderInTitleArea&&this._headerBiggerThanAllowedToBeExpandedInTitleArea()){this._expandHeader(false);this._setScrollPosition(0)}}else if(this._preserveHeaderStateOnScroll()&&i){this._togglePinButtonVisibility(false)}};y.prototype._updateTitleVisualState=function(){var e=this.getTitle(),t=this._hasVisibleTitleAndHeader()&&this.getToggleHeaderOnTitleClick();this.$().toggleClass("sapFDynamicPageTitleClickEnabled",t&&!d.system.phone);if(A(e)){e._toggleFocusableState(t)}};y.prototype._scrollBellowCollapseVisualIndicator=function(){var e=this.getHeader(),t,i,r,a;if(A(e)){t=this.getHeader()._getCollapseButton().getDomRef();i=t.getBoundingClientRect().height;r=this.$wrapper[0].getBoundingClientRect().height;a=t.offsetTop+i-r+this._getTitleHeight();this._setScrollPosition(a)}};y.prototype._hasVisibleTitleAndHeader=function(){var e=this.getTitle();return A(e)&&e.getVisible()&&this._hasVisibleHeader()};y.prototype._hasVisibleHeader=function(){var e=this.getHeader();return A(e)&&e.getVisible()&&A(e.getContent())};y.prototype._getHeight=function(e){var i;if(!(e instanceof t)){return 0}i=e.getDomRef();return i?i.getBoundingClientRect().height:0};y.prototype._getWidth=function(e){return!(e instanceof t)?0:e.$().outerWidth()||0};y.prototype._getTitleAreaHeight=function(){return A(this.$titleArea)?this.$titleArea.outerHeight()||0:0};y.prototype._getTitleAreaWidth=function(){return A(this.$titleArea)?this.$titleArea.width()||0:0};y.prototype._getTitleHeight=function(){return this._getHeight(this.getTitle())};y.prototype._getHeaderHeight=function(){return this._getHeight(this.getHeader())};y.prototype._preserveHeaderStateOnScroll=function(){return this.getPreserveHeaderStateOnScroll()&&!this._headerBiggerThanAllowedHeight};y.prototype._cacheDomElements=function(){var e=this.getFooter();if(A(e)){this.$footer=e.$();this.$footerWrapper=this.$("footerWrapper")}this.$wrapper=this.$("contentWrapper");this.$headerInContentWrapper=this.$("headerWrapper");this.$contentFitContainer=this.$("contentFitContainer");this.$titleArea=this.$("header");this.$stickyPlaceholder=this.$("stickyPlaceholder");this._cacheTitleDom();this._cacheHeaderDom()};y.prototype._cacheTitleDom=function(){var e=this.getTitle();if(A(e)){this.$title=e.$()}};y.prototype._cacheHeaderDom=function(){var e=this.getHeader();if(A(e)){this.$header=e.$()}};y.prototype._adjustSnap=function(){var e,t,i,r,a,n,s=this.$();if(!A(s)){return}if(!T(s[0])){return}e=this.getHeader();t=!this.getHeaderExpanded();if(!e||!t){return}i=!this._preserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();r=t&&e.$().hasClass("sapFDynamicPageHeaderHidden");if(i&&r){this._toggleHeaderVisibility(true);this._moveHeaderToContentArea(true);return}if(!i&&!r){this._moveHeaderToTitleArea(true);this._toggleHeaderVisibility(false);return}if(i){a=this._getScrollPosition();n=this._getSnappingHeight();if(a<n){this._setScrollPosition(n)}}};y.prototype.ontouchmove=function(e){e.setMarked()};y.prototype._onChildControlAfterRendering=function(e){var t=e.srcControl;if(t instanceof _){this._cacheTitleDom();this._deRegisterResizeHandler(y.RESIZE_HANDLER_ID.TITLE);this._registerResizeHandler(y.RESIZE_HANDLER_ID.TITLE,this.$title[0],this._onChildControlsHeightChange.bind(this))}else if(t instanceof g&&t.getDomRef()!==this.$header.get(0)){this._cacheHeaderDom();this._deRegisterResizeHandler(y.RESIZE_HANDLER_ID.HEADER);this._registerResizeHandler(y.RESIZE_HANDLER_ID.HEADER,this.$header[0],this._onChildControlsHeightChange.bind(this))}setTimeout(this._updateTitlePositioning.bind(this),0)};y.prototype._onChildControlsHeightChange=function(e){var t=this._needsVerticalScrollBar(),i=this.getHeader(),r,a;if(t){this._updateFitContainer(t)}this._adjustSnap();if(!this._bExpandingWithAClick){this._updateTitlePositioning()}this._bExpandingWithAClick=false;if(i&&e.target.id===i.getId()){r=e.size.height;a=e.oldSize.height;this._updateHeaderVisualState(r!==a);this._adaptScrollPositionOnHeaderChange(r,a)}};y.prototype._onResize=function(e){var t=this.getTitle(),i=e.size.width,r=e.size.height,a=r!==e.oldSize.height;this._updateHeaderVisualState(a,r);if(A(t)){t._onResize(i)}this._adjustSnap();this._updateTitlePositioning();this._updateMedia(i)};y.prototype._toggleHeaderOnScroll=function(){if(this._bSuppressToggleHeaderOnce){this._bSuppressToggleHeaderOnce=false;return}if(d.system.desktop&&this._bExpandingWithAClick){return}if(this._preserveHeaderStateOnScroll()){return}if(this._shouldSnapOnScroll()){this._snapHeader(true,true)}else if(this._shouldExpandOnScroll()){this._expandHeader(false,true);this._toggleHeaderVisibility(true)}else if(!this._bPinned&&this._bHeaderInTitleArea){var e=this._getScrollPosition()>=this._getSnappingHeight();this._moveHeaderToContentArea(e);this._adjustStickyContent();this._updateTitlePositioning()}};y.prototype._adjustStickyContent=function(){if(!this._oStickySubheader){return}var e,t=this._shouldStickStickyContent(),r,a=this.getStickySubheaderProvider();if(t===this._bStickySubheaderInTitleArea){return}r=i.byId(a);if(!A(r)){return}e=document.activeElement;r._setStickySubheaderSticked(t);if(t){this._oStickySubheader.$().appendTo(this.$stickyPlaceholder)}else{r._returnStickyContent()}e.focus();this._bStickySubheaderInTitleArea=t};y.prototype._adaptScrollPositionOnHeaderChange=function(e,t){var i=e-t,r=this.getHeader();if(i&&(!this.getHeaderExpanded()&&r.$().css("visibility")!=="hidden")&&!this._bHeaderInTitleArea&&this._needsVerticalScrollBar()){this._setScrollPosition(this._getScrollPosition()+i)}};y.prototype._onTitlePress=function(){if(this.getToggleHeaderOnTitleClick()&&this._hasVisibleTitleAndHeader()){this._titleExpandCollapseWhenAllowed(true);this.getTitle()._focus()}};y.prototype._onExpandHeaderVisualIndicatorPress=function(){this._onTitlePress();if(this._headerBiggerThanAllowedToBeExpandedInTitleArea()){this._scrollBellowCollapseVisualIndicator()}this._focusCollapseVisualIndicator()};y.prototype._onCollapseHeaderVisualIndicatorPress=function(){this._onTitlePress();this._focusExpandVisualIndicator()};y.prototype._onVisualIndicatorMouseOver=function(){var e=this.$();if(A(e)){e.addClass("sapFDynamicPageTitleForceHovered")}};y.prototype._onVisualIndicatorMouseOut=function(){var e=this.$();if(A(e)){e.removeClass("sapFDynamicPageTitleForceHovered")}};y.prototype._onTitleMouseOver=y.prototype._onVisualIndicatorMouseOver;y.prototype._onTitleMouseOut=y.prototype._onVisualIndicatorMouseOut;y.prototype._titleExpandCollapseWhenAllowed=function(e){var t,i;if(this._bPinned&&!e){return this}if(this._preserveHeaderStateOnScroll()||!this._canSnapHeaderOnScroll()||!this.getHeader()){if(!this.getHeaderExpanded()){this._expandHeader(false,e);this._toggleHeaderVisibility(true,e)}else{this._snapHeader(false,e);this._toggleHeaderVisibility(false,e)}}else if(!this.getHeaderExpanded()){t=!this._headerBiggerThanAllowedToBeExpandedInTitleArea();this._bExpandingWithAClick=true;this._expandHeader(t,e);this.getHeader().$().removeClass("sapFDynamicPageHeaderHidden");if(!t){this._setScrollPosition(0)}this._bExpandingWithAClick=false}else{var r=this._bHeaderInTitleArea;this._snapHeader(r,e);if(!r){i=this._getSnappingHeight();this._setScrollPosition(i?i+y.HEADER_CONTENT_PADDING_BOTTOM:0)}}};y.prototype._onPinUnpinButtonPress=function(){if(this._bPinned){this._unPin(true)}else{this._pin(true);this._restorePinButtonFocus()}};y.prototype._attachResizeHandlers=function(){var e=this._onChildControlsHeightChange.bind(this);this._registerResizeHandler(y.RESIZE_HANDLER_ID.PAGE,this,this._onResize.bind(this));if(A(this.$title)){this._registerResizeHandler(y.RESIZE_HANDLER_ID.TITLE,this.$title[0],e)}if(A(this.$header)){this._registerResizeHandler(y.RESIZE_HANDLER_ID.HEADER,this.$header[0],e)}if(A(this.$contentFitContainer)){this._registerResizeHandler(y.RESIZE_HANDLER_ID.CONTENT,this.$contentFitContainer[0],e)}};y.prototype._registerResizeHandler=function(e,t,i){if(!this[e]){this[e]=n.register(t,i)}};y.prototype._detachResizeHandlers=function(){this._deRegisterResizeHandler(y.RESIZE_HANDLER_ID.PAGE);this._deRegisterResizeHandler(y.RESIZE_HANDLER_ID.TITLE);this._deRegisterResizeHandler(y.RESIZE_HANDLER_ID.HEADER);this._deRegisterResizeHandler(y.RESIZE_HANDLER_ID.CONTENT)};y.prototype._deRegisterResizeHandler=function(e){if(this[e]){n.deregister(this[e]);this[e]=null}};y.prototype._attachPageChildrenAfterRenderingDelegates=function(){var e=this.getTitle(),t=this.getHeader(),i=this.getContent(),r=this._onChildControlAfterRendering.bind(this),a={onAfterRendering:r};if(A(e)){e.addEventDelegate(a)}if(A(i)){i.addEventDelegate(a)}if(A(t)){t.addEventDelegate(a)}};y.prototype._attachTitlePressHandler=function(){var e=this.getTitle();if(A(e)&&!this._bAlreadyAttachedTitlePressHandler){e.attachEvent(y.EVENTS.TITLE_PRESS,this._onTitlePress,this);this._bAlreadyAttachedTitlePressHandler=true}};y.prototype._attachPinPressHandler=function(){var e=this.getHeader();if(A(e)&&!this._bAlreadyAttachedPinPressHandler){e.attachEvent(y.EVENTS.PIN_UNPIN_PRESS,this._onPinUnpinButtonPress,this);this._bAlreadyAttachedPinPressHandler=true}};y.prototype._attachStickyHeaderObserver=function(){var e=this.getHeader();if(A(e)&&!this._bAlreadyAttachedStickyHeaderObserver){if(!this._oStickyHeaderObserver){this._oStickyHeaderObserver=new a(this._onHeaderPropertyChange.bind(this))}this._oStickyHeaderObserver.observe(e,{properties:["visible"]});this._bAlreadyAttachedStickyHeaderObserver=true}};y.prototype._onHeaderPropertyChange=function(e){var t=this.getHeader();this._adjustStickyContent();if(t&&e.name==="visible"&&e.current===false){t.invalidate();this._updateTitlePositioning()}};y.prototype._attachHeaderObserver=function(){var e=this.getHeader();if(A(e)&&!this._bAlreadyAttachedHeaderObserver){if(!this._oHeaderObserver){this._oHeaderObserver=new a(this._onHeaderFieldChange.bind(this))}this._oHeaderObserver.observe(e,{aggregations:["content"],properties:["visible","pinnable"]});this._bAlreadyAttachedHeaderObserver=true}};y.prototype._attachTitleObserver=function(){var e=this.getTitle();if(A(e)&&!this._bAlreadyAttachedTitleObserver){if(!this._oTitleObserver){this._oTitleObserver=new a(this._onTitleFieldChange.bind(this))}this._oTitleObserver.observe(e,{properties:["visible"]});this._bAlreadyAttachedTitleObserver=true}};y.prototype._onHeaderFieldChange=function(e){if(e.type==="property"&&e.name==="pinnable"){this._updatePinButtonState();return}this._updateToggleHeaderVisualIndicators()};y.prototype._onTitleFieldChange=function(e){if(e.type==="property"&&e.name==="visible"){this.invalidate();return}};y.prototype._attachVisualIndicatorsPressHandlers=function(){var e=this.getTitle(),t=this.getHeader();if(A(e)&&!this._bAlreadyAttachedTitleIndicatorPressHandler){e.attachEvent(y.EVENTS.TITLE_VISUAL_INDICATOR_PRESS,this._onExpandHeaderVisualIndicatorPress,this);this._bAlreadyAttachedTitleIndicatorPressHandler=true}if(A(t)&&!this._bAlreadyAttachedHeaderIndicatorPressHandler){t.attachEvent(y.EVENTS.HEADER_VISUAL_INDICATOR_PRESS,this._onCollapseHeaderVisualIndicatorPress,this);this._bAlreadyAttachedHeaderIndicatorPressHandler=true}};y.prototype._addStickySubheaderAfterRenderingDelegate=function(){var e,t=this.getStickySubheaderProvider(),r;e=i.byId(t);if(A(e)&&!this._bAlreadyAddedStickySubheaderAfterRenderingDelegate){r=e.getMetadata().getInterfaces().indexOf("sap.f.IDynamicPageStickyContent")!==-1;if(r){this._oStickySubheader=e._getStickyContent();this._oStickySubheader.addEventDelegate(this._oSubHeaderAfterRenderingDelegate,this);this._bAlreadyAddedStickySubheaderAfterRenderingDelegate=true;this._attachStickyHeaderObserver()}}};y.prototype._attachVisualIndicatorMouseOverHandlers=function(){var e=this.getHeader();if(A(e)&&!this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler){e.attachEvent(y.EVENTS.VISUAL_INDICATOR_MOUSE_OVER,this._onVisualIndicatorMouseOver,this);e.attachEvent(y.EVENTS.VISUAL_INDICATOR_MOUSE_OUT,this._onVisualIndicatorMouseOut,this);this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler=true}};y.prototype._attachTitleMouseOverHandlers=function(){var e=this.getTitle();if(A(e)&&!this._bAlreadyAttachedTitleMouseOverOutHandler){e.attachEvent(y.EVENTS.TITLE_MOUSE_OVER,this._onTitleMouseOver,this);e.attachEvent(y.EVENTS.TITLE_MOUSE_OUT,this._onTitleMouseOut,this);this._bAlreadyAttachedTitleMouseOverOutHandler=true}};y.prototype._attachScrollHandler=function(){this._toggleHeaderOnScrollReference=this._toggleHeaderOnScroll.bind(this);this.$wrapper.on("scroll",this._toggleHeaderOnScrollReference)};y.prototype._toggleAdditionalNavigationClass=function(){var e=this._bStickySubheaderProviderExists();this.toggleStyleClass(y.NAVIGATION_CLASS_NAME,e)};y.prototype._bStickySubheaderProviderExists=function(){var e=i.byId(this.getStickySubheaderProvider());return!!e&&e.isA("sap.f.IDynamicPageStickyContent")};y.prototype._detachScrollHandler=function(){if(this.$wrapper){this.$wrapper.off("scroll",this._toggleHeaderOnScrollReference)}};y.prototype._formatLandmarkInfo=function(e,t){if(e){var i=e["get"+t+"Role"]()||"",r=e["get"+t+"Label"]()||"";if(i===E.None){i=""}return{role:i.toLowerCase(),label:r}}return{}};y.prototype._getHeaderTag=function(e){if(e&&e.getHeaderRole()!==E.None){return y.DIV}return y.HEADER};y.prototype._getFooterTag=function(e){if(e&&e.getFooterRole()!==E.None){return y.DIV}return y.FOOTER};y.prototype._setFooterAriaLabelledBy=function(){var e=this.getFooter();if(e&&!e.getAriaLabelledBy().length){this._oInvisibleText=new o({id:e.getId()+"-FooterActions-InvisibleText",text:i.getLibraryResourceBundle("sap.f").getText(y.ARIA_LABEL_TOOLBAR_FOOTER_ACTIONS)}).toStatic();e.addAriaLabelledBy(this._oInvisibleText)}};y.prototype._destroyInvisibleText=function(){if(this._oInvisibleText){this._oInvisibleText.destroy();this._oInvisibleText=null}};return y});
//# sourceMappingURL=DynamicPage.js.map