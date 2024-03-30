sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/m/Dialog","sap/m/Button","sap/m/Text","ui5pos/szdk/controller/util/InputCheck","sap/ui/model/Sorter"],function(e,t,o,s,i,n,r){"use strict";return e.extend("ui5pos.szdk.controller.BaseController",{inputCheck:n,onInit:function(){this.comp=this.getOwnerComponent();this.i18n=this.comp.getModel("lang").getResourceBundle();this.inputCheck.setResourceBundel(this.i18n)},defaultPatternMatched:function(e){let t=e.getParameter("name");if(!this.comp.getModel("service")){this.comp.getRouter().navTo("setup");return false}this.comp.getModel("nav").setProperty("/sideNav/visible",true);this.comp.getModel("nav").setProperty("/sideNav/expandableMin",1e3);this.comp.getModel("nav").setProperty("/sideNav/selectedKey",`nav_item_route_${t}`);return true},goBack:function(e="home",o={}){let s=t.getInstance().getPreviousHash();if(s!==undefined)window.history.go(-1);else this.comp.getRouter().navTo(e,o,true)},getMaxValue:function(e,t){let o=()=>{},s=()=>{};let i=new Promise((e,t)=>{o=e;s=t});this.comp.getModel("service").read(e,{sorters:[new r(t,true)],urlParameters:{$select:t,$top:1},success:e=>{if(!e||!e.results||e.results.length==0)o(0);else o(e.results[0][t])},error:e=>{s(e)}});return i},showErrorDialog:function(e){this.showDialog(e,sap.ui.core.ValueState.Error)},showInfoDialog:function(e){this.showDialog(e,sap.ui.core.ValueState.Information)},showSuccessDialog:function(e){this.showDialog(e,sap.ui.core.ValueState.Success)},showWarningDialog:function(e){this.showDialog(e,sap.ui.core.ValueState.Warning)},showDialog:function(e,t=sap.ui.core.ValueState.Error){e=e||{};e.title=e.title||this.i18n.getText({[sap.ui.core.ValueState.Error]:"error",[sap.ui.core.ValueState.Information]:"information",[sap.ui.core.ValueState.Warning]:"warning",[sap.ui.core.ValueState.Success]:"success"}[t]);e.buttonClose=e.buttonClose||e.onConfirm?this.i18n.getText("cancel"):this.i18n.getText("close");e.buttonConfirm=e.buttonConfirm||this.i18n.getText("confirm");e.buttonType=e.buttonType||sap.m.ButtonType.Emphasized;e.message=e.message||[this.i18n.getText("an_error_occurred")];e.onClose=e.onClose;e.onConfirm=e.onConfirm;if(typeof e.message=="string")e.message=[e.message];let n=[];for(let t of e.message){if(typeof t=="string")n.push(new i({text:t}))}let r=new s({type:e.onConfirm?sap.m.ButtonType.Transparent:sap.m.ButtonType.Emphasized,text:e.buttonClose,press:()=>{this._Dialog.close();this._Dialog.destroyBeginButton().destroyEndButton().destroyContent();if(e.onClose)e.onClose()}});let a=!e.onConfirm?undefined:new s({type:e.buttonType,text:e.buttonConfirm,press:()=>{this._Dialog.close();this._Dialog.destroyBeginButton().destroyEndButton().destroyContent();if(e.onConfirm)e.onConfirm()}});if(!this._Dialog){this._Dialog=new o({type:sap.m.DialogType.Message,state:t,title:e.title,content:n,beginButton:a,endButton:r})}else{this._Dialog.setTitle(e.title);if(a)this._Dialog.setBeginButton(a);this._Dialog.setEndButton(r);this._Dialog.setState(t);for(let e of n)this._Dialog.addContent(e)}this._Dialog.open()}})});
//# sourceMappingURL=BaseController.js.map