/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/initial/api/Version","sap/ui/fl/write/_internal/Versions","sap/ui/fl/Utils","sap/ui/fl/write/api/FeaturesAPI","sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/write/api/ContextBasedAdaptationsAPI"],function(e,r,t,n,o,i,a){"use strict";function l(e){var r=i.getFlexReferenceForControl(e);if(!r){throw Error("The application ID could not be determined")}return r}function s(e){if(!e.control){throw Error("No control was provided")}if(!e.layer){throw Error("No layer was provided")}var r=l(e.control);return t.getVersionsModel({nonNormalizedReference:r,reference:r,layer:e.layer})}function d(e){var r=l(e.control);var t=a.hasAdaptationsModel({layer:e.layer,reference:r});if(!e.adaptationId&&t){return a.refreshAdaptationModel(e)}else if(e.adaptationId&&t){var n=a.getAdaptationsModel(e);n.switchDisplayedAdaptation(e.adaptationId);return Promise.resolve(e.adaptationId)}return Promise.resolve()}var c={};c.initialize=function(e){if(!e.control){return Promise.reject("No control was provided")}if(!e.layer){return Promise.reject("No layer was provided")}var r=n.getAppComponentForControl(e.control);return t.initialize({reference:l(r),layer:e.layer})};c.clearInstances=function(){t.clearInstances()};c.isDraftAvailable=function(e){var t=s(e);var n=t.getProperty("/versions");var o=n.find(function(e){return e.version===r.Number.Draft});return!!o};c.isOldVersionDisplayed=function(e){var t=s(e);var n=t.getProperty("/displayedVersion");var o=t.getProperty("/activeVersion");return n!==r.Number.Draft&&n!==o};c.loadDraftForApplication=function(e){e.version=r.Number.Draft;return c.loadVersionForApplication(e)};c.loadVersionForApplication=function(t){if(!t.control){return Promise.reject("No control was provided")}if(!t.layer){return Promise.reject("No layer was provided")}var i=s(t);if(i){if(t.version===undefined){t.version=i.getProperty("/activeVersion")}i.setProperty("/displayedVersion",t.version);i.setProperty("/persistedVersion",t.version);if(t.version!==r.Number.Draft&&o.isPublishAvailable()){var a=i.getProperty("/versions");if(a.length){var c=a.find(function(e){return e.version===t.version});if(c){i.setProperty("/publishVersionEnabled",!c.isPublished)}}}}return d(t).then(function(r){var o=n.getAppComponentForControl(t.control);var i=l(o);return e.clearAndInitialize({componentId:o.getId(),reference:i,version:t.version,allContexts:t.allContexts,adaptationId:r})})};c.activate=function(e){if(!e.control){return Promise.reject("No control was provided")}if(!e.layer){return Promise.reject("No layer was provided")}if(!e.title){return Promise.reject("No version title was provided")}var r=l(e.control);return t.activate({nonNormalizedReference:r,reference:r,layer:e.layer,title:e.title,appComponent:n.getAppComponentForControl(e.control),displayedVersion:e.displayedVersion})};c.discardDraft=function(r){if(!r.control){return Promise.reject("No control was provided")}if(!r.layer){return Promise.reject("No layer was provided")}var o=n.getAppComponentForControl(r.control);var i=l(o);return t.discardDraft({nonNormalizedReference:i,reference:i,layer:r.layer}).then(function(t){if(t.backendChangesDiscarded){var n=a.hasAdaptationsModel({layer:r.layer,reference:i});if(n){return a.refreshAdaptationModel(r).then(function(r){return e.clearAndInitialize({componentId:o.getId(),reference:i,adaptationId:r}).then(function(){return t})})}return e.clearAndInitialize({componentId:o.getId(),reference:i}).then(function(){return t})}return t})};c.publish=function(e){if(!e.selector){return Promise.reject("No selector was provided")}if(!e.layer){return Promise.reject("No layer was provided")}if(!e.version){return Promise.reject("No version was provided")}e.styleClass||="";e.reference=l(e.selector);return t.publish(e)};return c});
//# sourceMappingURL=VersionsAPI.js.map