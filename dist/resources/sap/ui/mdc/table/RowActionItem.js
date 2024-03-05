/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/core/IconPool","sap/ui/core/Core","sap/ui/mdc/enums/TableRowAction"],function(t,e,i,n){"use strict";const o=t.extend("sap.ui.mdc.table.RowActionItem",{metadata:{library:"sap.ui.mdc",properties:{type:{type:"sap.ui.mdc.enums.TableRowAction"},text:{type:"string"},icon:{type:"sap.ui.core.URI"},visible:{type:"boolean",defaultValue:true}},events:{press:{parameters:{bindingContext:{type:"sap.ui.model.Context"}}}}}});const s={navigationIcon:"navigation-right-arrow"};o.prototype._getText=function(){let t;if(this.getText()){t=this.getText()}else{const e=i.getLibraryResourceBundle("sap.ui.mdc");if(this.getType()===n.Navigation){t=e.getText("table.ROW_ACTION_ITEM_NAVIGATE")}}return t};o.prototype._getIcon=function(){let t;if(this.getIcon()){t=this.getIcon()}else if(this.getType()===n.Navigation){t=e.getIconURI(s["navigationIcon"])}return t};o.prototype._onPress=function(t){this.firePress({bindingContext:t.bindingContext})};return o});
//# sourceMappingURL=RowActionItem.js.map