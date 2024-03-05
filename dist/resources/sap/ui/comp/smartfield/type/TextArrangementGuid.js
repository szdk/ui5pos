/*
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/smartfield/type/TextArrangement","sap/ui/comp/smartfield/type/Guid","sap/ui/model/ValidateException","sap/base/assert"],function(t,e,i,r){"use strict";var n=t.extend("sap.ui.comp.smartfield.type.TextArrangementGuid");n.prototype.init=function(){t.prototype.init.apply(this,arguments);if(this.oFormatOptions&&this.oFormatOptions.textArrangement==="descriptionOnly"){this.oValidateExceptionSettings={resourceBundle:"sap.ui.comp",text:"ENTER_AN_EXISTING_DESCRIPTION"}}else{this.oValidateExceptionSettings={resourceBundle:"",text:"EnterGuid"}}};n.prototype.parseDescriptionOnly=function(n,s,p,a,u){var l=e.prototype.parseValue.call(this,n,s);if(o(l)){return new Promise(function(t,e){function n(n){if(n.length===1){this.sDescription=n[0][u.descriptionField];t([l,undefined]);return}if(n.length===0){e(new i(this.getResourceBundleText("SMARTFIELD_NOT_FOUND")));return}r(false,"Duplicate GUID. - "+this.getName())}function o(t){e(new i(this.getResourceBundleText("SMARTFIELD_INVALID_ENTRY")))}var s={filterFields:this.getFilterFields(l),success:n.bind(this),error:o.bind(this)};this.onBeforeValidateValue(l,s)}.bind(this))}else{n=n.trim();return t.prototype.parseDescriptionOnly.call(this,n,s,p,a,u)}};n.prototype.getFilterFields=function(t){if(this.oFormatOptions.textArrangement==="descriptionOnly"){if(o(t)){return["keyField"]}return["descriptionField"]}return["keyField","descriptionField"]};n.prototype.getName=function(){return"sap.ui.comp.smartfield.type.TextArrangementGuid"};n.prototype.getPrimaryType=function(){return e};n.prototype.formatValue=function(e){var i=t.prototype.formatValue.apply(this,arguments);if(this.oFormatOptions.textArrangement==="descriptionOnly"&&i==="00000000-0000-0000-0000-000000000000"){i=""}return i};function o(t){var e=/^[A-F0-9]{8}-([A-F0-9]{4}-){3}[A-F0-9]{12}$/i;return e.test(t)}return n});
//# sourceMappingURL=TextArrangementGuid.js.map