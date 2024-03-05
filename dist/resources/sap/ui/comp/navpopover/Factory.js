/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library"],function(e){"use strict";var i={getUShellContainer:function(){return sap.ui.require("sap/ushell/Container")},getService:function(e,i){const r=this.getUShellContainer();if(!r){return i?Promise.resolve(null):null}switch(e){case"CrossApplicationNavigation":return i?r.getServiceAsync("CrossApplicationNavigation"):r.getService("CrossApplicationNavigation");case"URLParsing":return i?r.getServiceAsync("URLParsing"):r.getService("URLParsing");default:return i?Promise.resolve(null):null}}};return i},true);
//# sourceMappingURL=Factory.js.map