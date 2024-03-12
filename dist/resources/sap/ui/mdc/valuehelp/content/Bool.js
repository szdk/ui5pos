/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/valuehelp/content/FixedList","sap/ui/mdc/util/loadModules","sap/ui/model/ParseException"],function(e,t,o){"use strict";const s=e.extend("sap.ui.mdc.valuehelp.content.Bool",{metadata:{library:"sap.ui.mdc",interfaces:["sap.ui.mdc.valuehelp.ITypeaheadContent"]}});s.prototype.init=function(){e.prototype.init.apply(this,arguments);this.setUseFirstMatch(true);this.setUseAsValueHelp(true);this.setFilterList(false);this.setCaseSensitive(false);this._oObserver.observe(this,{properties:["config"]})};s.prototype.exit=function(){if(this._oModel){this._oModel.destroy();this._oModel=undefined}e.prototype.exit.apply(this,arguments)};s.prototype.getContent=function(){return this._retrievePromise("boolContent",function(){return t(["sap/ui/mdc/valuehelp/content/FixedListItem","sap/ui/model/json/JSONModel"]).then(function(t){const o=t[0];const s=t[1];this._oModel=new s({type:"",items:[{key:true,text:"true"},{key:false,text:"false"}]});i.call(this,this.getConfig());const n=new o(this.getId()+"-Item",{key:{path:"$Bool>key"},text:{path:"$Bool>text"}});this.bindAggregation("items",{path:"$Bool>/items",template:n});this.setModel(this._oModel,"$Bool");return e.prototype.getContent.apply(this,arguments)}.bind(this))}.bind(this))};s.prototype.getItemForValue=function(e){return Promise.resolve().then(function(){const t=this.getConfig();const s=e.dataType||t&&t.dataType;if(s){if(e.checkKey){if(e.parsedValue===true||e.parsedValue===false){return{key:e.parsedValue,description:s.formatValue(e.parsedValue,"string")}}else{e.checkDescription=true}}if(e.checkDescription&&e.value){const t=s.formatValue(true,"string");if(t.toLowerCase().startsWith(e.value.toLowerCase())){return{key:true,description:t}}const o=s.formatValue(false,"string");if(o.toLowerCase().startsWith(e.value.toLowerCase())){return{key:false,description:o}}}const t=this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST",[e.value]);const i=e.exception||o;throw new i(t)}else{throw new Error("Type missing")}}.bind(this))};s.prototype.shouldOpenOnClick=function(){return false};s.prototype.isNavigationEnabled=function(e){return true};s.prototype.observeChanges=function(t){if(t.type==="property"&&t.name==="config"){i.call(this,t.current)}e.prototype.observeChanges.apply(this,arguments)};function i(e){if(this._oModel&&e){const t=e.dataType;const o=this._oModel.getData();if(t&&o["type"]!==t.getMetadata().getName()){o["type"]=t.getMetadata().getName();const e=o["items"];for(let o=0;o<e.length;o++){const s=e[o];s["text"]=t.formatValue(s["key"],"string")}this._oModel.checkUpdate(true)}}}return s});
//# sourceMappingURL=Bool.js.map