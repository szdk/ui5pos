/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";const t={apiVersion:2};t.CSS_CLASS="sapUiMdcFilterBarBase";t.render=function(e,i){e.openStart("div",i);e.class(t.CSS_CLASS);if(i.isA("sap.ui.mdc.filterbar.p13n.AdaptationFilterBar")&&i.getProperty("_useFixedWidth")){e.style("width",i.getWidth())}e.openEnd();const n=i.getAggregation("layout")?i.getAggregation("layout").getInner():null;e.renderControl(n);e.close("div")};return t},true);
//# sourceMappingURL=FilterBarBaseRenderer.js.map