/*
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var t=function(t,e,a){this._oMetaData=t;this._oParent=e;this._oTypes=a};t.prototype.checkComboBox=function(t){var e={},a;if(typeof t!=="undefined"){a=t.mode}if(a==="display"){e.combobox=false;return e}return this._checkComboBox()};t.prototype._checkComboBox=function(){var t={};if(this._oMetaData.annotations.valuelist){t.valuelistType=this._oMetaData.annotations.valuelistType;t.annotation=this._oMetaData.annotations.valuelist}if(!t.annotation){return t}if(t.valuelistType==="fixed-values"){t.combobox=true}if(!t.combobox){t.annotation=this._oMetaData.annotations.valuelist;t.combobox=this._checkConfig("dropDownList")}return t};t.prototype.checkSelection=function(){var t={};if(this._oMetaData.annotations.valuelist){t.annotation=this._oMetaData.annotations.valuelist;t.selection=this._checkConfig("selection")}return t};t.prototype.checkCheckBox=function(){var t,e;if(this._oMetaData.property&&this._oMetaData.property.property&&this._oMetaData.property.property.type==="Edm.String"){t=this._oParent.getBindingInfo("value");e=this._oTypes.getMaxLength(this._oMetaData.property,t);if(e===1){if(this._checkConfig("checkBox")){return true}}}return false};t.prototype.checkDatePicker=function(){if(this._oMetaData.property&&this._oMetaData.property.property&&(this._oMetaData.property.property["sap:display-format"]==="Date"||this._oTypes.isCalendarDate(this._oMetaData.property))){return true}return this._checkConfig("datePicker")};t.prototype._checkConfig=function(t){var e=this._oParent.getConfiguration();if(e){return e.getControlType()===t}return false};t.prototype.getCreator=function(t){var e,a;if(typeof t!=="undefined"){if(typeof t==="boolean"){e=t}else{e=t.blockSmartLinkCreation;a=t.mode}}var o={"Edm.Decimal":"_createEdmNumeric","Edm.Double":"_createEdmNumeric","Edm.Float":"_createEdmNumeric","Edm.Single":"_createEdmNumeric","Edm.Int16":"_createEdmNumeric","Edm.Int32":"_createEdmNumeric","Edm.Int64":"_createEdmNumeric","Edm.Byte":"_createEdmNumeric","Edm.DateTimeOffset":"_createEdmDateTimeOffset","Edm.DateTime":"_createEdmDateTime","Edm.Boolean":"_createEdmBoolean","Edm.String":"_createEdmString","Edm.Time":"_createEdmTime"};if(this._isUOMDisplayObjectStatus()){return"_createEdmUOMObjectStatus"}if(this._isUOMDisplay()){return"_createEdmUOMObjectNumber"}if(a==="display"){if(this._oMetaData.annotations){if(this.useObjectIdentifier(this.checkDatePicker())&&this._oMetaData.annotations.text&&this._oMetaData.annotations.semanticKeys&&this._oMetaData.annotations.semanticKeys.semanticKeyFields&&this._oMetaData.annotations.semanticKeys.semanticKeyFields.indexOf(this._oMetaData.path)>-1){return"_createEdmDisplay"}if(this._oMetaData.annotations.semantic&&!e){return"_createEdmSemantic"}if(this._oMetaData.annotations.uom){return"_createEdmUOMDisplay"}if(this._isObjectStatusProposed()){return"_createObjectStatus"}return this._oMetaData.property&&this._oMetaData.property.property&&this._oMetaData.property.property.type==="Edm.Boolean"?"_createEdmBoolean":"_createEdmDisplay"}}if(this._oMetaData.annotations&&this._oMetaData.annotations.uom){return"_createEdmUOM"}if(this._oMetaData.property&&this._oMetaData.property.property){if(this._oTypes.isCalendarDate(this._oMetaData.property)){return"_createEdmDateTime"}return o[this._oMetaData.property.property.type]||"_createEdmString"}return null};t.prototype._isUOMDisplay=function(){if(this._oMetaData.annotations.uom){if(this._isObjectNumberProposed()){if(!this._oParent.getContextEditable()||!this._oParent.getEditable()&&!this._oParent.getUomEditable()||!this._oParent.getEnabled()&&!this._oParent.getUomEnabled()){return true}if(this._oParent.getProperty("uomEditState")===0){return true}}}return false};t.prototype._isUOMDisplayObjectStatus=function(){if(this._oMetaData.annotations.uom){if(this._isObjectStatusProposed()){if(!this._oParent.getContextEditable()||!this._oParent.getEditable()&&!this._oParent.getUomEditable()||!this._oParent.getEnabled()&&!this._oParent.getUomEnabled()){return true}if(this._oParent.getProperty("uomEditState")===0){return true}}}return false};t.prototype._isObjectStatusProposed=function(){var t=this._oParent.getControlProposal(),e;if(t){e=t.getObjectStatus();if(e){return true}}return false};t.prototype._isObjectNumberProposed=function(){var t;if(this._oParent.data("suppressUnit")!=="true"){t=this._oParent.getControlProposal();if(t&&t.getControlType()==="ObjectNumber"){return true}if(this._oParent.getProposedControl()==="ObjectNumber"){return true}}return false};t.prototype.useObjectIdentifier=function(t,e){var a;if(this._oMetaData&&this._oMetaData.property&&this._oMetaData.property.property&&this._oMetaData.property.property.type==="Edm.String"){if(!t&&!e){a=this._oParent.getControlProposal();if(a&&a.getControlType()==="ObjectIdentifier"){return true}if(this._oParent.getProposedControl()==="ObjectIdentifier"){return true}}}return false};t.prototype.destroy=function(){this._oParent=null;this._oMetaData=null;this._oTypes=null};return t},true);
//# sourceMappingURL=ODataControlSelector.js.map