/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/Base","./ItemBaseFlex"],function(e,t){"use strict";const n=Object.assign({},t);n.findItem=function(e,t,n){return Promise.resolve(sap.ui.getCore().byId(n))};return{createChanges:function(e,t){const n=t.filter(function(e){return!sap.ui.getCore().byId(e.id)});const r={};return n.reduce(function(e,t){if(!r[t.id]){r[t.id]=true;e.push(t)}return e},[]).map(function(t){return{selectorElement:e,changeSpecificData:{changeType:"createItem",content:{selector:t.id}}}})},createItem:{layers:{USER:true},changeHandler:{applyChange:function(e,t,n){const r=e.getContent().selector;return Promise.resolve().then(function(){t.getModel();return n.modifier.getProperty(t,"metadataHelperPath")}).then(function(e){return new Promise(function(t,n){sap.ui.require(["sap/ui/mdc/link/PanelItem",e],function(e,n){t(n)},function(e){n(e)})})}).then(function(e){const o=n.modifier;if(o.bySelector(r,n.appComponent,n.view)){return undefined}const i=e.retrieveAllMetadata(t);let c;const u=function(e,t){let n=-1;t.some(function(t,r){if(t.getId()===e){n=r;return true}});return n};const s=o.getControlIdBySelector(r,n.appComponent);return Promise.resolve().then(o.getAggregation.bind(o,t,"items")).then(function(e){c=-1;let t=null;i.some(function(n){const r=u(n.id,e);if(r>-1){c=r}if(n.id===s){t=n;return true}});if(!t){return undefined}return o.createControl("sap.ui.mdc.link.PanelItem",n.appComponent,n.view,t.id,{text:t.text,description:t.description,href:t.href,target:t.target,icon:t.icon,visible:true})}).then(function(e){return o.insertAggregation(t,"items",e,c+1)})})},revertChange:function(t,n,r){const o=r.modifier;if(t.getContent()&&t.getContent().selector){const i=t.getContent().selector.id;const c=o.bySelector(i,r.appComponent,r.view);if(!c){return e.markAsNotApplicable("revertChange of createItem: the item with id "+i+" is not existing and therefore can not be removed.",true)}return Promise.resolve().then(o.removeAggregation.bind(o,n,"items",c))}},completeChangeContent:function(e,t,n){if(t.content){const r=n.modifier.getSelector(t.content.selector,n.appComponent);e.setContent({selector:r})}}}}}},true);
//# sourceMappingURL=Panel.flexibility.js.map