sap.ui.define(["ui5pos/szdk/controller/BaseController","ui5pos/szdk/controller/util/RouteEvent","ui5pos/szdk/controller/util/F4Help","ui5pos/szdk/controller/util/Table","ui5pos/szdk/controller/util/FilterDialog","sap/ui/model/json/JSONModel","sap/ui/core/Core","sap/m/ObjectNumber","sap/m/Text","sap/m/Title","sap/m/Button"],function(e,t,i,r,s,o,a,n,l,p,u){"use strict";var d=null;return e.extend("ui5pos.szdk.controller.product.View",{productID:null,onInit:function(){e.prototype.onInit.apply(this,arguments);window.t=this.getView();d=this;this.mainModel=new o({editting:false,productData:{}});this.getView().setModel(this.mainModel,"model");this.getView().setBusyIndicatorDelay(0);this.comp.szdk_serviceCreated.then(e=>e.attachRequestSent(()=>this.getView().setBusy(true)));this.comp.szdk_serviceCreated.then(e=>e.attachRequestCompleted(()=>this.getView().setBusy(false)));this.comp.getRouter().getRoute("view_product").attachPatternMatched(this.patternMatched.bind(this));let t=a.getMessageManager();t.registerObject(this.byId("product_input_name"),true);t.registerObject(this.byId("product_input_category"),true);t.registerObject(this.byId("product_input_supplier"),true);t.registerObject(this.byId("product_input_qpu"),true);t.registerObject(this.byId("product_input_unit_price"),true);t.registerObject(this.byId("product_input_in_stock"),true);t.registerObject(this.byId("product_input_reorder_level"),true)},onValueHelpCategory:function(){i.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Categories",filterFields:[{path:"CategoryName",label:this.i18n.getText("category_name")}],showFields:[{path:"CategoryID",label:this.i18n.getText("category_id")},{path:"CategoryName",label:this.i18n.getText("name")}],returnFields:["CategoryID","CategoryName"],title:this.i18n.getText("category_select_single")}).then(e=>{if(!e||e.length==0)return;let t=parseInt(e[0].CategoryID);if(t){this.byId("product_input_category").setValue(t).setValueState(sap.ui.core.ValueState.None);this.byId("product_category_name").setValue(e[0].CategoryName)}})},onValueHelpSupplier:function(){i.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Suppliers",filterFields:[{path:"CompanyName",label:this.i18n.getText("supplier_company_name")}],showFields:[{path:"SupplierID",label:this.i18n.getText("supplier_id")},{path:"CompanyName",label:this.i18n.getText("supplier_company_name")}],returnFields:["SupplierID","CompanyName"],title:this.i18n.getText("supplier_select_single")}).then(e=>{if(!e||e.length==0)return;let t=parseInt(e[0].SupplierID);if(t){this.byId("product_input_supplier").setValue(t).setValueState(sap.ui.core.ValueState.None);this.byId("product_supplier_name").setValue(e[0].CompanyName)}})},onSave:function(){if(!this.mainModel.getProperty("/editting"))return;for(let e of["product_input_name","product_input_qpu","product_input_unit_price","product_input_in_stock","product_input_reorder_level"]){let t=this.byId(e);try{let e=t.getBinding("value");let i=e?e.getType():null;if(i)i.validateValue(t.getValue())}catch(e){t.setValueState(sap.ui.core.ValueState.Error);this.showErrorDialog({message:this.i18n.getText("input_submit_error")});return}}this.categoryIDCheck().then(()=>this.supplierIDCheck()).then(()=>{let e={ProductName:this.mainModel.getProperty("/productData/ProductName"),SupplierID:parseInt(this.mainModel.getProperty("/productData/SupplierID")),CategoryID:parseInt(this.mainModel.getProperty("/productData/CategoryID")),QuantityPerUnit:this.mainModel.getProperty("/productData/QuantityPerUnit"),UnitPrice:parseFloat(this.mainModel.getProperty("/productData/UnitPrice")),UnitsInStock:parseInt(this.mainModel.getProperty("/productData/UnitsInStock")),ReorderLevel:parseInt(this.mainModel.getProperty("/productData/ReorderLevel"))};let t=`/Products(${this.productID})`;console.log({action:"update",path:t,data:e});this.comp.getModel("service").update(t,e,{success:()=>{this.refreshBinding();this.showSuccessDialog({message:this.i18n.getText("data_saved_description")})},error:e=>this.showErrorDialog({message:e.message})})}).catch(()=>this.showErrorDialog({message:this.i18n.getText("input_submit_error")}))},onCategoryChange:function(){this.categoryIDCheck().catch(()=>{})},onSupplierChange:function(){this.supplierIDCheck().catch(()=>{})},categoryIDCheck:function(){let e=()=>{},t=()=>{};let i=new Promise((i,r)=>{e=i;t=r});const r=()=>{a.setValueState(sap.ui.core.ValueState.None)};const s=(e,t)=>{a.setValueStateText(this.i18n.getText(e,t));a.setValueState(sap.ui.core.ValueState.Error)};let o=this.byId("product_category_name");o.setValue("");let a=this.byId("product_input_category");let n=parseInt(a.getValue());if(!n||n<=0){s("input_invalid_category_id");t(n);return i}this.comp.getModel("service").read(`/Categories(${n})`,{success:t=>{if(t&&t.CategoryName)o.setValue(t.CategoryName);e(t);r()},error:e=>{t(n);s("input_invalid_category_id")}});return i},supplierIDCheck:function(){let e=()=>{},t=()=>{};let i=new Promise((i,r)=>{e=i;t=r});const r=()=>{a.setValueState(sap.ui.core.ValueState.None)};const s=(e,t)=>{a.setValueStateText(this.i18n.getText(e,t));a.setValueState(sap.ui.core.ValueState.Error)};let o=this.byId("product_supplier_name");o.setValue("");let a=this.byId("product_input_supplier");let n=parseInt(a.getValue());if(!n||n<=0){s("input_invalid_supplier_id");t(n);return i}this.comp.getModel("service").read(`/Suppliers(${n})`,{success:t=>{if(t&&t.CompanyName)o.setValue(t.CompanyName);e(t);r()},error:e=>{t(n);s("input_invalid_supplier_id")}});return i},onToggleEdit:function(e){if(!this.mainModel.getProperty("/editting")){if(!this.productID)return;const e=e=>{this.categoryIDCheck().catch(()=>{});this.supplierIDCheck().catch(()=>{});this.byId("product_view_page").setHeaderExpanded(true);this.mainModel.setProperty("/editting",true)};this.refreshBinding(e)}else{this.mainModel.setProperty("/editting",false)}},onToggleDiscontinue:function(){let e=this.comp.getModel("service");let t={Discontinued:!this.mainModel.getProperty("/productData/Discontinued")};let i=`/Products(${this.productID})`;console.log({action:"update",path:i,data:t});e.update(i,t,{success:()=>{this.refreshBinding()},error:e=>this.showErrorDialog({message:e.message})})},onDelete:function(){let e=this.comp.getModel("service");const t=()=>{e.remove(`/Products(${this.productID})`,{success:()=>{this.showSuccessDialog({message:this.i18n.getText("product_has_been_deleted"),onClose:()=>{this.comp.getRouter().navTo("products")}})},error:this.showErrorDialog})};e.read(`/Products(${this.productID})/Order_Details/$count`,{success:e=>{if(parseInt(e)>0){this.showInfoDialog({title:this.i18n.getText("product_in_use"),message:this.i18n.getText("product_cannot_delete_desc",[e])})}else{this.showErrorDialog({title:this.i18n.getText("confirm_delete"),message:this.i18n.getText("product_confirm_delete"),onConfirm:t})}},error:e=>this.showErrorDialog({message:e.message})})},refreshBinding:function(e=null,t=null,i=false){if(!t)t=e=>{this.showErrorDialog({message:e.message})};const r=t=>{if(!t||parseInt(t.ProductID)!==parseInt(this.productID)){this.showErrorDialog();return}t={ProductID:t.ProductID,ProductName:t.ProductName,SupplierID:t.SupplierID,CategoryID:t.CategoryID,QuantityPerUnit:t.QuantityPerUnit,UnitPrice:t.UnitPrice,UnitsInStock:t.UnitsInStock,UnitsOnOrder:t.UnitsOnOrder,ReorderLevel:t.ReorderLevel,Discontinued:t.Discontinued};this.mainModel.setProperty("/productData",t);if(e)e(t)};let s=!i?false:this.comp.getModel("service").getObject("",this.getView().getBindingContext("service"));if(!s||parseInt(s.ProductID)!==parseInt(this.productID))this.comp.getModel("service").read(`/Products(${this.productID})`,{urlParameters:{$expand:"Category,Supplier"},success:r,error:t});else r(s)},onOpenAction:function(e){let t=e.getSource();this.getView().byId("view_product_actionSheet").openBy(t)},patternMatched:function(e){if(!t.defaultPatternMatched.apply(this,[e]))return;this.getView().getModel("nav").setProperty("/sideNav/selectedKey",`nav_item_route_products`);this.mainModel.setProperty("/editting",false);this.mainModel.setProperty("/productData",{});this.productID=null;const i=()=>{this.comp.getRouter().getTarget("notFound").display()};let r=e.getParameter("arguments");let s=r&&r.id&&(""+r.id).length>0?r.id:null;if(s){this.comp.getModel("service").createBindingContext(`/Products(${s})`,{expand:"Category,Supplier,Order_Details"},e=>{if(!e){i();return}this.productID=s;this.getView().setBindingContext(e,"service");this.refreshBinding(null,null,true);if(!this.orders_table){this.createOrdersTable(s)}else{this.updateOrdersTable(s)}},true)}else{i()}},createOrdersTable:function(e){this.filterDialog=new s({i18n:this.i18n,dialog:true,title:this.i18n.getText("add_filters"),onFilter:e=>{this.orders_table.applyFilter(e)},fields:[{path:"OrderID",label:this.i18n.getText("order_id"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]},{path:"UnitPrice",label:this.i18n.getText("product_unitPrice"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]},{path:"Quantity",label:this.i18n.getText("order_quantity"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]},{path:"Discount",label:this.i18n.getText("order_discount"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]}]});let t=new u({icon:"sap-icon://filter",text:this.i18n.getText("filter"),press:()=>this.filterDialog.container.open()});let i=[{id:"OrderID",label:this.i18n.getText("order_id"),path:"OrderID",header:{}},{id:"UnitPrice",label:this.i18n.getText("product_unitPrice"),path:"UnitPrice",header:{minScreenWidth:"Tablet",demandPopin:true,popinDisplay:"Inline"}},{id:"Quantity",label:this.i18n.getText("order_quantity"),path:"Quantity",header:{minScreenWidth:"Tablet",demandPopin:true,popinDisplay:"Inline"}},{id:"Discount",label:this.i18n.getText("order_discount"),path:"Discount",header:{minScreenWidth:"Tablet",demandPopin:true,popinDisplay:"Inline"}}].map(e=>({id:this.getView().createId(e.id),cell:{bindingPath:e.path},header:{header:e.label,...e.header},p13n:{key:e.id,label:e.label,path:e.path},excel:{label:e.label,property:e.path}}));i[1].cell.control=new n({unit:"USD"});i[1].cell.control.bindProperty("number",{parts:[{path:"UnitPrice"},{value:"USD"}],type:"sap.ui.model.type.Currency",formatOptions:{showMeasure:false}});i[3].cell.control=new l({text:"{= ${Discount} === 0 ? 0 : ( ${Discount} + ' %' )}"});this.orders_table=new r({id:this.getView().createId("orders_table"),i18n:this.i18n,model:this.comp.getModel("service"),properties:{busyIndicatorDelay:0,mode:sap.m.ListMode.None,rememberSelections:true,growing:true,growingThreshold:50,sticky:["HeaderToolbar","ColumnHeaders"],popinLayout:sap.m.PopinLayout.Block,alternateRowColors:false},itemsBinding:{path:`/Products(${e})/Order_Details`},customToolbar:{start:[new p({text:this.i18n.getText("product_order_details_header")})],end:[t]},toolbar:{p13n:{Columns:true,Sorter:true,Groups:true},excel:this.comp.getModel("settings").getProperty("/odata/useMock")?2:1,growSize:true,pin:true},columns:i});this.byId("table_container").removeAllContent();this.byId("table_container").addContent(this.orders_table.getTable())},updateOrdersTable:function(e){this.orders_table.data.itemsBinding.path=`/Products(${e})/Order_Details`;this.orders_table.refreshBinding()}})});
//# sourceMappingURL=View.controller.js.map