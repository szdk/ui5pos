/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/flexibility/Util","sap/ui/fl/changeHandler/condenser/Classification"],function(e,t){"use strict";const n={};const r=function(e,t,n){const r=n.modifier;return Promise.resolve().then(r.getProperty.bind(r,t,"chartType")).then(function(n){e.setRevertData(n);r.setProperty(t,"chartType",e.getContent().chartType)})};const i=function(e,t,n){n.modifier.setProperty(t,"chartType",e.getRevertData());e.resetRevertData();return Promise.resolve()};const o=function(e,n){return{classification:t.LastOneWins,affectedControl:e.getSelector(),uniqueKey:"chartType"}};n.setChartType=e.createChangeHandler({apply:r,revert:i,getCondenserInfo:o});return n});
//# sourceMappingURL=ChartTypeFlex.js.map