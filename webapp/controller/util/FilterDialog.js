sap.ui.define([
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/ui/layout/form/Form",
    "sap/ui/layout/form/FormContainer",
    "sap/ui/layout/form/FormElement",
    "sap/ui/layout/form/FormLayout",
    "sap/ui/layout/form/ResponsiveGridLayout",
    "sap/m/MultiInput",
    "sap/m/Token",
    "sap/m/Bar"
],
function (
    Dialog,
    VBox,
    Form,
    FormContainer,
    FormElement,
    FormLayout,
    ResponsiveGridLayout,
    MultiInput,
    Token,
    Bar,
) {
    "use strict";
    return class {
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
                    type : sap.m.InputType OR 'Date' OR 'Datetime'
                    valueBinding : {Object containing binding info, eg : type, formatOption}
                    registerValueCheck? : Boolean
                    options : [array of sap.ui.model.FilterOperator]
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
                text : this.i18n.getText('apply_filter', undefined, 'Apply Filter'),
                icon : 'sap-icon://accept',
                type : sap.m.ButtonType.Emphasized
            });
            this.applyFilterButton.attachPress(() => data.onFilter(this.createFilter()));

            this.createLayout();

            this.container = null;
            if (data.dialog) {
                this.container = new Dialog({
                    title : data.title,
                    content : this.innerContainer,
                    beginButton : this.applyFilterButton,
                    endButton : new Button({
                        text : this.i18n.getText('cancel', undefined, 'Cancel'),
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
        }
    //     path : String,
    //     label : String,
    //     type : sap.m.InputType OR 'Date' OR 'Datetime'
    //     valueBinding : {Object containing binding info, eg : type, formatOption}
    //     registerValueCheck? : Boolean
    //     options : [array of sap.ui.model.FilterOperator]
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
                                            let operator = item.data('operator');
                                            let token = new Token({
                                                editable : false, //editable false, because we don't want user to remove this token by cliking on cross button (we let user do it in subpage)
                                                text : todo//TODO
                                            });
                                            //TODO
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

        createFilterBar (fieldData, parent) {
            //TODO
        }
        
    };
});