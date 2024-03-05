/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/fl/initial/_internal/FlexConfiguration","sap/ui/fl/Layer","sap/ui/fl/LayerUtils","sap/base/util/isEmptyObject"],function(e,n,t,r,a){"use strict";var o={load:{LrepConnector:"sap/ui/fl/initial/_internal/connectors/LrepConnector",NeoLrepConnector:"sap/ui/fl/initial/_internal/connectors/NeoLrepConnector",PersonalizationConnector:"sap/ui/fl/initial/_internal/connectors/PersonalizationConnector",KeyUserConnector:"sap/ui/fl/initial/_internal/connectors/KeyUserConnector",StaticFileConnector:"sap/ui/fl/initial/_internal/connectors/StaticFileConnector",ObjectStorageConnector:"sap/ui/fl/apply/_internal/connectors/ObjectStorageConnector",JsObjectConnector:"sap/ui/fl/write/_internal/connectors/JsObjectConnector",ObjectPathConnector:"sap/ui/fl/write/_internal/connectors/ObjectPathConnector",LocalStorageConnector:"sap/ui/fl/write/_internal/connectors/LocalStorageConnector",SessionStorageConnector:"sap/ui/fl/write/_internal/connectors/SessionStorageConnector"},write:{LrepConnector:"sap/ui/fl/write/_internal/connectors/LrepConnector",NeoLrepConnector:"sap/ui/fl/write/_internal/connectors/NeoLrepConnector",PersonalizationConnector:"sap/ui/fl/write/_internal/connectors/PersonalizationConnector",KeyUserConnector:"sap/ui/fl/write/_internal/connectors/KeyUserConnector",StaticFileConnector:"sap/ui/fl/write/_internal/connectors/StaticFileConnector",JsObjectConnector:"sap/ui/fl/write/_internal/connectors/JsObjectConnector",ObjectPathConnector:"sap/ui/fl/write/_internal/connectors/ObjectPathConnector",LocalStorageConnector:"sap/ui/fl/write/_internal/connectors/LocalStorageConnector",SessionStorageConnector:"sap/ui/fl/write/_internal/connectors/SessionStorageConnector"}};var i="sap/ui/fl/initial/_internal/connectors/";var c={connector:"StaticFileConnector"};function s(e,n){var t=[];if(!e){t=n}else{t=e.filter(function(e){return n.indexOf(e)!==-1||n[0]==="ALL"})}return t}function l(e,n,t){return t.map(function(e){var t=e.connector;var r;if(!e.loadConnector&&!e.applyConnector&&!e.loadConnector){r=n?o.load[t]:o.write[t]}else if(n){r=e.loadConnector||e.applyConnector}else{r=e.writeConnector||"sap/ui/fl/write/connectors/BaseConnector"}return r})}function p(e,n,t){var r=l(e,n,t);return new Promise(function(e){sap.ui.require(r,function(...r){r.forEach(function(e,r){if(!t[r].layers){t[r].layers=e.layers}else{t[r].layers=s(t[r].layers,e.layers)}if(n){t[r].loadConnectorModule=e}else{t[r].writeConnectorModule=e}});e(t)})})}return{getConnectors(e,t){var r=n.getFlexibilityServices();var a=[];if(t){a=[c]}a=a.concat(r);return p(e,t,a)},getLoadConnectors(){return this.getConnectors(i,true)},getStaticFileConnector(){return p(i,true,[c])},logAndResolveDefault(n,t,r,a){e.error(`Connector (${t.connector}) failed call '${r}': ${a}\n\t\t\t\tApplication startup continues without data from this storage.`);return n},filterAndSortResponses(e){var n=[];Object.keys(e).forEach(function(t){n.push(e[t])});n=n.filter(function(e){return e.changes.length>0||e.appDescriptorChanges.length>0||e.variants.length>0||e.variantChanges.length>0||e.variantManagementChanges.length>0||e.variantDependentControlChanges.length>0||e.comp.variants.length>0||e.comp.changes.length>0||e.comp.defaultVariants.length>0||e.comp.standardVariants.length>0});n.sort(function(e,n){return e.index-n.index});return n},sortFlexObjects(e){e.sort(function(e,n){return new Date(e.creation)-new Date(n.creation)})},getGroupedFlexObjects(e){this.sortFlexObjects(e);var n={};Object.keys(t).forEach(function(e){n[e]=this.getEmptyFlexDataResponse();n[e].index=r.getLayerIndex(e)}.bind(this));e.forEach(function(e){var t=e.layer;if(e.fileType==="ctrl_variant"&&e.variantManagementReference){n[t].variants.push(e)}else if(e.fileType==="ctrl_variant_change"){n[t].variantChanges.push(e)}else if(e.fileType==="ctrl_variant_management_change"){n[t].variantManagementChanges.push(e)}else if(e.fileType==="variant"){n[t].comp.variants.push(e)}else if(e.fileType==="change"){if(e.variantReference){n[t].variantDependentControlChanges.push(e)}else if(e.appDescriptorChange){n[t].appDescriptorChanges.push(e)}else{switch(e.changeType){case"addFavorite":case"removeFavorite":case"updateVariant":n[t].comp.changes.push(e);break;case"defaultVariant":n[t].comp.defaultVariants.push(e);break;case"standardVariant":n[t].comp.standardVariants.push(e);break;default:n[t].changes.push(e)}}}});return n},getEmptyFlexDataResponse(){return Object.assign({},{appDescriptorChanges:[],changes:[],comp:{variants:[],changes:[],defaultVariants:[],standardVariants:[]},variants:[],variantChanges:[],variantDependentControlChanges:[],variantManagementChanges:[],ui2personalization:{}})},isStorageResponseFilled(e){return Object.keys(e||{}).some(function(n){if(Array.isArray(e[n])){return e[n].length!==0}return!a(e[n])})}}});
//# sourceMappingURL=StorageUtils.js.map