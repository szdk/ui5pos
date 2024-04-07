sap.ui.define([
    "ui5pos/szdk/controller/BaseController",
    "ui5pos/szdk/controller/util/Settings",
    "sap/ui/model/json/JSONModel",
    "sap/base/i18n/Localization",
    ],
    function (
        Controller,
        Settings,
        JSONModel,
        Localization
    ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.App", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                window.l = Localization;
                window.v = this;
                // ======================== remove loading text from body =====================
                document.body.classList.remove('szdk-loading')

                // ======================================= settings model =========================================
                let settingsModel = this.comp.getModel('settings');
                let tmp_settings_model = new JSONModel({
                    serviceCreated : false,
                    serviceIsMock : true,
                    generateID : settingsModel.getProperty('/odata/generateID'),
                    updateQuantity : settingsModel.getProperty('/odata/updateQuantity'),
                    theme : settingsModel.getProperty('/theme'),
                    lang : settingsModel.getProperty('/lang'),
                    density : settingsModel.getProperty('/density'),
                });
                this.getView().setModel(tmp_settings_model, 'tmp_settings');
                this.comp.szdk_serviceCreated.then(() => {
                    tmp_settings_model.setProperty('/serviceCreated', true);
                    tmp_settings_model.setProperty('/serviceIsMock', settingsModel.getProperty('/odata/useMock'));
                    tmp_settings_model.setProperty('/generateID', settingsModel.getProperty('/odata/generateID'));
                    tmp_settings_model.setProperty('/updateQuantity', settingsModel.getProperty('/odata/updateQuantity'));
                }); 
                
                this.bindSideNavTarget();
                
            },

            onPressSettings : function () {
                let tmp_settings_model = this.getView().getModel('tmp_settings');
                let settingsModel = this.comp.getModel('settings');
                tmp_settings_model.setProperty('/theme', settingsModel.getProperty('/theme'));
                tmp_settings_model.setProperty('/lang', settingsModel.getProperty('/lang'));
                tmp_settings_model.setProperty('/density', settingsModel.getProperty('/density'));
                tmp_settings_model.setProperty('/generateID', settingsModel.getProperty('/odata/generateID'));
                tmp_settings_model.setProperty('/updateQuantity', settingsModel.getProperty('/odata/updateQuantity'));
                this.byId('settings-dialog').open();
            },

            onPressSaveSettings : function () {
                let tmp_settings_model = this.getView().getModel('tmp_settings');
                let settings = {
                    odata : {
                        generateID : tmp_settings_model.getProperty('/generateID'),
                        updateQuantity : tmp_settings_model.getProperty('/updateQuantity'),
                    },
                    theme :tmp_settings_model.getProperty('/theme'),
                    lang :tmp_settings_model.getProperty('/lang'),
                    density :tmp_settings_model.getProperty('/density'),
                };
                Settings.updateSettings(settings, this.comp.getModel("settings"));
                this.byId('settings-dialog').close();;
            },

            onCloseSettings : function () {
                this.byId('settings-dialog').close();;
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
                    for (let routeName of [
                        "create_order",
                        "orders",
                        // "home",
                        "products",
                        "create_product",
                    ]) {
                        let navItem = this.byId(`app_nav_route_${routeName}`);
                        if (navItem)
                            navItem.attachSelect(() => {
                                this.comp.getModel('nav').setProperty('/sideNav/expanded', false);
                                router.navTo(routeName);
                            });
                    }
                }
            },

            onSideNavButtonPress : function () {
                let navModel = this.comp.getModel('nav');
                navModel.setProperty('/sideNav/expanded', !navModel.getProperty('/sideNav/expanded'));
            }
        });
    }
);