/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function e(){return{actions:{},aggregations:{},description:"{description}",name:"{name}",properties:{}}}function t(e,t,n){const i=e.includes(t);const r=i&&n[t]||{};if(!Object.keys(r).length){r[t]={ignore:!i};Object.assign(n,r)}}return{getDesignTime:function(n,i,r,s){s=s?s:e();s.actions=s.actions?s.actions:{};s.properties=s.properties?s.properties:{};s.aggregations=s.aggregations?s.aggregations:{};i=i?i:[];r=r?r:[];const o=n.getMetadata(),g=Object.keys(o.getAllProperties()).concat(Object.keys(o.getAllPrivateProperties())),a=Object.keys(o.getAllAggregations()).concat(Object.keys(o.getAllPrivateAggregations()));g.forEach(function(e){t(i,e,s.properties)});a.forEach(function(e){t(r,e,s.aggregations)});return s}}});
//# sourceMappingURL=Util.js.map