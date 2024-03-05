/*
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function () {
    "use strict";
    /**
     * Enumeration of the propagation reason in the condition propagation callback of the {@link sap.ui.mdc.ValueHelp ValueHelp}
     *
     * @enum {string}
     * @public
     * @since 1.115
     * @alias sap.ui.mdc.enums.ValueHelpPropagationReason
     */
    const ValueHelpPropagationReason = {
        /**
         * Triggered by connected control after processing valuehelp output
         *
         * @public
         */
         ControlChange: "ControlChange",
        /**
         * Triggered by <code>ValueHelp</code> itself on selection
         *
         * @public
         */
         Select: "Select",
        /**
         * Triggered by <code>ValueHelp</code> itself on <code>getItemForValue</code>
         *
         * @public
         */
         Info: "Info"
    };

    return ValueHelpPropagationReason;
}, /* bExport= */ true);