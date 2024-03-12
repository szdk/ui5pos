sap.ui.define([
        "ui5pos/szdk/controller/BaseController",
        'ui5pos/szdk/controller/util/Table',
        "sap/ui/model/json/JSONModel",
        'sap/ui/export/Spreadsheet',
        'sap/m/Dialog',
        "sap/m/Button",
        "sap/m/Text",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
    ],
    function (
        Controller,
        Table,
        JSONModel,
        Spreadsheet,
        Dialog,
        Button,
        Text,
        Filter,
        FilterOperator,
    ) {
        "use strict";
        //nav Toolbar functions
        let navToolbar = {
            onSearchProduct : function (e) {
                let searchValue = e.getParameter('query').trim();
                let binding = this._tableMain.getBinding('items');
                
                //===================== search filters
                let filter = searchValue.length == 0 ? [] : new Filter({
                    filters : [
                        new Filter({path: 'ProductID', operator: FilterOperator.EQ, value1: searchValue}),
                        new Filter({path: 'ProductName', operator: FilterOperator.Contains, value1: searchValue}),
                        // new Filter({path: 'CategoryName', operator: FilterOperator.Contains, value1: searchValue}),
                        new Filter({path: 'QuantityPerUnit', operator: FilterOperator.Contains, value1: searchValue}),
                    ],
                    and : false
                });

                // if (binding.hasPendingChanges(true))
                //     binding.resetChanges();

                binding.filter(filter);

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
            }
            
        }

        //controller
        return Controller.extend("ui5pos.szdk.controller.product.Products", {
            ...navToolbar,

            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                
                // // ===================== table model =================================
                // this.tableModel = new JSONModel({
                //     mode : "SingleSelectMaster",
                //     grow : {size: 50, text:this.i18n.getText('50')},
                //     sticky : ['HeaderToolbar','ColumnHeaders'],
                //     canExport : true,
                // });
                // this.tableModel.setDefaultBindingMode('OneWay');
                // this.getView().setModel(this.tableModel, 'table');
                
                // this._tableMain = window.temp = this.byId('products_table');

                let columns = [
                    {id : 'ProductID', label : this.i18n.getText('id'), path : 'ProductID'},
                    {id : 'ProductName', label : this.i18n.getText('product'), path : 'ProductName'},
                    {id : 'CategoryName', label : this.i18n.getText('category'), path : 'Category/CategoryName'},
                    {id : 'UnitsInStock', label : this.i18n.getText('product_instock'), path : 'UnitsInStock'},
                    {id : 'QuantityPerUnit', label : this.i18n.getText('product_quantityPerUnit'), path : 'QuantityPerUnit'},
                    {id : 'UnitPrice', label : this.i18n.getText('product_unitPrice'), path : 'UnitPrice'},
                ].map((v) => ({
                    id : this.getView().createId(v.id),
                    cell: {bindingPath : v.path},
                    header : {header : v.label},
                    p13n : {key : v.id, label: v.label, path : v.path},
                    excel : {label : v.label, property : v.path}
                }));

                // columns[3].groupFunction = columns[5].groupFunction = (context) => {
                //     let price = parseInt(context.getProperty('UnitPrice'));
                //     if (!price) price = 0;
                //     let from = Math.floor(price / 10) * 10;
                //     return this.i18n.getText('to_range', [from, from + 9]);
                // }


                this.comp.szdk_serviceCreated.then((model) => {
                    let tableGenerator = new Table({
                        id:'products_table',
                        i18n: this.i18n,
                        model,
                        properties : {
                            busyIndicatorDelay : 0,
                            mode : sap.m.ListMode.SingleSelectMaster,
                            rememberSelections:true,
                            growing:true,
                            growingThreshold:50,
                            sticky: ['HeaderToolbar','ColumnHeaders'],
                            popinLayout: sap.m.PopinLayout.Block,
                            alternateRowColors: false,
                        },
                        itemsBinding : {
                            path : '/Products',
                            parameters : {
                                expand : 'Category'
                            }
                        },
                        customToolBar : {
                            mid : [] //add search field later
                        },
                        toolbar : {
                            p13n : {
                                Columns : Boolean,
                                Sorter : Boolean,
                                Groups : Boolean,
                            },
                            excel : this.comp.getModel('settings').getProperty('/odata/useMock') ? 2 : 1,
                            growSize : true,
                            pin : true
                        },
                        columns,
                    });
                    this.byId('products_main_page').addContent(tableGenerator.getTable());
                    tableGenerator.getTable().attachSelectionChange(this.onSelectionChange.bind(this));
                });
            },

            //navigate to selected product
            onSelectionChange: function (evt) {
                let params = evt.getParameters();
                if (!params.listItem || params.listItems && params.listItems.length != 1) return;

                let bindingContext = params.listItem.getBindingContext();
                let prodId = bindingContext ? bindingContext.getProperty('ProductID') : null;
                if (prodId !== null)
                    this.comp.getRouter().navTo("view_product", {id : prodId});
            },

            onPressCreateProduct: function () {
                this.comp.getRouter().navTo("create_product");
            }
        });
    }
);