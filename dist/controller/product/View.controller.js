sap.ui.define(["ui5pos/szdk/controller/BaseController","ui5pos/szdk/controller/util/F4Help","ui5pos/szdk/controller/util/Table","ui5pos/szdk/controller/util/FilterDialog","sap/ui/model/json/JSONModel","sap/ui/core/Messaging","sap/m/ObjectNumber","sap/m/Text","sap/m/Title","sap/m/Button","sap/m/Link"],function(e,t,i,r,o,s,a,n,l,p,u){"use strict";return e.extend("ui5pos.szdk.controller.product.View",{productID:null,onInit:function(){e.prototype.onInit.apply(this,arguments);this.mainModel=new o({editting:false,productData:{}});this.getView().setModel(this.mainModel,"model");this.getView().setBusyIndicatorDelay(0);this.comp.szdk_serviceCreated.then(e=>e.attachRequestSent(()=>this.getView().setBusy(true)));this.comp.szdk_serviceCreated.then(e=>e.attachRequestCompleted(()=>this.getView().setBusy(false)));this.comp.getRouter().getRoute("view_product").attachPatternMatched(this.patternMatched.bind(this));s.registerObject(this.byId("product_input_name"),true);s.registerObject(this.byId("product_input_category"),true);s.registerObject(this.byId("product_input_supplier"),true);s.registerObject(this.byId("product_input_qpu"),true);s.registerObject(this.byId("product_input_unit_price"),true);s.registerObject(this.byId("product_input_in_stock"),true);s.registerObject(this.byId("product_input_reorder_level"),true)},onValueHelpCategory:function(){t.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Categories",filterFields:[{path:"CategoryName",label:this.i18n.getText("category_name")}],showFields:[{path:"CategoryID",label:this.i18n.getText("category_id")},{path:"CategoryName",label:this.i18n.getText("name")}],returnFields:["CategoryID","CategoryName"],title:this.i18n.getText("category_select_single")}).then(e=>{if(!e||e.length==0)return;let t=parseInt(e[0].CategoryID);if(t){this.byId("product_input_category").setValue(t).setValueState(sap.ui.core.ValueState.None);this.byId("product_category_name").setValue(e[0].CategoryName)}})},onValueHelpSupplier:function(){t.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Suppliers",filterFields:[{path:"CompanyName",label:this.i18n.getText("supplier_company_name")}],showFields:[{path:"SupplierID",label:this.i18n.getText("supplier_id")},{path:"CompanyName",label:this.i18n.getText("supplier_company_name")}],returnFields:["SupplierID","CompanyName"],title:this.i18n.getText("supplier_select_single")}).then(e=>{if(!e||e.length==0)return;let t=parseInt(e[0].SupplierID);if(t){this.byId("product_input_supplier").setValue(t).setValueState(sap.ui.core.ValueState.None);this.byId("product_supplier_name").setValue(e[0].CompanyName)}})},onSave:function(){if(!this.mainModel.getProperty("/editting"))return;for(let e of["product_input_name","product_input_qpu","product_input_unit_price","product_input_in_stock","product_input_reorder_level"]){let t=this.byId(e);try{let e=t.getBinding("value");let i=e?e.getType():null;if(i)i.validateValue(t.getValue())}catch(e){t.setValueState(sap.ui.core.ValueState.Error);this.showErrorDialog({message:this.i18n.getText("input_submit_error")});return}}this.categoryIDCheck().then(()=>this.supplierIDCheck()).then(()=>{let e={ProductName:this.mainModel.getProperty("/productData/ProductName"),SupplierID:parseInt(this.mainModel.getProperty("/productData/SupplierID")),CategoryID:parseInt(this.mainModel.getProperty("/productData/CategoryID")),QuantityPerUnit:this.mainModel.getProperty("/productData/QuantityPerUnit"),UnitPrice:parseFloat(this.mainModel.getProperty("/productData/UnitPrice")),UnitsInStock:parseInt(this.mainModel.getProperty("/productData/UnitsInStock")),ReorderLevel:parseInt(this.mainModel.getProperty("/productData/ReorderLevel"))};let t=`/Products(${this.productID})`;console.log({action:"update",path:t,data:e});this.comp.getModel("service").update(t,e,{success:()=>{this.refreshBinding();this.showSuccessDialog({message:this.i18n.getText("data_saved_description")})},error:e=>this.showErrorDialog({message:e.message})})}).catch(()=>this.showErrorDialog({message:this.i18n.getText("input_submit_error")}))},onCategoryChange:function(){this.categoryIDCheck().catch(()=>{})},onSupplierChange:function(){this.supplierIDCheck().catch(()=>{})},categoryIDCheck:function(){let e=()=>{},t=()=>{};let i=new Promise((i,r)=>{e=i;t=r});const r=()=>{a.setValueState(sap.ui.core.ValueState.None)};const o=(e,t)=>{a.setValueStateText(this.i18n.getText(e,t));a.setValueState(sap.ui.core.ValueState.Error)};let s=this.byId("product_category_name");s.setValue("");let a=this.byId("product_input_category");let n=parseInt(a.getValue());if(!n||n<=0){o("input_invalid_category_id");t(n);return i}this.comp.getModel("service").read(`/Categories(${n})`,{success:t=>{if(t&&t.CategoryName)s.setValue(t.CategoryName);e(t);r()},error:e=>{t(n);o("input_invalid_category_id")}});return i},supplierIDCheck:function(){let e=()=>{},t=()=>{};let i=new Promise((i,r)=>{e=i;t=r});const r=()=>{a.setValueState(sap.ui.core.ValueState.None)};const o=(e,t)=>{a.setValueStateText(this.i18n.getText(e,t));a.setValueState(sap.ui.core.ValueState.Error)};let s=this.byId("product_supplier_name");s.setValue("");let a=this.byId("product_input_supplier");let n=parseInt(a.getValue());if(!n||n<=0){o("input_invalid_supplier_id");t(n);return i}this.comp.getModel("service").read(`/Suppliers(${n})`,{success:t=>{if(t&&t.CompanyName)s.setValue(t.CompanyName);e(t);r()},error:e=>{t(n);o("input_invalid_supplier_id")}});return i},onToggleEdit:function(e){if(!this.mainModel.getProperty("/editting")){if(!this.productID)return;const e=e=>{this.categoryIDCheck().catch(()=>{});this.supplierIDCheck().catch(()=>{});this.byId("product_view_page").setHeaderExpanded(true);this.mainModel.setProperty("/editting",true)};this.refreshBinding(e)}else{this.mainModel.setProperty("/editting",false)}},onToggleDiscontinue:function(){let e=this.comp.getModel("service");let t={Discontinued:!this.mainModel.getProperty("/productData/Discontinued")};let i=`/Products(${this.productID})`;console.log({action:"update",path:i,data:t});e.update(i,t,{success:()=>{this.refreshBinding()},error:e=>this.showErrorDialog({message:e.message})})},onDelete:function(){let e=this.comp.getModel("service");const t=()=>{e.remove(`/Products(${this.productID})`,{success:()=>{this.showSuccessDialog({message:this.i18n.getText("product_has_been_deleted"),onClose:()=>{this.comp.getRouter().navTo("products")}})},error:this.showErrorDialog})};e.read(`/Products(${this.productID})/Order_Details/$count`,{success:e=>{if(parseInt(e)>0){this.showInfoDialog({title:this.i18n.getText("product_in_use"),message:this.i18n.getText("product_cannot_delete_desc",[e])})}else{this.showErrorDialog({title:this.i18n.getText("confirm_delete"),message:this.i18n.getText("product_confirm_delete"),onConfirm:t})}},error:e=>this.showErrorDialog({message:e.message})})},refreshBinding:function(e=null,t=null,i=false){if(!t)t=e=>{this.showErrorDialog({message:e.message})};const r=t=>{if(!t||parseInt(t.ProductID)!==parseInt(this.productID)){this.showErrorDialog();return}t={ProductID:t.ProductID,ProductName:t.ProductName,SupplierID:t.SupplierID,CategoryID:t.CategoryID,QuantityPerUnit:t.QuantityPerUnit,UnitPrice:t.UnitPrice,UnitsInStock:t.UnitsInStock,UnitsOnOrder:t.UnitsOnOrder,ReorderLevel:t.ReorderLevel,Discontinued:t.Discontinued};this.mainModel.setProperty("/productData",t);if(e)e(t)};let o=!i?false:this.comp.getModel("service").getObject("",this.getView().getBindingContext("service"));if(!o||parseInt(o.ProductID)!==parseInt(this.productID))this.comp.getModel("service").read(`/Products(${this.productID})`,{urlParameters:{$expand:"Category,Supplier"},success:r,error:t});else r(o)},onOpenAction:function(e){let t=e.getSource();this.getView().byId("view_product_actionSheet").openBy(t)},patternMatched:function(e){if(!this.defaultPatternMatched(e))return;this.comp.getModel("nav").setProperty("/sideNav/selectedKey",`nav_item_route_products`);this.mainModel.setProperty("/editting",false);this.mainModel.setProperty("/productData",{});this.productID=null;const t=()=>{this.comp.getRouter().getTarget("notFound").display()};let i=e.getParameter("arguments");let r=i&&i.id&&(""+i.id).length>0?i.id:null;if(r){this.comp.getModel("service").createBindingContext(`/Products(${r})`,{expand:"Category,Supplier"},e=>{if(!e){t();return}this.productID=r;this.getView().setBindingContext(e,"service");this.refreshBinding(null,null,true);document.title=this.i18n.getText("view_product_title2",[this.mainModel.getProperty("/productData/ProductName")]);if(!this.orders_table){this.createOrdersTable(r)}else if(this.orders_table_id!=r){this.updateOrdersTable(r)}},true)}else{t()}},createOrdersTable:function(e){this.orders_table_id=e;this.byId("product_view_page").setHeaderExpanded(true);this.filterDialog=new r({i18n:this.i18n,dialog:true,title:this.i18n.getText("add_filters"),onFilter:e=>{this.orders_table.applyFilter(e)},fields:[{path:"OrderID",label:this.i18n.getText("order_id"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]},{path:"UnitPrice",label:this.i18n.getText("product_unitPrice"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]},{path:"Quantity",label:this.i18n.getText("order_quantity"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]},{path:"Discount",label:this.i18n.getText("order_discount"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]}]});let t=new p({icon:"sap-icon://filter",text:this.i18n.getText("filter"),press:()=>this.filterDialog.container.open()});let o=[{id:"OrderID",label:this.i18n.getText("order_id"),path:"OrderID",header:{}},{id:"UnitPrice",label:this.i18n.getText("product_unitPrice"),path:"UnitPrice",header:{minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"Quantity",label:this.i18n.getText("order_quantity"),path:"Quantity",header:{minScreenWidth:"Tablet",demandPopin:true,popinDisplay:"Inline"}},{id:"Discount",label:this.i18n.getText("order_discount"),path:"Discount",header:{minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"NetPrice",label:this.i18n.getText("order_net_price"),path:"UnitPrice",header:{hAlign:"End"}}].map(e=>({id:this.getView().createId(e.id),cell:{bindingPath:e.path},header:{header:e.label,...e.header},p13n:{key:e.id,label:e.label,path:e.path},excel:{label:e.label,property:e.path}}));o[0].cell.control=new u({text:"{OrderID}",wrapping:true,press:e=>{this.comp.getRouter().navTo("view_order",{id:parseInt(e.getSource().getText())})}});o[1].cell.control=new a({unit:"USD"});o[1].cell.control.bindProperty("number",{parts:[{path:"UnitPrice"},{value:"USD"}],type:"sap.ui.model.type.Currency",formatOptions:{showMeasure:false}});o[3].cell.control=new n({text:"{= ${Discount} === 0 ? 0 : ( (${Discount} * 100) + ' %' )}"});o[4].cell.control=new a({unit:"USD"});o[4].cell.control.bindProperty("number",{parts:[{path:"UnitPrice"},{path:"Quantity"},{path:"Discount"}],type:this.inputCheck.order.netPrice,formatOptions:{showMeasure:false}});delete o[4].excel;this.orders_table=new i({id:this.getView().createId("orders_table"),i18n:this.i18n,model:this.comp.getModel("service"),properties:{busyIndicatorDelay:0,mode:sap.m.ListMode.None,rememberSelections:true,growing:true,growingThreshold:50,sticky:["HeaderToolbar","ColumnHeaders"],popinLayout:sap.m.PopinLayout.Block,alternateRowColors:false},itemsBinding:{path:`/Products(${e})/Order_Details`},customToolbar:{start:[new l({text:this.i18n.getText("product_order_details_header")})],end:[t]},toolbar:{p13n:{Columns:true,Sorter:true,Groups:true},excel:this.comp.getModel("settings").getProperty("/odata/useMock")?2:1,growSize:true,pin:true},columns:o});this.byId("table_container").removeAllContent();this.byId("table_container").addContent(this.orders_table.getTable())},updateOrdersTable:function(e){this.orders_table_id=e;this.byId("product_view_page").setHeaderExpanded(true);this.orders_table.data.itemsBinding.path=`/Products(${e})/Order_Details`;this.orders_table.refreshBinding()}})});
//# sourceMappingURL=View.controller.js.map