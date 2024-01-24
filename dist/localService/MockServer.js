sap.ui.define(["sap/ui/core/util/MockServer","sap/base/Log","sap/ui/model/odata/v2/ODataModel"],function(e,a,t){"use strict";return{init:function(t){a.info("Creating Mock instance. "+{serviceUrl:t.odata.serviceUrl});var r=new e({rootUri:t.odata.serviceUrl});a.info("Mock Server Simulation Start");r.simulate(`${sap.ui.require.toUrl("ui5pos/szdk/localService")}/metadata.xml`,{sMockdataBaseUrl:sap.ui.require.toUrl("ui5pos/szdk/localService/data"),bGenerateMissingMockData:false,aEntitySetsNames:["Categories","Products"]});a.info("Mock Server Config");e.config({autoRespond:true,autoRespondAfter:t.odata.delay||0});a.info("Mock Server Start");r.start();a.info({started:r.isStarted()});return r}}});
//# sourceMappingURL=MockServer.js.map