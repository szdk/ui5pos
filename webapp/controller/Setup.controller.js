sap.ui.define([
        "ui5pos/szdk/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "ui5pos/szdk/models/models",
    ],
    function (Controller, JSONModel, models) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.Setup", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);

                this.comp.getRouter().getRoute('setup').attachPatternMatched((evt) => {
                    if (this.comp.getModel('service')) {
                        this.goBack();
                    }
                    this.comp.getModel('nav').setProperty('/sideNav/visible', false);
                });
                
                const settings = {...this.comp.getModel('settings').getData()};

                let localModel = new JSONModel({
                    odataType : settings.odata.useMock ? "1" : "2",
                    odataUrl : settings.odata.serviceUrl,
                    odataDelay : settings.odata.delay,
                    generateID: settings.odata.generateID,
                    updateQuantity : settings.odata.updateQuantity,
                    updateMethod: settings.odata.updateMethod,

                    inputEnabled : true,
                    ServiceCreated : false,
                });
                this.getView().setModel(localModel, 'local');
            },

            onCreateService : function (e) {
                let view = this.getView();
                let localModel = view.getModel('local');
                let loadingIndicator = this.byId('setup-loading');

                //if service already exists, navigate to home page
                if (localModel.getProperty('/ServiceCreated') && this.comp.getModel('service')) {
                    this.goBack('home');
                    return;
                }

                //disable input of all fields with the help of model
                localModel.setProperty('/inputEnabled', false);

                //show loading indicator
                loadingIndicator.setVisible(true);

                //fetch global settings from settings model which is assigned to root component
                let settings = {...this.comp.getModel('settings').getData()};
                settings.odata = {...settings.odata};

                settings.odata.useMock = localModel.getProperty("/odataType") === "1";
                settings.odata.serviceUrl = settings.odata.useMock ? "/ui5pos/szdk/mockService.svc/" : localModel.getProperty("/odataUrl");

                let responseDelay = parseInt(localModel.getProperty("/odataDelay"));
                if (!responseDelay) responseDelay = 0;
                localModel.setProperty("/odataDelay", responseDelay);
                settings.odata.delay = responseDelay;

                settings.odata.generateID = settings.odata.useMock ? true : localModel.getProperty("/generateID");
                settings.odata.updateQuantity = settings.odata.useMock ? true : localModel.getProperty("/updateQuantity");
                settings.odata.updateMethod = localModel.getProperty("/updateMethod");
                //set the modified global settings back to the model
                this.comp.getModel('settings').setData(settings);

                //create main Service
                let serviceModel = null;
                //using setTimeout because MockServer blocks prosessing for a while, so better to wait few millis so that ui can be updated
                setTimeout(() =>
                    models.createService({... settings}).then((model) => {
                        serviceModel = model;
                        return model.metadataLoaded(true);
                    }).then(() => {
                        //service creation successfull, attach the main service model to root component    
                        this.comp.setModel(serviceModel, "service");
                        this.comp.szdk_resolve_serviceCreated(serviceModel);

                        //update local modle "ServiceCreated" property to true, so that continue button can be enabled
                        localModel.setProperty('/ServiceCreated', true);

                        //hide loading indicator
                        loadingIndicator.setVisible(false);
                    }).catch((e) => {
                        //service creation failed, hide loading indicator
                        loadingIndicator.setVisible(false);
                        
                        //show the error dialog
                        let errorDialog = this.byId("setup-error-dialog").setVisible(true).open();
                        this.byId("setup-error-dialog-text").setText(this.i18n.getText("setup_loadingError", [e.message]));
                        this.byId("setup-error-dialog-close").attachPress(() => {
                            errorDialog.close().setVisible(false);
                        });

                        //delete the created faulty service model
                        models.deleteService(settings.odata.serviceUrl);

                        //enable input with the help of local model
                        localModel.setProperty('/inputEnabled', true);
                    }),
                    100
                );//end setTimeout
            }
            
        });
    }
);