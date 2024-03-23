sap.ui.define([
        "ui5pos/szdk/controller/BaseController",
        'ui5pos/szdk/controller/util/Table',
        "ui5pos/szdk/controller/util/F4Help",
        "ui5pos/szdk/controller/util/FilterDialog",
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
        "sap/m/ToolbarSeparator",
    ],
    function (
        Controller,
        Table,
        F4Help,
        FilterDialog,
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

        return Controller.extend("ui5pos.szdk.controller.product.Products", {
            onInit: function () {
                Controller.prototype.onInit.apply(this, arguments);
                
                window.temp = this;

                //Create Table after service has been created
                this.comp.szdk_serviceCreated.then((model) => {
                    //Open Product input toolbar
                    let inputOpenProduct = new Input({
                        type : sap.m.InputType.Number,
                        showValueHelp:true,
                        placeholder: this.i18n.getText('product_id'),
                        width : '9em'
                    });
                    inputOpenProduct.attachValueHelpRequest(() => (this.onValueHelpProduct.bind(this))(inputOpenProduct));
                    
                    let buttonOpenProduct = new Button({type: sap.m.ButtonType.Transparent ,text: this.i18n.getText('open')});
                    buttonOpenProduct.attachPress(() => (this.openProduct.bind(this))(inputOpenProduct));

                    //Table Filters Toolbar 
                    this.filterDialog = new FilterDialog({
                        i18n : this.i18n,
                        dialog : true,
                        title : this.i18n.getText('add_filters', undefined, true) || 'Add Filters',
                        onFilter : (filters) => {
                            tableGenerator.applyFilter(filters);
                        },
                        fields : [
                            {
                                path : 'ProductID',
                                label : this.i18n.getText('product_id'),
                                type : sap.m.InputType.Number,
                                operators : [sap.ui.model.FilterOperator.EQ, sap.ui.model.FilterOperator.BT, sap.ui.model.FilterOperator.LT, sap.ui.model.FilterOperator.GT, sap.ui.model.FilterOperator.LE, sap.ui.model.FilterOperator.GE],
                                onValueHelp : (input) => {
                                    F4Help.f4Table({
                                        i18n : this.i18n,
                                        ODataModel: this.comp.getModel('service'),
                                        entitySetPath: '/Products',
                                        filterFields: [{path : 'ProductName', label : this.i18n.getText('product_name')}],
                                        showFields: [
                                            {path : 'ProductID', label : this.i18n.getText('product_id')},
                                            {path : 'ProductName', label : this.i18n.getText('product_name')},
                                        ],
                                        returnFields: ['ProductID'],
                                        title: this.i18n.getText('product_select_single')
                                    }).then((selected) => {
                                        if (!selected || selected.length == 0) return;
                                        let id = parseInt(selected[0].ProductID);
                                        if (id) {
                                            input.setValue(id).setValueState(sap.ui.core.ValueState.None);
                                        }
                                    });
                                }
                            },
                            {
                                path : 'ProductName',
                                label : this.i18n.getText('product_name'),
                            },
                            {
                                path : 'UnitPrice',
                                label : this.i18n.getText('product_unitPrice'),
                                type : sap.m.InputType.Number,
                                operators : [sap.ui.model.FilterOperator.EQ, sap.ui.model.FilterOperator.BT, sap.ui.model.FilterOperator.LT, sap.ui.model.FilterOperator.GT, sap.ui.model.FilterOperator.LE, sap.ui.model.FilterOperator.GE],
                            },
                            {
                                path : 'CategoryID',
                                label : this.i18n.getText('category_id'),
                                type : sap.m.InputType.Number,
                                operators : [sap.ui.model.FilterOperator.EQ, sap.ui.model.FilterOperator.BT, sap.ui.model.FilterOperator.LT, sap.ui.model.FilterOperator.GT, sap.ui.model.FilterOperator.LE, sap.ui.model.FilterOperator.GE],
                                onValueHelp : (input) => {
                                    F4Help.f4Table({
                                        i18n : this.i18n,
                                        ODataModel: this.comp.getModel('service'),
                                        entitySetPath: '/Categories',
                                        filterFields: [{path : 'CategoryName', label : this.i18n.getText('category_name')}],
                                        showFields: [
                                            {path : 'CategoryID', label : this.i18n.getText('product_id')},
                                            {path : 'CategoryName', label : this.i18n.getText('product_name')},
                                        ],
                                        returnFields: ['CategoryID'],
                                        title: this.i18n.getText('category_select_single')
                                    }).then((selected) => {
                                        if (!selected || selected.length == 0) return;
                                        let id = parseInt(selected[0].CategoryID);
                                        if (id) {
                                            input.setValue(id).setValueState(sap.ui.core.ValueState.None);
                                        }
                                    });
                                }
                            },
                            {
                                path : 'Category/CategoryName',
                                label : this.i18n.getText('category')
                            },
                            {
                                path : 'SupplierID',
                                label : this.i18n.getText('supplier_id'),
                                type : sap.m.InputType.Number,
                                operators : [sap.ui.model.FilterOperator.EQ, sap.ui.model.FilterOperator.BT, sap.ui.model.FilterOperator.LT, sap.ui.model.FilterOperator.GT, sap.ui.model.FilterOperator.LE, sap.ui.model.FilterOperator.GE],
                                onValueHelp : (input) => {
                                    F4Help.f4Table({
                                        i18n : this.i18n,
                                        ODataModel: this.comp.getModel('service'),
                                        entitySetPath: '/Suppliers',
                                        filterFields: [{path : 'CompanyName', label : this.i18n.getText('supplier_company_name')}],
                                        showFields: [
                                            {path : 'SupplierID', label : this.i18n.getText('supplier_id')},
                                            {path : 'CompanyName', label : this.i18n.getText('supplier_company_name')},
                                        ],
                                        returnFields: ['SupplierID'],
                                        title: this.i18n.getText('supplier_select_single')
                                    }).then((selected) => {
                                        if (!selected || selected.length == 0) return;
                                        let id = parseInt(selected[0].SupplierID);
                                        if (id) {
                                            input.setValue(id).setValueState(sap.ui.core.ValueState.None);
                                        }
                                    });
                                }
                            }
                        ]
                    });
                    let filterButton = new Button({icon: 'sap-icon://filter', type: sap.m.ButtonType.Transparent, tooltip : this.i18n.getText('filter')});
                    filterButton.attachPress(() => {
                        this.filterDialog.container.open();
                    });

                    //Table Columns
                    let columns = [
                        {id : 'ProductID', label : this.i18n.getText('id'), path : 'ProductID', header: {minScreenWidth:"XXLarge", demandPopin:true, popinDisplay:"Inline", width:"5em"}},
                        {id : 'ProductName', label : this.i18n.getText('product'), path : 'ProductName', header: {}},
                        {id : 'CategoryName', label : this.i18n.getText('category'), path : 'Category/CategoryName', header: {minScreenWidth:"Tablet", demandPopin:true, popinDisplay:"Inline"}},
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

                    let tableGenerator = new Table({
                        id: this.getView().createId('products_table'),
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
                                Columns : true,
                                Sorter : true,
                                Groups : true,
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

            openProduct: function (input) {
                const error = () => {
                    input.setValueStateText(this.i18n.getText('input_invalid_product_id'));
                    input.setValueState(sap.ui.core.ValueState.Error);
                };
                let id = parseInt(input.getValue());
                if (!id) {
                    error();
                    return;
                }

                this.comp.getModel('service').read(`/Products(${id})`, {success : (data) => {
                    if (data && data.ProductID) {
                        input.setValueState(sap.ui.core.ValueState.None);
                        input.setValue('');
                        this.comp.getRouter().navTo("view_product", {id : data.ProductID});
                    } else {
                        error();
                    }
                }, error : (err) => {
                    error();
                }});

            },

            onValueHelpProduct: function (input) {
                F4Help.f4Table({
                    i18n : this.i18n,
                    ODataModel: this.comp.getModel('service'),
                    entitySetPath: '/Products',
                    filterFields: [{path : 'ProductName', label : this.i18n.getText('product_name')}],
                    showFields: [
                        {path : 'ProductID', label : this.i18n.getText('product_id')},
                        {path : 'ProductName', label : this.i18n.getText('product_name')},
                    ],
                    returnFields: ['ProductID'],
                    title: this.i18n.getText('product_select_single')
                }).then((selected) => {
                    if (!selected || selected.length == 0) return;
                    let id = parseInt(selected[0].ProductID);
                    if (id) {
                        input.setValue(id).setValueState(sap.ui.core.ValueState.None);
                    }
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