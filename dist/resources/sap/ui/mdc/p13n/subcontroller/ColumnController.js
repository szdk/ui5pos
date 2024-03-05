/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./SelectionController","sap/m/p13n/SelectionPanel"],function(e,t){"use strict";const n=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");const o=e.extend("sap.ui.mdc.p13n.subcontroller.ColumnController");o.prototype.getUISettings=function(){return{title:n.getText("table.SETTINGS_COLUMN"),tabText:n.getText("p13nDialog.TAB_Column")}};o.prototype.model2State=function(){const e=[];this._oPanel.getP13nData(true).forEach(function(t){if(t.visible){e.push({name:t.name})}});return e};o.prototype.createUI=function(e){const o=new t({showHeader:true,enableCount:true,title:n.getText("fieldsui.COLUMNS"),fieldColumn:n.getText("fieldsui.COLUMNS")});o.setEnableReorder(this._bReorderingEnabled);return o.setP13nData(e.items)};o.prototype.getChangeOperations=function(){return{add:"addColumn",remove:"removeColumn",move:"moveColumn"}};return o});
//# sourceMappingURL=ColumnController.js.map