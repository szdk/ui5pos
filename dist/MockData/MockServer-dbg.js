sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/Log",
    "sap/ui/model/odata/v2/ODataModel"
], function(MockServer, Log, ODataModel) {
	"use strict";

	return {
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */
		init: function() {
			// create
			var oMockServer = new MockServer({
				rootUri: "/MockData/"
			});

			// simulate against the metadata and mock data
			oMockServer.simulate("MockData/metadata.xml", {
				sMockdataBaseUrl: "MockData/data/",
				bGenerateMissingMockData: true
			});

			// start
			oMockServer.start();

			Log.info("Running the app with mock data");

            let model = new ODataModel({
                "serviceUrl" : "/MockData/"
            });

            return model;
		}

	};

});