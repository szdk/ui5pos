/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/LinkDelegate","sap/ui/mdc/link/LinkItem","sap/ui/mdc/link/Factory","sap/ui/mdc/link/Log","sap/base/Log","sap/base/util/isPlainObject","sap/ui/mdc/link/SemanticObjectMapping","sap/ui/mdc/link/SemanticObjectMappingItem","sap/ui/mdc/link/SemanticObjectUnavailableAction","sap/ui/mdc/enums/LinkType"],function(t,e,n,i,a,c,o,r,s,u){"use strict";const l=Object.assign({},t);l.fetchLinkItems=function(t,e,n){const a=t.getPayload();const c=e?e.getObject(e.getPath()):undefined;const o=[];if(n){n.initialize(l._getSemanticObjects(a));o.forEach(function(t){n.addIntent(i.IntentType.API,{text:t.getText(),intent:t.getHref()})})}const r=l._calculateSemanticAttributes(c,a,n);return l._retrieveNavigationTargets("",r,a,n).then(function(t,e){return Promise.resolve(t)})};l.fetchLinkType=function(t){const e={};let i=null;const c=t.getPayload();const o=function(t){return t.filter(function(t){return!e[t]}).length===0};const r=function(t){return t.some(function(t){return e[t]&&e[t].exists===true})};const s=function(){if(!i){i=new Promise(function(t){const c=n.getService("CrossApplicationNavigation");if(!c){a.error("FlpLinkDelegate: Service 'CrossApplicationNavigation' could not be obtained");t({});return}c.getDistinctSemanticObjects().then(function(n){n.forEach(function(t){e[t]={exists:true}});i=null;return t(e)},function(){a.error("FlpLinkDelegate: getDistinctSemanticObjects() of service 'CrossApplicationNavigation' failed");return t({})})})}return i};const l=function(t){if(o(t)){return Promise.resolve(r(t))}return s().then(function(){return r(t)})};if(c&&c.semanticObjects){return l(c.semanticObjects).then(function(t){return Promise.resolve({type:t?u.Popover:u.Text,directLink:undefined})})}else{throw new Error("no payload or semanticObjects found")}};l._calculateSemanticAttributes=function(t,e,n){const i=l._getSemanticObjects(e);const o=l._convertSemanticObjectMapping(l._getSemanticObjectMappings(e));if(!i.length){i.push("")}const r={};i.forEach(function(e){if(n){n.addContextObject(e,t)}r[e]={};for(const i in t){let s=null,u=null;if(n){s=n.getSemanticObjectAttribute(e,i);if(!s){s=n.createAttributeStructure();n.addSemanticObjectAttribute(e,i,s)}}if(t[i]===undefined||t[i]===null){if(s){s.transformations.push({value:undefined,description:"ℹ Undefined and null values have been removed in FlpLinkDelegate."})}continue}if(c(t[i])){if(s){s.transformations.push({value:undefined,description:"ℹ Plain objects has been removed in FlpLinkDelegate."})}continue}const l=o&&o[e]&&o[e][i]?o[e][i]:i;if(s&&i!==l){u={value:undefined,description:"ℹ The attribute "+i+" has been renamed to "+l+" in FlpLinkDelegate.",reason:"🔴 A com.sap.vocabularies.Common.v1.SemanticObjectMapping annotation is defined for semantic object "+e+" with source attribute "+i+" and target attribute "+l+". You can modify the annotation if the mapping result is not what you expected."}}if(r[e][l]){a.error("FlpLinkDelegate: The attribute "+i+" can not be renamed to the attribute "+l+" due to a clash situation. This can lead to wrong navigation later on.")}r[e][l]=t[i];if(s){if(u){s.transformations.push(u);const a=n.createAttributeStructure();a.transformations.push({value:t[i],description:"ℹ The attribute "+l+" with the value "+t[i]+" has been added due to a mapping rule regarding the attribute "+i+" in FlpLinkDelegate."});n.addSemanticObjectAttribute(e,l,a)}}}});return r};l._retrieveNavigationTargets=function(t,i,c,o){if(!c.semanticObjects){return new Promise(function(t){t([])})}const r=c.semanticObjects;const s=c.sourceControl;const u={ownNavigation:undefined,availableActions:[]};return sap.ui.getCore().loadLibrary("sap.ui.fl",{async:true}).then(function(){return new Promise(function(f){sap.ui.require(["sap/ui/fl/Utils"],function(b){const g=n.getService("CrossApplicationNavigation");const p=n.getService("URLParsing");if(!g||!p){a.error("FlpLinkDelegate: Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained");return f(u.availableActions,u.ownNavigation)}const m=sap.ui.getCore().byId(s);const d=b.getAppComponentForControl(m);const h=r.map(function(e){return[{semanticObject:e,params:i?i[e]:undefined,appStateKey:t,ui5Component:d,sortResultsBy:"text"}]});return new Promise(function(){g.getLinks(h).then(function(t){if(!t||!t.length){return f(u.availableActions,u.ownNavigation)}const n=l._getSemanticObjectUnavailableActions(c);const i=l._convertSemanticObjectUnavailableAction(n);let a=g.hrefForExternal();if(a&&a.indexOf("?")!==-1){a=a.split("?")[0]}if(a){a+="?"}const s=function(t,e){return!!i&&!!i[t]&&i[t].indexOf(e)>-1};const b=function(t){const n=p.parseShellHash(t.intent);if(s(n.semanticObject,n.action)){return}const i=g.hrefForExternal({target:{shellHash:t.intent}},d);if(t.intent&&t.intent.indexOf(a)===0){u.ownNavigation=new e({href:i,text:t.text,internalHref:t.intent});return}const c=new e({key:n.semanticObject&&n.action?n.semanticObject+"-"+n.action:undefined,text:t.text,description:undefined,href:i,internalHref:t.intent,icon:undefined,initiallyVisible:t.tags&&t.tags.indexOf("superiorAction")>-1});u.availableActions.push(c);if(o){o.addSemanticObjectIntent(n.semanticObject,{intent:c.getHref(),text:c.getText()})}};for(let e=0;e<r.length;e++){t[e][0].forEach(b)}return f(u.availableActions,u.ownNavigation)},function(){a.error("FlpLinkDelegate: '_retrieveNavigationTargets' failed executing getLinks method");return f(u.availableActions,u.ownNavigation)})})})})})};l._getSemanticObjects=function(t){return t.semanticObjects?t.semanticObjects:[]};l._getSemanticObjectUnavailableActions=function(t){const e=[];if(t.semanticObjectUnavailableActions){t.semanticObjectUnavailableActions.forEach(function(t){e.push(new s({semanticObject:t.semanticObject,actions:t.actions}))})}return e};l._getSemanticObjectMappings=function(t){const e=[];let n=[];if(t.semanticObjectMappings){t.semanticObjectMappings.forEach(function(t){n=[];if(t.items){t.items.forEach(function(t){n.push(new r({key:t.key,value:t.value}))})}e.push(new o({semanticObject:t.semanticObject,items:n}))})}return e};l._convertSemanticObjectMapping=function(t){if(!t.length){return undefined}const e={};t.forEach(function(t){if(!t.getSemanticObject()){throw Error("FlpLinkDelegate: 'semanticObject' property with value '"+t.getSemanticObject()+"' is not valid")}e[t.getSemanticObject()]=t.getItems().reduce(function(t,e){t[e.getKey()]=e.getValue();return t},{})});return e};l._convertSemanticObjectUnavailableAction=function(t){if(!t.length){return undefined}const e={};t.forEach(function(t){if(!t.getSemanticObject()){throw Error("FlpLinkDelegate: 'semanticObject' property with value '"+t.getSemanticObject()+"' is not valid")}e[t.getSemanticObject()]=t.getActions()});return e};return l});
//# sourceMappingURL=FlpLinkDelegate.js.map