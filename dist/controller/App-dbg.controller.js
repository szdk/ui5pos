sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "sap/ui/model/json/JSONModel"
    ],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.App", {
            _routes : ["home", "products"],

            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                // App model
                let navModel = new JSONModel({
                    sideNav : {
                        visible : true,
                        selectedKey : "home",
                    }
                });
                //todo change binding mode, for bug fix
                navModel.setDefaultBindingMode("OneWay");
                
                this.getView().setModel(navModel, 'nav');

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
                let navModel = this.getView().getModel('nav');
                
                //loop over each route (by route name) and attach patternMatched event handler to each rout
                for (let routeName of this._routes) {
                    router.getRoute(routeName).attachPatternMatched((e) => {
                        //service not set yet, redirect to setup page
                        if (!this.comp.getModel('service')) {
                            router.navTo('setup');
                            return;
                        }
                        //show nav item list
                        navModel.setProperty('/sideNav/visible', true);

                        //select relevent nav item with the help of navModel
                        navModel.setProperty('/sideNav/selectedKey', `nav_item_${routeName}`);
                        
                    });
                }
                //remove sidenav selection if this is setup page
                router.getRoute('setup').attachPatternMatched((e) => {
                    //service already set, move to home page
                    if (this.comp.getModel('service')) {
                        this.goBack();
                    }
                    // hide side nav items
                    navModel.setProperty('/sideNav/visible', false);
                });
            }
        });
    }
);