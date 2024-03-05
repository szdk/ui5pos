/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/base/Log","sap/ui/mdc/condition/FilterOperatorUtil","sap/ui/mdc/flexibility/Util","sap/ui/fl/changeHandler/condenser/Classification"],function(e,n,t,i,o){"use strict";const r=function(e,n){const t=function(n){if(e._pQueue===n){delete e._pQueue}};e._pQueue=e._pQueue instanceof Promise?e._pQueue.then(n):n();e._pQueue.then(t.bind(null,e._pQueue));return e._pQueue};const a=function(e){return new Promise(function(n,t){sap.ui.require([e],n,t)}).then(function(e){return e})};const c=function(o,c,u,f){const s=f===i.REVERT;const d=s?o.getRevertData():o.getContent();let l,g=null;const p=u.modifier;return r(c,function(){return p.getProperty(c,"filterConditions").then(function(i){l=e({},i);if(l){for(const e in l){if(e===d.name){g=l[e];break}}}if(!g){l[d.name]=[];g=l[d.name]}if(!s){o.setRevertData({name:d.name,condition:d.condition})}const r=t.indexOfCondition(d.condition,g);if(r<0){g.push(d.condition);p.setProperty(c,"filterConditions",l);return p.getProperty(c,"delegate").then(function(e){return a(e.name)}).then(function(e){const t=e&&(e.getFilterDelegate?e.getFilterDelegate().addCondition:e.addCondition);if(t){return t(c,d.name,u).catch(function(e){n.error("Error during Delegate.addCondition call: "+e)})}}).finally(function(){if(s){o.resetRevertData()}})}})})};const u=function(o,c,u,f){const s=f===i.REVERT;const d=s?o.getRevertData():o.getContent();let l,g,p=-1;const m=u.modifier;return r(c,function(){return m.getProperty(c,"filterConditions").then(function(i){l=e({},i);if(l){for(const e in l){if(e===d.name){g=l[e];break}}}if(!s){o.setRevertData({name:d.name,condition:d.condition})}if(g&&g.length>0){p=t.indexOfCondition(d.condition,g);if(p>=0){g.splice(p,1);m.setProperty(c,"filterConditions",l);return m.getProperty(c,"delegate").then(function(e){return a(e.name)}).then(function(e){const t=e&&(e.getFilterDelegate?e.getFilterDelegate().removeCondition:e.removeCondition);if(t){return t(c,d.name,u).catch(function(e){n.error("Error during Delegate.removeCondition call: "+e)})}}).finally(function(){if(s){o.resetRevertData()}})}}})})};const f=function(e,n){const t=e.getContent();return{classification:o.Reverse,affectedControl:e.getSelector(),uniqueKey:t.name+"_"+JSON.stringify(t.condition)}};const s={};s.addCondition=i.createChangeHandler({apply:c,revert:u,getCondenserInfo:f});s.removeCondition=i.createChangeHandler({apply:u,revert:c,getCondenserInfo:f});return s});
//# sourceMappingURL=ConditionFlex.js.map