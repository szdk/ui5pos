sap.ui.define([
    "sap/ui/core/ComponentContainer"
], function(ComponentContainer) {
    "use strict";

    //create component instance and render it inside body#content html tag
    //alternatively Declarative API for Initial Components can be used (this is default in fiori basic app template)
    // more information about Declarative API for Initial Components can be found in api docs
    new ComponentContainer({
		name: "ui5pos.szdk",
		settings : {
			id : "ui5pos-component" //this id can be used to identify and get instance of this component
		},
		async: true
	}).placeAt("content");
});