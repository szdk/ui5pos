/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library"],function(e){"use strict";const r={apiVersion:2};r.CSS_CLASS="sapUiMDCChart";r.render=function(e,n){e.openStart("div",n);e.class(r.CSS_CLASS);e.style("height",n.getHeight());e.style("width",n.getWidth());e.style("min-height",n.getMinHeight());e.style("min-width",n.getMinWidth());e.openEnd();e.openStart("div");e.openEnd();this.renderToolbar(e,n.getAggregation("_toolbar"));this.renderInfoToolbar(e,n.getAggregation("_infoToolbar"));e.close("div");this.renderBreadcrumbs(e,n.getAggregation("_breadcrumbs"));this.renderInnerStructure(e,n.getAggregation("_innerChart"));e.close("div")};r.renderNoDataStruct=function(e,r){if(r){}};r.renderToolbar=function(e,r){if(r){e.openStart("div");e.openEnd();e.renderControl(r);e.close("div")}};r.renderBreadcrumbs=function(e,r){if(r){e.renderControl(r)}};r.renderInfoToolbar=function(e,r){if(r){e.renderControl(r)}};r.renderInnerStructure=function(e,r){e.renderControl(r)};return r},true);
//# sourceMappingURL=ChartRenderer.js.map