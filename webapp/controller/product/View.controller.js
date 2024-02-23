sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/util/RouteEvent",
    "sap/ui/model/json/JSONModel"
    ],
    function (Controller, RouteEvent, JSONModel) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.product.View", {
            productID: null,
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                window.t = this.getView();
                //========================= MODEL ============================================
                this.mainModel = new JSONModel({
                    editting : false,
                    productData : {}
                });
                this.getView().setModel(this.mainModel, 'model');
                
                this.getView().setBusyIndicatorDelay(0);
                this.comp.szdk_serviceCreated.then((s) => s.attachRequestSent(() => this.getView().setBusy(true)));
                this.comp.szdk_serviceCreated.then((s) => s.attachRequestCompleted(() => this.getView().setBusy(false)));

                this.comp.getRouter().getRoute('view_product').attachPatternMatched(this.patternMatched.bind(this));

            },

            //=============================================
            onToggleDiscontinue: function () {
                let model = this.comp.getModel('service');
                let data = {...this.mainModel.getProperty('/productData')};
                data.Discontinued = !data.Discontinued;
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
            onToggleEdit: function (evt) {
                if (!this.mainModel.getProperty('/editting')) {
                    if (!this.productID) return;
                    
                    const enableEdit = (data) => {
                        this.byId('product_view_page').setHeaderExpanded(true);
                        this.mainModel.setProperty('/editting', true);
                    };

                    this.refreshBinding(enableEdit, true);

                } else {
                    this.mainModel.setProperty('/editting', false);
                }
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
                        expand : 'Category,Supplier'
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