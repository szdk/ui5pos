/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/base/DataType"], function(DataType) {
    "use strict";

    /**
     *
     * Defines the actions that can be used in the table.
     *
     * @enum {string}
     * @alias sap.ui.mdc.enums.TableRowAction
     * @since 1.115
     * @public
     */
    const TableRowAction = {
        /**
         * Navigation arrow (chevron) is shown in the table rows/items.
         *
         * @public
         */
        Navigation: "Navigation"
    };

    DataType.registerEnum("sap.ui.mdc.enums.TableRowAction", TableRowAction);

    return TableRowAction;

}, /* bExport= */ true);