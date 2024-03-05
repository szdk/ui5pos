/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./Factory"],function(jQuery,e){"use strict";function r(){}function t(e){return{hrefForExternal:function(e){if(!e||!e.target||!e.target.shellHash){return null}return e.target.shellHash},hrefForExternalAsync:function(e){if(!e||!e.target||!e.target.shellHash){return Promise.resolve(null)}return Promise.resolve(e.target.shellHash)},getDistinctSemanticObjects:function(){var r=[];for(var t in e){r.push(t)}var n=jQuery.Deferred();setTimeout(function(){n.resolve(r)},0);return n.promise()},getLinks:function(r){var t=[];if(!Array.isArray(r)){if(e[r.semanticObject]){t=e[r.semanticObject].links}else{t=[]}}else{r.forEach(function(r){if(e[r[0].semanticObject]){t.push([e[r[0].semanticObject].links])}else{t.push([[]])}})}var n=jQuery.Deferred();setTimeout(function(){n.resolve(t)},0);return n.promise()}}}function n(e){return{parseShellHash:function(r){var t=function(e){var t=e.filter(function(e){return e.intent===r});return t[0]};for(var n in e){var i=t(e[n].links);if(i){return{semanticObject:n,action:i.action}}}return{semanticObject:null,action:null}}}}r.enableFakeConnector=function(t){if(r.getServiceReal){return}r.getServiceReal=e.getService;e.getService=r._createFakeService(t)};r._createFakeService=function(e){return function(i,a){switch(i){case"CrossApplicationNavigation":return a?Promise.resolve(t(e)):t(e);case"URLParsing":return a?Promise.resolve(n(e)):n(e);default:return r.getServiceReal(i,a)}}};r.disableFakeConnector=function(){if(r.getServiceReal){e.getService=r.getServiceReal;r.getServiceReal=undefined}};return r},true);
//# sourceMappingURL=FakeFlpConnector.js.map