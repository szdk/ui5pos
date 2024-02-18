sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
    ],
    function (Controller, JSONModel, Device) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.App", {
            _routes : ["home", "products", "create_product"],

            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                // ======================================= App model =========================================
                this.appNavModel = new JSONModel({
                    sideNav : {
                        visible : true,
                        selectedKey : "home",
                        expanded : Device.resize.width >= 1024,
                    }
                });
                //todo change binding mode, for bug fix
                this.appNavModel.setDefaultBindingMode("OneWay");
                
                this.getView().setModel(this.appNavModel, 'nav');

                this.attachPatternMatched();

                this.bindSideNavTarget();
                
            },

            bindSideNavTarget : function () {
                let router = this.comp.getRouter();
                if (this.getView().getModel('device').getProperty('/system/desktop')) {
                    let navList = this.byId('app_side_nav_list');
                    if (navList)
                        navList.attachItemSelect((e) => {
                            let item = e.getParameters().item;
                            if (!item) return;
                            let key = item.getKey();
                            if (!key || !key.startsWith('nav_item_')) return;
                            router.navTo(key.substring(9));
                        });
                } else {
                    for (let routeName of this._routes) {
                        let navItem = this.byId(`app_nav_${routeName}`);
                        if (navItem)
                            navItem.attachSelect(() => {
                                router.navTo(routeName);
                            });
                    }
                }
            },

            attachPatternMatched : function () {
                let router = this.comp.getRouter();
                
                //loop over each route (by route name) and attach patternMatched event handler to each rout
                for (let routeName of this._routes) {
                    router.getRoute(routeName).attachPatternMatched((e) => {
                        //service not set yet, redirect to setup page
                        if (!this.comp.getModel('service')) {
                            router.navTo('setup');
                            return;
                        }
                        //show nav item list
                        this.appNavModel.setProperty('/sideNav/visible', true);

                        //select relevent nav item with the help of navModel
                        this.appNavModel.setProperty('/sideNav/selectedKey', `nav_item_${routeName}`);
                        
                    });
                }
                //remove sidenav selection if this is setup page
                router.getRoute('setup').attachPatternMatched((e) => {
                    //service already set, move to home page
                    if (this.comp.getModel('service')) {
                        this.goBack();
                    }
                    // hide side nav items
                    this.appNavModel.setProperty('/sideNav/visible', false);
                });
            },

            onSideNavButtonPress : function () {
                this.appNavModel.setProperty('/sideNav/expanded', !this.appNavModel.getProperty('/sideNav/expanded'));
            }
        });
    }
);