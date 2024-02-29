sap.ui.define([
    ],
    function () {
        "use strict";
        const defaultPatternMatched = function (evt) {
            let routeName = evt.getParameter('name');

            //service not set yet, redirect to setup page
            if (!this.comp.getModel('service')) {
                this.comp.getRouter().navTo('setup');
                return false;
            }

            //show nav item list
            this.getView().getModel('nav').setProperty('/sideNav/visible', true);

            //select relevent nav item with the help of navModel
            this.getView().getModel('nav').setProperty('/sideNav/selectedKey', `nav_item_route_${routeName}`);
            return true;
        };
        return {
            defaultPatternMatched : defaultPatternMatched,
            routes: {
                "":["home", "products", "create_product", "view_product"],
                "home" : {
                    patternMatched : defaultPatternMatched
                },
                "products" : {
                    patternMatched : defaultPatternMatched
                },
                "create_product" : {
                    patternMatched : defaultPatternMatched
                },
                "view_product" : {}, // patternmatched is defined in its view controller
                "setup" : {
                    patternMatched : function (evt) {
                        //service already set, move to home page
                        if (this.comp.getModel('service')) {
                            this.goBack();
                        }
                        // hide side nav items
                        this.getView().getModel('nav').setProperty('/sideNav/visible', false);
                    }
                }
            },
            
        }
    }
);