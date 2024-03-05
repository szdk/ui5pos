/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/isEmptyObject","sap/ui/fl/apply/_internal/flexObjects/FlexObjectFactory"],function(e,t){"use strict";var n="$sap.ui.fl.changes";function r(e){var r=e&&e.getEntry&&e.getEntry(n)&&e.getEntry(n).descriptor||[];return r.map(function(e){return t.createAppDescriptorChange(e)})}var a={applyChanges(t,n,r){return r.registry().then(function(e){var t=n.map(function(t){return e[t.getChangeType()]&&e[t.getChangeType()]()});return Promise.all(t)}).then(function(a){a.forEach(function(a,s){try{var i=n[s];t=a.applyChange(t,i);if(!a.skipPostprocessing&&!e(i.getTexts())){t=r.processTexts(t,i.getTexts())}}catch(e){r.handleError(e)}});return t})},applyChangesIncludedInManifest(e,t){var a=r(e);var s=e.getJson();delete s[n];if(a.length>0){return this.applyChanges(s,a,t).then(function(){return})}return Promise.resolve()}};return a});
//# sourceMappingURL=Applier.js.map