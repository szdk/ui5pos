/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/field/content/DefaultContent","sap/ui/core/library","sap/ui/model/Filter","sap/base/util/isEmptyObject","sap/base/util/merge","sap/ui/mdc/enums/FieldEditMode"],function(e,t,i,a,n,l){"use strict";const d=t.ValueState;const o=function(e,t,i,a,n,l){return e.getUnitTypeInstance?e.getUnitTypeInstance(t,n,l):e.getDataTypeInstance(t.getMetadata().getName(),i,a,{showNumber:n,showMeasure:l})};const s=Object.assign({},e,{getEdit:function(){return["sap/ui/mdc/field/FieldInput","sap/ui/core/InvisibleText"]},getEditMultiValue:function(){return["sap/ui/mdc/field/FieldMultiInput","sap/ui/mdc/field/FieldInput","sap/m/Token","sap/ui/core/InvisibleText"]},getEditMultiLine:function(){return[null]},getUseDefaultValueHelp:function(){return false},createEdit:function(e,t,i){e.setIsMeasure(true);const a=t[0];const n=t[1];const l=e.getConditionsType();this._adjustDataTypeForUnit(e);const d=n.getStaticId("sap.ui.mdc","field.NUMBER");let o=[];const s=new a(i,{value:{path:"$field>/conditions",type:l},placeholder:"{$field>/placeholder}",textAlign:"{$field>/textAlign}",textDirection:"{$field>/textDirection}",valueHelpIconSrc:"sap-icon://slim-arrow-down",required:"{$field>/required}",editable:{path:"$field>/editMode",formatter:e.getMetadata()._oClass._getEditable},enabled:{path:"$field>/editMode",formatter:e.getMetadata()._oClass._getEnabled},valueState:{path:"$field>/valueState",formatter:r},valueStateText:{path:"$field>/valueStateText",formatter:u},showValueHelp:false,width:"70%",tooltip:"{$field>/tooltip}",autocomplete:false,fieldGroupIds:{path:"$field>/fieldGroupIds",formatter:p},ariaDescribedBy:[d],change:e.getHandleContentChange(),liveChange:e.getHandleContentLiveChange()});s._setPreferUserInteraction(true);e.setAriaLabelledBy(s);o.push(s);o=this._addUnitControl(e,o,i,a,n);return o},createEditMultiValue:function(e,t,a){e.setIsMeasure(true);const n=t[0];const l=t[2];const d=t[1];const o=t[3];const s=e.getConditionType();const c=e.getConditionsType();this._adjustDataTypeForUnit(e);let f=[];const g=new l(a+"-token",{text:{path:"$field>",type:s}});const h=new i({path:"values",test:function(e){if(!Array.isArray(e[0])||e[0][0]){return true}else{return false}}});const I=o.getStaticId("sap.ui.mdc","field.NUMBER");const m=new n(a,{value:{path:"$field>/conditions",type:c},placeholder:"{$field>/placeholder}",textAlign:"{$field>/textAlign}",textDirection:"{$field>/textDirection}",required:"{$field>/required}",editable:{path:"$field>/editMode",formatter:e.getMetadata()._oClass._getEditable},enabled:{path:"$field>/editMode",formatter:e.getMetadata()._oClass._getEnabled},valueState:{path:"$field>/valueState",formatter:r},valueStateText:{path:"$field>/valueStateText",formatter:u},showValueHelp:false,width:"70%",tooltip:"{$field>/tooltip}",fieldGroupIds:{path:"$field>/fieldGroupIds",formatter:p},ariaDescribedBy:[I],tokens:{path:"$field>/conditions",template:g,filters:[h]},dependents:[g],autocomplete:false,change:e.getHandleContentChange(),liveChange:e.getHandleContentLiveChange(),tokenUpdate:e.getHandleTokenUpdate()});m._setPreferUserInteraction(true);e.setAriaLabelledBy(m);f.push(m);f=this._addUnitControl(e,f,a,d,o);return f},createEditMultiLine:function(){throw new Error("sap.ui.mdc.field.content.UnitContent - createEditMultiLine not defined!")},_addUnitControl:function(e,t,i,a,n){const d=e.getUnitConditionsType();if(e.getField().getEditMode()===l.EditableDisplay){t[0].bindProperty("description",{path:"$field>/conditions",type:d});t[0].setWidth("100%");t[0].setFieldWidth("70%")}else{let l;const o=e.getUnitOriginalType();const s=o&&o.getMetadata().getName();if(s&&s.indexOf("Currency")>=0){l=n.getStaticId("sap.ui.mdc","field.CURRENCY")}else{l=n.getStaticId("sap.ui.mdc","field.UNIT")}const c=new a(i+"-unit",{value:{path:"$field>/conditions",type:d},placeholder:"{$field>/placeholder}",textAlign:"{$field>/textAlign}",textDirection:"{$field>/textDirection}",required:"{$field>/required}",editable:{path:"$field>/editMode",formatter:e.getMetadata()._oClass._getEditableUnit},enabled:{path:"$field>/editMode",formatter:e.getMetadata()._oClass._getEnabled},valueState:{path:"$field>/valueState",formatter:r},valueStateText:{path:"$field>/valueStateText",formatter:u},valueHelpIconSrc:e.getValueHelpIcon(),showValueHelp:"{$field>/_valueHelpEnabled}",ariaAttributes:"{$field>/_ariaAttributes}",width:"30%",tooltip:"{$field>/tooltip}",autocomplete:false,fieldGroupIds:{path:"$field>/fieldGroupIds",formatter:p},ariaDescribedBy:[l],change:e.getHandleContentChange(),liveChange:e.getHandleContentLiveChange(),valueHelpRequest:e.getHandleValueHelpRequest()});c._setPreferUserInteraction(true);e.setAriaLabelledBy(c);t.push(c)}return t},_adjustDataTypeForUnit:function(e){const t=e.getField();const i=t.getTypeMap();const l=e.retrieveDataType();const d=l.getFormatOptions();const s=l.getConstraints();const r=!d||!d.hasOwnProperty("showMeasure")||d.showMeasure;const u=!d||!d.hasOwnProperty("showNumber")||d.showNumber;if(r&&u){const t=n({},d);const r=a(s)?undefined:n({},s);let u=o(i,l,t,r,true,false);e.setUnitOriginalType(e.getDataType());i.initializeInternalType(u,e.getFieldTypeInitialization());e.setDataType(u);u=o(i,l,t,r,false,true);i.initializeInternalType(u,e.getFieldTypeInitialization());e.setUnitType(u);e.updateConditionType()}}});function r(e){const t=this.getParent();if(!t||!t.isInvalidInput()||t._isInvalidInputForContent(this)){return e}else{return d.None}}function u(e){const t=this.getParent();if(!t||!t.isInvalidInput()){return e}else if(t._isInvalidInputForContent(this)){const e=t._getInvalidInputException(this);return e.message}else{return""}}function p(e){const t=this.getParent();if(t){e.push(t.getId())}else{let t=this.getId();const i=t.lastIndexOf("-inner");t=t.slice(0,i);e.push(t)}return e}return s});
//# sourceMappingURL=UnitContent.js.map