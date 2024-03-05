/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ItemBaseFlex"],function(e){"use strict";const r=Object.assign({},e);r.beforeAddItem=function(e,r,t,n,o){return e.addItem.call(e,t,r,n,o.role)};r.findItem=function(e,r,t){return r.reduce(function(r,n){return r.then(function(r){if(!r){return Promise.all([e.getProperty(n,"propertyKey"),e.getProperty(n,"key")]).then(function(e){if(e[0]===t||e[1]===t){return n}})}return r})},Promise.resolve())};r.addItem=r.createAddChangeHandler();r.removeItem=r.createRemoveChangeHandler();r.moveItem=r.createMoveChangeHandler();return r});
//# sourceMappingURL=ChartItemFlex.js.map