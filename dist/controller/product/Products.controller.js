sap.ui.define(["ui5pos/szdk/controller/BaseController","ui5pos/szdk/controller/util/Table","ui5pos/szdk/controller/util/F4Help","ui5pos/szdk/controller/util/FilterDialog","sap/ui/model/json/JSONModel","sap/ui/export/Spreadsheet","sap/m/Dialog","sap/m/Button","sap/m/Text","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/ObjectIdentifier","sap/m/ObjectNumber","sap/m/Title","sap/m/Input","sap/m/ToolbarSeparator"],function(e,t,i,r,a,l,o,n,p,s,d,u,c,h,m,g){"use strict";return e.extend("ui5pos.szdk.controller.product.Products",{onInit:function(){e.prototype.onInit.apply(this,arguments);window.temp=this;this.comp.getRouter().getRoute("products").attachPatternMatched(this.defaultPatternMatched.bind(this));this.comp.szdk_serviceCreated.then(e=>{let a=new m({type:sap.m.InputType.Number,showValueHelp:true,placeholder:this.i18n.getText("product_id"),width:"9em"});a.attachValueHelpRequest(()=>this.onValueHelpProduct.bind(this)(a));let l=new n({type:sap.m.ButtonType.Transparent,text:this.i18n.getText("open")});l.attachPress(()=>this.openProduct.bind(this)(a));this.filterDialog=new r({i18n:this.i18n,dialog:true,title:this.i18n.getText("add_filters",undefined,true)||"Add Filters",onFilter:e=>{s.applyFilter(e)},fields:[{path:"ProductID",label:this.i18n.getText("product_id"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LT,sap.ui.model.FilterOperator.GT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE],onValueHelp:e=>{i.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Products",filterFields:[{path:"ProductName",label:this.i18n.getText("product_name")}],showFields:[{path:"ProductID",label:this.i18n.getText("product_id")},{path:"ProductName",label:this.i18n.getText("product_name")}],returnFields:["ProductID"],title:this.i18n.getText("product_select_single")}).then(t=>{if(!t||t.length==0)return;let i=parseInt(t[0].ProductID);if(i){e.setValue(i).setValueState(sap.ui.core.ValueState.None)}})}},{path:"ProductName",label:this.i18n.getText("product_name")},{path:"UnitPrice",label:this.i18n.getText("product_unitPrice"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LT,sap.ui.model.FilterOperator.GT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE]},{path:"CategoryID",label:this.i18n.getText("category_id"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LT,sap.ui.model.FilterOperator.GT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE],onValueHelp:e=>{i.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Categories",filterFields:[{path:"CategoryName",label:this.i18n.getText("category_name")}],showFields:[{path:"CategoryID",label:this.i18n.getText("product_id")},{path:"CategoryName",label:this.i18n.getText("product_name")}],returnFields:["CategoryID"],title:this.i18n.getText("category_select_single")}).then(t=>{if(!t||t.length==0)return;let i=parseInt(t[0].CategoryID);if(i){e.setValue(i).setValueState(sap.ui.core.ValueState.None)}})}},{path:"Category/CategoryName",label:this.i18n.getText("category")},{path:"SupplierID",label:this.i18n.getText("supplier_id"),type:sap.m.InputType.Number,operators:[sap.ui.model.FilterOperator.EQ,sap.ui.model.FilterOperator.BT,sap.ui.model.FilterOperator.LT,sap.ui.model.FilterOperator.GT,sap.ui.model.FilterOperator.LE,sap.ui.model.FilterOperator.GE],onValueHelp:e=>{i.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Suppliers",filterFields:[{path:"CompanyName",label:this.i18n.getText("supplier_company_name")}],showFields:[{path:"SupplierID",label:this.i18n.getText("supplier_id")},{path:"CompanyName",label:this.i18n.getText("supplier_company_name")}],returnFields:["SupplierID"],title:this.i18n.getText("supplier_select_single")}).then(t=>{if(!t||t.length==0)return;let i=parseInt(t[0].SupplierID);if(i){e.setValue(i).setValueState(sap.ui.core.ValueState.None)}})}}]});let o=new n({icon:"sap-icon://filter",type:sap.m.ButtonType.Transparent,tooltip:this.i18n.getText("filter")});o.attachPress(()=>{this.filterDialog.container.open()});let p=[{id:"ProductID",label:this.i18n.getText("id"),path:"ProductID",header:{minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline",width:"5em"}},{id:"ProductName",label:this.i18n.getText("product"),path:"ProductName",header:{}},{id:"CategoryName",label:this.i18n.getText("category"),path:"Category/CategoryName",header:{minScreenWidth:"Tablet",demandPopin:true,popinDisplay:"Inline"}},{id:"UnitsInStock",label:this.i18n.getText("product_instock"),path:"UnitsInStock",header:{minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"QuantityPerUnit",label:this.i18n.getText("product_quantityPerUnit"),path:"QuantityPerUnit",header:{minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"UnitPrice",label:this.i18n.getText("product_unitPrice"),path:"UnitPrice",header:{hAlign:"End"}},{id:"SupplierID",label:this.i18n.getText("supplier_id"),path:"SupplierID",header:{visible:false,minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"CategoryID",label:this.i18n.getText("category_id"),path:"CategoryID",header:{visible:false,minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"ReorderLevel",label:this.i18n.getText("product_reorder_level"),path:"ReorderLevel",header:{visible:false,minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}},{id:"Discontinued",label:this.i18n.getText("discontinued"),path:"Discontinued",header:{visible:false,minScreenWidth:"XXLarge",demandPopin:true,popinDisplay:"Inline"}}].map(e=>({id:this.getView().createId(e.id),cell:{bindingPath:e.path},header:{header:e.label,...e.header},p13n:{key:e.id,label:e.label,path:e.path},excel:{label:e.label,property:e.path}}));p[0].cell.control=new u({title:"{ProductID}"});p[1].cell.control=new h({titleStyle:"H6",wrapping:true,wrappingType:"Normal",text:"{ProductName}"});p[5].cell.control=new c({unit:"USD"});p[5].cell.control.bindProperty("number",{parts:[{path:"UnitPrice"},{value:"USD"}],type:"sap.ui.model.type.Currency",formatOptions:{showMeasure:false}});let s=new t({id:this.getView().createId("products_table"),i18n:this.i18n,model:e,columnListItem:{type:sap.m.ListType.Navigation},properties:{busyIndicatorDelay:0,mode:sap.m.ListMode.SingleSelectMaster,rememberSelections:true,growing:true,growingThreshold:50,sticky:["HeaderToolbar","ColumnHeaders"],popinLayout:sap.m.PopinLayout.Block,alternateRowColors:false},itemsBinding:{path:"/Products",parameters:{expand:"Category"}},customToolbar:{start:[o,new g,a,l]},toolbar:{p13n:{Columns:true,Sorter:true,Groups:true},excel:this.comp.getModel("settings").getProperty("/odata/useMock")?2:1,growSize:true,pin:true},columns:p});this.byId("products_main_page").addContent(s.getTable());s.getTable().attachItemPress(this.onSelectionChange.bind(this))})},openProduct:function(e){const t=()=>{e.setValueStateText(this.i18n.getText("input_invalid_product_id"));e.setValueState(sap.ui.core.ValueState.Error)};let i=parseInt(e.getValue());if(!i){t();return}this.comp.getModel("service").read(`/Products(${i})`,{success:i=>{if(i&&i.ProductID){e.setValueState(sap.ui.core.ValueState.None);e.setValue("");this.comp.getRouter().navTo("view_product",{id:i.ProductID})}else{t()}},error:e=>{t()}})},onValueHelpProduct:function(e){i.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Products",filterFields:[{path:"ProductName",label:this.i18n.getText("product_name")}],showFields:[{path:"ProductID",label:this.i18n.getText("product_id")},{path:"ProductName",label:this.i18n.getText("product_name")}],returnFields:["ProductID"],title:this.i18n.getText("product_select_single")}).then(t=>{if(!t||t.length==0)return;let i=parseInt(t[0].ProductID);if(i){e.setValue(i).setValueState(sap.ui.core.ValueState.None)}})},onSelectionChange:function(e){let t=e.getParameters();if(!t.listItem||t.listItems&&t.listItems.length!=1)return;let i=t.listItem.getBindingContext();let r=i?i.getProperty("ProductID"):null;if(r!==null)this.comp.getRouter().navTo("view_product",{id:r})},onPressCreateProduct:function(){this.comp.getRouter().navTo("create_product")}})});
//# sourceMappingURL=Products.controller.js.map