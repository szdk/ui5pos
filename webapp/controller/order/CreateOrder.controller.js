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
                        mode : 'input',
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
                    total : 100000,
                    total_price : 0,
                    total_discount : 0,
                    items : [
                        {name : 'Gumbo Mix', price : 14.99, discount : 0, quantity : 4, total: 59.96, editted : false},
                        {name : 'Chiuawa', price : 9.00, discount : 0.15, quantity : 9, total: 12.15, editted : false}
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

            onAddItem : function () {
                let inputid = this.byId('input_product_id'),
                    seldisctype = this.byId('sel-disc-type'),
                    inputdisc = this.byId('inpt-disc'),
                    inputquan = this.byId('inpt-quan');
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
                        let quantity = inputquan.getValue();

                            //todo
                            // calculate total require quantity from the list of products which are already added as well
                        if (this.checkInputProduct(data, inputid, quantity)) {
                            //todo

                        }
                    })
                    .catch(() => {
                        invalidProd();
                        this.configModel.setProperty('/editable', true);
                    });
            },

            onSubmitProductID : function (evt) {
                let input = evt.getSource();
                let id = parseInt(input.getValue());
                if (!id) return;
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
                    if (!this.configModel.getProperty('/input/lock_discount')) {
                        this.byId('inpt-disc').focus();
                    } else if (!this.configModel.getProperty('/input/lock_quantity')) {
                        this.byId('inpt-quan').focus();
                    } else {
                        this.onAddItem();
                    }
                }
            },

            onSubmitDisc : function () {
                if (!this.configModel.getProperty('/input/lock_quantity')) {
                    this.byId('inpt-quan').focus();
                } else {
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
                        urlParameters : {
                            '$expand' : "ProductID,ProductName,UnitPrice,UnitsInStock,Discontinued"
                        },
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
            }
        });
    }
);