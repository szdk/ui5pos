/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./GridTableType"],function(e){"use strict";let t;const n=e.extend("sap.ui.mdc.table.TreeTableType",{metadata:{library:"sap.ui.mdc"}});n.prototype.loadModules=function(){if(t){return Promise.resolve()}return e.prototype.loadModules.apply(this,arguments).then(function(){return new Promise(function(e,n){sap.ui.require(["sap/ui/table/TreeTable"],function(n){t=n;e()},function(){n("Failed to load some modules")})})})};n.prototype.createTable=function(e){const n=this.getTable();if(!n||!t){return null}const o=new t(e,this.getTableSettings());o._oProxy._bEnableV4=true;return o};return n});
//# sourceMappingURL=TreeTableType.js.map