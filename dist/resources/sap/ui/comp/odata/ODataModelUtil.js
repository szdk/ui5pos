/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/model/odata/v2/ODataModel"],function(e){"use strict";var t={handleModelInit:function(t,a,i){var n=false,o;if(t&&!t._bMetaModelLoadAttached&&a){o=t.getModel();if(o){if(o.getMetadata()&&o instanceof e){n=true}else if(o.bLoadMetadataAsync||o.getServiceMetadata&&!o.getServiceMetadata()){n=true}t._bMetaModelLoadAttached=true;if(n&&o.getMetaModel()&&o.getMetaModel().loaded){var l=!!i;if(!l){o.getMetaModel().loaded().then(a.bind(t))}else{this._getFlexRuntimeInfoAPI().then(function(e){var n;if(!e.isFlexSupported({element:t})){n=Promise.resolve()}else if(typeof i==="boolean"){n=e.waitForChanges({element:t})}else{n=e.waitForChanges({complexSelectors:i})}Promise.all([o.getMetaModel().loaded(),n]).then(a.bind(t))})}}else{a.apply(t)}}}},_getFlexRuntimeInfoAPI:function(){return sap.ui.getCore().loadLibrary("sap.ui.fl",{async:true}).then(function(){return new Promise(function(e){sap.ui.require(["sap/ui/fl/apply/api/FlexRuntimeInfoAPI"],function(t){e(t)})})})}};return t},true);
//# sourceMappingURL=ODataModelUtil.js.map