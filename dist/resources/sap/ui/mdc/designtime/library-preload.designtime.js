//@ui5-bundle sap/ui/mdc/designtime/library-preload.designtime.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/Util", [],function(){"use strict";function e(){return{actions:{},aggregations:{},description:"{description}",name:"{name}",properties:{}}}function t(e,t,n){const i=e.includes(t);const r=i&&n[t]||{};if(!Object.keys(r).length){r[t]={ignore:!i};Object.assign(n,r)}}return{getDesignTime:function(n,i,r,s){s=s?s:e();s.actions=s.actions?s.actions:{};s.properties=s.properties?s.properties:{};s.aggregations=s.aggregations?s.aggregations:{};i=i?i:[];r=r?r:[];const o=n.getMetadata(),g=Object.keys(o.getAllProperties()).concat(Object.keys(o.getAllPrivateProperties())),a=Object.keys(o.getAllAggregations()).concat(Object.keys(o.getAllPrivateAggregations()));g.forEach(function(e){t(i,e,s.properties)});a.forEach(function(e){t(r,e,s.aggregations)});return s}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/actiontoolbar/ActionToolbar.designtime", ["sap/ui/mdc/ActionToolbar","sap/m/p13n/Engine","../Util"],function(n,e,t){"use strict";const a=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");const i={description:"{description}",name:"{name}",aggregations:{between:{propagateMetadata:function(n){if(n.isA("sap.ui.fl.variants.VariantManagement")){return null}return{actions:"not-adaptable"}}}},properties:{},actions:{settings:{name:a.getText("actiontoolbar.RTA_SETTINGS_NAME"),handler:function(n,t){return e.getInstance().getRTASettingsActionHandler(n,t,"actionsKey").then(function(n){return n})},CAUTION_variantIndependent:true}}},r=["actions","between"],s=[];return t.getDesignTime(n,s,r,i)});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/actiontoolbar/ActionToolbarAction.designtime", ["sap/ui/mdc/actiontoolbar/ActionToolbarAction","../Util"],function(t,e){"use strict";const n={description:"{description}",name:"{name}",aggregations:{action:{propagateMetadata:function(t){return{actions:{rename:{changeType:"rename",domRef:function(t){return t.$()},getTextMutators:function(t){return{getText:function(){return t.getDomRef().textContent},setText:function(e){t.getDomRef().textContent=e}}}},remove:null,reveal:null}}}}},properties:{},actions:{}},o=["action"],i=[];return e.getDesignTime(t,i,o,n)});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/chart/Chart.designtime", ["sap/m/p13n/Engine","sap/ui/mdc/Chart","../Util"],function(e,n,t){"use strict";const i={actions:{settings:function(){return{handler:function(n,t){const i=n.getP13nMode();const r=i.indexOf("Type");if(r>-1){i.splice(r,1)}if(n.isPropertyHelperFinal()){return e.getInstance().getRTASettingsActionHandler(n,t,i)}else{return n.finalizePropertyHelper().then(function(){return e.getInstance().getRTASettingsActionHandler(n,t,i)})}}}}},aggregations:{_toolbar:{propagateMetadata:function(e){return null}}}};const r=["_toolbar"],a=["headerLevel","headerVisible"];return t.getDesignTime(n,a,r,i)});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/field/Field.designtime", ["sap/ui/fl/Utils","sap/ui/fl/apply/api/FlexRuntimeInfoAPI","sap/m/p13n/Engine","sap/ui/core/Core"],function(e,n,t,o){"use strict";const r=o.getLibraryResourceBundle("sap.ui.mdc");return{properties:{value:{ignore:true},additionalValue:{ignore:true}},getStableElements:function(t){if(!t.getFieldInfo()){return[]}const r=t.getFieldInfo();let i=typeof r.getSourceControl()==="string"?o.byId(r.getSourceControl()):r.getSourceControl();if(!i){i=t}const l=e.getAppComponentForControl(i)||e.getAppComponentForControl(t);const s=r._createPanelId(e,n);return[{id:s,appComponent:l}]},actions:{settings:function(o){if(!o.getFieldInfo()){return{}}return{name:r.getText("info.POPOVER_DEFINE_LINKS"),handler:function(r,i){const l=r.getFieldInfo();return l.getContent().then(function(s){l.addDependent(s);return n.waitForChanges({element:s}).then(function(){i.fnAfterClose=function(){s.destroy()};const l=function(){return t.getInstance().getRTASettingsActionHandler(s,i,"LinkItems").then(function(n){n.forEach(function(n){const t=n.selectorElement;delete n.selectorElement;const i=e.getAppComponentForControl(r)||e.getAppComponentForControl(o);n.selectorControl={id:t.getId(),controlType:t===s?"sap.ui.mdc.link.Panel":"sap.ui.mdc.link.PanelItem",appComponent:i}});return n})};const u=s.getItems();if(u.length>0){return n.waitForChanges({selectors:u}).then(function(){return l()})}else{return l()}})})},CAUTION_variantIndependent:true}}},tool:{start:function(e){e.getFieldInfo()?.setEnablePersonalization(false)},stop:function(e){e.getFieldInfo()?.setEnablePersonalization(true)}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/field/FieldBase.designtime", ["sap/ui/mdc/field/FieldBase","../Util"],function(e,i){"use strict";const s={};const t=[],n=[];return i.getDesignTime(e,n,t,s)});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/field/FilterField.designtime", [],function(){"use strict";return{properties:{operators:{ignore:true},defaultOperator:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/field/MultiValueField.designtime", [],function(){"use strict";return{properties:{delegate:{ignore:true}},aggregations:{items:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/filterbar/FilterBar.designtime", ["sap/m/p13n/Engine"],function(e){"use strict";return{actions:{settings:function(){return{name:"filterbar.ADAPT_TITLE",handler:function(t,n){return t.initializedWithMetadata().then(function(){return e.getInstance().getRTASettingsActionHandler(t,n,"Item")})}}}},aggregations:{layout:{ignore:true},basicSearchField:{ignore:true},filterItems:{ignore:true}},properties:{showAdaptFiltersButton:{ignore:false},showClearButton:{ignore:false},p13nMode:{ignore:false}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/filterbar/FilterBarBase.designtime", [],function(){"use strict";return{properties:{showGoButton:{ignore:false},delegate:{ignore:true},liveMode:{ignore:false},showMessages:{ignore:false},filterConditions:{ignore:true},propertyInfo:{ignore:true},suspendSelection:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/library.designtime", [],function(){"use strict";return{}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/table/Table.designtime", ["sap/m/p13n/Engine","sap/ui/mdc/Table","../Util"],function(e,t,n){"use strict";const i={name:"{name}",description:"{description}",actions:{settings:function(){return{handler:function(t,n){return t.finalizePropertyHelper().then(function(){return e.getInstance().getRTASettingsActionHandler(t,n,t.getActiveP13nModes())})}}}},properties:{},aggregations:{_content:{domRef:":sap-domref",propagateMetadata:function(e){if(e.isA("sap.ui.fl.variants.VariantManagement")||e.isA("sap.ui.mdc.ActionToolbar")||e.isA("sap.ui.mdc.actiontoolbar.ActionToolbarAction")||e.isA("sap.ui.mdc.Field")||e.getParent()&&(e.getParent().isA("sap.ui.mdc.actiontoolbar.ActionToolbarAction")||e.getParent().isA("sap.ui.mdc.Field"))){return null}return{actions:"not-adaptable"}}}}};const a=["width","headerLevel","header","headerVisible","showRowCount","threshold","enableExport","busyIndicatorDelay","enableColumnResize","showPasteButton","multiSelectMode"],o=["_content"];return n.getDesignTime(t,a,o,i)});
//# sourceMappingURL=library-preload.designtime.js.map
