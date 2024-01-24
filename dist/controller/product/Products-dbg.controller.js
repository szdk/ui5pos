sap.ui.define([
        "ui5pos/szdk/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        'sap/ui/export/Spreadsheet',
        'sap/m/Dialog',
        "sap/m/Button",
        "sap/m/Text"
    ],
    function (
        Controller,
        JSONModel,
        Spreadsheet,
        Dialog,
        Button,
        Text,
    ) {
        "use strict";
        //nav Toolbar functions
        let navToolbar = {
            onToggleSelect : function (e) {
                this.tableModel.setProperty('/mode', e.getSource().getPressed() ? 'MultiSelect' : 'SingleSelectMaster');
            },
            onRefreshItems : function () {
                this._tableMain.refreshItems();
            },
            onItemsPerPage : function (e) {
                let selectedItem = e.getParameter('item');
                let growSize = parseInt(selectedItem.getKey());
                this.tableModel.setProperty('/grow/size', growSize);
                this.tableModel.setProperty('/grow/text', selectedItem.getText());
                if (growSize === 0)
                    this.onRefreshItems();
            },
            onPinHeader : function (e) {
                let clicked = e.getParameter('item').getKey();
                let pinned = [... this.tableModel.getProperty('/sticky')];
                let i = pinned.indexOf(clicked);
                if (i === -1)
                    pinned.push(clicked);
                else
                    pinned.splice(i, 1);
                this.tableModel.setProperty('/sticky', pinned);
            },
            onExportExcel : function () {
                let type = sap.ui.export.EdmType;
                let cols = [
                    {
                        label: this.i18n.getText('id'),
                        property: 'ProductID',
                        type: type.Number,
                        scale: 0,
                    },
                    {
                        label: this.i18n.getText('product'),
                        property: 'ProductName',
                        type: type.String,
                        width: 20,
                    },
                    {
                        label: this.i18n.getText('category'),
                        property: 'Category/CategoryName',
                        type: type.String,
                    },
                    {
                        label: this.i18n.getText('product_instock'),
                        property: 'UnitsInStock',
                        type: type.Number,
                        scale: 0
                    },
                    {
                        label: this.i18n.getText('product_quantityPerUnit'),
                        property: 'QuantityPerUnit',
                        type: type.String,
                    },
                    {
                        label: this.i18n.getText('product_unitPrice') + ' (USD)',
                        property: 'UnitPrice',
                        type: type.Number,
                        scale: 2,
                        delimiter: true
                    },
                ];

                const startExport = (dataSource, useWorker = false) => {
                    let config = {
                        workbook: {
                            columns: cols,
                            // hierarchyLevel: 'Level'
                        },
                        dataSource: dataSource,
                        fileName: `${this.i18n.getText('products_title')}.xlsx`,
                        worker: useWorker
                    };
                    let sheet = new Spreadsheet(config);
                    sheet.build().finally(function() {
                        sheet.destroy();
                    });
                }

                if (this.comp.getModel('settings').getProperty('/odata/useMock')) {
                    this.tableModel.setProperty('/canExport', false);
                    let bindingInfo = this._tableMain.getBindingInfo('items');
                    this.comp.getModel('service').read( bindingInfo.path, {
                            urlParameters : {
                                '$expand' : 'Category'
                            },
                            sorters : bindingInfo.sorter,
                            filters : bindingInfo.filters,
                            success : (e) => {
                                startExport(e.results);
                                this.tableModel.setProperty('/canExport', true);
                            },
                            error : (e) => {
                                let dialogBox = new Dialog({
                                    type: sap.m.DialogType.Message,
                                    // title: "Error",
                                    state: sap.ui.core.ValueState.Error,
                                    content: new Text({ text: this.i18n.getText('export_failed') }),
                                    beginButton: new Button({
                                        type: ButtonType.Emphasized,
                                        text: this.i18n.getText('ok'),
                                        press: () => {
                                            this.tableModel.setProperty('/canExport', true);
                                            dialogBox.close();
                                        }
                                    })
                                }).open();
                            }
                        }
                    );
                } else {
                    startExport(this._tableMain.getBinding('items'), true);
                }
            },
            
            onDeleteSelected : function () {
                alert('todo');
            }

        }

        //controller
        return Controller.extend("ui5pos.szdk.controller.Products", {
            ...navToolbar,

            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                
                // ===================== table model =================================
                this.tableModel = new JSONModel({
                    mode : "SingleSelectMaster",
                    grow : {size: 50, text:this.i18n.getText('50')},
                    sticky : ['HeaderToolbar','ColumnHeaders'],
                    canExport : true,
                });
                this.tableModel.setDefaultBindingMode('OneWay');
                this.getView().setModel(this.tableModel, 'table');
                
                this._tableMain = window.temp = this.byId('products_table');


            },


            onPressCreateProduct: function () {
                alert("todo");
                // this.comp.getRouter().navTo("");
            }
        });
    }
);