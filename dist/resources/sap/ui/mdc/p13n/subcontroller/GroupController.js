/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./SelectionController","sap/ui/mdc/p13n/P13nBuilder","sap/m/p13n/GroupPanel"],function(t,e,o){"use strict";const n=t.extend("sap.ui.mdc.p13n.subcontroller.GroupController");n.prototype.getStateKey=function(){return"groupLevels"};n.prototype.getUISettings=function(){return{tabText:sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("p13nDialog.TAB_Group"),title:sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("group.PERSONALIZATION_DIALOG_TITLE")}};n.prototype.getDelta=function(e){return t.prototype.getDelta.apply(this,arguments)};n.prototype.initAdaptationUI=function(t){const e=new o;const n=this.mixInfoAndState(t);const r=this.getAdaptationControl();if(r.isA("sap.ui.mdc.Table")&&r._isOfType("ResponsiveTable")){e.setQueryLimit(1)}e.setP13nData(n.items);this._oPanel=e;return Promise.resolve(e)};n.prototype.model2State=function(){const t=[];this._oPanel.getP13nData(true).forEach(function(e){if(e.grouped){t.push({name:e.name})}});return t};n.prototype.getChangeOperations=function(){return{add:"addGroup",remove:"removeGroup",move:"moveGroup"}};n.prototype._getPresenceAttribute=function(){return"grouped"};n.prototype.mixInfoAndState=function(t){const o=this.getCurrentState();const n=e.arrayToMap(o);const r=this.getAdaptationControl();const i=r.getAggregateConditions?r.getAggregateConditions()||{}:{};const p=this.prepareAdaptationData(t,function(t,e){const o=n[e.name];t.grouped=!!o;t.position=o?o.position:-1;return!(e.groupable===false||i[e.name])});e.sortP13nData({visible:"grouped",position:"position"},p.items);p.presenceAttribute=this._getPresenceAttribute();p.items.forEach(function(t){delete t.position});return p};return n});
//# sourceMappingURL=GroupController.js.map