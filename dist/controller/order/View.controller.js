sap.ui.define(["ui5pos/szdk/controller/BaseController","ui5pos/szdk/controller/util/Table","sap/ui/model/json/JSONModel","sap/m/ObjectNumber","sap/m/Text","sap/m/Link","sap/m/Title","sap/ui/core/CustomData"],function(e,t,i,r,a,n,o,d){"use strict";return e.extend("ui5pos.szdk.controller.order.View",{onInit:function(){e.prototype.onInit.apply(this,arguments);this.getView().setBusyIndicatorDelay(0);this.comp.szdk_serviceCreated.then(e=>e.attachRequestSent(()=>this.getView().setBusy(true)));this.comp.szdk_serviceCreated.then(e=>e.attachRequestCompleted(()=>this.getView().setBusy(false)));this.comp.getRouter().getRoute("view_order").attachPatternMatched(this.patternMatched.bind(this))},patternMatched:function(e){if(!this.defaultPatternMatched(e))return;this.comp.getModel("nav").setProperty("/sideNav/selectedKey",`nav_item_route_orders`);this.orderID=null;const t=()=>{this.comp.getRouter().getTarget("notFound").display()};let i=e.getParameter("arguments");let r=i&&i.id&&(""+i.id).length>0?i.id:null;if(r){this.comp.getModel("service").createBindingContext(`/Orders(${r})`,{expand:"Customer"},e=>{if(!e){t();return}this.orderID=parseInt(r);this.getView().setBindingContext(e,"service");document.title=this.i18n.getText("order_view_title",[this.orderID]);if(!this.order_details_table){this.createOrderDetailTable(r)}else if(this.order_details_table_id!=r){this.updateOrderDetailTable(r)}},true)}else{t()}},createOrderDetailTable:function(e){this.order_details_table_id=e;this.byId("order_view_page").setHeaderExpanded(true);let i=[{id:"ProductID",label:this.i18n.getText("product_id"),path:"ProductID",header:{minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"ProductName",label:this.i18n.getText("product_name"),path:"Product/ProductName",header:{}},{id:"UnitPrice",label:this.i18n.getText("product_unitPrice"),path:"UnitPrice",header:{minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"Quantity",label:this.i18n.getText("order_quantity"),path:"Quantity",header:{minScreenWidth:"Tablet",demandPopin:true,popinDisplay:"Inline"}},{id:"Discount",label:this.i18n.getText("order_discount"),path:"Discount",header:{minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"NetPrice",label:this.i18n.getText("order_net_price"),path:"UnitPrice",header:{hAlign:"End"}}].map(e=>({id:this.getView().createId(e.id),cell:{bindingPath:e.path},header:{header:e.label,...e.header},p13n:{key:e.id,label:e.label,path:e.path},excel:{label:e.label,property:e.path}}));i[1].cell.control=new n({text:"{Product/ProductName}",customData:[new d({key:"id",value:"{ProductID}"})],wrapping:true,press:e=>{let t=e.getSource();if(!t)return;let i=t.data("id");if(i)this.comp.getRouter().navTo("view_product",{id:i})}});i[2].cell.control=new r({unit:"USD"});i[2].cell.control.bindProperty("number",{parts:[{path:"UnitPrice"},{value:"USD"}],type:"sap.ui.model.type.Currency",formatOptions:{showMeasure:false}});i[4].cell.control=new a({text:"{= ${Discount} === 0 ? 0 : ( (${Discount} * 100) + ' %' )}"});i[5].cell.control=new r({unit:"USD"});i[5].cell.control.bindProperty("number",{parts:[{path:"UnitPrice"},{path:"Quantity"},{path:"Discount"}],type:this.inputCheck.order.netPrice,formatOptions:{showMeasure:false}});delete i[5].excel;this.order_details_table=new t({id:this.getView().createId("order_details_table"),i18n:this.i18n,model:this.comp.getModel("service"),properties:{busyIndicatorDelay:0,mode:sap.m.ListMode.None,rememberSelections:true,growing:true,growingThreshold:1e3,sticky:["HeaderToolbar","ColumnHeaders"],popinLayout:sap.m.PopinLayout.Block,alternateRowColors:false},itemsBinding:{path:`/Orders(${e})/Order_Details`,parameters:{expand:"Product"}},customToolbar:{start:[new o({text:this.i18n.getText("order_view_items_header")})]},toolbar:{p13n:{Columns:true,Sorter:true,Groups:true},excel:this.comp.getModel("settings").getProperty("/odata/useMock")?2:1,growSize:false,pin:true},columns:i});this.byId("table_container").removeAllContent();this.byId("table_container").addContent(this.order_details_table.getTable())},updateOrderDetailTable:function(e){this.order_details_table_id=e;this.byId("order_view_page").setHeaderExpanded(true);this.order_details_table.data.itemsBinding.path=`/Orders(${e})/Order_Details`;this.order_details_table.refreshBinding()},onOpenAction:function(e){this.byId("view_order_actionSheet").openBy(e.getSource())}})});
//# sourceMappingURL=View.controller.js.map