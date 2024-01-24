/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/base/Object"],function(e){"use strict";const t={ArchiveFormat:false,Border:false,CoverPage:false,DocumentDescriptionCollection:"",DocumentDescriptionReference:"",FitToPage:false,FontName:false,FontSize:false,HeaderFooter:false,IANATimezoneFormat:false,Margin:false,Padding:false,ResultSizeDefault:2e4,ResultSizeMaximum:2e4,Signature:false,Treeview:false};var i=e.extend("sap.ui.export.util.PDFCapabilities",{constructor:function(e){e=e||{};for(const[i,o]of Object.entries(t)){this[i]=typeof e[i]===typeof o?e[i]:o}if(window.location.search.includes("sap-ui-xx-pdf-tree")){this.Treeview=true}}});i.prototype.isValid=function(){return this["DocumentDescriptionReference"]&&this["DocumentDescriptionCollection"]&&this["ResultSizeMaximum"]>0};return i});
//# sourceMappingURL=PDFCapabilities.js.map