sap.ui.define(["ui5pos/szdk/controller/BaseController","sap/ui/model/json/JSONModel","ui5pos/szdk/models/models"],function(e,t,s){"use strict";return e.extend("ui5pos.szdk.controller.Setup",{onInit:function(){e.prototype.onInit.apply(this,arguments);let s=new t({odataType:"1",odataUrl:"",odataDelay:10,inputEnabled:true,ServiceCreated:false});this.getView().setModel(s,"local")},onCreateService:function(e){let t=this.getView();let o=t.getModel("local");let r=this.byId("setup-loading");if(o.getProperty("/ServiceCreated")&&this.comp.getModel("service")){this.goBack("home");return}o.setProperty("/inputEnabled",false);r.setVisible(true);let a=this.comp.getModel("settings").getData();a.odata.useMock=o.getProperty("/odataType")==="1";a.odata.serviceUrl=a.odata.useMock?"/ui5pos/szdk/mockService.svc/":o.getProperty("/odataUrl");let i=o.getProperty("/odataDelay");if(!i||parseInt(i)<=0)o.setProperty("/odataDelay",0);a.odata.delay=parseInt(o.getProperty("/odataDelay"))||0;this.comp.getModel("settings").setData(a);let l=null;setTimeout(()=>s.createService({...a}).then(e=>{l=e;return e.metadataLoaded(true)}).then(()=>{this.comp.setModel(l,"service");this.comp.szdk_resolve_serviceCreated(l);o.setProperty("/ServiceCreated",true);r.setVisible(false)}).catch(e=>{r.setVisible(false);let t=this.byId("setup-error-dialog").setVisible(true).open();this.byId("setup-error-dialog-text").setText(this.i18n.getText("setup_loadingError",[e.message]));this.byId("setup-error-dialog-close").attachPress(()=>{t.close().setVisible(false)});s.deleteService(a.odata.serviceUrl);o.setProperty("/inputEnabled",true)}),100)}})});
//# sourceMappingURL=Setup.controller.js.map