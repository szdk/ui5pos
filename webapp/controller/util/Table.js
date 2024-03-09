sap.ui.define([
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Text",
    'sap/m/p13n/Engine',
	'sap/m/p13n/SelectionController',
	'sap/m/p13n/SortController',
	'sap/m/p13n/GroupController',
	'sap/m/p13n/MetadataHelper',
], function (
    Table,
    Column,
    Text,
    Engine,
    SelectionController,
    SortController,
    GroupController,
    MetadataHelper,
) {
    "use strict";
    return new class {
        /**
         data = {
            i18n,
            model,
            id : String,
            properties : {sap.m.Table properties}
            itemsBinding : {
                path : String,
                parameters? : {

                }
            },
            toolbar : {
                p13n : null OR Object({
                    Columns : Boolean,
                    Sorter : Boolean,
                    Groups : Boolean,
                    Filter : Boolean,
                }),
                excel : Boolean,
            },
            columns : [
                {
                    p13n? : {
                        key : String,
                        label : String,
                        path : String,
                    },
                    cell : {
                        bindingPath? : String,
                        control? : properly binded sap.ui.core.Control (eg. Text control)
                    },
                    header : {
                        header : String OR sap.ui.core.Control (eg. Text control)
                        ...properties of sap.m.Column
                    }
                },
                ...
            ]

         }
         */
        constructor (data) {
            this.generateTable(data);
        }

        getTable = () => this.table;

        generateTable = (data = {}) => {
            this.i18n = data.i18n;

            this.colHeader = this.generateHeader(data);
            this.cols = this.genereateColumns(data);

            this.colmap = {};
            if (data.toolbar.p13n) {
                for (let i = 0; i < this.colHeader.length; i++) {
                    colmap[data.columns.p13n.key] = {
                        header : this.colHeader[i],
                        col : this.cols[i]
                    }
                }
            }

            this.sorter = [];
            this.filters = [];
            
            this.table = new Table(data.id, {columns : this.cols, ...data.properties});
            this.table.setModel(data.model);
            this.table.bindItems({
                path : data.itemsBinding.path,
                parameters : data.itemsBinding.parameters,
                template : new ColumnListItem({cells: this.cols}),
                templateShareable : false,
                sorter : this.sorter,
                filters : this.filters,
            });

            this.p13n = data.toolbar.p13n ? this.generateP13n(data) : null;
                
        }

        generateP13n (data) {
            let eng = Engine.getInstance().register();

            return eng;
        }

        generateHeader = (data) => {
            let result = [];
            for (let col of data.columns) {
                if (typeof col.header.header == 'string')
                    col.header.header = new Text({text : col.header.header});
                result.push(new Column(data.toolbar.p13n ? col.p13n.key : undefined, col.header));
            }
            return result;
        }
        genereateColumns = (data) => {
            let cells = [];
            for (let col of data.columns) {
                let item = null;
                if (col.cell.bindingPath) {
                    item = new Text();
                    item.bindText(col.cell.bindingPath);
                } else {
                    item = col.cell.control;
                }
                cells.push(item);
            }
            return cells;
        }
    };
});