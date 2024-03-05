/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/p13n/Engine","./ItemBaseFlex"],function(e,n){"use strict";const r=Object.assign({},n);r.findItem=function(e,n,r){return n.reduce(function(n,t){return n.then(function(n){if(!n){return Promise.all([e.getProperty(t,"propertyKey"),e.getProperty(t,"dataProperty")]).then(function(e){if(e[0]===r||e[1]===r){return t}})}return n})},Promise.resolve())};r.addColumn=r.createAddChangeHandler();r.removeColumn=r.createRemoveChangeHandler();r.moveColumn=r.createMoveChangeHandler();return r});
//# sourceMappingURL=ColumnFlex.js.map