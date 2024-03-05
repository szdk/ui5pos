/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/SyncPromise","sap/base/assert"],function(r,e){"use strict";return function n(t){e(typeof t==="string"||Array.isArray(t),"vModulePaths"+" param either must be a single string or an array of strings. - sap.ui.mdc.util.loadModules");let s;if(typeof t==="string"){s=[t]}else{s=t}const i=new Map;s.forEach(function(r){const e=sap.ui.require(r);i.set(r,e)});const a=s.filter(function(r){return i.get(r)===undefined});if(a.length===0){const e=Array.from(i.values());return r.resolve(e)}return new r(function(r,e){function n(){const e=Array.from(arguments);a.forEach(function(r,n){i.set(r,e[n])});const n=Array.from(i.values());r(n)}sap.ui.require(a,n,e)})}});
//# sourceMappingURL=loadModules.js.map