sap.ui.define(["sap/ui/core/util/MockServer","sap/base/Log","sap/ui/model/odata/v2/ODataModel"],function(e,a,r){"use strict";return{init:function(r){a.info("Creating Mock instance. "+{serviceUrl:r.odata.serviceUrl});var t=new e({rootUri:r.odata.serviceUrl});a.info("Mock Server Simulation Start");t.simulate(`${sap.ui.require.toUrl("ui5pos/szdk/localService")}/metadata.xml`,{sMockdataBaseUrl:sap.ui.require.toUrl("ui5pos/szdk/localService/data"),bGenerateMissingMockData:false,aEntitySetsNames:["Categories","Products","Suppliers","Order_Details"]});a.info("Mock Server Config");e.config({autoRespond:true,autoRespondAfter:r.odata.delay||0});a.info("Mock Server Start");t.start();a.info({started:t.isStarted()});return t}}});
//# sourceMappingURL=MockServer.js.map