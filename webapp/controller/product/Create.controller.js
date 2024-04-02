sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ui5pos/szdk/controller/util/F4Help",
    "sap/ui/core/Messaging",
    ],
    function (Controller, JSONModel, F4Help, Messaging) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.product.Create", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                this.comp.getRouter().getRoute('create_product').attachPatternMatched(this.defaultPatternMatched.bind(this));

                //========================= MODEL ============================================
                this.mainModel = new JSONModel({
                    productData : {
                        ProductName: "",
                        SupplierID: "",
                        CategoryID: "",
                        QuantityPerUnit: "",
                        UnitPrice: "",
                        UnitsInStock: "",
                        ReorderLevel: ""
                    }
                });
                this.getView().setModel(this.mainModel, 'model');

                //======================== register input validation ===========================
                Messaging.registerObject(this.byId('create_product_input_name'), true);
                Messaging.registerObject(this.byId('create_product_input_category'), true);
                Messaging.registerObject(this.byId('create_product_input_supplier'), true);
                Messaging.registerObject(this.byId('create_product_input_qpu'), true);
                Messaging.registerObject(this.byId('create_product_input_unit_price'), true);
                Messaging.registerObject(this.byId('create_product_input_in_stock'), true);
                Messaging.registerObject(this.byId('create_product_input_reorder_level'), true);
            },
            //============================================
            onClearInput : function () {
                let data = {...this.mainModel.getProperty('/productData')};
                for (let prop in data) {
                    this.mainModel.setProperty(`/productData/${prop}`, "0");
                    this.mainModel.setProperty(`/productData/${prop}`, "");
                }
                this.byId('create_product_input_name').setValueState(sap.ui.core.ValueState.None);
                this.byId('create_product_input_category').setValueState(sap.ui.core.ValueState.None);
                this.byId('create_product_input_supplier').setValueState(sap.ui.core.ValueState.None);
                this.byId('create_product_input_qpu').setValueState(sap.ui.core.ValueState.None);
                this.byId('create_product_input_unit_price').setValueState(sap.ui.core.ValueState.None);
                this.byId('create_product_input_in_stock').setValueState(sap.ui.core.ValueState.None);
                this.byId('create_product_input_reorder_level').setValueState(sap.ui.core.ValueState.None);
                this.byId('create_product_category_name').setValue();
                this.byId('create_product_supplier_name').setValue();
            },
            //============================================
            onSave : function () {
                for (let id of [
                    'create_product_input_name',
                    'create_product_input_qpu',
                    'create_product_input_unit_price',
                    'create_product_input_in_stock',
                    'create_product_input_reorder_level',
                ]) {
                    let el = this.byId(id);
                    try {
                        let binding = el.getBinding('value');
                        let type = binding ? binding.getType() : null;
                        if (type)//TODO
                            type.validateValue(el.getValue());
                    } catch (e) {
                        el.setValueState(sap.ui.core.ValueState.Error);
                        this.showErrorDialog({message : this.i18n.getText('input_submit_error')});
                        return;
                    }
                }
                this.categoryIDCheck()
                    .then(() => this.supplierIDCheck())
                    .then(() => {
                        let createProduct = (id) => {
                            let data = {
                                ProductName: this.mainModel.getProperty('/productData/ProductName'),
                                SupplierID: parseInt(this.mainModel.getProperty('/productData/SupplierID')),
                                CategoryID: parseInt(this.mainModel.getProperty('/productData/CategoryID')),
                                QuantityPerUnit: this.mainModel.getProperty('/productData/QuantityPerUnit'),
                                UnitPrice: parseFloat(this.mainModel.getProperty('/productData/UnitPrice')),
                                UnitsInStock: parseInt(this.mainModel.getProperty('/productData/UnitsInStock')),
                                ReorderLevel: parseInt(this.mainModel.getProperty('/productData/ReorderLevel')),
                                Discontinued: false,
                                UnitsOnOrder: 0
                            };
                            if (id)
                                data.ProductID = id;
                            console.log({action: 'create product', data});
                            this.comp.getModel('service').create('/Products', data, {
                                success: (data) => {
                                    console.log({message: 'production created', data});
                                    this.onClearInput();
                                    if (data && data.ProductID) {
                                        //navigate to view product
                                        this.comp.getRouter().navTo('view_product', {id : data.ProductID});
                                    } else {
                                        this.showSuccessDialog({message: this.i18n.getText('create_product_creation_success')});
                                    }
                                },
                                error: () => {
                                    this.showErrorDialog();
                                },
                            });

                        };

                        if (this.comp.getModel('settings').getProperty('/odata/useMock') || this.comp.getModel('settings').getProperty('/odata/generateID')) {
                            this.getMaxValue('/Products', 'ProductID').then((maxID) => {
                                createProduct(maxID + 1);
                            }).catch(() => {
                                this.showErrorDialog();
                            });
                        } else {
                            createProduct();
                        }
                    })
                    .catch(() => this.showErrorDialog({message : this.i18n.getText('input_submit_error')}));
            },
            //===========================================
            onValueHelpCategory: function () {
                F4Help.f4Table({
                    i18n : this.i18n,
                    ODataModel : this.comp.getModel('service'),
                    entitySetPath : '/Categories',
                    filterFields : [
                        {path : 'CategoryName', label : this.i18n.getText('category_name')}
                    ],
                    showFields : [
                        {path : 'CategoryID', label : this.i18n.getText('category_id')},
                        {path : 'CategoryName', label : this.i18n.getText('name')}
                    ],
                    returnFields : ['CategoryID', 'CategoryName'],
                    title : this.i18n.getText('category_select_single')
                }).then((selected) => {
                    if (!selected || selected.length == 0) return;
                    let id = parseInt(selected[0].CategoryID);
                    if (id) {
                        this.byId('create_product_input_category').setValue(id).setValueState(sap.ui.core.ValueState.None);
                        this.byId('create_product_category_name').setValue(selected[0].CategoryName);
                    }
                });
            },
            //===========================================
            onValueHelpSupplier: function () {
                F4Help.f4Table({
                    i18n : this.i18n,
                    ODataModel: this.comp.getModel('service'),
                    entitySetPath: '/Suppliers',
                    filterFields: [
                        {path : 'CompanyName', label : this.i18n.getText('supplier_company_name')}
                    ],
                    showFields: [
                        {path : 'SupplierID', label :  this.i18n.getText('supplier_id')},
                        {path : 'CompanyName', label : this.i18n.getText('supplier_company_name')}
                    ],
                    returnFields: ['SupplierID', 'CompanyName'],
                    title: this.i18n.getText('supplier_select_single')
                }).then((selected) => {
                    if (!selected || selected.length == 0) return;
                    let id = parseInt(selected[0].SupplierID);
                    if (id) {
                        this.byId('create_product_input_supplier').setValue(id).setValueState(sap.ui.core.ValueState.None);
                        this.byId('create_product_supplier_name').setValue(selected[0].CompanyName);
                    }
                });
            },
            //============================================
            onCategoryChange: function () {
                this.categoryIDCheck().catch(() => {});
            },
            //============================================
            onSupplierChange: function () {
                this.supplierIDCheck().catch(() => {});
            },
            //============================================
            categoryIDCheck : function () {
                let resolve = () => {}, reject = () => {};
                let response = new Promise((p_resolve, p_reject) => {
                    resolve = p_resolve;
                    reject = p_reject;
                });

                const removeState = () => {
                    el.setValueState(sap.ui.core.ValueState.None);
                };
                const setState = (text, param) => {
                    el.setValueStateText(this.i18n.getText(text, param));
                    el.setValueState(sap.ui.core.ValueState.Error);
                }

                //output name
                let output = this.byId('create_product_category_name');
                output.setValue('');

                //input id
                let el = this.byId('create_product_input_category');
                let id = parseInt(el.getValue());

                if (!id || id <= 0) {
                    setState('input_invalid_category_id')
                    reject(id);
                    return response;
                }

                this.comp.getModel('service').read(`/Categories(${id})`, {success : (data) => {
                    if (data && data.CategoryName)
                        output.setValue(data.CategoryName);
                    resolve(data);
                    removeState();
                }, error : (err) => {
                    reject(id);
                    setState('input_invalid_category_id');
                }});

                return response;
            },
            //============================================
            supplierIDCheck : function () {
                let resolve = () => {}, reject = () => {};
                let response = new Promise((p_resolve, p_reject) => {
                    resolve = p_resolve;
                    reject = p_reject;
                });

                const removeState = () => {
                    el.setValueState(sap.ui.core.ValueState.None);
                };
                const setState = (text, param) => {
                    el.setValueStateText(this.i18n.getText(text, param));
                    el.setValueState(sap.ui.core.ValueState.Error);
                }

                //output name
                let output = this.byId('create_product_supplier_name');
                output.setValue('');

                //input id
                let el = this.byId('create_product_input_supplier');
                let id = parseInt(el.getValue());

                if (!id || id <= 0) {
                    setState('input_invalid_supplier_id')
                    reject(id);
                    return response;
                }

                this.comp.getModel('service').read(`/Suppliers(${id})`, {success : (data) => {
                    if (data && data.CompanyName)
                        output.setValue(data.CompanyName);
                    resolve(data);
                    removeState();
                }, error : (err) => {
                    reject(id);
                    setState('input_invalid_supplier_id');
                }});

                return response;
            },



        });
    }
);