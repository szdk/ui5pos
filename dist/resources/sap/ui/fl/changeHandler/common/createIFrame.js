/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/util/IFrame"],function(){"use strict";return function(e,t,a,i){var n=t.modifier;var r=e.getContent();var o=t.view;var s=t.appComponent;var u={_settings:{}};["url","width","height"].forEach(function(e){var t=r[e];u[e]=t;u._settings[e]=t});u.useLegacyNavigation=!!r.useLegacyNavigation;u._settings.useLegacyNavigation=!!r.useLegacyNavigation;if(i){u.renameInfo=i;u.asContainer=true}return Promise.resolve().then(function(){return n.createControl("sap.ui.fl.util.IFrame",s,o,a,u,false)})}});
//# sourceMappingURL=createIFrame.js.map