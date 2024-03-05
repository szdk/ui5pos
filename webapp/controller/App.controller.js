sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "ui5pos/szdk/controller/util/RouteEvent"
    ],
    function (Controller, JSONModel, Device, RouteEvent) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.App", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                // ======================================= App model =========================================
                this.appNavModel = new JSONModel({
                    sideNav : {
                        visible : true,
                        selectedKey : "home",
                        expanded : Device.system.desktop,
                    }
                });

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
                            if (!key || !key.startsWith('nav_item_route_')) return;
                            if (!Device.system.desktop)
                                this.appNavModel.setProperty('/sideNav/expanded', false);
                            router.navTo(key.substring(15));
                        });
                } else {
                    for (let routeName in RouteEvent.routes) {
                        let navItem = this.byId(`app_nav_route_${routeName}`);
                        if (navItem)
                            navItem.attachSelect(() => {
                                if (!Device.system.desktop)
                                    this.appNavModel.setProperty('/sideNav/expanded', false);
                                router.navTo(routeName);
                            });
                    }
                }
            },

            attachPatternMatched : function () {
                let router = this.comp.getRouter();
                
                //loop over each route (by route name) and attach patternMatched event handler to each rout
                for (let routeName in RouteEvent.routes) {
                    if (RouteEvent.routes[routeName].patternMatched) {
                        router.getRoute(routeName).attachPatternMatched((e) => {
                            RouteEvent.routes[routeName].patternMatched.apply(this, [e]);
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