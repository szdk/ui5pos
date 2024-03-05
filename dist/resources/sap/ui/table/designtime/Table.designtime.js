/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/table/rowmodes/Type"],function(e){"use strict";return{domRef:function(o){var t=o.getRowMode();var r=false;if(!t){r=o.getVisibleRowCountMode()==="Auto"}if(t){r=t===e.Auto||t.isA("sap.ui.table.rowmodes.Auto")}if(r){return o.$("sapUiTableCnt").get(0)}return o.getDomRef()},aggregations:{columns:{domRef:".sapUiTableCHA"},rows:{ignore:true},hScroll:{ignore:false,domRef:function(e){return e.$("hsb").get(0)}},scrollContainers:[{domRef:function(e){return e.$("sapUiTableCnt").get(0)},aggregations:["rows"]}]}}});
//# sourceMappingURL=Table.designtime.js.map