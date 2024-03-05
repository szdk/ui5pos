/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function t(t,e,a){if(a!==""||a.toLowerCase()==="auto"){t.style(e,a)}}var e={apiVersion:2};e.render=function(e,a){e.openStart("iframe",a);t(e,"width",a.getWidth());t(e,"height",a.getHeight());e.style("display","block");e.style("border","none");e.attr("sandbox","allow-forms allow-popups allow-scripts allow-same-origin allow-modals");if(a.getUseLegacyNavigation()){e.attr("src",a.getUrl())}else{e.attr("src","about:blank")}var i=a.getTitle();if(i){e.attr("title",i)}e.openEnd();e.close("iframe")};return e},true);
//# sourceMappingURL=IFrameRenderer.js.map