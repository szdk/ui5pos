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
		init: function(settings) {
			// create
			Log.info("Creating Mock instance. " + {serviceUrl:settings.odata.serviceUrl});
			var mockServer = new MockServer({
				rootUri: settings.odata.serviceUrl
			});

			// simulate against the metadata and mock data
			Log.info("Mock Server Simulation Start");
			mockServer.simulate(`${sap.ui.require.toUrl("ui5pos/szdk/localService")}/metadata.xml`, {
				sMockdataBaseUrl: sap.ui.require.toUrl("ui5pos/szdk/localService/data"),
				bGenerateMissingMockData: false,
				aEntitySetsNames: [
					"Categories",
					"Products",
					"Suppliers",
					"Order_Details",
					"Orders",
					"Customers"
				]
			});

			// response delay config
			Log.info("Mock Server Config");
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: settings.odata.delay || 0
			});

			// start
			Log.info("Mock Server Start");
			mockServer.start();

			Log.info({started:mockServer.isStarted()});

            return mockServer;
		}

	};

});