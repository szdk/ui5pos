/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["./library","./ExportBase","./ExportDialog","./ExportUtils","./SpreadsheetExport","sap/base/Log","sap/ui/core/Core","sap/ui/Device"],function(e,t,r,o,i,s,n,a){"use strict";var c="sap.ui.export.Spreadsheet";var u=t.extend(c,{constructor:function(e){t.call(this,e);this._mSettings.customizing={};this._mSettings.showProgress=true;this._mSettings.worker=true;["showProgress","worker"].forEach(function(t){if(typeof e[t]!=="undefined"){this._mSettings[t]=e[t]}}.bind(this));this.codeListsPromise=this.codeListsPromise instanceof Promise?this.codeListsPromise:Promise.resolve([null,null])}});function l(e,t,r){if(!(r[e]instanceof Object)){r[e]={}}if(!isNaN(t.digits)){r[e].scale=t.digits}if(!isNaN(t.UnitSpecificScale)){r[e].scale=t.UnitSpecificScale}if(isNaN(r[e].scale)){delete r[e]}}u.prototype.setDefaultExportSettings=async function(e){var t,r,i,s;const a=await o.getResourceBundle();e.customizing.timezone=o.getTimezoneTranslations();i=e.workbook.context;if(!(i instanceof Object)){i=e.workbook.context={}}if(!i.title){i.title=a.getText("XLSX_DEFAULT_TITLE")}if(!i.sheetName){i.sheetName=a.getText("XLSX_DEFAULT_SHEETNAME")}t=e.customizing.currency={};r=e.customizing.unit={};var c=n.getConfiguration().getFormatSettings().getCustomCurrencies();if(c){for(s in c){l(s,c[s],t)}}let u;const[p,f]=await this.codeListsPromise;for(u in p){l(u,p[u],t)}for(u in f){l(u,f[u],r)}};u.requestCodeLists=function(e){if(!e.isA(["sap.ui.model.odata.ODataMetaModel","sap.ui.model.odata.v4.ODataMetaModel"])){return Promise.resolve([null,null])}return Promise.all([e.requestCurrencyCodes(),e.requestUnitsOfMeasure()]).catch(function(e){s.warning(c+": Code lists cannot be processed due to the following error - "+e);return Promise.resolve([null,null])})};u.prototype.attachBeforeSave=function(e,t,r){return this.attachEvent("beforeSave",e,t,r)};u.prototype.detachBeforeSave=function(e,t){return this.detachEvent("beforeSave",e,t)};u.prototype.cancel=function(){if(this.process){this.process.cancel();this.process=null}return this};u.prototype.getMimeType=function(){return"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"};u.prototype.onprogress=function(e,t){var r;if(isNaN(e)||isNaN(t)){return}r=Math.round(e/t*100);s.debug("Spreadsheet export: "+r+"% loaded.")};u.prototype.createDataSourceFromBinding=function(e){var t=[];if(e.isA("sap.ui.model.ClientListBinding")){var r=[];e.getAllCurrentContexts().forEach(function(e){r.push(e.getObject())});t={data:r,type:"array"}}if(e.isA("sap.ui.model.ClientTreeBinding")){s.error("Unable to create dataSource configuration due to not supported Binding: "+e.getMetadata().getName())}if(typeof e.getDownloadUrl==="function"){var i=e.getModel(),n=e.getDownloadUrl("json"),a=i.sServiceUrl,c=i.isA("sap.ui.model.odata.v4.ODataModel");n=o.interceptUrl(n);a=o.interceptUrl(a);t={type:"odata",dataUrl:n,serviceUrl:a,headers:c?i.getHttpHeaders(true):i.getHeaders(),count:n.includes("$apply")?undefined:o.getCountFromBinding(e),useBatch:c||i.bUseBatch};if(i.getMetaModel()&&typeof i.getMetaModel().requestCurrencyCodes==="function"&&typeof i.getMetaModel().requestUnitsOfMeasure==="function"){this.codeListsPromise=u.requestCodeLists(i.getMetaModel(),this._mSettings)}}return t};u.prototype.processDataSource=function(e){var t=null;var r=typeof e;if(!e){return null}if(r=="string"){return{count:this._mSettings.count,dataUrl:e,type:"odata",useBatch:false}}if(r!="object"){s.error("Spreadsheet#processDataSource: Unable to apply data source of type "+r);return null}if(e instanceof Array){t={data:e,type:"array"}}if(e.dataUrl){t=e}if(e.isA&&e.isA(["sap.ui.model.ListBinding","sap.ui.model.TreeBinding"])){t=this.createDataSourceFromBinding(e)}return t};u.prototype.createBuildPromise=function(t){var s=this;return new Promise(function(n,c){var u;var l=1048576;var p=a.system.desktop?2e6:1e5;var f=t.dataSource.type=="array"?t.dataSource.data.length:t.dataSource.count;var d=t.workbook.columns.length;function g(e){if(e.progress){if(u){u.updateStatus(e.fetched,e.total)}s.onprogress(e.fetched,e.total)}if(e.finished&&s.process!==null){s.process=null;if(!e.spreadsheet){c();return}var i=s.fireEvent("beforeSave",{data:e.spreadsheet,exportDialog:u},true,true);if(i){if(u){window.setTimeout(u.finish,1e3)}o.saveAsFile(new Blob([e.spreadsheet],{type:s.getMimeType()}),t.fileName)}n()}if(typeof e.error!="undefined"){var a=e.error.message||e.error;s.process=null;if(u){u.finish()}c(a);r.showErrorMessage(a)}}function h(){if(!t.showProgress){if(s.process){c("Cannot start export: the process is already running");return}s.process=i.execute(t,g);return}r.getProgressDialog().then(function(e){u=e;if(s.process){c("Cannot start export: the process is already running");return}u.oncancel=function(){return s.process&&s.process.cancel()};u.open();u.updateStatus(0,t.dataSource.count);s.process=i.execute(t,g)})}if(d<=0){c("No columns to export.")}else if(f*d>p||!f||f>=l){var m={rows:f,columns:d,cellLimit:p,rowLimit:l,fileType:e.FileType.XLSX};r.showWarningDialog(m).then(h).catch(c)}else{h()}})};return u});
//# sourceMappingURL=Spreadsheet.js.map