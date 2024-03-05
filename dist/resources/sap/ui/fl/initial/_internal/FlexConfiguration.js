/*!
* OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/base/config"],e=>{"use strict";const t=e.getWritableInstance();const i={getFlexibilityServices(){const e=[{url:"/sap/bc/lrep",connector:"LrepConnector"}];const i=t.get({name:"sapUiFlexibilityServices",type:t=>{if(typeof t==="string"){if(t===""){return[]}if(t[0]==="/"){e[0].url=t;t=e}else{t=JSON.parse(t)}}return t||[]},defaultValue:e,external:true});return i},setFlexibilityServices(e){t.set("sapUiFlexibilityServices",e.slice())}};return i});
//# sourceMappingURL=FlexConfiguration.js.map