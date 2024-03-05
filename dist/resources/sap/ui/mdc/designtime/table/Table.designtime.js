/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/p13n/Engine","sap/ui/mdc/Table","../Util"],function(e,t,n){"use strict";const i={name:"{name}",description:"{description}",actions:{settings:function(){return{handler:function(t,n){return t.finalizePropertyHelper().then(function(){return e.getInstance().getRTASettingsActionHandler(t,n,t.getActiveP13nModes())})}}}},properties:{},aggregations:{_content:{domRef:":sap-domref",propagateMetadata:function(e){if(e.isA("sap.ui.fl.variants.VariantManagement")||e.isA("sap.ui.mdc.ActionToolbar")||e.isA("sap.ui.mdc.actiontoolbar.ActionToolbarAction")||e.isA("sap.ui.mdc.Field")||e.getParent()&&(e.getParent().isA("sap.ui.mdc.actiontoolbar.ActionToolbarAction")||e.getParent().isA("sap.ui.mdc.Field"))){return null}return{actions:"not-adaptable"}}}}};const a=["width","headerLevel","header","headerVisible","showRowCount","threshold","enableExport","busyIndicatorDelay","enableColumnResize","showPasteButton","multiSelectMode"],o=["_content"];return n.getDesignTime(t,a,o,i)});
//# sourceMappingURL=Table.designtime.js.map