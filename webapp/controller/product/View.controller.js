sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/util/RouteEvent",
    "ui5pos/szdk/controller/util/F4Help",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Core",
    ],
    function (Controller,
        RouteEvent,
        F4Help,
        JSONModel,
        Core) {
        "use strict";
        var _this = null;

        return Controller.extend("ui5pos.szdk.controller.product.View", {
            productID: null,
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                
                window.t = this.getView();
                _this = this;

                //========================= MODEL ============================================
                this.mainModel = new JSONModel({
                    editting : false,
                    productData : {}
                });
                this.getView().setModel(this.mainModel, 'model');
                
                //==================== set busy on server request =============================
                this.getView().setBusyIndicatorDelay(0);
                this.comp.szdk_serviceCreated.then((s) => s.attachRequestSent(() => this.getView().setBusy(true)));
                this.comp.szdk_serviceCreated.then((s) => s.attachRequestCompleted(() => this.getView().setBusy(false)));

                //======================== attach pattern =====================================
                this.comp.getRouter().getRoute('view_product').attachPatternMatched(this.patternMatched.bind(this));

                //======================== register input validation ===========================
                let om = Core.getMessageManager();
                om.registerObject(this.byId('product_input_name'), true);
                om.registerObject(this.byId('product_input_category'), true);
                om.registerObject(this.byId('product_input_supplier'), true);
                om.registerObject(this.byId('product_input_qpu'), true);
                om.registerObject(this.byId('product_input_unit_price'), true);
                om.registerObject(this.byId('product_input_in_stock'), true);
                om.registerObject(this.byId('product_input_reorder_level'), true);

            },
            //===========================================
            onValueHelpCategory: function () {
                (F4Help.f4Table.bind(this))(
                    this.comp.getModel('service'),
                    '/Categories',
                    [],
                    {CategoryID : this.i18n.getText('category_id'), CategoryName: this.i18n.getText('name')},
                    ['CategoryID', 'CategoryName'],
                    this.i18n.getText('category_select_single')
                ).then((selected) => {
                    if (!selected || selected.length == 0) return;
                    let id = parseInt(selected[0].CategoryID);
                    if (id) {
                        this.byId('product_input_category').setValue(id);
                        this.byId('product_category_name').setValue(selected[0].CategoryName);
                    }
                });
            },
            //===========================================
            onValueHelpSupplier: function () {
                (F4Help.f4Table.bind(this))(
                    this.comp.getModel('service'),
                    '/Suppliers',
                    [],
                    {SupplierID : this.i18n.getText('supplier_id'), CompanyName: this.i18n.getText('supplier_company_name')},
                    ['SupplierID', 'CompanyName'],
                    this.i18n.getText('supplier_select_single')
                ).then((selected) => {
                    if (!selected || selected.length == 0) return;
                    let id = parseInt(selected[0].SupplierID);
                    if (id) {
                        this.byId('product_input_supplier').setValue(id);
                        this.byId('product_supplier_name').setValue(selected[0].CompanyName);
                    }
                });
            },
            //============================================
            onSave : function () {
                if (!this.mainModel.getProperty('/editting')) return;
                for (let id of [
                    'product_input_name',
                    'product_input_qpu',
                    'product_input_unit_price',
                    'product_input_in_stock',
                    'product_input_reorder_level',
                ]) {
                    let el = this.byId(id);
                    try {
                        let binding = el.getBinding('value');
                        let type = binding ? binding.getType() : null;
                        if (type)
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
                        //validation success, save input
                        let data = {
                            ProductName: this.mainModel.getProperty('/productData/ProductName'),
                            SupplierID: parseInt(this.mainModel.getProperty('/productData/SupplierID')),
                            CategoryID: parseInt(this.mainModel.getProperty('/productData/CategoryID')),
                            QuantityPerUnit: this.mainModel.getProperty('/productData/QuantityPerUnit'),
                            UnitPrice: parseFloat(this.mainModel.getProperty('/productData/UnitPrice')),
                            UnitsInStock: parseInt(this.mainModel.getProperty('/productData/UnitsInStock')),
                            ReorderLevel: parseInt(this.mainModel.getProperty('/productData/ReorderLevel')),
                        };
                        
                        let path = `/Products(${this.productID})`;
                        console.log({action: 'update', path, data});

                        this.comp.getModel('service').update(path, data, {
                            success: () => {
                                this.refreshBinding();
                                this.showSuccessDialog({message: this.i18n.getText('data_saved_description')})
                            },
                            error : (err) => this.showErrorDialog({message : err.message})
                        });
                    })
                    .catch(() => this.showErrorDialog({message : this.i18n.getText('input_submit_error')}));
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
                let output = this.byId('product_category_name');
                output.setValue('');

                //input id
                let el = this.byId('product_input_category');
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
                let output = this.byId('product_supplier_name');
                output.setValue('');

                //input id
                let el = this.byId('product_input_supplier');
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
            
            
            //============================================
            onToggleEdit: function (evt) {
                if (!this.mainModel.getProperty('/editting')) {
                    if (!this.productID) return;
                    
                    const enableEdit = (data) => {
                        this.categoryIDCheck().catch(() => {});
                        this.supplierIDCheck().catch(() => {});
                        this.byId('product_view_page').setHeaderExpanded(true);
                        this.mainModel.setProperty('/editting', true);
                    };

                    this.refreshBinding(enableEdit);

                } else {
                    this.mainModel.setProperty('/editting', false);
                }
            },


            //=============================================
            onToggleDiscontinue: function () {
                let model = this.comp.getModel('service');
                let data = {Discontinued : !this.mainModel.getProperty('/productData/Discontinued')};
                let path = `/Products(${this.productID})`;
                console.log({action: 'update', path, data});
                model.update(path, data, {
                    success: () => {
                        this.refreshBinding();
                    },
                    error : (err) => this.showErrorDialog({message : err.message})
                });
            },

            //============================================
            onDelete: function () {
                let model = this.comp.getModel('service');

                const deleteProduct = () => {
                    model.remove(`/Products(${this.productID})`, {
                        success : () => {
                            this.showSuccessDialog({
                                message : this.i18n.getText('product_has_been_deleted'),
                                onClose : () => {
                                    this.comp.getRouter().navTo('products');
                                }
                            });
                        },
                        error : this.showErrorDialog
                    });
                };

                model.read(`/Products(${this.productID})/Order_Details/$count`, {
                    success : (count) => {
                        if (parseInt(count) > 0) {
                            this.showInfoDialog({
                                title: this.i18n.getText('product_in_use'),
                                message: this.i18n.getText('product_cannot_delete_desc', [count])
                            });
                        } else {
                            this.showErrorDialog({
                                title: this.i18n.getText('confirm_delete'),
                                message: this.i18n.getText('product_confirm_delete'),
                                onConfirm: deleteProduct
                            });
                        }
                    },
                    error: (e) => this.showErrorDialog({message : e.message}),
                });
            },

            //=========================================================
            refreshBinding: function (onSuccess = null, onError = null, cached = false) {
                if (!onError)
                    onError = (err) => {
                        this.showErrorDialog({message: err.message});
                    }
                const onSuccess2 = (data) => {
                    if (!data || parseInt(data.ProductID) !== parseInt(this.productID)) {
                        this.showErrorDialog();
                        return;
                    }
                    data = {
                        ProductID: data.ProductID,
                        ProductName: data.ProductName,
                        SupplierID: data.SupplierID,
                        CategoryID: data.CategoryID,
                        QuantityPerUnit: data.QuantityPerUnit,
                        UnitPrice: data.UnitPrice,
                        UnitsInStock: data.UnitsInStock,
                        UnitsOnOrder: data.UnitsOnOrder,
                        ReorderLevel: data.ReorderLevel,
                        Discontinued: data.Discontinued,
                    }
                    this.mainModel.setProperty('/productData', data);
                    if (onSuccess)
                        onSuccess(data);
                }
                let data = !cached ? false : this.comp.getModel('service').getObject('', this.getView().getBindingContext('service'));
                if (!data || parseInt(data.ProductID) !== parseInt(this.productID))
                    this.comp.getModel('service').read(`/Products(${this.productID})`, {
                        urlParameters: { '$expand':'Category,Supplier' },
                        success : onSuccess2,
                        error : onError
                    });
                else
                    onSuccess2(data);
            },


            //============================================
            patternMatched: function (evt) {
                if (!RouteEvent.defaultPatternMatched.apply(this, [evt])) return;
                this.getView().getModel('nav').setProperty('/sideNav/selectedKey', `nav_item_route_products`);

                this.mainModel.setProperty('/editting', false);
                this.mainModel.setProperty('/productData', {});

                this.productID = null;

                const notFound = () => {
                    this.comp.getRouter().getTarget('notFound').display();
                };

                let arg = evt.getParameter('arguments');
                let id = arg && arg.id && ("" + arg.id).length > 0 ? arg.id : null;

                if (id) {
                    
                    this.comp.getModel('service').createBindingContext(`/Products(${id})`, {
                        expand : 'Category,Supplier,Order_Details'
                    },
                    (context) => {
                        if (!context) {
                            notFound();
                            return;
                        }
                        //product found
                        this.productID = id;
                        this.getView().setBindingContext(context, 'service');
                        this.refreshBinding(null, null, true);
                    }, true);
                } else {
                    notFound();
                }
            },

            //======================================
            onOpenAction : function (evt) {
                let button = evt.getSource();
                this.getView().byId('view_product_actionSheet').openBy(button);
            }
        });
    }
);