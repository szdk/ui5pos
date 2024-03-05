/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/LoaderExtensions","sap/ui/core/Component","sap/ui/core/Supportability"],function(e,r,a,n){"use strict";function o(o,i){var t=`${o.replace(/\./g,"/")}/changes/${i}.json`;var s=!!sap.ui.loader._.getModuleState(t);if(s||n.isDebugModeEnabled()||a.getComponentPreloadMode()==="off"){try{return r.loadResource(t)}catch(r){if(r.name.includes("SyntaxError")){e.error(r)}e.warning(`flexibility did not find a ${i}.json for the application: ${o}`)}}}return{loadFlexData(e){var r=e.componentName;r||=e.reference.replace(/.Component/g,"");var a=o(r,"flexibility-bundle");if(a){a.changes=a.changes.concat(a.compVariants);delete a.compVariants;return Promise.resolve(a)}var n=o(r,"changes-bundle");if(n){return Promise.resolve({changes:n})}return Promise.resolve()}}});
//# sourceMappingURL=StaticFileConnector.js.map