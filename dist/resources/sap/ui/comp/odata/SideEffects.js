/*
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var e=function(){};e.prototype.getSideEffects=function(e,t,r){var i={};if(r){if(e){if(r.entitySet){i.entitySet=this._getForPath(r.entitySet,e)}if(r.entityType){i.entityType=this._getForPath(r.entityType,e)}}if(t&&r.complexType){i.complexType=this._getForPath(r.complexType,t)}}return i};e.prototype._getForPath=function(e,t){var r,i,o={};for(r in e){if(r.indexOf&&r.indexOf("com.sap.vocabularies.Common.v1.SideEffects")===0){i=e[r];if(this._checkSourceProperties(i,t)){o[r]=i}if(this._checkSourceEntities(i,t)){o[r]=i}}}return o};e.prototype._checkSourceProperties=function(e,t){var r,i;if(e.SourceProperties){i=e.SourceProperties.length;for(r=0;r<i;r++){if(e.SourceProperties[r].PropertyPath===t){return true}}}return false};e.prototype._checkSourceEntities=function(e,t){var r,i;if(e.SourceEntities&&e.SourceEntities.Collection){i=e.SourceEntities.Collection.length;for(r=0;r<i;r++){if(e.SourceEntities.Collection[r].NavigationPropertyPath===t){return true}}}else if(e.SourceEntities&&Array.isArray(e.SourceEntities)){i=e.SourceEntities.length;for(r=0;r<i;r++){if(e.SourceEntities[r].NavigationPropertyPath===t){return true}}}return false};e.prototype.destroy=function(){};return e},true);
//# sourceMappingURL=SideEffects.js.map