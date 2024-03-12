sap.ui.define(["sap/ui/model/SimpleType","sap/ui/model/ValidateException","sap/base/i18n/ResourceBundle"],function(e,t,n){let i={setResourceBundel:e=>{i.i18n=e},product:{name:e.extend("product.id",{formatValue:e=>e,parseValue:e=>e,validateValue:function(e){if(!e||e.length==0)throw new t(i.i18n.getText("input_required"));if(e.length>40)throw new t(i.i18n.getText("input_length_exceeded",[40]))}}),unitPrice:e.extend("product.unitPrice",{formatValue:e=>{let t=Math.round(parseFloat(e)*100)/100;if(!isNaN(t)&&typeof t=="number")return t},parseValue:e=>{let t=Math.round(parseFloat(e)*100)/100;if(!isNaN(t)&&typeof t=="number")return t},validateValue:function(e){e=parseFloat(e);if(e!==0&&!e||e<0)throw new t(i.i18n.getText("input_invalid"))}}),unitInStock:e.extend("product.unitInStock",{formatValue:e=>{let t=parseInt(e);if(!isNaN(t)&&typeof t=="number")return t},parseValue:e=>{let t=parseInt(e);if(!isNaN(t)&&typeof t=="number")return t},validateValue:function(e){e=parseInt(e);if(e!==0&&!e)throw new t(i.i18n.getText("input_invalid"))}}),quantityPerUnit:e.extend("product.quantityPerUnit",{formatValue:e=>e,parseValue:e=>e,validateValue:function(e){if(!e||e.length==0)throw new t(i.i18n.getText("input_required"));if(e.length>20)throw new t(i.i18n.getText("input_length_exceeded",[20]))}})},category:{id:e.extend("category.id",{formatValue:e=>{let t=parseInt(e);if(!isNaN(t)&&typeof t=="number")return t},parseValue:e=>{let t=parseInt(e);if(!isNaN(t)&&typeof t=="number")return t},validateValue:function(e){if(e)e=parseInt(e);if(!e||e<=0)throw new t(i.i18n.getText("input_invalid_category_id",[id]))}})},supplier:{id:e.extend("supplier.id",{formatValue:e=>{let t=parseInt(e);if(!isNaN(t)&&typeof t=="number")return t},parseValue:e=>{let t=parseInt(e);if(!isNaN(t)&&typeof t=="number")return t},validateValue:function(e){if(e)e=parseInt(e);if(!e||e<=0)throw new t(i.i18n.getText("input_invalid_supplier_id",[id]))}})}};return i});
//# sourceMappingURL=InputCheck.js.map