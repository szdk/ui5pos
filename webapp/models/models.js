sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "ui5pos/szdk/localService/MockServer",
    "sap/ui/model/odata/v2/ODataModel",
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, MockServer, ODataModel) {
        "use strict";

        return {
            //Device Model
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                Device.resize.attachHandler((o) => oModel.refresh());
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            //Settings Model
            createSettingsModel: function () {
                let model = new JSONModel(sap.ui.require.toUrl('ui5pos/szdk/models/settings.json'));
                model.setDefaultBindingMode("OneWay");
                return model;
            },

            createNavModel: function () {
                return new JSONModel({
                    sideNav : {
                        visible : true,
                        selectedKey : "home",
                        expanded : !Device.system.phone,
                    }
                });
            },

            //Northwind Odata Service
            createService : function (settings) {
                let result = new Promise((resolve, reject) => {
                    if (settings.odata.useMock) {
                        if (!this._mock)
                            this._mock = {};
                        if (!this._mock[settings.odata.serviceUrl]) {
                            this._mock[settings.odata.serviceUrl] = MockServer.init(settings);
                            console.log(`Created new Mock Server for "${settings.odata.serviceUrl}" with settings:`);
                            console.log(settings);
                        } else {
                            console.log(`Mock Server already exists for "${settings.odata.serviceUrl}"`);
                        }
                    }
                    if (!this._services) this._services = {};
                    if (!this._services[settings.odata.serviceUrl]) {
                        //create ODataModel
                        let props = {
                            // defaultOperationMode : settings.odata.useMock ? sap.ui.model.odata.OperationMode.Client : sap.ui.model.odata.OperationMode.Server
                        };
                        if (!settings.odata.useMock)
                            props.defaultUpdateMethod = settings.odata.updateMethod == "MERGE" ? sap.ui.model.odata.UpdateMethod.Merge : sap.ui.model.odata.UpdateMethod.Put;
                        this._services[settings.odata.serviceUrl] = new ODataModel(settings.odata.serviceUrl, props);
                        console.log(`Created new Service "${settings.odata.serviceUrl}"`);
                    } else {
                        console.log(`Service "${settings.odata.serviceUrl}" alread exists`);
                    }
                    resolve(this._services[settings.odata.serviceUrl]);
                });
                return result;
            },
            deleteService : function (url) {
                if (this._mock && this._mock[url]) {
                    this._mock[url].destroy();
                    delete this._mock[url];
                    console.log(`Destroyed Mock Server "${url}"`);
                } else {
                    console.log(`Mock server does not exist for service "${url}"`);
                }
                if (this._services && this._services[url]) {
                    this._services[url].destroy();
                    delete this._services[url];
                    console.log(`Destroyed Service "${url}"`);
                } else {
                    console.log(`Service "${url}" does not exist`);
                }
            }
        };
    }
);