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
            [sap.ui.model.FilterOperator.NB] : true,
            [sap.ui.model.FilterOperator.NE] : true,
            [sap.ui.model.FilterOperator.NotContains] : true,
            [sap.ui.model.FilterOperator.NotEndsWith] : true,
            [sap.ui.model.FilterOperator.NotStartsWith] : true,
            [sap.ui.model.FilterOperator.StartsWith] : true,
        }
        operatorHasDouble = {
            [sap.ui.model.FilterOperator.BT] : true,
            [sap.ui.model.FilterOperator.NB] : true,
        };

        data = null;
        createFilter = null;
        i18n = null;
        container = null; //contains innerContainer and applyFilterButton
        applyFilterButton = null;
        innerContainer = null; //has navigations, mainPage and subPages
        mainPage = null;
        subPages = {};
        multiInputs = {};

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
                    valueBinding : {Object containing binding info, eg : type, formatOption}
                    registerValueCheck? : Boolean
                    operators : [array of sap.ui.model.FilterOperator]
                    onValueHelp ? : Function (the input element is passed as first argument to the given callback function)
                },
                ...
            ]
          }
         */
        constructor (data) {
            this.data = data;
            this.i18n = data.i18n;

            this.applyFilterButton = new Button({
                text : this.i18n.getText('apply_filter', undefined, true) || 'Apply Filter',
                icon : 'sap-icon://accept',
                type : sap.m.ButtonType.Emphasized
            });
            this.applyFilterButton.attachPress(() => data.onFilter(this.createFilter()));

            this.createLayout();

            this.container = null;
            if (data.dialog) {
                this.container = new Dialog({
                    title : data.title,
                    content : [this.innerContainer],
                    beginButton : this.applyFilterButton,
                    endButton : new Button({
                        text : this.i18n.getText('cancel', undefined, true) || 'Cancel',
                        type : sap.m.ButtonType.Transparent,
                        press : () => this.container.close()
                    })
                });
            } else {
                this.container = new VBox({
                    renderType : sap.m.FlexRendertype.Bare,
                    items : [this.innerContainer, this.applyFilterButton]
                });
            }
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
                    this.innerContainer.removeItem(this.mainPage);
                    this.innerContainer.addItem(this.subPages[field.path]);
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
    //     path : String,
    //     label : String,
    //     type : sap.m.InputType OR 'Date' OR 'Datetime'
    //     valueBinding : {Object containing binding info, eg : type, formatOption}
    //     registerValueCheck? : Boolean
    //     operators : [array of sap.ui.model.FilterOperator]
    //     onValueHelp ? : Function (the input element is passed as first argument to the given callback function)
    // },
        createSubPages () {
            this.subPages = {};
            for (let field of this.data.fields) {
                //container for multiple row of filter inputs (operator, low, high inputs)
                let container = new VBox({}); //initially empty

                //this is sub page
                this.subPages[field.path] = new VBox({
                    renderType : sap.m.FlexRendertype.Bare,
                    items : [
                        //header
                        new Bar({
                            contentMiddle : [
                                new Button({
                                    icon : 'sap-icon://accept',
                                    press : () => {
                                        //apply filters to multiinput
                                        let mi = this.multiInputs[field.path];
                                        mi.destroyTokens(); mi.removeAllTokens();

                                        let items = container.getItems();
                                        for (let item of items) {
                                            let operator = item.data('operator').getSelectedKey();
                                            let low = item.data('low').getValue();;
                                            let high = item.data('high');
                                            high = high.getEnabled() ? high.getValue() : null;
                                            if (!this.operators[operator])
                                                continue;
                                            let text = low + (high == null ? '' : ',' + high);
                                            let token = new Token({
                                                editable : false, //editable false, because we don't want user to remove this token by cliking on cross button (we let user do it in subpage)
                                                text
                                            });
                                            token.data('operator', operator);
                                            token.data('low', low);
                                            token.data('high', high);
                                            mi.addToken(token);
                                        }

                                        //go back, which means remove this subpage from this.innerContainer, and add mainPage to this.innerContainer
                                        this.innerContainer.removeItem(this.subPages[field.path]);
                                        this.innerContainer.addItem(this.mainPage);
                                    }
                                })
                            ]
                        }),
                        //container of filter rows
                        container,
                        //adds a new row of filter inputs (operator, low, high inputs) to the above container
                        new Button({
                            icon : 'sap-icon://add',
                            press : () => {
                                container.addItem(this.createFilterBar(field, container));
                            }
                        })    
                    ]
                });
            }
        }
    //     path : String,
    //     label : String,
    //     type : sap.m.InputType OR 'Date' OR 'Datetime'
    //     valueBinding : {Object containing binding info, eg : type, formatOption}
    //     registerValueCheck? : Boolean
    //     operators : [array of sap.ui.model.FilterOperator]
    //     onValueHelp ? : Function (the input element is passed as first argument to the given callback function)
    // },
        createFilterBar (fieldData, parent) {
            let selectOperator = new Select({items : fieldData.operators.map((operator) => {
                return new ListItem({
                    key : operator,
                    text : this.i18n.getText(operator)
                })
            })});

            let low = null, high = null;
            if (fieldData.type == 'Date') {
                low = new DatePicker();
                high = new DatePicker({
                    enabled : !!this.operatorHasDouble[selectOperator.getSelectedKey()],
                });
            } else if (fieldData.type == 'Datetime') {
                low = new DateTimePicker();
                high = new DateTimePicker({
                    enabled : !!this.operatorHasDouble[selectOperator.getSelectedKey()],
                });
            } else if (fieldData.type == 'Time') {
                low = new TimePicker();
                high = new TimePicker({
                    enabled : !!this.operatorHasDouble[selectOperator.getSelectedKey()],
                });
            } else {
                low = new Input();
                high = new Input({
                    enabled : !!this.operatorHasDouble[selectOperator.getSelectedKey()],
                });

                if (typeof fieldData.onValueHelp == 'function') {
                    low.setShowValueHelp(true);
                    high.setShowValueHelp(true);
                    low.attachValueHelpRequest(() => fieldData.onValueHelp(low))
                    high.attachValueHelpRequest(() => fieldData.onValueHelp(high));
                }

            }

            if (fieldData.valueBinding) {
                low.bindValue(fieldData.valueBinding);
                high.bindValue(fieldData.valueBinding);
            }

            if (fieldData.registerValueCheck) {
                let om = Core.getMessageManager();
                om.registerObject(low, true);
                om.registerObject(high, true);
            }

            selectOperator.attachChange(() => {
                high.setEnabled(!!this.operatorHasDouble[selectOperator.getSelectedKey()]);
            });

            let deleteButton = new Button({
                icon : 'sap-icon://delete',
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