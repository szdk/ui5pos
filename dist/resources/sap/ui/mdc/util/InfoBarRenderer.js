/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../library"],function(e){"use strict";const r={apiVersion:2};r.render=function(e,r){e.openStart("div",r);e.attr("id",r.getId());e.openEnd();e.renderControl(r.getAggregation("_toolbar"));e.close("div")};return r},true);
//# sourceMappingURL=InfoBarRenderer.js.map