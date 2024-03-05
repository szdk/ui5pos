/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/LoaderExtensions"],function(e){"use strict";var t={setTextInChange(e,t,n,r){e.texts||={};e.texts[t]||={};e.texts[t].value=n;e.texts[t].type=r},instantiateFragment(t,n){var r=t.getFlexObjectMetadata();var a=r.moduleName;if(!a){return Promise.reject(new Error("The module name of the fragment is not set. This should happen in the backend"))}var o=n.viewId?`${n.viewId}--`:"";var i=r.projectId||"";var s=t.getExtensionPointInfo&&t.getExtensionPointInfo()&&t.getExtensionPointInfo().fragmentId||"";var u=i&&s?".":"";var v=o+i+u+s;var d=n.modifier;var m=n.view;return Promise.resolve().then(function(){var t=e.loadResource(a,{dataType:"text"});return d.instantiateFragment(t,v,m).catch(function(e){throw new Error(`The following XML Fragment could not be instantiated: ${t} Reason: ${e.message}`)})})},markAsNotApplicable(e,t){var n={message:e};if(!t){throw n}return Promise.reject(n)}};return t},true);
//# sourceMappingURL=Base.js.map