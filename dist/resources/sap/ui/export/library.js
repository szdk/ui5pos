/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/core/library"],function(e){"use strict";var i=sap.ui.getCore().initLibrary({name:"sap.ui.export",dependencies:["sap.ui.core"],types:["sap.ui.export.EdmType","sap.ui.export.FileType"],interfaces:[],controls:[],elements:[],version:"1.120.3"});i.EdmType={BigNumber:"BigNumber",Boolean:"Boolean",Currency:"Currency",Date:"Date",DateTime:"DateTime",Enumeration:"Enumeration",Number:"Number",Percentage:"Percentage",String:"String",Time:"Time",Timezone:"Timezone"};i.FileType={CSV:"CSV",GSHEET:"GSHEET",PDF:"PDF",XLSX:"XLSX"};i.Destination={LOCAL:"LOCAL",REMOTE:"REMOTE"};sap.ui.loader.config({shim:{"sap/ui/export/js/XLSXBuilder":{amd:true,exports:"XLSXBuilder"},"sap/ui/export/js/XLSXExportUtils":{amd:true,exports:"XLSXExportUtils"}}});return i});
//# sourceMappingURL=library.js.map