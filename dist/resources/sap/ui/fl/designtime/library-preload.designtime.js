//@ui5-bundle sap/ui/fl/designtime/library-preload.designtime.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/library.designtime", [],function(){"use strict";return{}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/util/IFrame.designtime", ["sap/ui/core/Element","sap/ui/rta/plugin/iframe/AddIFrameDialog","sap/m/library"],function(e,t){"use strict";function a(a){var i=new t;var r=a.get_settings();var n=a.getRenameInfo();var o;var u;if(n){u=e.getElementById(n.sourceControlId);r.title=u.getProperty(n.propertyName)}return t.buildUrlBuilderParametersFor(a).then(function(e){o={parameters:e,frameUrl:r.url,frameWidth:r.width,frameHeight:r.height,title:r.title,asContainer:!!r.title,useLegacyNavigation:r.useLegacyNavigation,updateMode:true};return i.open(o)}).then(function(t){if(!t){return[]}var i=[];var o=false;var u={url:r.url,height:r.height,width:r.width,useLegacyNavigation:r.useLegacyNavigation};if(t.frameHeight+t.frameHeightUnit!==r.height){o=true;u.height=t.frameHeight+t.frameHeightUnit}if(t.frameWidth+t.frameWidthUnit!==r.width){o=true;u.width=t.frameWidth+t.frameWidthUnit}if(t.frameUrl!==r.url){o=true;u.url=t.frameUrl}if(t.useLegacyNavigation!==!!r.useLegacyNavigation){o=true;u.useLegacyNavigation=t.useLegacyNavigation}if(o){i.push({selectorControl:a,changeSpecificData:{changeType:"updateIFrame",content:u}})}if(t.title!==r.title){var g={selectorControl:e.getElementById(n.selectorControlId),changeSpecificData:{changeType:"rename",content:{value:t.title}}};i.push(g)}return i})}return{actions:{settings(){return{icon:"sap-icon://write-new",name:"CTX_EDIT_IFRAME",isEnabled:true,handler:a}},remove:{changeType:"hideControl"},reveal:{changeType:"unhideControl"}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/variants/VariantManagement.designtime", ["sap/ui/core/Lib","sap/ui/fl/apply/api/ControlVariantApplyAPI","sap/ui/fl/Utils"],function(e,t,r){"use strict";var a=function(e,a){var o=r.getAppComponentForControl(e);var n=e.getId();var i=o.getModel(t.getVariantModelName());var l=o.getLocalId(n)||n;if(!i){return}if(a){i.waitForVMControlInit(l).then(function(){i.setModelPropertiesForControl(l,a,e);i.checkUpdate(true)})}else{i.setModelPropertiesForControl(l,a,e);i.checkUpdate(true)}};return{annotations:{},properties:{showSetAsDefault:{ignore:false},inErrorState:{ignore:false},editable:{ignore:false},modelName:{ignore:false},updateVariantInURL:{ignore:true},resetOnContextChange:{ignore:true},executeOnSelectionForStandardDefault:{ignore:false},displayTextForExecuteOnSelectionForStandardVariant:{ignore:false},headerLevel:{ignore:false}},variantRenameDomRef(e){return e.getTitle().getDomRef("inner")},customData:{},tool:{start(e){var t=true;a(e,t);e.enteringDesignMode()},stop(e){var t=false;a(e,t);e.leavingDesignMode()}},actions:{controlVariant(a){var o=r.getAppComponentForControl(a);var n=a.getId();var i=o.getModel(t.getVariantModelName());var l=o.getLocalId(n)||n;return{validators:["noEmptyText",{validatorFunction(e){var t=i._getVariantTitleCount(e,l)||0;return t===0},errorMessage:e.getResourceBundleFor("sap.m").getText("VARIANT_MANAGEMENT_ERROR_DUPLICATE")}]}}}}});
//# sourceMappingURL=library-preload.designtime.js.map
