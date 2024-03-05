/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ItemBaseFlex"],function(e){"use strict";const t=Object.assign({},e);t.findItem=function(e,t,n){return t.find(function(t){let i;if(e.targets==="jsControlTree"){i=t.getPropertyKey()}else{i=t.getAttribute("conditions");if(i){let e;const t=i.indexOf("/conditions/");if(t>=0){i=i.slice(t+12);e=i.indexOf("}");if(e>=0){i=i.slice(0,e)}}}}return i===n})};t.beforeApply=function(e){if(e.applyConditionsAfterChangesApplied){e.applyConditionsAfterChangesApplied()}};t.addFilter=t.createAddChangeHandler();t.removeFilter=t.createRemoveChangeHandler();t.moveFilter=t.createMoveChangeHandler();return t},true);
//# sourceMappingURL=FilterItemFlex.js.map