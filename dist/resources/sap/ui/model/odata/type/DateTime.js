/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/date/UI5Date","sap/ui/model/odata/type/DateTimeBase"],function(t,e,a){"use strict";function n(e,a){var n={};if(a){switch(a.displayFormat){case"Date":n.isDateOnly=true;break;case undefined:break;default:t.warning("Illegal displayFormat: "+a.displayFormat,null,e.getName())}n.nullable=a.nullable}return n}var r=a.extend("sap.ui.model.odata.type.DateTime",{constructor:function(t,e){a.call(this,t,n(this,e))}});r.prototype.getConstraints=function(){var t=a.prototype.getConstraints.call(this);if(t.isDateOnly){t.displayFormat="Date";delete t.isDateOnly}return t};r.prototype.getISOStringFromModelValue=function(t){if(!t){return null}var e=t.toISOString();return this.oConstraints&&this.oConstraints.isDateOnly?e.split("T")[0]:e};r.prototype.getModelValue=function(t){var e=this._getModelValue(t);this.validateValue(e);return e};r.prototype.getModelValueFromISOString=function(t){if(!t){return null}return e.getInstance(t)};r.prototype.getName=function(){return"sap.ui.model.odata.type.DateTime"};return r});
//# sourceMappingURL=DateTime.js.map