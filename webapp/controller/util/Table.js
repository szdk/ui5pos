sap.ui.define([
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/ColumnListItem",
    'sap/m/p13n/Engine',
	'sap/m/p13n/SelectionController',
	'sap/m/p13n/SortController',
	'sap/m/p13n/GroupController',
    'sap/m/table/ColumnWidthController',
	'sap/m/p13n/MetadataHelper',
    'sap/ui/core/library',
    'sap/ui/model/Sorter',
    'sap/m/IllustratedMessage',
    'sap/m/OverflowToolbar',
    'sap/m/ToolbarSpacer',
    'sap/m/Button',
    'sap/m/MenuButton',
    'sap/m/Menu',
    'sap/m/MenuItem',
], function (
    Table,
    Column,
    Text,
    ColumnListItem,
    Engine,
    SelectionController,
    SortController,
    GroupController,
    ColumnWidthController,
    MetadataHelper,
    Core,
    Sorter,
    IllustratedMessage,
    OverflowToolbar,
    ToolbarSpacer,
    Button,
    MenuButton,
    Menu,
    MenuItem,
) {
    "use strict";

    return class {
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
                }),
                excel : Boolean,
                growSize : Boolean,
                pin: Boolean,
            },
            columns : [
                {
                    id : String | the id of the column, so that column is identified by p13n (has to be equal to the key of p13n preffixed by view generated id)
                    groupFunction? : function to be used when grouping this column
                    p13n? : {
                        key : String,
                        label : String,
                        path : String,
                        ...properties of sap.m.p13n.MetadataHelper
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
            this.data = data;
            this.i18n = data.i18n;
            this.sorter = [];
            this.filters = [];
            this.generateTable();
            this.p13n = data.toolbar && data.toolbar.p13n ? this.registerP13n() : null;
            this.generateToolbar();
        }
        
        getTable = () => this.table;

        generateToolbar = () => {
            let data = this.data;
            if (!data.toolbar || !Object.keys(data.toolbar).find(val => !!val))
                return;
            this.toolbar = new OverflowToolbar();
            this.toolbar.addContent(new ToolbarSpacer());
            if (data.toolbar.p13n) {
                this.toolbar.addContent(
                    new Button({
                        icon : 'sap-icon://provision',
                        text : this.i18n.getText('layout'),
                        type : sap.m.ButtonType.Transparent,
                        press : (e) => {
                            this.showP13n();
                        }
                }));
            }
            if (data.toolbar.growSize) {
                let menus = [];
                for (let key of ['20', '50', '100', '1000'])
                    menus.push(new MenuItem({
                        key,
                        text : this.i18n.getText(key)
                    }));
                let menuButton = new MenuButton({
                    tooltip : this.i18n.getText('items_count'),
                    text : this.table.getGrowing() ? this.table.getGrowingThreshold() : null,
                    icon : 'sap-icon://documents',
                    type : sap.m.ButtonType.Transparent,
                    menu : new Menu({
                        items : menus,
                        itemSelected : (e) => {
                            let selected = e.getParameter('item');
                            if (!selected) return;
                            this.table.setGrowing(true);
                            this.table.setGrowingThreshold(parseInt(selected.getKey()));
                            menuButton.setText(selected.getText());
                        },
                    })
                });
                this.toolbar.addContent(menuButton);
            }
            if (data.toolbar.pin) {
                let curSticky = this.table.getSticky() || [];
                let menuButton = new MenuButton({
                    tooltip : this.i18n.getText('pin'),
                    text : this.i18n.getText('pin'),
                    icon : 'sap-icon://pushpin-on',
                    type : sap.m.ButtonType.Transparent,
                    menu : new Menu({
                        items : [
                            new MenuItem({
                                text: this.i18n.getText('toolbar'),
                                key : 'HeaderToolbar',
                                icon : curSticky.indexOf('HeaderToolbar') > -1 ? 'sap-icon://complete' : 'sap-icon://border'
                            }),
                            new MenuItem({
                                text: this.i18n.getText('column_header'),
                                key : 'ColumnHeaders',
                                icon : curSticky.indexOf('ColumnHeaders') > -1 ? 'sap-icon://complete' : 'sap-icon://border'
                            }),
                        ],
                        itemSelected : (e) => {
                            let sticky = [...this.table.getSticky() || []];
                            let selected = e.getParameter('item');
                            let idx = sticky.indexOf(selected.getKey());
                            if (idx < 0) {
                                sticky.push(selected.getKey());
                                selected.setIcon('sap-icon://complete');
                            } else {
                                sticky.splice(idx, 1);
                                selected.setIcon('sap-icon://border');
                            }
                            this.table.setSticky(sticky);
                        },
                    }),
                });
                this.toolbar.addContent(menuButton);
            }


            this.table.setHeaderToolbar(this.toolbar);
        }

        generateTable = () => {
            let data = this.data;

            this.columnElements = [];
            this.cellElements = [];
            this.colP13nMap = {};
            this.colNonP13n = [];
            for (let col of data.columns) {
                let obj = {
                    columnData : col,
                    columnElement : this.generateColumn(col),
                    cellElement : this.genereateCell(col),
                };
                this.columnElements.push(obj.columnElement);
                this.cellElements.push(obj.cellElement);
                if (col.p13n)
                    this.colP13nMap[col.p13n.key] = obj
                else
                    this.colNonP13n.push(obj);
            }

            this.cellContainer = new ColumnListItem({cells: this.cellElements});

            this.table = new Table(data.id, {columns : this.columnElements, noData: new IllustratedMessage(), ...data.properties});
            this.table.setModel(data.model);
            this.table.bindItems({
                path : data.itemsBinding.path,
                parameters : data.itemsBinding.parameters,
                template : this.cellContainer,
                templateShareable : true,
                sorter : this.sorter,
                filters : this.filters,
            });    
        }

        handelStateChange = (evt) => {
            if (evt.getParameter('control') == this.table) {
                let state = evt.getParameter('state');
                let cols = this.columnsFromState(state);
                //reset col properties
                for (let i = 0; i < cols.length; i++) {
                    let col = cols[i];
                    col.setVisible(true).setWidth(col.data('default-width'));
                    if (state.Sorter && state.Sorter.length > 0) {
                        let key = col.data('key');
                        let sort = state.Sorter.find(obj => obj.key == key);
                        if (sort)
                            col.setSortIndicator(sort.descending ? Core.SortOrder.Descending : Core.SortOrder.Ascending);
                        else
                            col.setSortIndicator(Core.SortOrder.None);
                    }
                }
                let cells = this.cellsFromState(state);
                this.sorter = this.sorterFromState(state);


                this.table.getColumns().forEach((cur_col) => this.table.removeColumn(cur_col));
                cols.forEach((col, idx) => this.table.insertColumn(col, idx));
                
                this.cellContainer.getCells().forEach(cur_cell => this.cellContainer.removeCell(cur_cell));
                cells.forEach((cell, idx) => this.cellContainer.insertCell(cell, idx));

                this.table.bindItems({
                    path : this.data.itemsBinding.path,
                    parameters : this.data.itemsBinding.parameters,
                    template : this.cellContainer,
                    templateShareable : true,
                    sorter : this.sorter,
                    filters : this.filters,
                });
                
            }
            this.p13n.detachStateChange(this.handelStateChange);
        };

        showP13n = () => {
            let data = this.data;
            this.p13n.attachStateChange(this.handelStateChange);
            this.p13n.show(this.table, Object.keys(data.toolbar.p13n).filter(v => data.toolbar.p13n[v]), this.table);
        }

        sorterFromState = (state) => {
            if (typeof state.Sorter == 'undefined') return this.sorter;
            let sorter = [];
            let groupKey = state.Groups && state.Groups.length > 0 ? state.Groups[0].key : null;
            let isGroupSorted = false;
            for (let obj of state.Sorter) {
                if (obj.key == groupKey)
                    isGroupSorted = true;
                sorter.push(new Sorter(
                    this.colP13nMap[obj.key].columnData.p13n.path,
                    obj.descending,
                    obj.key == groupKey ? (
                        this.colP13nMap[obj.key].columnData.groupFunction || true
                    ) : false
                ));
            }
            if (groupKey && !isGroupSorted) {
                sorter.push(new Sorter(
                    this.colP13nMap[groupKey].columnData.p13n.path,
                    false,
                    this.colP13nMap[groupKey].columnData.groupFunction || true
                ));
            }
            return sorter;
        }

        columnsFromState = (state) => {
            if (typeof state.Columns == 'undefined') return this.columnElements;
            let cols = [];
            //add p13n columns
            for (let col of state.Columns)
                cols.push(this.colP13nMap[col.key].columnElement);
            //add non p13n columns
            for (let col of this.colNonP13n)
                cols.push(col.columnElement);
            return cols;
        }

        cellsFromState = (state) => {
            if (typeof state.Columns == 'undefined') return this.cellElements;
            let cells = [];
            //add p13n cells
            for (let cell of state.Columns)
                cells.push(this.colP13nMap[cell.key].cellElement);
            //add non p13n cells
            for (let cell of this.colNonP13n)
                cells.push(cell.cellElement);
            return cells;
        }

        registerP13n = () => {
            let data = this.data;

            let helper = [];
            for (let col of data.columns)
                helper.push({...col.p13n});
            let eng = Engine.getInstance();
            eng.register(this.table, {
                helper : new MetadataHelper(helper),
                controller : {
                    Columns: new SelectionController({
						targetAggregation: "columns",
						control: this.table
					}),
					Sorter: new SortController({
						control: this.table
					}),
					Groups: new GroupController({
						control: this.table
					}),
                }
            });
            return eng;
        }

        generateColumn = (colData) => {
            if (typeof colData.header.header == 'string')
                colData.header.header = new Text({text : colData.header.header});
            let el = new Column(colData.id, colData.header);
            el.data('default-width', colData.header.width);
            if (colData.p13n && colData.p13n.key)
                el.data('key', colData.p13n.key);
            return el;
        }
        genereateCell = (colData) => {
            let el = null;
            if (colData.cell.bindingPath) {
                el = new Text();
                el.bindText(colData.cell.bindingPath);
            } else {
                el = colData.cell.control;
            }
            return el;
        }
    };
});