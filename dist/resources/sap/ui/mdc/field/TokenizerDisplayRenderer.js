/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/m/TokenizerRenderer","sap/m/library","sap/ui/core/Core"],function(e,t,n,r){"use strict";const a=n.EmptyIndicatorMode;const o=r.getLibraryResourceBundle("sap.m");const s=e.extend(t);s.apiVersion=2;s._renderIndicator=function(e,n){t._renderIndicator.apply(this,arguments);if(n.getEmptyIndicatorMode()!==a.Off&&n.getTokens().length==0){this._renderEmptyIndicator(e,n)}};s._renderIndicatorTabIndex=function(e,t){e.attr("tabindex","0")};s._renderEmptyIndicator=function(e,t){e.openStart("span");e.class("sapMEmptyIndicator");if(t.getEmptyIndicatorMode()===a.Auto){e.class("sapMEmptyIndicatorAuto")}e.openEnd();e.openStart("span");e.attr("aria-hidden",true);e.openEnd();e.text(o.getText("EMPTY_INDICATOR"));e.close("span");e.openStart("span");e.class("sapUiPseudoInvisibleText");e.openEnd();e.text(o.getText("EMPTY_INDICATOR_TEXT"));e.close("span");e.close("span")};return s});
//# sourceMappingURL=TokenizerDisplayRenderer.js.map