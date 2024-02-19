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
                
                //========================= MODEL ============================================
                this.mainModel = new JSONModel({
                    editting : false,
                    productData : {}
                });
                this.getView().setModel(this.mainModel, 'model');

                this.comp.getRouter().getRoute('view_product').attachPatternMatched(this.patternMatched.bind(this));

            },

            //============================================
            onToggleEdit: function (evt) {
                if (!this.mainModel.getProperty('/editting')) {
                    if (!this.productID) return;
                    
                    const enableEdit = (data) => {
                        if (!data || parseInt(!data.ProductID) !== parseInt(this.productID)) {
                            this.showErrorDialog();
                            return;
                        }

                        this.byId('product_view_page').setHeaderExpanded(true);
                        this.mainModel.setProperty('/editting', true);

                        //todo
                        this.mainModel.setProperty('/productData', data);
                    };


                    let data = false && this.comp.getModel('service').getObject('', this.getView().getBindingContext('service'));
                    if (!data || parseInt(!data.ProductID) !== parseInt(this.productID))
                        this.comp.getModel('service').read(`/Products(${this.productID})`, {
                            success : enableEdit,
                            error : (err) => {
                                this.showErrorDialog({message: err.message});
                            }
                        });
                    else
                        enableEdit(data);                    

                } else {
                    this.mainModel.setProperty('/editting', false);
                }
            },


            //============================================
            patternMatched: function (evt) {
                if (!RouteEvent.defaultPatternMatched.apply(this, [evt])) return;
                this.getView().getModel('nav').setProperty('/sideNav/selectedKey', `nav_item_route_products`);

                this.mainModel.setProperty('/editting', false);

                let arg = evt.getParameter('arguments');
                let id = arg && arg.id && ("" + arg.id).length > 0 ? arg.id : null;

                const notFound = () => {
                    this.comp.getRouter().getTarget('notFound').display();
                };

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
                    }, true);
                } else {
                    notFound();
                }
            }
        });
    }
);