/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/each"],function(e){"use strict";return{addToChangesMap(e,n,a){if(!e[n.uniqueKey]){n.change=a;e[n.uniqueKey]=n;a.condenserState="select"}else{a.condenserState="delete"}},getChangesFromMap(n,a){var t=[];e(n[a],function(e,n){t.push(n.change)});return t}}});
//# sourceMappingURL=Update.js.map