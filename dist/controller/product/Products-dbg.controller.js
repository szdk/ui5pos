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
        "sap/m/ObjectIdentifier",
        "sap/m/ObjectNumber",
        "sap/m/Title",
        "sap/m/Input",
        "sap/m/ToolbarSeparator"
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
        ObjectIdentifier,
        ObjectNumber,
        Title,
        Input,
        ToolbarSeparator
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

                let filterButton = new Button({icon: 'sap-icon://filter', type: sap.m.ButtonType.Transparent, tooltip : this.i18n.getText('filter')});
                let inputOpenProduct = new Input({
                    type : sap.m.InputType.Number,
                    showValueHelp:true,
                    placeholder: this.i18n.getText('product_id'),
                    width : '9em'
                });
                let buttonOpenProduct = new Button({type: sap.m.ButtonType.Transparent ,text: this.i18n.getText('open')});

                let columns = [
                    {id : 'ProductID', label : this.i18n.getText('id'), path : 'ProductID', header: {minScreenWidth:"XXLarge", width:"5em"}},
                    {id : 'ProductName', label : this.i18n.getText('product'), path : 'ProductName', header: {}},
                    {id : 'CategoryName', label : this.i18n.getText('category'), path : 'Category/CategoryName', header: {minScreenWidth:"Tablet", demandPopin:true, popinDisplay:"WithoutHeader"}},
                    {id : 'UnitsInStock', label : this.i18n.getText('product_instock'), path : 'UnitsInStock', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                    {id : 'QuantityPerUnit', label : this.i18n.getText('product_quantityPerUnit'), path : 'QuantityPerUnit', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                    {id : 'UnitPrice', label : this.i18n.getText('product_unitPrice'), path : 'UnitPrice', header: {hAlign : "End"}},
                    {id : 'SupplierID', label : this.i18n.getText('supplier_id'), path : 'SupplierID', header: {visible:false,minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                    {id : 'CategoryID', label : this.i18n.getText('category_id'), path : 'CategoryID', header: {visible:false,minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                    {id : 'ReorderLevel', label : this.i18n.getText('product_reorder_level'), path : 'ReorderLevel', header: {visible:false,minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                    {id : 'Discontinued', label : this.i18n.getText('discontinued'), path : 'Discontinued', header: {visible:false,minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline"}},
                ].map((v) => ({
                    id : this.getView().createId(v.id),
                    cell: {bindingPath : v.path},
                    header : {header : v.label, ...v.header},
                    p13n : {key : v.id, label: v.label, path : v.path},
                    excel : {label : v.label, property : v.path}
                }));

                columns[0].cell.control = new ObjectIdentifier({title: "{ProductID}"});
                columns[1].cell.control = new Title({titleStyle:"H6", wrapping:true, wrappingType:"Normal", text:"{ProductName}"});
                columns[5].cell.control = new ObjectNumber({unit:"USD"});
                columns[5].cell.control.bindProperty('number', {
                    parts:[{path:'UnitPrice'},{value:'USD'}],
                    type: 'sap.ui.model.type.Currency',
                    formatOptions: {showMeasure:false}
                });
                
                this.comp.szdk_serviceCreated.then((model) => {
                    let tableGenerator = new Table({
                        id:'products_table',
                        i18n: this.i18n,
                        model,
                        columnListItem : {type : sap.m.ListType.Navigation},
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
                        customToolbar : {
                            start : [filterButton, new ToolbarSeparator(), inputOpenProduct, buttonOpenProduct]
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
                    tableGenerator.getTable().attachItemPress(this.onSelectionChange.bind(this));
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