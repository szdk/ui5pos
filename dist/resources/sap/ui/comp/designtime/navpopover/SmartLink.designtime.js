/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/navpopover/RTAHandler","sap/m/ObjectIdentifier","sap/base/Log"],function(e,n,t){"use strict";var a=function(e){var n=e.getModel("$sapuicompNavigationPopoverHandler");return e._initModel().then(function(){return e._getEnableAvailableActionsPersonalization(n.getProperty("/availableActions"))})};var i=function(e){a(e).then(function(n){if(!e._oRTANavigationHandling.enabled){e.setEnableAvailableActionsPersonalization(false);e._oRTANavigationHandling.initialValue=n;e._oRTANavigationHandling.enabled=true}})};var o=function(e){if(e._oRTANavigationHandling.enabled){e.setEnableAvailableActionsPersonalization(e._oRTANavigationHandling.initialValue);e._oRTANavigationHandling.enabled=false}};(function(){n.getMetadata().loadDesignTime().then(function(n){if(n.registerSettingsHandler){n.registerSettingsHandler({getStableElements:function(n){var t;n.fireEvent("ObjectIdentifier.designtime",{caller:"ObjectIdentifier.designtime",registerNavigationPopoverHandler:function(e){t=e;i(t)}});return e.getStableElements(t)},isSettingsAvailable:function(){return e.isSettingsAvailable()},execute:function(n,t){var a;n.fireEvent("ObjectIdentifier.designtime",{caller:"ObjectIdentifier.designtime",registerNavigationPopoverHandler:function(e){a=e;i(a)}});return e.execute(a,t)}})}})})();return{getStableElements:function(n){return e.getStableElements(n.getNavigationPopoverHandler())},actions:{settings:function(){if(!e.isSettingsAvailable()){t.error("sap.ui.comp.navpopover.SmartLink.designtime: 'settings' action is not available");return}return{handler:function(n,t){return e.execute(n.getNavigationPopoverHandler(),t.getUnsavedChanges,t.styleClass)}}}},tool:{start:function(e){i(e.getNavigationPopoverHandler())},stop:function(e){o(e.getNavigationPopoverHandler())}},annotations:{semanticObjectMapping:{namespace:"com.sap.vocabularies.Common.v1",annotation:"SemanticObjectMapping",target:["Property"],defaultValue:null,appliesTo:["text"],group:["Behavior"],since:"1.48.0"},contact:{namespace:"com.sap.vocabularies.Communication.v1",annotation:"Contact",target:["EntityType"],allowList:{values:["Hidden"]},defaultValue:null,appliesTo:["text","label","value"],group:["Behavior"],since:"1.40.1"},semanticObjectUnavailableActions:{namespace:"com.sap.vocabularies.Common.v1",annotation:"SemanticObjectUnavailableActions",target:["Property"],defaultValue:null,appliesTo:["text"],group:["Behavior"],since:"1.60.0"}},properties:{semanticObject:{ignore:true},additionalSemanticObjects:{ignore:true},semanticObjectController:{ignore:true},fieldName:{ignore:true},semanticObjectLabel:{ignore:true},createControlCallback:{ignore:true},mapFieldToSemanticObject:{ignore:false},contactAnnotationPath:{ignore:false},ignoreLinkRendering:{ignore:true},enableAvailableActionsPersonalization:{ignore:false},uom:{ignore:true},enabled:{ignore:false},forceLinkRendering:{ignore:true},beforeNavigationCallback:{ignore:true}},customData:{}}});
//# sourceMappingURL=SmartLink.designtime.js.map