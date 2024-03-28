sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "ui5pos/szdk/controller/util/F4Help",
    ],
    function (
        Controller,
        JSONModel,
        Device,
        F4Help,
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
                    auto_print : false,
                });
                this.getView().setModel(this.configModel, 'config');

                this.dataModel = new JSONModel({
                    previous_orders : [
                        {order_id : 10003, phone : '9876543210', order_total : 30.27},
                        {order_id : 10002, phone : '9876543210', order_total : 54.00},
                        {order_id : 10001, phone : '9876543210', order_total : 99.99}
                    ],
                });
                this.getView().setModel(this.dataModel, 'data');

                this.orderModel = new JSONModel({
                    total : 0,
                    total_price : 0,
                    total_discount : 0,
                    items : [
                        // {id : 1, name : 'Gumbo Mix', price : 14.99, discount : 0, quantity : 4, total: 59.96, editted : false},
                        // {id : 2, name : 'Chiuawa', price : 9.00, discount : 0.15, quantity : 9, total: 12.15, editted : false}
                    ],
                    customer_phone : '',
                    customer_name : '',
                    customer_address : '',
                    customer_city : '',
                    customer_postal_code: '',
                    customer_country : '',
                });
                this.getView().setModel(this.orderModel, 'order');

                
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

            onAddItem : function () {
                let inputid = this.byId('input_product_id');
                let id = parseInt(inputid.getValue());
                const invalidProd = () => {
                    inputid.setValueStateText(this.i18n.getText('input_invalid_product_id'));
                    inputid.setValueState(sap.ui.core.ValueState.Error);
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
                if (newItem.quantity == 0) {
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
                if (newItem.discount < 0) newItem.discount = 0;
                if (newItem.discount > 1) newItem.discount = 1;

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
                } else {
                    input.setValueState(sap.ui.core.ValueState.None);
                    this.onAddItem();
                }
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
                        // urlParameters : {
                        //     '$expand' : "ProductID,ProductName,UnitPrice,UnitsInStock,Discontinued"
                        // },
                        success : res,
                        error : rej
                    });
                }
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

            checkInputProduct : function (data, input, quan = 1) {
                if (!data) {
                    input.setValueStateText(this.i18n.getText('input_invalid_product_id'));
                    input.setValueState(sap.ui.core.ValueState.Error);
                    return false;
                } else if (data.Discontinued) {
                    input.setValueStateText(this.i18n.getText('discontinued'));
                    input.setValueState(sap.ui.core.ValueState.Error);
                    return false;
                } else if (!parseInt(data.UnitsInStock) || parseInt(data.UnitsInStock) == 0) {
                    input.setValueStateText(this.i18n.getText('out_of_stock'));
                    input.setValueState(sap.ui.core.ValueState.Error);
                    return false;
                } else if (parseInt(data.UnitsInStock) < quan) {
                    input.setValueStateText(this.i18n.getText('only_num_left', [data.UnitsInStock]));
                    input.setValueState(sap.ui.core.ValueState.Error);
                    return false;
                } else
                    input.setValueState(sap.ui.core.ValueState.None);
                return true;
            },

            patternMatched : function (evt) {
                if (!this.defaultPatternMatched(evt)) return;
                this.comp.getModel('nav').setProperty('/sideNav/selectedKey', `nav_item_route_create_order`);
                this.comp.getModel('nav').setProperty('/sideNav/expandableMin', 1260);
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