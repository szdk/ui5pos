sap.ui.define(["ui5pos/szdk/controller/BaseController","ui5pos/szdk/controller/order/Helper","sap/ui/model/json/JSONModel","sap/ui/Device","ui5pos/szdk/controller/util/F4Help","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/Messaging","sap/m/MessageToast"],function(t,e,i,r,s,o,d,n,u){"use strict";return t.extend("ui5pos.szdk.controller.order.CreateOrder",{onInit:function(){t.prototype.onInit.apply(this,arguments);window.crt=this;this.comp.getRouter().getRoute("create_order").attachPatternMatched(this.patternMatched.bind(this));this.comp.getRouter().getRoute("home").attachPatternMatched(this.patternMatched.bind(this));this.configModel=new i({input:{mode:"scan",lock_quantity:false,lock_discount:false},editable:true,auto_print:true});this.getView().setModel(this.configModel,"config");this.dataModel=new i({previous_orders:[]});this.getView().setModel(this.dataModel,"data");this.orderModel=new i({order_id:null,total:0,total_price:0,total_discount:0,items:[],customer:{editable:true,id:null,phone:"",name:"",address:"",city:"",postal_code:"",country:""}});this.getView().setModel(this.orderModel,"order");n.registerObject(this.byId("inpt-cus-name"),true);n.registerObject(this.byId("inpt-cust-adr"),true);n.registerObject(this.byId("inpt-cust-city"),true);n.registerObject(this.byId("inpt-cust-post"),true);n.registerObject(this.byId("inpt-cust-cnt"),true)},onPressCreateOrder:function(){let t=this.orderModel.getProperty("/items");if(!t||t.length<=0)return;for(let t of["inpt-cst-phn","inpt-cus-name","inpt-cust-adr","inpt-cust-city","inpt-cust-post","inpt-cust-cnt"]){let e=this.byId(t);try{e.getBinding("value").getType().validateValue(e.getValue())}catch(t){if(t.message){e.setValueState(sap.ui.core.ValueState.Error)}this.focus(e);return}}let i={...this.orderModel.getData()};let r={OrderDate:new Date};let s=[];for(let t of i.items){s.push({ProductID:t.id,UnitPrice:t.price,Quantity:t.quantity,Discount:t.discount})}let o=null;if(i.customer.id)r.CustomerID=i.customer.id;else{o={Phone:i.customer.phone,ContactName:i.customer.name,Address:i.customer.address,City:i.customer.city,PostalCode:i.customer.postal_code,Country:i.customer.country}}if(!i.order_id){this.getView().setBusy(true);e.create.bind(this)(r,s,o).then(t=>{this.getView().setBusy(false);u.show(this.i18n.getText("create_order_created_num",[t.OrderID]),{duration:15e3,animationDuration:1});let r=this.dataModel.getProperty("/previous_orders")||[];r.unshift({order_id:t.OrderID,phone:i.customer.phone,order_total:Math.round(t.Freight*100)/100});if(r.length>20)r.pop();this.dataModel.setProperty("/previous_orders",r);this.onClearOrder();if(this.configModel.getProperty("/auto_print")){this.getView().setBusy(true);e.print({model:this.comp.getModel("service"),order_id:t.OrderID,i18n:this.i18n}).catch(()=>this.showErrorDialog()).finally(()=>{this.getView().setBusy(false)})}}).catch(t=>{this.getView().setBusy(false);console.error(t);this.showErrorDialog({message:t.message})})}else{this.getView().setBusy(true);delete r.OrderDate;r.OrderID=i.order_id;e.update.bind(this)(r,s,o).then(t=>{this.getView().setBusy(false);u.show(this.i18n.getText("create_order_updated_num",[t.OrderID]),{duration:15e3,animationDuration:1});let s=this.dataModel.getProperty("/previous_orders")||[];let o=s.findIndex(e=>parseInt(e.order_id)==parseInt(t.OrderID));if(o>=0)s.splice(o,1);s.unshift({order_id:t.OrderID,phone:i.customer.phone,order_total:Math.round(t.Freight*100)/100});if(s.length>20)s.pop();this.dataModel.setProperty("/previous_orders",s);this.onClearOrder();if(this.navBackAfterUpdate==r.OrderID)this.goBack("create_order");else if(this.configModel.getProperty("/auto_print")){this.getView().setBusy(true);e.print({model:this.comp.getModel("service"),order_id:t.OrderID,i18n:this.i18n}).catch(()=>this.showErrorDialog()).finally(()=>{this.getView().setBusy(false)})}}).catch(t=>{this.getView().setBusy(false);console.error(t);this.showErrorDialog({message:t.message})})}},editOrderMode:function(t){this.getView().setBusy(true);this.fetchOrder(t).then(e=>{this.getView().setBusy(false);this.onClearOrder();this.orderModel.setProperty("/order_id",t);this.orderModel.setProperty("/customer",{editable:false,id:e.Customer.CustomerID,phone:e.Customer.Phone,name:e.Customer.ContactName,address:e.Customer.Address,city:e.Customer.City,postal_code:e.Customer.PostalCode,country:e.Customer.Country});this.byId("inpt-cst-phn").setValueState(sap.ui.core.ValueState.None);this.orderEditProdQuan={[t]:{}};let i=[];let r=(Array.isArray(e.Order_Details)?e.Order_Details:e.Order_Details&&e.Order_Details.results)||[];for(let e of r){this.orderEditProdQuan[t][e.ProductID]=e.Quantity;i.push({id:e.ProductID,name:e.Product.ProductName,price:e.UnitPrice,discount:e.Discount,quantity:e.Quantity,total:Math.round(e.UnitPrice*e.Quantity*(1-e.Discount)*100)/100,editted:false})}this.orderModel.setProperty("/items",i);this.updateOrderTotal();this.focus(this.byId("input_product_id"))}).catch(e=>{this.getView().setBusy(false);console.error(e);this.showErrorDialog({message:this.i18n.getText("create_order_error_while_edit",[t])})})},onClearOrder:function(){this.orderModel.setProperty("/order_id",null);this.orderModel.setProperty("/total",0);this.orderModel.setProperty("/total_price",0);this.orderModel.setProperty("/total_discount",0);this.orderModel.setProperty("/items",[]);this.orderModel.setProperty("/customer/editable",true);this.orderModel.setProperty("/customer/id",null);this.orderModel.setProperty("/customer/phone"," ");this.orderModel.setProperty("/customer/phone","");this.orderModel.setProperty("/customer/name"," ");this.orderModel.setProperty("/customer/name","");this.byId("inpt-cst-phn").setValueState(sap.ui.core.ValueState.None);this.byId("inpt-cus-name").setValueState(sap.ui.core.ValueState.None);this.byId("input_product_id").setValueState(sap.ui.core.ValueState.None);this.focus(this.byId("input_product_id"))},onPressCustInfo:function(t){this.byId("ppp-customer-exist-des").openBy(t.getSource())},onClearCust:function(){this.orderModel.setProperty("/customer",{editable:true,id:null,phone:" ",name:" ",address:" ",city:" ",postal_code:" ",country:" "});this.orderModel.setProperty("/customer",{editable:true,id:null,phone:"",name:"",address:"",city:"",postal_code:"",country:""});this.byId("inpt-cst-phn").setValueState(sap.ui.core.ValueState.None);this.byId("inpt-cus-name").setValueState(sap.ui.core.ValueState.None);this.byId("inpt-cust-adr").setValueState(sap.ui.core.ValueState.None);this.byId("inpt-cust-city").setValueState(sap.ui.core.ValueState.None);this.byId("inpt-cust-post").setValueState(sap.ui.core.ValueState.None);this.byId("inpt-cust-cnt").setValueState(sap.ui.core.ValueState.None)},onPressEditOrder:function(t){let e=t.getSource();let i=e&&e.getBindingContext("data");let r=parseInt(i&&i.getProperty&&i.getProperty("order_id"));if(r){let t=this.orderModel.getProperty("/items");if(t&&t.length>0)this.showInfoDialog({title:this.i18n.getText("edit_order_num",[r]),buttonConfirm:this.i18n.getText("continue"),buttonType:sap.m.ButtonType.Reject,onConfirm:()=>{this.editOrderMode(r)},message:this.i18n.getText("create_order_cnf_edit")});else this.editOrderMode(r)}},onPressViewOrder:function(t){let e=t.getSource();let i=e&&e.getBindingContext("data");let r=parseInt(i&&i.getProperty&&i.getProperty("order_id"));this.comp.getRouter().navTo("view_order",{id:r})},onPressPrintOrder:function(t){let i=t.getSource();let r=i&&i.getBindingContext("data");let s=parseInt(r&&r.getProperty&&r.getProperty("order_id"));if(s){this.getView().setBusy(true);e.print({model:this.comp.getModel("service"),order_id:s,i18n:this.i18n}).catch(()=>this.showErrorDialog()).finally(()=>{this.getView().setBusy(false)})}},onPressDeleteOrder:function(t){let i=t.getSource();let r=i&&i.getBindingContext("data");let s=parseInt(r&&r.getProperty&&r.getProperty("order_id"));if(s){this.showErrorDialog({title:this.i18n.getText("confirm_delete"),message:this.i18n.getText("order_view_confirm_delete",[s]),onConfirm:()=>{e.delete({model:this.comp.getModel("service"),orderId:s}).then(()=>{u.show(this.i18n.getText("create_order_deleted_num",[s]),{duration:15e3,animationDuration:1});let t=this.dataModel.getProperty("/previous_orders")||[];let e=t.findIndex(t=>parseInt(t.order_id)==s);if(e>=0)t.splice(e,1);this.dataModel.setProperty("/previous_orders",t)}).catch(()=>{this.showErrorDialog()})}})}else{this.showErrorDialog()}},onPressViewProduct:function(t){let e=t.getSource().data("id");this.comp.getRouter().navTo("view_product",{id:e})},updateOrderTotal:function(){let t=[...this.orderModel.getProperty("/items")];let e=t.reduce((t,e)=>({totalPrice:t.totalPrice+e.price*e.quantity,total:t.total+e.total}),{totalPrice:0,total:0});this.orderModel.setProperty("/total",this.round2(e.total));this.orderModel.setProperty("/total_price",this.round2(e.totalPrice));this.orderModel.setProperty("/total_discount",this.round2(e.totalPrice-e.total))},resetInput:function(){if(!this.configModel.getProperty("/input/lock_discount"))this.byId("inpt-disc").setValue(0);if(!this.configModel.getProperty("/input/lock_quantity"))this.byId("inpt-quan").setValue(1);this.byId("input_product_id").setValue();this.toggleDiscountVisible(true)},onDeleteItem:function(t){let e=t.getSource();let i=e&&e.getBindingContext("order");let r=parseInt(i&&i.getProperty&&i.getProperty("id"));if(!r)return;let s=[...this.orderModel.getProperty("/items")];let o=s.findIndex(t=>t.id==r);if(o<0)return;s.splice(o,1);this.orderModel.setProperty("/items",s);this.updateOrderTotal()},onEditItem:function(t){let e=t.getSource();let i=e&&e.getBindingContext("order");let r=parseInt(i&&i.getProperty&&i.getProperty("id"));if(!r)return;let s=[...this.orderModel.getProperty("/items")];let o=s.findIndex(t=>t.id==r);if(o<0)return;let d=this.byId("edit-item-dialog");d.data("id",r);this.byId("sel-disc-type-edit").setSelectedKey("per");this.byId("item-name-edit").setText(s[o].name);this.byId("item-price-edit").setNumber(s[o].price.toFixed(2));this.byId("inpt-disc-edit").setValue(Math.round(s[o].discount*1e3)/10);this.byId("inpt-quan-edit").setValue(parseInt(s[o].quantity));d.open();this.focus(this.byId("inpt-disc-edit"))},onUpdateItem:function(){let t=this.byId("edit-item-dialog"),e=this.byId("sel-disc-type-edit"),i=this.byId("inpt-disc-edit"),r=this.byId("inpt-quan-edit");let s=t.data("id");let o=[...this.orderModel.getProperty("/items")];let d=o.findIndex(t=>t.id==s);if(d>=0){this.fetchProduct(s).then(s=>{let n={...o[d]};n.quantity=parseInt(r.getValue())||0;n.discount=parseFloat(i.getValue())||0;if(n.quantity<=0){this.focus(r);r.setValueStateText(this.i18n.getText("input_invalid"));r.setValueState(sap.ui.core.ValueState.Error);return}r.setValueState(sap.ui.core.ValueState.None);if(e.getSelectedKey()=="usd"){n.discount=n.discount/n.price}else{n.discount/=100}n.discount=Math.round(n.discount*1e3)/1e3;if(n.discount<0)n.discount=0;if(n.discount>1)n.discount=1;n.total=this.round2(n.price*n.quantity*(1-n.discount));if(this.checkInputProduct(s,r,n.quantity)){o[d]=n;this.orderModel.setProperty("/items",o);this.updateOrderTotal();t.close()}}).catch(e=>{console.error(e);t.close();this.showErrorDialog()})}else{t.close()}},onCancelItemUpdate:function(){this.byId("edit-item-dialog").close()},onAddItem:function(){let t=this.byId("input_product_id");let e=parseInt(t.getValue());const i=()=>{t.setValueStateText(this.i18n.getText("input_invalid_product_id"));t.setValueState(sap.ui.core.ValueState.Error);this.focus(t)};if(!e){i();return}this.configModel.setProperty("/editable",false);this.fetchProduct(e).then(t=>{this.configModel.setProperty("/editable",true);this.addItem(t)}).catch(t=>{console.log(t);i();this.configModel.setProperty("/editable",true)})},addItem:function(t){let e=this.byId("input_product_id"),i=this.byId("sel-disc-type"),r=this.byId("inpt-disc"),s=this.byId("inpt-quan");let o={id:t.ProductID,name:t.ProductName,price:t.UnitPrice,discount:parseFloat(r.getValue())||0,quantity:parseInt(s.getValue())||0,editted:false};if(o.quantity<=0){this.focus(s);s.setValueState(sap.ui.core.ValueState.Error);return}else{s.setValueState(sap.ui.core.ValueState.None)}if(i.getSelectedKey()=="usd"){o.discount=o.discount/o.price}else{o.discount/=100}o.discount=Math.round(o.discount*1e3)/1e3;if(o.discount<0)o.discount=0;if(o.discount>1)o.discount=1;o.total=this.round2(o.price*o.quantity*(1-o.discount));let d=[...this.orderModel.getProperty("/items")];let n=d.findIndex(t=>t.id==o.id);this.focus(e);if(n==-1){if(this.checkInputProduct(t,e,o.quantity)){d.unshift(o);this.orderModel.setProperty("/items",d);this.updateOrderTotal();this.resetInput()}else return}else{o.discount=d[n].discount;this.focus(e);if(this.checkInputProduct(t,e,o.quantity+d[n].quantity)){o.quantity+=d[n].quantity;o.total=this.round2(o.price*o.quantity*(1-o.discount));d.splice(n,1);d.unshift(o);this.orderModel.setProperty("/items",d);this.updateOrderTotal();this.resetInput()}}},onSubmitProductID:function(t){let e=t.getSource();let i=parseInt(e.getValue());if(!i)return;let r=this.orderModel.getProperty("/items").find(t=>t.id==i);if(r){this.byId("inpt-disc-existing").setValue(r.discount*100);this.toggleDiscountVisible(false)}else{this.toggleDiscountVisible(true)}if(this.configModel.getProperty("/input/mode")=="input"){this.fetchProduct(i).then(t=>{this.checkInputProduct(t,e)}).catch(()=>{if(i==parseInt(e.getValue())){e.setValueStateText(this.i18n.getText("input_invalid_product_id"));e.setValueState(sap.ui.core.ValueState.Error);this.focus(e)}})}else{if(!this.configModel.getProperty("/input/lock_discount")&&!r){this.focus(this.byId("inpt-disc"))}else if(!this.configModel.getProperty("/input/lock_quantity")){this.focus(this.byId("inpt-quan"))}else{this.onAddItem()}}},onSubmitDisc:function(t){t.getSource().setValueState(sap.ui.core.ValueState.None);if(!this.configModel.getProperty("/input/lock_quantity")){this.focus(this.byId("inpt-quan"))}else{this.onAddItem()}},onSubmitQuan:function(){let t=this.byId("inpt-quan");let e=parseInt(t.getValue());if(!e||e<=0){t.setValueState(sap.ui.core.ValueState.Error);this.focus(t)}else{t.setValueState(sap.ui.core.ValueState.None);this.onAddItem()}},fetchOrder:function(t){let e=()=>{},i=()=>{};let r=new Promise((t,r)=>{e=t;i=r});this.comp.getModel("service").read(`/Orders(${t})`,{urlParameters:{$expand:"Customer,Order_Details,Order_Details/Product"},success:e,error:i});return r},fetchPhone:function(t){let e=()=>{},i=()=>{};let r=new Promise((t,r)=>{e=t;i=r});let s=this.comp.getModel("service");s.read(`/Customers`,{filters:[new o({path:"Phone",operator:d.EQ,value1:t})],success:r=>{if(r&&r.results&&r.results.length>0){e(r.results[0])}else i(`customer with phone "${t}" not found`)},error:i});return r},fetchProduct:function(t){let e=()=>{},i=()=>{};let r=new Promise((t,r)=>{e=t;i=r});let s=this.comp.getModel("service");let o=s.getObject(`/Products(${t})`,{select:"ProductID,ProductName,UnitPrice,UnitsInStock,Discontinued"});if(o)e(o);else{s.read(`/Products(${t})`,{success:e,error:i})}return r},fetchProducts:function(t){let e=()=>{},i=()=>{};let r=new Promise((t,r)=>{e=t;i=r});let s=[];for(let e of t)s.push(new o("ProductID",d.EQ,parseInt(e)));let n=this.comp.getModel("service");n.read("/Products",{filters:[new o({filters:s,and:false})],success:t=>{if(t&&t.results)e(t.results);else i({message:"results property not found in fetched data",data:t})},error:i});return r},onValueHelpProductID:function(t){s.f4Table({i18n:this.i18n,ODataModel:this.comp.getModel("service"),entitySetPath:"/Products",filterFields:[{path:"ProductName",label:this.i18n.getText("product_name")}],showFields:[{path:"ProductID",label:this.i18n.getText("product_id")},{path:"ProductName",label:this.i18n.getText("product_name")}],returnFields:["ProductID","Discontinued","UnitsInStock"],title:this.i18n.getText("product_select_single")}).then(e=>{if(!e||e.length==0)return;let i=parseInt(e[0].ProductID);if(i){t.getSource().setValue(i);this.checkInputProduct(e[0],t.getSource())}})},onChangePhone:function(t){let e=t.getSource();try{e.getBinding("value").getType().validateValue(e.getValue());e.setValueState(sap.ui.core.ValueState.None)}catch(t){e.setValueStateText(t.message);e.setValueState(sap.ui.core.ValueState.Error);return}let i=this.orderModel.getProperty("/customer/phone");if(!i||i.trim().length==0)return;this.orderModel.setProperty("/customer/editable",false);this.fetchPhone(i).then(t=>{this.orderModel.setProperty("/customer",{editable:false,id:t.CustomerID,phone:t.Phone,name:t.ContactName,address:t.Address,city:t.City,postal_code:t.PostalCode,country:t.Country})}).catch(t=>{console.error(t);this.orderModel.setProperty("/customer/editable",true);this.orderModel.setProperty("/customer/id",null);this.focus(this.byId("inpt-cus-name"))})},checkInputProduct:function(t,e,i=1){let r=parseInt(t.UnitsInStock)||0;let s=this.orderModel.getProperty("/order_id");if(s&&this.orderEditProdQuan&&this.orderEditProdQuan[s]&&this.orderEditProdQuan[s][t.ProductID]){r+=parseInt(this.orderEditProdQuan[s][t.ProductID])||0}if(!t){e.setValueStateText(this.i18n.getText("input_invalid_product_id"));e.setValueState(sap.ui.core.ValueState.Error);this.focus(e);return false}else if(t.Discontinued){e.setValueStateText(this.i18n.getText("discontinued"));e.setValueState(sap.ui.core.ValueState.Error);this.focus(e);return false}else if(r==0){e.setValueStateText(this.i18n.getText("out_of_stock"));e.setValueState(sap.ui.core.ValueState.Error);this.focus(e);return false}else if(r<i){e.setValueStateText(this.i18n.getText("only_num_left",[r]));e.setValueState(sap.ui.core.ValueState.Error);this.focus(e);return false}else e.setValueState(sap.ui.core.ValueState.None);return true},patternMatched:function(t){if(!this.defaultPatternMatched(t))return;this.comp.getModel("nav").setProperty("/sideNav/selectedKey",`nav_item_route_create_order`);this.comp.getModel("nav").setProperty("/sideNav/expandableMin",1401);let e=t.getParameter("arguments");this.navBackAfterUpdate=false;if(e&&e["edit"]&&e["edit"]&&parseInt(e["edit"])){let t=parseInt(e["edit"]);this.navBackAfterUpdate=t;let i=this.orderModel.getProperty("/items");if(i&&i.length>0)this.showInfoDialog({title:this.i18n.getText("edit_order_num",[t]),buttonConfirm:this.i18n.getText("continue"),buttonType:sap.m.ButtonType.Reject,onConfirm:()=>{this.editOrderMode(t)},message:this.i18n.getText("create_order_cnf_edit")});else this.editOrderMode(t)}setTimeout(()=>this.focus(this.byId("input_product_id")),500)},round2:function(t){return Math.round(t*100)/100},focus:function(t){if(typeof t.focus=="function")t.focus();if(typeof t.getFocusDomRef=="function"){let e=t.getFocusDomRef();if(e&&typeof e.select=="function")e.select()}},toggleDiscountVisible:function(t=true){this.byId("sel-disc-type").setVisible(t);this.byId("inpt-disc").setVisible(t);this.byId("sel-disc-type-existing").setVisible(!t);this.byId("inpt-disc-existing").setVisible(!t)}})});
//# sourceMappingURL=CreateOrder.controller.js.map