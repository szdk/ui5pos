/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(function(){"use strict";return{actions:{localReset:"localReset"},aggregations:{groups:{propagateRelevantContainer:true,childNames:{singular:"GROUP_CONTROL_NAME",plural:"GROUP_CONTROL_NAME_PLURAL"},actions:{move:"moveGroups",remove:{removeLastElement:true},createContainer:{changeType:"addGroup",isEnabled:true,getCreatedContainerId:function(e){return e}}}},customToolbar:{propagateMetadata:function(e){if(e.isA(["sap.m.ToolbarSpacer","sap.m.ToolbarSeparator"])){return{actions:"not-adaptable"}}}}},name:"{name}",description:"{description}",properties:{title:{ignore:false},useHorizontalLayout:{ignore:false},horizontalLayoutGroupElementMinWidth:{ignore:true},checkButton:{ignore:false},entityType:{ignore:true},expandable:{ignore:false},expanded:{ignore:false},editTogglable:{ignore:false},editable:{ignore:false},ignoredFields:{ignore:true},flexEnabled:{ignore:true},validationMode:{ignore:true},importance:{ignore:true}}}},true);
//# sourceMappingURL=SmartForm.designtime.js.map