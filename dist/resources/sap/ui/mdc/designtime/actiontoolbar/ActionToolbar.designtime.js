/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/ActionToolbar","sap/m/p13n/Engine","../Util"],function(n,e,t){"use strict";const a=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");const i={description:"{description}",name:"{name}",aggregations:{between:{propagateMetadata:function(n){if(n.isA("sap.ui.fl.variants.VariantManagement")){return null}return{actions:"not-adaptable"}}}},properties:{},actions:{settings:{name:a.getText("actiontoolbar.RTA_SETTINGS_NAME"),handler:function(n,t){return e.getInstance().getRTASettingsActionHandler(n,t,"actionsKey").then(function(n){return n})},CAUTION_variantIndependent:true}}},r=["actions","between"],s=[];return t.getDesignTime(n,s,r,i)});
//# sourceMappingURL=ActionToolbar.designtime.js.map