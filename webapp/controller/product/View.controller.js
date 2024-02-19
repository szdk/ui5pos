sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/util/RouteEvent",
    ],
    function (Controller, RouteEvent) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.product.View", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                
                this.comp.getRouter().getRoute('view_product').attachPatternMatched((evt) => {
                    if (!RouteEvent.defaultPatternMatched.apply(this, [evt])) return;

                    let arg = evt.getParameter('arguments');
                    let id = arg && arg.id && ("" + arg.id).length > 0 ? arg.id : null;

                    const notFound = () => {
                        this.comp.getRouter().getTarget('notFound').display();
                    };

                    if (id) {
                        this.comp.getModel('service').createBindingContext(`/Products(${id})`, {
                            expand : 'Category,Order_Details,Supplier'
                        },
                        (context) => {
                            if (!context) {
                                notFound();
                                return;
                            }
                            this.getView().setBindingContext(context, 'service');
                        }, true);
                    } else {
                        notFound();
                    }
                });
            }
        });
    }
);