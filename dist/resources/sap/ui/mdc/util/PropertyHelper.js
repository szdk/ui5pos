/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/base/DataType","sap/ui/core/Core","sap/base/util/merge","sap/base/util/isPlainObject","sap/base/Log"],function(e,t,r,o,n,i){"use strict";const a={name:{type:"string",mandatory:true,forComplexProperty:{allowed:true}},label:{type:"string",mandatory:true,forComplexProperty:{allowed:true}},tooltip:{type:"string",forComplexProperty:{allowed:true}},visible:{type:"boolean",default:{value:true},forComplexProperty:{allowed:true}},path:{type:"string"},dataType:{type:"string",mandatory:true},formatOptions:{type:"object"},constraints:{type:"object"},maxConditions:{type:"int",default:{value:-1}},caseSensitive:{type:"boolean",default:{value:true}},group:{type:"string",forComplexProperty:{allowed:true}},groupLabel:{type:"string",forComplexProperty:{allowed:true}},filterable:{type:"boolean",default:{value:true},forComplexProperty:{valueIfNotAllowed:false}},sortable:{type:"boolean",default:{value:true},forComplexProperty:{valueIfNotAllowed:false}},propertyInfos:{type:"PropertyReference[]",forComplexProperty:{allowed:true}}};const p={isComplex:function(){return A.isPropertyComplex(this)},getSimpleProperties:function(){return this.propertyInfosProperties||[this]},getSortableProperties:function(){return this.getSimpleProperties().filter(function(e){return e.sortable})},getFilterableProperties:function(){return this.getSimpleProperties().filter(function(e){return e.filterable})},getVisibleProperties:function(){return this.getSimpleProperties().filter(function(e){return e.visible})}};const s=["name","label","tooltip","visible","path","dataType","formatOptions","constraints","maxConditions","group","groupLabel","caseSensitive"];const l=new WeakMap;function u(e){return JSON.stringify(e,function(e,t){return t===undefined?null:t})||""}function f(e,t){const o=r.getLoadedLibraries();if(!(window["sap-ui-mdc-config"]&&window["sap-ui-mdc-config"].disableStrictPropertyInfoValidation||new URLSearchParams(window.location.search).get("sap-ui-xx-disableStrictPropertyValidation")=="true")&&!("sap.fe.core"in o||"sap.fe.macros"in o||"sap.sac.df"in o)||new URLSearchParams(window.location.search).get("sap-ui-xx-enableStrictPropertyValidation")=="true"){c(e,t)}if(i.getLevel()<i.WARNING){return}const n=u(t);i.warning("Invalid property definition: "+e+(n?"\n"+n:""))}function c(e,t){const r=t?u(t):null;throw new Error("Invalid property definition: "+e+(r?"\n"+r:""))}function y(e,t){t.map(function(e){Object.keys(p).forEach(function(t){Object.defineProperty(e,t,{value:function(){return p[t].call(this)},writable:true})})})}function d(e){const t=Object.getOwnPropertyNames(e);Object.freeze(e);for(let r=0;r<t.length;r++){const o=e[t[r]];if(typeof o==="function"){Object.freeze(o)}else if(n(o)&&!Object.isFrozen(o)){d(o)}else if(Array.isArray(o)){d(o)}}}function P(e,t){if(!t){return e}return t.split(".").reduce(function(e,t){return e&&e[t]?e[t]:null},e)}function b(e){let r;if(typeof e==="object"){r="object"}else{r=e.replace("PropertyReference","string")}return t.getType(r)}function g(e){const t=b(e);if(t.isArrayType()){return t.getBaseType().getDefaultValue()}else{return t.getDefaultValue()}}function m(e,t){t.forEach(function(t){e.prepareProperty(t)});d(t)}function h(e,t,r,o,n,i){const a=o==null;let p=[];const s=A.isPropertyComplex(t);if(a){i=l.get(e).mAttributeMetadata;n=t}if(!n){return[]}for(const l in i){const u=i[l];const f=a?l:o+"."+l;const c=n[l];if(s&&!u.forComplexProperty.allowed){if("valueIfNotAllowed"in u.forComplexProperty){n[l]=u.forComplexProperty.valueIfNotAllowed}continue}if(c!=null&&typeof u.type==="string"&&u.type.startsWith("PropertyReference")||f==="propertyInfos"){if(s||f!=="propertyInfos"){v(n,l,r)}continue}if(c==null){w(n,u,o,l,p,c)}if(typeof u.type==="object"){p=p.concat(h(e,t,r,f,n[l],u.type))}}return p}function v(e,t,r){const o=e[t];let n;let i=t;if(Array.isArray(o)){n=o.map(function(e){return r[e]});i+="Properties"}else{n=r[o];i+="Property"}Object.defineProperty(e,i,{value:n})}function w(e,t,r,n,i,a){if("default"in t){const p=t.default;if(a===null&&p.ignoreIfNull&&"value"in p){return}if(p.value===undefined){e[n]=g(t.type)}else if(typeof p.value==="string"&&p.value.startsWith("attribute:")){i.push({source:p.value.substring(p.value.indexOf(":")+1),targetPath:r,targetAttribute:n,targetType:t.type})}else if(typeof p.value==="object"){e[n]=o({},p.value)}else{e[n]=p.value}}else{e[n]=g(t.type)}}function x(e){return Object.freeze(e.reduce(function(e,t){e[t.name]=t;return e},{}))}function C(e,t,r){for(const o in e){const n=e[o];const i=t==null?o:t+"."+o;const a=r?r.forComplexProperty:{};n.forComplexProperty=Object.assign({allowed:a.allowed&&a.propagateAllowance,propagateAllowance:true},n.forComplexProperty);if(typeof n.type==="object"){C(n.type,i,n)}}}function j(e,t){if(!Array.isArray(t)){c("Property infos must be an array.")}const r=l.get(e);const n=o([],t);e.validateProperties(n,r.aPreviousRawProperties);r.aProperties=n;r.mProperties=x(n);r.aPreviousRawProperties=o([],t);y(e,n);m(e,n)}const A=e.extend("sap.ui.mdc.util.PropertyHelper",{constructor:function(t,r,o){e.call(this);if(r&&!e.isObjectA(r,"sap.ui.base.ManagedObject")){throw new Error("The type of the parent is invalid.")}Object.keys(o||{}).forEach(function(e){if(e in a&&o[e]!==true){throw new Error("The attribute '"+e+"' is reserved and cannot be overridden by additional attributes.")}});const n={};const i=Object.keys(o||{});n.mAttributeMetadata=s.concat(i).reduce(function(e,t){e[t]=t in a?a[t]:o[t];return e},{});C(n.mAttributeMetadata);n.aMandatoryAttributes=Object.keys(n.mAttributeMetadata).filter(function(e){return n.mAttributeMetadata[e].mandatory});n.oParent=r||null;l.set(this,n);j(this,t)}});A.prototype.validateProperties=function(e,t){const r=new Set;for(let o=0;o<e.length;o++){this.validateProperty(e[o],e,t);r.add(e[o].name)}if(r.size!==e.length){c("Properties do not have unique names.")}};A.prototype.validateProperty=function(e,t,r){if(!n(e)){c("Property info must be a plain object.")}O(this,e,t);if(A.isPropertyComplex(e)){if(!e.propertyInfos||e.propertyInfos.length===0){c("Complex property does not reference existing properties.",e)}}const o=l.get(this);o.aMandatoryAttributes.forEach(function(t){const r=o.mAttributeMetadata[t].forComplexProperty.allowed;if(e[t]==null&&A.isPropertyComplex(e)&&!r){return}if(!(t in e)){f("Property does not contain mandatory attribute '"+t+"'.",e)}else if(e[t]==null){c("Property does not contain mandatory attribute '"+t+"'.",e)}})};function O(e,t,r,o,n,i){const a=o==null;if(a){i=l.get(e).mAttributeMetadata;n=t}for(const p in n){const s=i[p];const l=a?p:o+"."+p;const u=n[p];if(!s){f("Property contains invalid attribute '"+l+"'.",t)}else if(A.isPropertyComplex(t)&&!s.forComplexProperty.allowed){f("Complex property contains invalid attribute '"+l+"'.",t)}else if(typeof s.type==="object"&&u&&typeof u==="object"){O(e,t,r,l,u,s.type)}else if(u!=null&&!b(s.type).isValid(u)){c("The value of '"+l+"' is invalid.",t)}else if(u&&typeof s.type==="string"&&s.type.startsWith("PropertyReference")){I(e,t,r,l,u,s)}}}function I(e,t,r,o,n,i){const a=i.type.endsWith("[]")?n:[n];const p=new Set(a);if(a.indexOf(t.name)>-1){c("Property references itself in the '"+o+"' attribute.",t)}if(p.size!==a.length){c("Property contains duplicate names in the '"+o+"' attribute.",t)}for(let e=0;e<r.length;e++){if(p.has(r[e].name)){if(A.isPropertyComplex(r[e])){c("Property references complex properties in the '"+o+"' attribute.",t)}p.delete(r[e].name)}}if(p.size>0){c("Property references non-existing properties in the '"+o+"' attribute.",t)}}A.prototype.prepareProperty=function(e){const t=this.getPropertyMap();const r=h(this,e,t);r.forEach(function(r){const o=P(e,r.targetPath);if(o){let n=P(e,r.source);if(n==null){n=g(r.targetType)}o[r.targetAttribute]=n;if(typeof r.targetType==="string"&&r.targetType.startsWith("PropertyReference")){v(o,r.targetAttribute,t)}}})};A.prototype.getParent=function(){const e=l.get(this);return e?e.oParent:null};A.prototype.setProperties=function(e){j(this,e)};A.prototype.getProperties=function(){const e=l.get(this);return e?e.aProperties:[]};A.prototype.getPropertyMap=function(){const e=l.get(this);return e?e.mProperties:{}};A.prototype.getProperty=function(e){return this.getPropertyMap()[e]||null};A.prototype.hasProperty=function(e){return e in this.getPropertyMap()};A.isPropertyComplex=function(e){return e!=null&&typeof e==="object"?"propertyInfos"in e:false};A.prototype.getSortableProperties=function(){return this.getProperties().filter(function(e){return e.sortable})};A.prototype.getFilterableProperties=function(){return this.getProperties().filter(function(e){return e.filterable})};A.prototype.getVisibleProperties=function(){return this.getProperties().filter(function(e){return e.visible})};A.prototype.destroy=function(){e.prototype.destroy.apply(this,arguments);l.delete(this)};return A});
//# sourceMappingURL=PropertyHelper.js.map