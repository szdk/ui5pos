sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.App", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                // ======================== remove loading text from body =====================
                document.body.classList.remove('szdk-loading')

                // ======================================= App model =========================================
                this.appNavModel = this.comp.getModel('nav');                
                
                this.bindSideNavTarget();
                
            },

            bindSideNavTarget : function () {
                let router = this.comp.getRouter();
                if (this.comp.getModel('device').getProperty('/system/desktop')) {
                    let navList = this.byId('app_side_nav_list');
                    if (navList)
                        navList.attachItemSelect((e) => {
                            let item = e.getParameters().item;
                            if (!item) return;
                            let key = item.getKey();
                            if (!key || !key.startsWith('nav_item_route_')) return;
                            router.navTo(key.substring(15));
                        });
                } else {
                    for (let routeName in [
                        "create_order",
                        "orders",
                        // "home",
                        "products",
                        "create_product",
                    ]) {
                        let navItem = this.byId(`app_nav_route_${routeName}`);
                        if (navItem)
                            navItem.attachSelect(() => {
                                this.appNavModel.setProperty('/sideNav/expanded', false);
                                router.navTo(routeName);
                            });
                    }
                }
            },

            onSideNavButtonPress : function () {
                this.appNavModel.setProperty('/sideNav/expanded', !this.appNavModel.getProperty('/sideNav/expanded'));
            }
        });
    }
);