sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/order/Helper",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "ui5pos/szdk/controller/util/F4Help",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Messaging",
    "sap/m/MessageToast",
    ],
    function (
        Controller,
        Helper,
        JSONModel,
        Device,
        F4Help,
        Filter,
        FilterOperator,
        Messaging,
        MessageToast,
        ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.order.CreateOrder", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                window.crt = this;
                
                this.comp.getRouter().getRoute('create_order').attachPatternMatched(this.patternMatched.bind(this));

                // ========= models ============================
                this.configModel = new JSONModel({
                    input : {
                        mode : 'scan',
                        lock_quantity : false,
                        lock_discount : false,
                    },
                    editable : true,
                    auto_print : true,
                });
                this.getView().setModel(this.configModel, 'config');

                this.dataModel = new JSONModel({
                    previous_orders : [
                        // {order_id : 10249, phone : '9876543210', order_total : 30.27},
                        // {order_id : 10250, phone : '9876543210', order_total : 54.00},
                        // {order_id : 10251, phone : '9876543210', order_total : 99.99}
                    ],
                });
                this.getView().setModel(this.dataModel, 'data');

                this.orderModel = new JSONModel({
                    order_id : null,
                    total : 0,
                    total_price : 0,
                    total_discount : 0,
                    items : [
                        // {id : 1, name : 'Gumbo Mix', price : 14.99, discount : 0, quantity : 4, total: 59.96, editted : false},
                        // {id : 2, name : 'Chiuawa', price : 9.00, discount : 0.15, quantity : 9, total: 12.15, editted : false}
                    ],
                    customer : {
                        editable : true,
                        id : null,
                        phone : '',
                        name : '',
                        address : '',
                        city : '',
                        postal_code : '',
                        country : '',
                    }
                });
                this.getView().setModel(this.orderModel, 'order');

                // ======================= register input validation check =====================================
                // Messaging.registerObject(this.byId('inpt-cst-phn'), true);
                Messaging.registerObject(this.byId('inpt-cus-name'), true);
                Messaging.registerObject(this.byId('inpt-cust-adr'), true);
                Messaging.registerObject(this.byId('inpt-cust-city'), true);
                Messaging.registerObject(this.byId('inpt-cust-post'), true);
                Messaging.registerObject(this.byId('inpt-cust-cnt'), true);
                
            },

            onPressCreateOrder : function () {
                let items = this.orderModel.getProperty('/items');
                if (!items || items.length <= 0) return;

                for (let id of [
                    'inpt-cst-phn',
                    'inpt-cus-name',
                    'inpt-cust-adr',
                    'inpt-cust-city',
                    'inpt-cust-post',
                    'inpt-cust-cnt',
                ]) {
                    let el = this.byId(id);
                    try {
                        el.getBinding('value').getType().validateValue(el.getValue());
                    } catch (e) {
                        if (e.message) {
                            // el.setValueStateText(e.message);
                            el.setValueState(sap.ui.core.ValueState.Error);
                        }
                        this.focus(el);
                        return;
                    }
                }

                let orderModel = {...this.orderModel.getData()};
                let order = {OrderDate : new Date()};

                let order_details = [];
                for (let item of orderModel.items) {
                    order_details.push({
                        ProductID : item.id,
                        UnitPrice : item.price,
                        Quantity : item.quantity,
                        Discount : item.discount
                    });
                }
                let customer = null;
                if (orderModel.customer.id)
                    order.CustomerID = orderModel.customer.id;
                else {
                    customer = {
                        Phone : orderModel.customer.phone,
                        ContactName : orderModel.customer.name,
                        Address : orderModel.customer.address,
                        City : orderModel.customer.city,
                        PostalCode : orderModel.customer.postal_code,
                        Country : orderModel.customer.country,
                    };
                }

                if (!orderModel.order_id) {
                    this.getView().setBusy(true);
                    (Helper.create.bind(this))(order, order_details, customer)
                        .then((order_data) => {
                            this.getView().setBusy(false);
                            MessageToast.show(this.i18n.getText('create_order_created_num', [order_data.OrderID]), {
                                duration : 15000,
                                animationDuration : 1,
                            });
                            let previous_orders = this.dataModel.getProperty('/previous_orders') || [];
                            previous_orders.unshift({order_id : order_data.OrderID, phone : orderModel.customer.phone, order_total : Math.round(order_data.Freight * 100) / 100});
                            if (previous_orders.length > 20)
                                previous_orders.pop();
                            this.dataModel.setProperty('/previous_orders', previous_orders);
                            this.onClearOrder();
                            if (this.configModel.getProperty('/auto_print')) {
                                this.getView().setBusy(true);
                                Helper.print({model : this.comp.getModel('service'), order_id : order_data.OrderID, i18n : this.i18n})
                                    .catch(() => this.showErrorDialog())
                                    .finally(() => {this.getView().setBusy(false)});
                            }
                        })
                        .catch((err) => {
                            this.getView().setBusy(false);
                            console.error(err);
                            this.showErrorDialog({message : err.message});
                        });
                } else {
                    this.getView().setBusy(true);
                    delete order.OrderDate;
                    order.OrderID = orderModel.order_id;
                    (Helper.update.bind(this))(order, order_details, customer)
                        .then((order_data) => {
                            this.getView().setBusy(false);
                            MessageToast.show(this.i18n.getText('create_order_updated_num', [order_data.OrderID]), {
                                duration : 15000,
                                animationDuration : 1,
                            });
                            let previous_orders = this.dataModel.getProperty('/previous_orders') || [];
                            let idx = previous_orders.findIndex((v) => parseInt(v.order_id) == parseInt(order_data.OrderID));
                            if (idx >= 0)
                                previous_orders.splice(idx, 1);
                            previous_orders.unshift({order_id : order_data.OrderID, phone : orderModel.customer.phone, order_total : Math.round(order_data.Freight * 100) / 100});
                            if (previous_orders.length > 20)
                                previous_orders.pop();
                            this.dataModel.setProperty('/previous_orders', previous_orders);
                            this.onClearOrder();
                            if (this.navBackAfterUpdate)
                                this.goBack("create_order");
                            else if (this.configModel.getProperty('/auto_print')) {
                                this.getView().setBusy(true);
                                Helper.print({model : this.comp.getModel('service'), order_id : order_data.OrderID, i18n : this.i18n})
                                    .catch(() => this.showErrorDialog())
                                    .finally(() => {this.getView().setBusy(false)});
                            }
                        }).catch((err) => {
                            this.getView().setBusy(false);
                            console.error(err);
                            this.showErrorDialog({message : err.message});
                        });
                }                
            },


            editOrderMode : function (order_id) {
                this.getView().setBusy(true);
                this.fetchOrder(order_id).then(data => {
                    this.getView().setBusy(false);

                    this.onClearOrder();
                    this.orderModel.setProperty('/order_id', order_id);

                    this.orderModel.setProperty('/customer', {
                        editable : false,
                        id : data.Customer.CustomerID,
                        phone : data.Customer.Phone,
                        name : data.Customer.ContactName,
                        address : data.Customer.Address,
                        city : data.Customer.City,
                        postal_code : data.Customer.PostalCode,
                        country : data.Customer.Country
                    });
                    this.byId('inpt-cst-phn').setValueState(sap.ui.core.ValueState.None);

                    //to calculate quantity of products in stock (including the quantity in current order)
                    this.orderEditProdQuan = {[order_id] : {}};

                    let items = [];
                    let ref = (Array.isArray(data.Order_Details) ? data.Order_Details : (data.Order_Details && data.Order_Details.results)) || [];
                    for (let el of ref) {
                        this.orderEditProdQuan[order_id][el.ProductID] = el.Quantity;
                        items.push({
                            id : el.ProductID,
                            name : el.Product.ProductName,
                            price : el.UnitPrice,
                            discount : el.Discount,
                            quantity : el.Quantity,
                            total : Math.round((el.UnitPrice * el.Quantity * (1 - el.Discount) ) * 100) / 100,
                            editted : false,
                        });
                    }
                    this.orderModel.setProperty('/items', items);
                    this.updateOrderTotal();
                    this.focus(this.byId('input_product_id'));
                }).catch(err => {
                    this.getView().setBusy(false);
                    console.error(err);
                    this.showErrorDialog({message : this.i18n.getText('create_order_error_while_edit', [order_id])});
                });
            },

            onClearOrder : function () {
                this.orderModel.setProperty('/order_id', null);
                this.orderModel.setProperty('/total', 0);
                this.orderModel.setProperty('/total_price', 0);
                this.orderModel.setProperty('/total_discount', 0);
                this.orderModel.setProperty('/items', []);
                this.orderModel.setProperty('/customer/editable', true);
                this.orderModel.setProperty('/customer/id', null);
                this.orderModel.setProperty('/customer/phone', ' ');
                this.orderModel.setProperty('/customer/phone', '');
                this.orderModel.setProperty('/customer/name', ' ');
                this.orderModel.setProperty('/customer/name', '');
                this.byId('inpt-cst-phn').setValueState(sap.ui.core.ValueState.None);
                this.byId('inpt-cus-name').setValueState(sap.ui.core.ValueState.None);
                this.byId('input_product_id').setValueState(sap.ui.core.ValueState.None);
                this.focus(this.byId('input_product_id'));
            },

            onPressCustInfo : function (evt) {
                this.byId('ppp-customer-exist-des').openBy(evt.getSource());
            },
            onClearCust : function () {
                this.orderModel.setProperty('/customer', {
                    editable : true,
                    id : null,
                    phone : ' ',
                    name : ' ',
                    address : ' ',
                    city : ' ',
                    postal_code : ' ',
                    country : ' ',
                });
                //to trigger refresh in case input has value state error
                this.orderModel.setProperty('/customer', {
                    editable : true,
                    id : null,
                    phone : '',
                    name : '',
                    address : '',
                    city : '',
                    postal_code : '',
                    country : '',
                });
                
                this.byId('inpt-cst-phn').setValueState(sap.ui.core.ValueState.None);
                this.byId('inpt-cus-name').setValueState(sap.ui.core.ValueState.None);
                this.byId('inpt-cust-adr').setValueState(sap.ui.core.ValueState.None);
                this.byId('inpt-cust-city').setValueState(sap.ui.core.ValueState.None);
                this.byId('inpt-cust-post').setValueState(sap.ui.core.ValueState.None);
                this.byId('inpt-cust-cnt').setValueState(sap.ui.core.ValueState.None);
            },

            onPressEditOrder : function (evt) {
                let source = evt.getSource();
                let ctx = source && source.getBindingContext('data');
                let id = parseInt(ctx && ctx.getProperty && ctx.getProperty('order_id'));
                if (id) {
                    let curItems = this.orderModel.getProperty('/items');
                    if (curItems && curItems.length > 0)
                        this.showInfoDialog({
                            title : this.i18n.getText('edit_order_num', [id]),
                            buttonConfirm : this.i18n.getText('continue'),
                            buttonType : sap.m.ButtonType.Reject,
                            onConfirm : () => {
                                this.editOrderMode(id);
                            },
                            message : this.i18n.getText('create_order_cnf_edit')
                        });
                    else
                        this.editOrderMode(id);
                }
            },

            onPressViewOrder : function (evt) {
                let source = evt.getSource();
                let ctx = source && source.getBindingContext('data');
                let id = parseInt(ctx && ctx.getProperty && ctx.getProperty('order_id'));
                this.comp.getRouter().navTo("view_order", {id : id});
            },

            onPressPrintOrder : function (evt) {
                let source = evt.getSource();
                let ctx = source && source.getBindingContext('data');
                let id = parseInt(ctx && ctx.getProperty && ctx.getProperty('order_id'));
                if (id) {
                    this.getView().setBusy(true);
                    Helper.print({model : this.comp.getModel('service'), order_id : id, i18n : this.i18n})
                        .catch(() => this.showErrorDialog())
                        .finally(() => {this.getView().setBusy(false)});
                }
            },

            onPressDeleteOrder : function (evt) {
                let source = evt.getSource();
                let ctx = source && source.getBindingContext('data');
                let id = parseInt(ctx && ctx.getProperty && ctx.getProperty('order_id'));
                if (id) {
                    this.showErrorDialog({
                        title: this.i18n.getText('confirm_delete'),
                        message: this.i18n.getText('order_view_confirm_delete', [id]),
                        onConfirm: () => {
                            Helper.delete({
                                model : this.comp.getModel('service'),
                                orderId : id
                            }).then(() => {
                                MessageToast.show(this.i18n.getText('create_order_deleted_num', [id]), {
                                    duration : 15000,
                                    animationDuration : 1,
                                });
                                let previous_orders = this.dataModel.getProperty('/previous_orders') || [];
                                let idx = previous_orders.findIndex((v) => parseInt(v.order_id) == id);
                                if (idx >= 0)
                                    previous_orders.splice(idx, 1);
                                this.dataModel.setProperty('/previous_orders', previous_orders);
                            })
                            .catch(() => {
                                this.showErrorDialog();
                            });
                        }
                    });
                } else {
                    this.showErrorDialog();
                }
            },

            onPressViewProduct : function (evt) {
                let id = evt.getSource().data('id');
                this.comp.getRouter().navTo("view_product", {id});
            },

            updateOrderTotal : function () {
                let items = [...this.orderModel.getProperty('/items')];
                let total = items.reduce((sum, v) => ({
                    totalPrice : sum.totalPrice + v.price * v.quantity,
                    total : sum.total + v.total
                }), {totalPrice : 0, total : 0});
                this.orderModel.setProperty('/total', this.round2(total.total));
                this.orderModel.setProperty('/total_price', this.round2(total.totalPrice));
                this.orderModel.setProperty('/total_discount', this.round2(total.totalPrice - total.total));
            },

            resetInput : function () {
                if (!this.configModel.getProperty('/input/lock_discount'))
                    this.byId('inpt-disc').setValue(0);
                if (!this.configModel.getProperty('/input/lock_quantity'))
                    this.byId('inpt-quan').setValue(1);
                this.byId('input_product_id').setValue();
                this.toggleDiscountVisible(true);
            },

            onDeleteItem : function (evt) {
                let source = evt.getSource();
                let ctx = source && source.getBindingContext('order');
                let id = parseInt(ctx && ctx.getProperty && ctx.getProperty('id'));
                if (!id) return;

                let items = [...this.orderModel.getProperty('/items')];
                let idx = items.findIndex(v => v.id == id);
                if (idx < 0) return;

                items.splice(idx, 1);
                this.orderModel.setProperty('/items', items);
                this.updateOrderTotal();
            },

            onEditItem : function (evt) {
                let source = evt.getSource();
                let ctx = source && source.getBindingContext('order');
                let id = parseInt(ctx && ctx.getProperty && ctx.getProperty('id'));
                if (!id) return;
                let items = [...this.orderModel.getProperty('/items')];
                let idx = items.findIndex(v => v.id == id);
                if (idx < 0) return;

                let d = this.byId('edit-item-dialog');
                d.data('id', id);

                this.byId('sel-disc-type-edit').setSelectedKey('per');
                this.byId('item-name-edit').setText(items[idx].name);
                this.byId('item-price-edit').setNumber(items[idx].price.toFixed(2));
                this.byId('inpt-disc-edit').setValue(Math.round(items[idx].discount * 1000) / 10);
                this.byId('inpt-quan-edit').setValue(parseInt(items[idx].quantity));
                d.open();
                this.focus(this.byId('inpt-disc-edit'));
            },

            onUpdateItem : function () {
                let dialog = this.byId('edit-item-dialog'),
                    seldisctype = this.byId('sel-disc-type-edit'),
                    inputdisc = this.byId('inpt-disc-edit'),
                    inputquan = this.byId('inpt-quan-edit');
                let id = dialog.data('id');
                let items = [...this.orderModel.getProperty('/items')];
                let idx = items.findIndex(v => v.id == id);
                if (idx >= 0) {
                    this.fetchProduct(id).then(data => {
                        let newItem = {...items[idx]};
                        newItem.quantity = parseInt(inputquan.getValue()) || 0;
                        newItem.discount = parseFloat(inputdisc.getValue()) || 0.0;

                        if (newItem.quantity <= 0) {
                            this.focus(inputquan);
                            inputquan.setValueStateText(this.i18n.getText('input_invalid'));
                            inputquan.setValueState(sap.ui.core.ValueState.Error);
                            return;
                        }
                        inputquan.setValueState(sap.ui.core.ValueState.None);
                        
                        if (seldisctype.getSelectedKey() == 'usd') {
                            newItem.discount = newItem.discount / newItem.price;
                        } else {
                            newItem.discount /= 100;
                        }
                        newItem.discount = Math.round(newItem.discount * 1000) / 1000;
                        if (newItem.discount < 0) newItem.discount = 0.0;
                        if (newItem.discount > 1) newItem.discount = 1.0;
                        
                        newItem.total = this.round2(newItem.price * newItem.quantity * (1 - newItem.discount));

                        if (this.checkInputProduct(data, inputquan, newItem.quantity)) {
                            items[idx] = newItem;
                            this.orderModel.setProperty('/items', items);
                            this.updateOrderTotal();
                            dialog.close();
                        }
                    }).catch(e => {
                        console.error(e);
                        dialog.close();
                        this.showErrorDialog();
                    });
                } else {
                    dialog.close();
                }
            },

            onCancelItemUpdate : function () {
                this.byId('edit-item-dialog').close();
            },

            onAddItem : function () {
                let inputid = this.byId('input_product_id');
                let id = parseInt(inputid.getValue());
                const invalidProd = () => {
                    inputid.setValueStateText(this.i18n.getText('input_invalid_product_id'));
                    inputid.setValueState(sap.ui.core.ValueState.Error);
                    this.focus(inputid);
                }
                if (!id) {
                    invalidProd();
                    return;
                }
                this.configModel.setProperty('/editable', false);
                this.fetchProduct(id)
                    .then((data) => {
                        this.configModel.setProperty('/editable', true);
                        this.addItem(data);
                    })
                    .catch((e) => {
                        console.log(e);
                        invalidProd();
                        this.configModel.setProperty('/editable', true);
                    });
            },

            addItem : function (prod) {
                let inputid = this.byId('input_product_id'),
                    seldisctype = this.byId('sel-disc-type'),
                    inputdisc = this.byId('inpt-disc'),
                    inputquan = this.byId('inpt-quan');
                
                let newItem = {
                    id : prod.ProductID,
                    name : prod.ProductName,
                    price : prod.UnitPrice,
                    discount : parseFloat(inputdisc.getValue()) || 0.0,
                    quantity : parseInt(inputquan.getValue()) || 0,
                    editted : false
                };
                if (newItem.quantity <= 0) {
                    this.focus(inputquan);
                    inputquan.setValueState(sap.ui.core.ValueState.Error);
                    return;
                } else {
                    inputquan.setValueState(sap.ui.core.ValueState.None);
                }
                if (seldisctype.getSelectedKey() == 'usd') {
                    newItem.discount = newItem.discount / newItem.price;
                } else {
                    newItem.discount /= 100;
                }
                newItem.discount = Math.round(newItem.discount * 1000) / 1000;
                if (newItem.discount < 0) newItem.discount = 0.0;
                if (newItem.discount > 1) newItem.discount = 1.0;

                newItem.total = this.round2(newItem.price * newItem.quantity * (1 - newItem.discount));

                let items = [...this.orderModel.getProperty('/items')];
                let idx = items.findIndex(v => v.id == newItem.id);
                this.focus(inputid);
                if (idx == -1) {
                    if (this.checkInputProduct(prod, inputid, newItem.quantity)) {
                        items.unshift(newItem);
                        this.orderModel.setProperty('/items', items);
                        this.updateOrderTotal();
                        this.resetInput();
                    } else
                        return;
                } else {
                    newItem.discount = items[idx].discount;
                    this.focus(inputid);
                    if (this.checkInputProduct(prod, inputid, newItem.quantity + items[idx].quantity)) {
                        newItem.quantity += items[idx].quantity;
                        newItem.total = this.round2(newItem.price * newItem.quantity * (1 - newItem.discount));
                        items.splice(idx, 1);
                        items.unshift(newItem);
                        this.orderModel.setProperty('/items', items);
                        this.updateOrderTotal();
                        this.resetInput();
                    }
                }
            },

            onSubmitProductID : function (evt) {
                let input = evt.getSource();
                let id = parseInt(input.getValue());
                if (!id) return;

                //existing item check
                let existing = this.orderModel.getProperty('/items').find(v => v.id == id);
                if (existing) {
                    this.byId('inpt-disc-existing').setValue(existing.discount * 100);
                    this.toggleDiscountVisible(false);
                } else {
                    this.toggleDiscountVisible(true);
                }

                if (this.configModel.getProperty('/input/mode') == 'input') {
                    this.fetchProduct(id)
                        .then((data) => {
                            this.checkInputProduct(data, input);
                        }).catch(() => {
                            if (id == parseInt(input.getValue())) {
                                input.setValueStateText(this.i18n.getText('input_invalid_product_id'));
                                input.setValueState(sap.ui.core.ValueState.Error);
                                this.focus(input);
                            }
                        });
                } else {
                    if (!this.configModel.getProperty('/input/lock_discount') && !existing) {
                        this.focus(this.byId('inpt-disc'));
                    } else if (!this.configModel.getProperty('/input/lock_quantity')) {
                        this.focus(this.byId('inpt-quan'));
                    } else {
                        this.onAddItem();
                    }
                }
            },

            onSubmitDisc : function (evt) {
                evt.getSource().setValueState(sap.ui.core.ValueState.None);
                if (!this.configModel.getProperty('/input/lock_quantity')) {
                    this.focus(this.byId('inpt-quan'));
                } else {
                    this.onAddItem();
                }
            },

            onSubmitQuan : function () {
                let input = this.byId('inpt-quan');
                let val = parseInt(input.getValue());
                if (!val || val <= 0) {
                    input.setValueState(sap.ui.core.ValueState.Error);
                    this.focus(input);
                } else {
                    input.setValueState(sap.ui.core.ValueState.None);
                    this.onAddItem();
                }
            },

            fetchOrder : function (order_id) {
                let res = () => {}, rej = () => {};
                let prom = new Promise((s, e) => {
                    res = s; rej = e;
                });

                this.comp.getModel('service').read(`/Orders(${order_id})`, {
                    urlParameters : {
                        '$expand' : 'Customer,Order_Details,Order_Details/Product'
                    },
                    success : res,
                    error : rej
                });
                return prom;
            },

            fetchPhone : function (phone) {
                let res = () => {}, rej = () => {};
                let prom = new Promise((s, e) => {
                    res = s; rej = e;
                });

                let model = this.comp.getModel('service');
                model.read(`/Customers`, {
                    filters : [
                        new Filter({
                            path : 'Phone',
                            operator : FilterOperator.EQ,
                            value1 : phone
                        })
                    ],
                    success : (data) => {
                        if (data && data.results && data.results.length > 0) {
                            res(data.results[0]);
                        } else
                            rej(`customer with phone "${phone}" not found`);
                    },
                    error : rej
                });
                
                return prom;
            },

            fetchProduct : function (id) {
                let res = () => {}, rej = () => {};
                let prom = new Promise((s, e) => {
                    res = s; rej = e;
                });

                let model = this.comp.getModel('service');
                let data = model.getObject(`/Products(${id})`, {select : "ProductID,ProductName,UnitPrice,UnitsInStock,Discontinued"});
                if (data)
                    res(data);
                else{
                    model.read(`/Products(${id})`, {
                        success : res,
                        error : rej
                    });
                }
                return prom;
            },

            fetchProducts : function (ids) {
                let resolve = () => {}, reject = () => {};
                let prom = new Promise((s, e) => {
                    resolve = s; reject = e;
                });

                let filters = [];
                for (let id of ids)
                    filters.push(new Filter('ProductID', FilterOperator.EQ, parseInt(id)));

                let model = this.comp.getModel('service');
                model.read('/Products', {
                    filters : [new Filter({filters, and : false})],
                    success : (data) => {
                        if (data && data.results)
                            resolve(data.results);
                        else
                            reject({message : 'results property not found in fetched data', data});
                    },
                    error : reject
                });

                return prom;
            },

            onValueHelpProductID : function (evt) {
                F4Help.f4Table({
                    i18n : this.i18n,
                    ODataModel: this.comp.getModel('service'),
                    entitySetPath: '/Products',
                    filterFields: [{path : 'ProductName', label : this.i18n.getText('product_name')}],
                    showFields: [
                        {path : 'ProductID', label : this.i18n.getText('product_id')},
                        {path : 'ProductName', label : this.i18n.getText('product_name')},
                    ],
                    returnFields: ['ProductID', 'Discontinued', 'UnitsInStock'],
                    title: this.i18n.getText('product_select_single')
                }).then((selected) => {
                    if (!selected || selected.length == 0) return;
                    let id = parseInt(selected[0].ProductID);
                    if (id) {
                        evt.getSource().setValue(id);
                        this.checkInputProduct(selected[0], evt.getSource());
                    }
                });
            },
            onChangePhone : function (evt) {
                let el = evt.getSource();
                try {
                    el.getBinding('value').getType().validateValue(el.getValue());
                    el.setValueState(sap.ui.core.ValueState.None);
                } catch (e) {
                    el.setValueStateText(e.message);
                    el.setValueState(sap.ui.core.ValueState.Error);
                    return;
                }
                let phone = this.orderModel.getProperty('/customer/phone');
                if (!phone || phone.trim().length == 0) return;
                this.orderModel.setProperty('/customer/editable', false);
                this.fetchPhone(phone).then((data) => {
                    this.orderModel.setProperty('/customer', {
                        editable : false,
                        id : data.CustomerID,
                        phone : data.Phone,
                        name : data.ContactName,
                        address : data.Address,
                        city : data.City,
                        postal_code : data.PostalCode,
                        country : data.Country,
                    });
                }).catch((err) => {
                    console.error(err);
                    this.orderModel.setProperty('/customer/editable', true);
                    this.orderModel.setProperty('/customer/id', null);
                    this.focus(this.byId('inpt-cus-name'));
                });
            },
            checkInputProduct : function (data, input, quan = 1) {
                let instock = parseInt(data.UnitsInStock) || 0;
                let cur_order_id = this.orderModel.getProperty('/order_id');
                if (cur_order_id && this.orderEditProdQuan && this.orderEditProdQuan[cur_order_id] && this.orderEditProdQuan[cur_order_id][data.ProductID]) {
                    instock += (parseInt(this.orderEditProdQuan[cur_order_id][data.ProductID]) || 0);
                }
                if (!data) {
                    input.setValueStateText(this.i18n.getText('input_invalid_product_id'));
                    input.setValueState(sap.ui.core.ValueState.Error);
                    this.focus(input);
                    return false;
                } else if (data.Discontinued) {
                    input.setValueStateText(this.i18n.getText('discontinued'));
                    input.setValueState(sap.ui.core.ValueState.Error);
                    this.focus(input);
                    return false;
                } else if (instock == 0) {
                    input.setValueStateText(this.i18n.getText('out_of_stock'));
                    input.setValueState(sap.ui.core.ValueState.Error);
                    this.focus(input);
                    return false;
                } else if (instock < quan) {
                    input.setValueStateText(this.i18n.getText('only_num_left', [instock]));
                    input.setValueState(sap.ui.core.ValueState.Error);
                    this.focus(input);
                    return false;
                } else
                    input.setValueState(sap.ui.core.ValueState.None);
                return true;
            },

            patternMatched : function (evt) {
                // window.e = evt;
                // console.log(evt);
                if (!this.defaultPatternMatched(evt)) return;
                this.comp.getModel('nav').setProperty('/sideNav/selectedKey', `nav_item_route_create_order`);
                this.comp.getModel('nav').setProperty('/sideNav/expandableMin', 1401);

                //check if edit order query passed
                let args = evt.getParameter('arguments');
                this.navBackAfterUpdate = false;
                if (args && args['edit'] && args['edit'] && parseInt(args['edit'])) {
                    let order_id = parseInt(args['edit']);
                    this.navBackAfterUpdate = true;
                    let curItems = this.orderModel.getProperty('/items');
                    if (curItems && curItems.length > 0)
                        this.showInfoDialog({
                            title : this.i18n.getText('edit_order_num', [order_id]),
                            buttonConfirm : this.i18n.getText('continue'),
                            buttonType : sap.m.ButtonType.Reject,
                            onConfirm : () => {
                                this.editOrderMode(order_id);
                            },
                            message : this.i18n.getText('create_order_cnf_edit')
                        });
                    else
                        this.editOrderMode(order_id);
                }
                setTimeout(() => this.focus(this.byId('input_product_id')), 500)
            },

            round2 : function (v) {
                return Math.round(v * 100) / 100;
            },

            focus : function (input) {
                if (typeof input.focus == 'function')
                    input.focus();
                if (typeof input.getFocusDomRef == 'function') {
                    let dom = input.getFocusDomRef();
                    if (dom && typeof dom.select == 'function')
                        dom.select();
                }
            },

            toggleDiscountVisible : function (showActual = true) {
                this.byId('sel-disc-type').setVisible(showActual);
                this.byId('inpt-disc').setVisible(showActual);
                this.byId('sel-disc-type-existing').setVisible(!showActual);
                this.byId('inpt-disc-existing').setVisible(!showActual);
            }
        });
    }
);