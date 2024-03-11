sap.ui.define(["sap/ui/core/util/MockServer","sap/base/Log","sap/ui/model/odata/v2/ODataModel"],function(e,r,a){"use strict";return{init:function(a){r.info("Creating Mock instance. "+{serviceUrl:a.odata.serviceUrl});var t=new e({rootUri:a.odata.serviceUrl});r.info("Mock Server Simulation Start");t.simulate(`${sap.ui.require.toUrl("ui5pos/szdk/localService")}/metadata.xml`,{sMockdataBaseUrl:sap.ui.require.toUrl("ui5pos/szdk/localService/data"),bGenerateMissingMockData:false,aEntitySetsNames:["Categories","Products","Suppliers","Order_Details","Orders","Customers"]});r.info("Mock Server Config");e.config({autoRespond:true,autoRespondAfter:a.odata.delay||0});r.info("Mock Server Start");t.start();r.info({started:t.isStarted()});return t}}});
//# sourceMappingURL=MockServer.js.map