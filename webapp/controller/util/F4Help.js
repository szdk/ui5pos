sap.ui.define([
        "sap/m/Dialog",
        "sap/m/Table",
        "sap/m/Column",
        "sap/m/Text",
        "sap/m/ColumnListItem",
        "sap/m/Button",
    ],
    function (
        Dialog,
        Table,
        Column,
        Text,
        ColumnListItem,
        Button
    ) {
        "use strict";
        return {
            /**
             * 
             * @param {*} ODataModel 
             * @param {*} entitySetPath without model name prefix
             * @param {*} filterFields {field1 : "Field 1 header text", ...}
             * @param {*} showFields   {field1 : "Field 1 header text", ...}
             * @param {*} returnFields [field1, ...]
             * @param {*} title        appears on top
             * @param {*} width        max css width of dialog box, default : '480px'
             * @param {*} singleSelect default: true
             * @returns {Promise} resolves with [{field1 : val, ...}, {...] or null
             */
            f4Table : function (
                ODataModel,
                entitySetPath,
                filterFields,
                showFields,
                returnFields,
                title,
                width = '480px',
                singleSelect = true
            ) {
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
                for (let field in showFields) {
                    table.addColumn(new Column({
                        header: new Text({text : showFields[field]})
                    }));

                    let item = new Text();
                    item.bindText(field);
                    items.push(item);
                }

                table.bindItems({
                    path: entitySetPath,
                    template: new ColumnListItem({cells : items})
                });

                //action
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
                    text: this.i18n.getText('cancel'),
                    press: () => {
                        closeDialog(null);
                    }
                });

                //dialog box
                let dialog = new Dialog({
                    type: sap.m.DialogType.Standard,
                    icon: 'sap-icon://value-help',
                    title: title,
                    content: [table],
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