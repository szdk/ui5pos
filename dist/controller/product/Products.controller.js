sap.ui.define(["ui5pos/szdk/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/export/Spreadsheet","sap/m/Dialog","sap/m/Button","sap/m/Text","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,r,i,o,s,n,l){"use strict";let a={onSearchProduct:function(e){let t=e.getParameter("query").trim();let r=this._tableMain.getBinding("items");let i=t.length==0?[]:new n({filters:[new n({path:"ProductID",operator:l.EQ,value1:t}),new n({path:"ProductName",operator:l.Contains,value1:t}),new n({path:"QuantityPerUnit",operator:l.Contains,value1:t})],and:false});r.filter(i)},onRefreshItems:function(){this._tableMain.refreshItems()},onItemsPerPage:function(e){let t=e.getParameter("item");let r=parseInt(t.getKey());this.tableModel.setProperty("/grow/size",r);this.tableModel.setProperty("/grow/text",t.getText());if(r===0)this.onRefreshItems()},onPinHeader:function(e){let t=e.getParameter("item").getKey();let r=[...this.tableModel.getProperty("/sticky")];let i=r.indexOf(t);if(i===-1)r.push(t);else r.splice(i,1);this.tableModel.setProperty("/sticky",r)},onExportExcel:function(){let e=sap.ui.export.EdmType;let t=[{label:this.i18n.getText("id"),property:"ProductID",type:e.Number,scale:0},{label:this.i18n.getText("product"),property:"ProductName",type:e.String,width:20},{label:this.i18n.getText("category"),property:"Category/CategoryName",type:e.String},{label:this.i18n.getText("product_instock"),property:"UnitsInStock",type:e.Number,scale:0},{label:this.i18n.getText("product_quantityPerUnit"),property:"QuantityPerUnit",type:e.String},{label:this.i18n.getText("product_unitPrice")+" (USD)",property:"UnitPrice",type:e.Number,scale:2,delimiter:true}];const n=(e,i=false)=>{let o={workbook:{columns:t},dataSource:e,fileName:`${this.i18n.getText("products_title")}.xlsx`,worker:i};let s=new r(o);s.build().finally(function(){s.destroy()})};if(this.comp.getModel("settings").getProperty("/odata/useMock")){this.tableModel.setProperty("/canExport",false);let e=this._tableMain.getBindingInfo("items");this.comp.getModel("service").read(e.path,{urlParameters:{$expand:"Category"},sorters:e.sorter,filters:e.filters,success:e=>{n(e.results);this.tableModel.setProperty("/canExport",true)},error:e=>{let t=new i({type:sap.m.DialogType.Message,state:sap.ui.core.ValueState.Error,content:new s({text:this.i18n.getText("export_failed")}),beginButton:new o({type:ButtonType.Emphasized,text:this.i18n.getText("ok"),press:()=>{this.tableModel.setProperty("/canExport",true);t.close()}})}).open()}})}else{n(this._tableMain.getBinding("items"),true)}}};return e.extend("ui5pos.szdk.controller.product.Products",{...a,onInit:function(){e.prototype.onInit.apply(this,arguments);this.tableModel=new t({mode:"SingleSelectMaster",grow:{size:50,text:this.i18n.getText("50")},sticky:["HeaderToolbar","ColumnHeaders"],canExport:true});this.tableModel.setDefaultBindingMode("OneWay");this.getView().setModel(this.tableModel,"table");this._tableMain=window.temp=this.byId("products_table")},onSelectionChange:function(e){let t=e.getParameters();if(!t.listItem||t.listItems&&t.listItems.length!=1)return;let r=t.listItem.getBindingContext("service");let i=r?r.getProperty("ProductID"):null;if(i!==null)this.comp.getRouter().navTo("view_product",{id:i})},onPressCreateProduct:function(){this.comp.getRouter().navTo("create_product")}})});
//# sourceMappingURL=Products.controller.js.map