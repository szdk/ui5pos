/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";return{getUShellContainer:function(){return sap.ui.require("sap/ushell/Container")},getService:function(e){const n=this.getUShellContainer();if(!n){return null}switch(e){case"CrossApplicationNavigation":return n.getService("CrossApplicationNavigation");case"URLParsing":return n.getService("URLParsing");default:return null}},getServiceAsync:function(e){const n=this.getUShellContainer();if(!n){return Promise.resolve(null)}switch(e){case"CrossApplicationNavigation":return n.getServiceAsync("CrossApplicationNavigation");case"URLParsing":return n.getServiceAsync("URLParsing");default:return Promise.resolve(null)}}}});
//# sourceMappingURL=Factory.js.map