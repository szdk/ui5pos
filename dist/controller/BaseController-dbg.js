sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/Text",
        "ui5pos/szdk/controller/util/InputCheck",
        "sap/ui/model/SimpleType"
    ],
    function (
            Controller,
            History,
            Dialog,
            Button,
            Text,
            InputCheck,
            SimpleType
        ) {
        "use strict";

        return Controller.extend("ui5pos.szdk.controller.BaseController", {
            inputCheck : InputCheck,

            onInit: function () {
                // methods/properties which are used too often can be defined here, so that all child controllers will inherit the same by default
                this.comp = this.getOwnerComponent();
                this.i18n = this.comp.getModel('lang').getResourceBundle();
                this.inputCheck.setResourceBundel(this.i18n);
            },

            goBack: function (defaultPage = "home", parameters = {}) {
                let prev = History.getInstance().getPreviousHash();
                if (prev !== undefined)
                    window.history.go(-1);
                else
                    this.comp.getRouter().navTo(defaultPage, parameters, true);
            },

            
            showErrorDialog: function (data) {
                this.showDialog(data, sap.ui.core.ValueState.Error);
            },

            showInfoDialog: function (data) {
                this.showDialog(data, sap.ui.core.ValueState.Information);
            },

            showSuccessDialog: function (data) {
                this.showDialog(data, sap.ui.core.ValueState.Success);
            },

            showWarningDialog: function (data) {
                this.showDialog(data, sap.ui.core.ValueState.Warning);
            },

            showDialog : function (data, type = sap.ui.core.ValueState.Error) {
                data = data || {};
                data.title = data.title || this.i18n.getText(({
                    [sap.ui.core.ValueState.Error] : 'error',
                    [sap.ui.core.ValueState.Information] : 'information',
                    [sap.ui.core.ValueState.Warning] : 'warning',
                    [sap.ui.core.ValueState.Success] : 'success',
                })[type]);

                data.buttonClose = data.buttonClose || data.onConfirm ? this.i18n.getText('cancel') : this.i18n.getText('close');
                data.buttonConfirm = data.buttonConfirm || this.i18n.getText('confirm');
                data.message = data.message || [this.i18n.getText('an_error_occurred')];
                data.onClose = data.onClose;
                data.onConfirm = data.onConfirm;

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
                    type: data.onConfirm ? sap.m.ButtonType.Transparent : sap.m.ButtonType.Emphasized,
                    text: data.buttonClose,
                    press: () => {
                        this._Dialog.close();
                        this._Dialog
                            .destroyBeginButton()
                            .destroyEndButton()
                            .destroyContent();
                        if (data.onClose)
                            data.onClose();
                    }
                });
                //confirm button
                let confirmButton = !data.onConfirm ? undefined : new Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: data.buttonConfirm,
                    press: () => {
                        this._Dialog.close();
                        this._Dialog
                            .destroyBeginButton()
                            .destroyEndButton()
                            .destroyContent();
                        if (data.onConfirm)
                            data.onConfirm();
                    }
                });



                if (!this._Dialog) {
                    this._Dialog = new Dialog({
                        type: sap.m.DialogType.Message,
                        state: type,
                        title: data.title,
                        content: messageContent,
                        beginButton: confirmButton,
                        endButton: closeButton
                    });
                } else {
                    this._Dialog.setTitle(data.title);
                    if (confirmButton)
                        this._Dialog.setBeginButton(confirmButton);
                    this._Dialog.setEndButton(closeButton);
                    this._Dialog.setState(type);
                    for (let content of messageContent)
                        this._Dialog.addContent(content);
                }
                
                this._Dialog.open();
            },

            
        });
    }
);