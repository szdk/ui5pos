/*!
* OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/base/util/each","sap/base/Log","sap/ui/fl/Layer","sap/ui/fl/registry/Settings","sap/ui/fl/requireAsync"],function(e,n,r,a,t){"use strict";var o={};var i={};var l={};var s={};function u(e){if(!e.changeHandler){n.error("sap.ui.fl.registry.ChangeRegistryStorage: changeHandler required");return false}return true}function f(e){if(typeof e.changeHandler==="string"){return t(e.changeHandler.replace(/\./g,"/")).then(function(n){e.changeHandler=n;return e.changeHandler})}return e.changeHandler}function c(e,n){var r={};if(!n||!n.changeHandler){r.changeHandler=n}else{r=n}if(r.changeHandler==="default"){r.changeHandler=s.defaultChangeHandlers[e]}else if(Object.keys(s.developerChangeHandlers||{}).includes(e)){throw Error(`You can't use a custom change handler for the following Developer Mode change type: ${e}. Please use 'default' instead.`)}return r}function g(n){l={};e(n,function(e,n){var r={controlType:"defaultActiveForAll",changeHandler:n,layers:a.getDeveloperModeLayerPermissions(),changeType:e};l[e]=r})}function h(n,r,t){t=c(r,t);var o=Object.assign({},a.getDefaultLayerPermissions());if(t.layers){e(t.layers,function(e,n){if(o[e]===undefined){throw Error(`The Layer '${e}' is not supported. Please only use supported layers`)}o[e]=n})}var i={controlType:n,changeHandler:t.changeHandler,layers:o,changeType:r};return u(i)?i:undefined}function d(e,n,r){var a=h(e,n,r);if(a){i[e]||={};i[e][n]=a}}function y(r,a){var o=Promise.resolve(a);var i="ChangeHandlerStorage.registerChangeHandlersForControl.skip_next_then";if(typeof a==="string"){o=t(`${a}.flexibility`).catch(function(e){n.error(`Flexibility change handler registration failed.\nControlType: ${r}\n${e.message}`);return Promise.resolve(i)})}return o.then(function(n){if(n!==i){e(n,function(e,n){d(r,e,n)})}}).catch(function(e){n.error(e.message)})}function p(e,n,a){var t=i[e]&&i[e][n]||l[n];if(!t){throw Error("No Change handler registered for the Control and Change type")}a=a===r.PUBLIC?r.USER:a;if(!t.layers[a]){throw Error(`Change type ${n} not enabled for layer ${a}`)}return t}function v(e,r,a,o){var i=o.getChangeHandlerModulePath(a);if(typeof i!=="string"){return Promise.resolve(undefined)}return t(i).then(function(n){var a=n[e];if(a){return h(r,e,a)}}).catch(function(e){n.error(`Flexibility registration for control ${o.getId(a)} failed to load module ${i}\n${e.message}`)})}o.getChangeHandler=function(e,n,r,a,t){return v(e,n,r,a).then(function(r){var a=r||p(n,e,t);return f(a)}).then(function(e){if(typeof e.completeChangeContent!=="function"||typeof e.applyChange!=="function"||typeof e.revertChange!=="function"){throw new Error("The ChangeHandler is either not available or does not have all required functions")}return e})};o.registerPredefinedChangeHandlers=function(e,n){s.defaultChangeHandlers=e;s.developerChangeHandlers=n;g(n)};o.registerChangeHandlersForLibrary=function(n){var r=[];e(n,function(e,n){r.push(y(e,n))});return Promise.all(r)};o.clearAll=function(){i={};l={};s={}};o.registerChangeHandlersForControl=function(e,n){return y(e,n)};return o});
//# sourceMappingURL=ChangeHandlerStorage.js.map