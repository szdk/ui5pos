sap.ui.define([
        "sap/m/Dialog",
        "sap/m/Table",
        "sap/m/Column",
        "sap/m/Text",
        "sap/m/ColumnListItem",
        "sap/m/Button",
        "sap/m/SearchField",
        "sap/m/Panel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
    ],
    function (
        Dialog,
        Table,
        Column,
        Text,
        ColumnListItem,
        Button,
        SearchField,
        Panel,
        Filter,
        FilterOperator,
    ) {
        "use strict";
        return {
            /**
             * 
             * @param {Object} data = {
                    i18n          : Resource Bundel object
                    ODataModel    : Odata Model Object
                    entitySetPath : without model name prefix (including / )
                    filterFields :  [{path : String, label : String}, ...]
                    showFields :    [{path : String, label : String}, ...]
                    returnFields :  [field1, ...]
                    title :         appears on top
                    width :         max css width of dialog box, default : '480px'
                    singleSelect :  default: true
             * } 
             * @returns {Promise} resolves with [{field1 : val, ...}, {...] or null
             */
            f4Table : function (data) {
                let i18n = data.i18n,
                    ODataModel = data.ODataModel,
                    entitySetPath = data.entitySetPath,
                    filterFields = data.filterFields,
                    showFields = data.showFields,
                    returnFields = data.returnFields,
                    title = data.title,
                    width = data.width || '480px',
                    singleSelect = typeof data.singleSelect != 'undefined' ? data.singleSelect : true;
                
                let resolve = () => {};
                let promise = new Promise((r) => {
                    resolve = r;
                });

                //table
                let table = new Table({
                    growing: true, growingThreshold: 10,
                    busyIndicatorDelay: 0,
                    mode: (singleSelect ? sap.m.ListMode.SingleSelectMaster : sap.m.ListMode.MultiSelect)
                });
                table.setModel(ODataModel);

                let items = [];
                // for (let field in showFields) {
                for (let field of showFields) {
                    table.addColumn(new Column({
                        header: new Text({text : field.label})
                    }));

                    let item = new Text();
                    item.bindText(field.path);
                    items.push(item);
                }

                table.bindItems({
                    path: entitySetPath,
                    template: new ColumnListItem({cells : items})
                });

                //search
                let searchFieldElements = [];
                let searchPanel = null;
                var searchValues = {};
                // if (filterFields && Object.keys(filterFields).length > 0) {
                if (filterFields && filterFields.length > 0) {
                    for (let field of filterFields) {
                        let el = new SearchField({placeholder: field.label, change: (e) => {
                            searchValues[field.path] = e.getParameter('value').trim();
                        }, search : (e) => {
                            searchValues[field.path] = e.getParameter('query').trim();
                            applyFilter(searchValues);
                        }});
                        searchFieldElements.push(el);
                    }
                    searchPanel = new Panel({content: searchFieldElements});
                }

                //action
                let applyFilter = (searchValues) => {
                    let binding = table.getBinding('items');
                    let filters = [];
                    for (let fieldName in searchValues) {
                        if (!searchValues[fieldName] || searchValues[fieldName].length == 0) continue;
                        filters.push(new Filter({path: fieldName, operator: FilterOperator.Contains, value1: searchValues[fieldName]}));
                    }
                    binding.filter(filters.length > 0 ? new Filter({filters: filters, and : true}) : []);
                };

                table.attachSelectionChange((evt) => {
                    let params = evt.getParameters();
                    if (!params.listItems || params.listItems.length == 0) return;
                    let result = [];
                    for (let i = 0; i < params.listItems.length; i++) {
                        let ctx = params.listItems[i].getBindingContext();
                        if (!ctx) continue;
                        let fields = {};
                        for (let fieldName of returnFields)
                            fields[fieldName] = ctx.getProperty(fieldName);
                        result.push(fields);
                    }
                    closeDialog(result);
                });

                let cancelButton = new Button({
                    type: sap.m.ButtonType.Transparent,
                    text: i18n.getText('cancel'),
                    press: () => {
                        closeDialog(null);
                    }
                });

                //dialog box
                let dialog = new Dialog({
                    type: sap.m.DialogType.Standard,
                    icon: 'sap-icon://value-help',
                    title: title,
                    content: searchPanel ? [searchPanel, table] : [table],
                    endButton: cancelButton,
                    contentWidth: width,
                    resizable: true,
                    draggable: true,
                });

                dialog.open();

                const closeDialog = (result) => {
                    resolve(result);
                    dialog.close();
                    table.destroy();
                    dialog.destroy();
                };

                return promise;
            }
        };
    }
);