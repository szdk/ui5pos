/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_omit","sap/ui/fl/apply/_internal/flexObjects/States","sap/ui/fl/apply/_internal/flexState/compVariants/CompVariantMerger","sap/ui/fl/apply/_internal/flexState/controlVariants/VariantManagementState","sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/apply/api/ControlVariantApplyAPI","sap/ui/fl/write/_internal/flexState/compVariants/CompVariantState","sap/ui/fl/write/_internal/Versions","sap/ui/fl/FlexControllerFactory","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/LayerUtils","sap/ui/fl/Utils"],function(e,t,r,n,a,i,o,l,c,s,f,u,p){"use strict";var g={};function y(e){e.reference=i.getFlexReferenceForControl(e.selector);return a.initialize({componentId:e.componentId||p.getAppComponentForControl(e.selector).getId(),reference:e.reference,componentData:{},manifest:{}})}function C(e){var t=a.getCompVariantsMap(e.reference);var n=[];if(e.invalidateCache){var i=a.getInitialNonFlCompVariantData(e.reference);if(i){Object.keys(i).forEach(function(e){t._initialize(e,i[e].variants,i[e].controlId);r.merge(e,t[e],i[e].standardVariant)})}}for(var o in t){var l=t[o];for(var c in l.byId){n.push(l.byId[c])}}return u.filterChangeOrChangeDefinitionsByCurrentLayer(n,e.currentLayer)}function h(e){var t=i.getFlexReferenceForControl(e.selector);return l.persistAll(t)}function v(e){e.reference||=i.getFlexReferenceForSelector(e.selector);return f.getChangePersistenceForComponent(e.reference)}function d(e,t){var r=p.getAppComponentForControl(t);var a=r.getModel(o.getVariantModelName());var i;if(a){var l=a&&a.sFlexReference;i=n.getVariantManagementReferences(l)}else{i=[]}if(i.length===0){return e}var c=i.map(function(e){return a.getCurrentVariantReference(e)});return e.filter(function(e){return e.getFileType()!=="change"||c.some(function(t){return e.getVariantReference()===t||!e.getVariantReference()})})}function F(t){var r=v(t);return r.getChangesForComponent(e(t,["invalidateCache","selector"]),t.invalidateCache).then(function(e){var n=[];if(t.includeDirtyChanges){n=r.getDirtyChanges();if(t.currentLayer){n=n.filter(function(e){return e.getLayer()===t.currentLayer})}}var a=e.concat(n);if(t.onlyCurrentVariants){return d(a,t.selector)}return a})}function m(e,t){var r=s.createForSelector(e.selector);return r.saveAll(t,e.skipUpdateCache,e.draft,e.layer,e.removeOtherLayerChanges,e.condenseAnyLayer)}g.getFlexObjects=function(e){return y(e).then(function(){return F(e)}).then(function(t){return C(e).concat(t)})};g.getDirtyFlexObjects=function(e){e.includeDirtyChanges=true;var r=v(e);var n=r.getDirtyChanges();var a=C(e);return n.concat(a).filter(function(e){return e.getState()!==t.LifecycleState.PERSISTED})};g.hasDirtyFlexObjects=function(e){var t=i.getFlexReferenceForSelector(e.selector);if(f.getChangePersistenceForComponent(t).getDirtyChanges().length>0){return true}return l.hasDirtyChanges(t)};g.saveFlexObjects=function(t){var r=p.getAppComponentForSelector(t.selector);t.reference=i.getFlexReferenceForControl(t.selector);return h(t).then(m.bind(this,t,r)).then(function(){if(t.version!==undefined&&c.hasVersionsModel(t)){var n=c.getVersionsModel(t);t.version=n.getProperty("/displayedVersion")}if(t.layer){t.currentLayer=t.layer}t.componentId=r.getId();t.invalidateCache=true;return g.getFlexObjects(e(t,"skipUpdateCache"))})};return g});
//# sourceMappingURL=FlexObjectState.js.map