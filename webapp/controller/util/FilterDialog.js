sap.ui.define([
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/FlexItemData",
    "sap/ui/layout/form/Form",
    "sap/ui/layout/form/FormContainer",
    "sap/ui/layout/form/FormElement",
    "sap/ui/layout/form/FormLayout",
    "sap/ui/layout/form/ResponsiveGridLayout",
    "sap/m/Button",
    "sap/m/MultiInput",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/DateTimePicker",
    "sap/m/TimePicker",
    "sap/m/Select",
    "sap/ui/core/ListItem",
    "sap/m/Token",
    "sap/m/Bar",
    "sap/ui/core/Core",
    "sap/m/Title",
    "sap/ui/model/Filter",
],
function (
    Dialog,
    VBox,
    HBox,
    FlexItemData,
    Form,
    FormContainer,
    FormElement,
    FormLayout,
    ResponsiveGridLayout,
    Button,
    MultiInput,
    Input,
    DatePicker,
    DateTimePicker,
    TimePicker,
    Select,
    ListItem,
    Token,
    Bar,
    Core,
    Title,
    Filter,
) {
    "use strict";
    return class {
        operators = {
            [sap.ui.model.FilterOperator.BT] : true,
            [sap.ui.model.FilterOperator.Contains] : true,
            [sap.ui.model.FilterOperator.EndsWith] : true,
            [sap.ui.model.FilterOperator.EQ] : true,
            [sap.ui.model.FilterOperator.GE] : true,
            [sap.ui.model.FilterOperator.GT] : true,
            [sap.ui.model.FilterOperator.LE] : true,
            [sap.ui.model.FilterOperator.LT] : true,
            [sap.ui.model.FilterOperator.StartsWith] : true,
            //following dont seem to work with mockserver
            [sap.ui.model.FilterOperator.NB] : false, 
            [sap.ui.model.FilterOperator.NE] : false,
            [sap.ui.model.FilterOperator.NotContains] : false,
            [sap.ui.model.FilterOperator.NotEndsWith] : false,
            [sap.ui.model.FilterOperator.NotStartsWith] : false,
        }
        operatorHasDouble = {
            [sap.ui.model.FilterOperator.BT] : true,
            [sap.ui.model.FilterOperator.NB] : true,
        };

        data = null;
        i18n = null;
        container = null; //contains innerContainer and applyFilterButton
        applyFilterButton = null;
        innerContainer = null; //has navigations, mainPage and subPages
        mainPage = null;
        subPages = {};
        multiInputs = {};
        fields = {}; //map of fields[path] = fieldDetails (as specified in data.fields)
        filterBarContainer = {};

        /**
         * 
          @param {Object} data = {
            i18n : Resource Bundle,
            dialog : Boolean,
            title : String,
            onFilter : Function (the Filter object is passed as first argument to the given callback function),
            fields : [
                {
                    path : String,
                    label : String,
                    type : sap.m.InputType OR 'Date' OR 'Datetime' OR 'Time'
                    operators? : [array of sap.ui.model.FilterOperator] if not defined, all supported operators are considered
                    onValueHelp ? : Function (the input element is passed as first argument to the given callback function)
                },
                ...
            ]
          }
         */
        constructor (data) {
            this.data = data;
            this.i18n = data.i18n;

            this.fields = {};
            for (let fieldData of this.data.fields)
                this.fields[fieldData.path] = fieldData;

            this.applyFilterButton = new Button({
                text : this.i18n.getText('apply', undefined, true) || 'Apply',
                icon : 'sap-icon://accept',
                type : sap.m.ButtonType.Emphasized,
                press : () => {
                    this.applyFilters();
                }
            });

            this.createLayout();

            this.container = null;
            if (data.dialog) {
                this.container = new Dialog({
                    stretch : !sap.ui.Device.system.desktop,
                    contentWidth : '40em',
                    // title : data.title,
                    customHeader : new Bar({
                        contentLeft : new Title({text : data.title}),
                        contentRight : new Button({
                            icon : 'sap-icon://delete',
                            tooltip : this.i18n.getText('clear_filters'),
                            press : () => {
                                this.clearFilters();
                                this.applyFilters();
                        }}),
                    }),
                    content : [this.innerContainer],
                    beginButton : this.applyFilterButton,
                    endButton : new Button({
                        text : this.i18n.getText('cancel', undefined, true) || 'Cancel',
                        type : sap.m.ButtonType.Transparent,
                        press : () => {
                            this.restoreFilters();
                            this.navigateInnerContainer(this.mainPage);
                            this.container.close()
                        }
                    })
                });
            } else {
                this.container = new VBox({
                    renderType : sap.m.FlexRendertype.Bare,
                    items : [this.innerContainer, this.applyFilterButton]
                });
            }
        }

        createFilter () {
            let allFilters = [];
            for (let path in this.savedFilters) {
                let curFilters = [];
                for (let filter of this.savedFilters[path]) {
                    curFilters.push(new Filter({
                        path,
                        operator : filter.operator,
                        value1 : filter.low,
                        value2 : (this.operatorHasDouble[filter.operator] ? filter.high : undefined)
                    }));
                }
                if (curFilters.length > 0)
                    allFilters.push(new Filter({
                        filters : curFilters,
                        and : false,
                    }));
            }
            if (allFilters.length > 0)
                return new Filter({
                    filters : allFilters,
                    and : true,
                });
            else
                return null;
        }

        applyFilters () {
            this.data.onFilter(this.createFilter());
            this.navigateInnerContainer(this.mainPage);
            if (this.data.dialog)
                this.container.close();
        }

        clearFilters () {
            this.savedFilters = {};
            this.restoreFilters();
        }

        saveFilters () {
            this.savedFilters = {};
            for (let path in this.multiInputs) {
                let mi = this.multiInputs[path];
                this.savedFilters[path] = [];
                for (let token of mi.getTokens()) {
                    this.savedFilters[path].push({
                        operator : token.data('operator'),
                        low : token.data('low'),
                        high : token.data('high'),
                    });
                }
            }
        }
        
        restoreFilters () {
            if (!this.savedFilters) this.savedFilters = {};
            for (let path in this.multiInputs) {
                let mi = this.multiInputs[path];
                mi.destroyTokens(); mi.removeAllTokens();
                
                let filterBarContainer = this.filterBarContainer[path];
                filterBarContainer.destroyItems(); filterBarContainer.removeAllItems();

                if (this.savedFilters[path] && this.savedFilters[path].length > 0) {
                    for (let filter of this.savedFilters[path]) {
                        let text = filter.operator + ':' + (filter.low || "''") + (filter.high == (null || undefined) ? '' : ',' + (filter.high || "''"));
                        let token = new Token({
                            // editable : false, //editable false, because we don't want user to remove this token by cliking on cross button (we let user do it in subpage)
                            text
                        });
                        token.data('operator', filter.operator);
                        token.data('low', filter.low);
                        token.data('high', filter.high);
                        mi.addToken(token);
                        
                        filterBarContainer.addItem(this.createFilterBar(path, filterBarContainer, filter));
                    }
                }
            }
        }

        navigateInnerContainer (navTo) {
            this.applyFilterButton.setEnabled(navTo == this.mainPage);
            this.innerContainer.getItems().forEach((v) => this.innerContainer.removeItem(v));
            this.innerContainer.addItem(navTo);
        }

        createLayout () {
            this.createSubPages();
            this.innerContainer = new VBox();

            //content of mainPage (multiple multiinputs with valueHelp (to navigate to subpages)
            let formElements = [];
            this.multiInputs = {};
            for (let field of this.data.fields) {
                let mi = new MultiInput({
                    showValueHelp : true,
                    showSuggestion : false,
                });
                mi.attachValueHelpRequest(() => {
                    //remove mainPage from this.innerContainer, and add subPage (simulate navigation)
                    this.navigateInnerContainer(this.subPages[field.path]);
                });
                mi.attachTokenUpdate(evt => {
                    let removed = evt.getParameter('removedTokens');
                    if (removed.length > 0) {
                        for (let t of removed)
                            mi.removeToken(t);
                        this.saveFilters();
                        this.restoreFilters();
                    }
                });
                this.multiInputs[field.path] = mi;
                formElements.push(new FormElement({label: field.label, fields : mi}));
            }


            this.mainPage = new Form({
                editable : true,
                layout : new ResponsiveGridLayout({
                    labelSpanXL:3,
					labelSpanL:3,
					labelSpanM:3,
					labelSpanS:12,
					adjustLabelSpan:false,
					emptySpanXL:4,
					emptySpanL:4,
					emptySpanM:4,
					emptySpanS:0,
					columnsXL:1,
					columnsL:1,
					columnsM:1,
					singleContainerFullSize:false,
                }),
                formContainers : [new FormContainer({formElements})]
            });
            this.innerContainer.addItem(this.mainPage);
        }

        createSubPages () {
            this.subPages = {};
            this.filterBarContainer = {}
            for (let field of this.data.fields) {
                //container for multiple row of filter inputs (operator, low, high inputs)
                let container = new VBox({}); //initially empty
                this.filterBarContainer[field.path] = container;

                let addButton = new Button({
                    icon : 'sap-icon://add',
                    text : this.i18n.getText('add', undefined, true) || 'Add',
                    press : () => {
                        container.addItem(this.createFilterBar(field.path, container));
                    }
                });
                
                container.addStyleClass('sapUiSmallMarginBeginEnd');
                addButton.addStyleClass('sapUiSmallMarginBeginEnd');

                //this is sub page
                this.subPages[field.path] = new VBox({
                    renderType : sap.m.FlexRendertype.Bare,
                    items : [
                        //header
                        new Bar({
                            contentLeft : [
                                new Title({text : this.i18n.getText('add_filter_conditions', undefined, true) || 'Add filter conditions'})
                            ],
                            contentRight : [
                                new Button({
                                    icon : 'sap-icon://accept',
                                    text : this.i18n.getText('confirm', undefined, true) || 'Confirm',
                                    press : () => {
                                        //apply filters to multiinput
                                        let mi = this.multiInputs[field.path];
                                        mi.destroyTokens(); mi.removeAllTokens();
                                        for (let item of container.getItems()) {
                                            let operator = item.data('operator').getSelectedKey();
                                            let low = item.data('low').getValue();;
                                            let high = item.data('high');
                                            high = high.getEditable() ? high.getValue() : null;
                                            if (!this.operators[operator])
                                                continue;
                                            let text = operator + ':' + (low || "''") + (high == null ? '' : ',' + (high || "''"));
                                            let token = new Token({
                                                // editable : false, //editable false, because we don't want user to remove this token by cliking on cross button (we let user do it in subpage)
                                                text
                                            });
                                            token.data('operator', operator);
                                            token.data('low', low);
                                            token.data('high', high);
                                            mi.addToken(token);
                                        }

                                        this.saveFilters();
                                        this.navigateInnerContainer(this.mainPage);
                                    }
                                }),
                                new Button({
                                    text : this.i18n.getText('cancel', undefined, true) || "Cancel",
                                    press : () => {
                                        this.restoreFilters();
                                        this.navigateInnerContainer(this.mainPage);
                                    }
                                })
                            ]
                        }),
                        //container of filter rows
                        container,
                        //adds a new row of filter inputs (operator, low, high inputs) to the above container
                        addButton,    
                    ]
                });
            }
        }

        createFilterBar (path, parent, filter = {}) {
            let fieldData = this.fields[path];
            let selectOperator = new Select({items : (fieldData.operators || Object.keys(this.operators)).map((operator) => {
                if (!this.operators[operator]) return null;
                return new ListItem({
                    key : operator,
                    text : this.i18n.getText(operator)
                })
            }).filter(v => v)});
            selectOperator.setSelectedKey(filter.operator || selectOperator.getItemAt(0).getKey());

            let low = null, high = null;
            if (fieldData.type == 'Date') {
                low = new DatePicker();
                high = new DatePicker({
                    editable : !!this.operatorHasDouble[selectOperator.getSelectedKey()],
                });
            } else if (fieldData.type == 'Datetime') {
                low = new DateTimePicker();
                high = new DateTimePicker({
                    editable : !!this.operatorHasDouble[selectOperator.getSelectedKey()],
                });
            } else if (fieldData.type == 'Time') {
                low = new TimePicker();
                high = new TimePicker({
                    editable : !!this.operatorHasDouble[selectOperator.getSelectedKey()],
                });
            } else {
                low = new Input({type : fieldData.type});
                high = new Input({
                    type : fieldData.type,
                    editable : !!this.operatorHasDouble[selectOperator.getSelectedKey()],
                });

                if (typeof fieldData.onValueHelp == 'function') {
                    low.setShowValueHelp(true);
                    high.setShowValueHelp(true);
                    low.attachValueHelpRequest(() => fieldData.onValueHelp(low))
                    high.attachValueHelpRequest(() => fieldData.onValueHelp(high));
                }
            }

            if (filter.low) low.setValue(filter.low);
            if (filter.high) high.setValue(filter.high);

            selectOperator.attachChange(() => {
                high.setEditable(!!this.operatorHasDouble[selectOperator.getSelectedKey()]);
            });

            let deleteButton = new Button({
                icon : 'sap-icon://delete',
                type : sap.m.ButtonType.Transparent,
                press : () => {
                    parent.removeItem(barOuter);
                    barOuter.destroy();
                }
            });

            let barOuter = new HBox({
                alignItems:sap.m.FlexAlignItems.End,
                items : [
                    new HBox({
                        wrap : sap.m.FlexWrap.Wrap,
                        items : [
                            selectOperator,
                            new HBox({
                                wrap : sap.m.FlexWrap.Wrap,
                                items : [low, high],
                                layoutData : new FlexItemData({growFactor : 1})
                            })
                        ],
                        layoutData : new FlexItemData({growFactor : 1})
                    }),
                    new HBox({items : [deleteButton]}),
                ]
            });
            barOuter.data('operator', selectOperator);
            barOuter.data('low', low);
            barOuter.data('high', high);
            return barOuter;
        }
        
    };
});