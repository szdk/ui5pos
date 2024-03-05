sap.ui.define(["ui5pos/szdk/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/Device","ui5pos/szdk/controller/util/RouteEvent"],function(e,t,a,s){"use strict";return e.extend("ui5pos.szdk.controller.App",{onInit:function(){e.prototype.onInit.apply(this,arguments);this.appNavModel=new t({sideNav:{visible:true,selectedKey:"home",expanded:a.system.desktop}});this.appNavModel.setDefaultBindingMode("OneWay");this.getView().setModel(this.appNavModel,"nav");this.attachPatternMatched();this.bindSideNavTarget()},bindSideNavTarget:function(){let e=this.comp.getRouter();if(this.getView().getModel("device").getProperty("/system/desktop")){let t=this.byId("app_side_nav_list");if(t)t.attachItemSelect(t=>{let s=t.getParameters().item;if(!s)return;let i=s.getKey();if(!i||!i.startsWith("nav_item_route_"))return;if(!a.system.desktop)this.appNavModel.setProperty("/sideNav/expanded",false);e.navTo(i.substring(15))})}else{for(let t in s.routes){let s=this.byId(`app_nav_route_${t}`);if(s)s.attachSelect(()=>{if(!a.system.desktop)this.appNavModel.setProperty("/sideNav/expanded",false);e.navTo(t)})}}},attachPatternMatched:function(){let e=this.comp.getRouter();for(let t in s.routes){if(s.routes[t].patternMatched){e.getRoute(t).attachPatternMatched(e=>{s.routes[t].patternMatched.apply(this,[e])})}}},onSideNavButtonPress:function(){this.appNavModel.setProperty("/sideNav/expanded",!this.appNavModel.getProperty("/sideNav/expanded"))}})});
//# sourceMappingURL=App.controller.js.map