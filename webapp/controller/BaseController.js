sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/Text"
    ],
    function (
            Controller,
            History,
            Dialog,
            Button,
            Text
        ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.BaseController", {
            onInit: function () {
                // methods/properties which are used too often can be defined here, so that all child controllers will inherit the same by default
                this.comp = this.getOwnerComponent();
                this.i18n = this.comp.getModel('lang').getResourceBundle();
            },

            goBack: function (defaultPage = "home", parameters = {}) {
                let prev = History.getInstance().getPreviousHash();
                if (prev !== undefined)
                    window.history.go(-1);
                else
                    this.comp.getRouter().navTo(defaultPage, parameters, true);
            },

            showErrorDialog: function (data) {
                data = data || {};
                data.title = data.title || this.i18n.getText('error');
                data.buttonText = data.buttonText || this.i18n.getText('close');
                data.message = data.message || [this.i18n.getText('an_error_occurred')];
                data.onClose = data.onClose;

                if (typeof data.message == 'string')
                    data.message = [data.message];

                //body
                let messageContent = [];
                for (let message of data.message) {
                    if (typeof message == 'string')
                        messageContent.push(new Text({ text: message }));
                }
                
                //close button
                let closeButton = new Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: data.buttonText,
                    press: () => {
                        this._errorDialog.close();
                        //destroy controlls
                        this._errorDialog
                            .destroyBeginButton()
                            .destroyContent();
                    }
                });



                if (!this._errorDialog) {
                    this._errorDialog = new Dialog({
                        type: sap.m.DialogType.Message,
                        state: sap.ui.core.ValueState.Error,
                        title: data.title,
                        content: messageContent,
                        beginButton: closeButton
                    });
                } else {
                    this._errorDialog.setTitle(data.title);
                    this._errorDialog.setBeginButton(closeButton);
                    for (let content of messageContent)
                        this._errorDialog.addContent(content);
                }
                
                if (data.onClose) {
                    let onClose = (evt) => {
                        data.onClose(evt);
                        this._errorDialog.detachAfterClose(onClose);
                    }
                    this._errorDialog.attachAfterClose(onClose);
                }

                this._errorDialog.open();
            }
            
        });
    }
);