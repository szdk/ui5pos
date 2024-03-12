/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_omit","sap/base/util/includes","sap/base/Log","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/core/Component","sap/ui/core/Element","sap/ui/core/Lib","sap/ui/fl/apply/_internal/appVariant/DescriptorChangeTypes","sap/ui/fl/apply/_internal/changes/Applier","sap/ui/fl/apply/_internal/changes/Reverter","sap/ui/fl/apply/_internal/flexObjects/FlexObjectFactory","sap/ui/fl/apply/_internal/flexObjects/States","sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/descriptorRelated/api/DescriptorChangeFactory","sap/ui/fl/initial/_internal/changeHandlers/ChangeHandlerStorage","sap/ui/fl/write/api/ContextBasedAdaptationsAPI","sap/ui/fl/write/_internal/appVariant/AppVariantInlineChangeFactory","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/Utils"],function(e,t,n,a,r,c,i,o,l,p,s,g,f,h,u,C,d,m,y){"use strict";var S={};function D(e){var t;if(e.changeSpecificData.layer){t=e.changeSpecificData.layer;delete e.changeSpecificData.layer}const a={changeType:e.changeSpecificData.changeType,content:e.changeSpecificData.content};if(e.changeSpecificData.texts){a.texts=e.changeSpecificData.texts}return d.createDescriptorInlineChange(a).then(n=>(new h).createNew(e.changeSpecificData.reference,n,t,e.selector)).catch(e=>{n.error("the change could not be created.",e.message);throw e})}function v(e){const t=s.createUIChange(e.changeSpecificData);return u.getChangeHandler(t.getChangeType(),e.controlType,e.selector,a,t.getLayer()).then(n=>n.completeChangeContent(t,e.changeSpecificData,{modifier:a,appComponent:e.appComponent,view:y.getViewForControl(e.selector)})).then(()=>{t.setState(g.LifecycleState.NEW);return t})}S.create=function(e){if(e.changeSpecificData.changeType==="codeExt"){return s.createControllerExtensionChange(e.changeSpecificData)}const n=y.getAppComponentForSelector(e.selector.view||e.selector);const c=e.selector.appId||f.getFlexReferenceForControl(n);e.appComponent=n;e.changeSpecificData.reference=c;if(t(o.getChangeTypes(),e.changeSpecificData.changeType)){return D(e)}const i={layer:e.changeSpecificData.layer,control:n,reference:c};if(C.hasAdaptationsModel(i)){e.changeSpecificData.adaptationId=C.getDisplayedAdaptationId(i)}if(e.selector instanceof r){return Promise.resolve(s.createUIChange(e.changeSpecificData))}if(e.selector.name&&e.selector.view){e.changeSpecificData.selector={name:e.selector.name,viewSelector:a.getSelector(e.selector.view.getId(),n)};return v(e)}const l=e.selector.id||e.selector.getId();e.changeSpecificData.selector||={};Object.assign(e.changeSpecificData.selector,a.getSelector(l,n));e.controlType=e.selector.controlType||y.getControlType(e.selector);return v(e)};S.apply=function(t){if(!(t.element instanceof c)){return Promise.reject("Please provide an Element")}t.appComponent=y.getAppComponentForSelector(t.element);t.modifier||=a;return l.applyChangeOnControl(t.change,t.element,e(t,["element","change"])).then(function(e){var n=m.getChangePersistenceForControl(t.element);var a=n.getOpenDependentChangesForControl(t.change.getSelector(),t.appComponent);if(a.length>0){return S.revert({change:t.change,element:t.element}).then(function(){var e=i.getResourceBundleFor("sap.ui.fl");var n=a.map(function(e){return e.getId()}).join(", ");throw Error(e.getText("MSG_DEPENDENT_CHANGE_ERROR",[t.change.getId(),n]))})}return e})};S.revert=function(e){var t=y.getAppComponentForSelector(e.element||{});var n=[];var r={modifier:a,appComponent:t};if(!Array.isArray(e.change)){return p.revertChangeOnControl(e.change,e.element,r)}var c=e.change.slice(0).reverse();return c.reduce(function(t,a){return t.then(function(){return p.revertChangeOnControl(a,e.element,r).then(function(e){n.unshift(e)})})},Promise.resolve()).then(function(){return n})};S.getChangeHandler=function(e){var t=e.controlType||e.modifier.getControlType(e.element);return u.getChangeHandler(e.changeType,t,e.element,e.modifier,e.layer)};return S});
//# sourceMappingURL=ChangesWriteAPI.js.map