/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/m/MultiInputRenderer","sap/ui/mdc/field/FieldInputRenderUtil"],function(t,e,i){"use strict";const n=t.extend(e);n.apiVersion=2;n.addOuterClasses=function(t,i){e.addOuterClasses.apply(this,arguments);t.class("sapUiMdcFieldMultiInput")};n.getAriaRole=function(t){return i.getAriaRole.call(this,t,e)};n.getAccessibilityState=function(t){return i.getAccessibilityState.call(this,t,e)};n.writeInnerAttributes=function(t,n){return i.writeInnerAttributes.call(this,t,n,e)};return n});
//# sourceMappingURL=FieldMultiInputRenderer.js.map