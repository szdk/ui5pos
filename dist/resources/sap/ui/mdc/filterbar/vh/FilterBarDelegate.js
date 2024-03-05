/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/FilterBarDelegate","sap/ui/core/Core"],function(e,r){"use strict";const t=r.getLibraryResourceBundle("sap.ui.mdc");const i=Object.assign({},e);i.fetchProperties=function(e){return Promise.resolve([{name:"$search",label:t.getText("filterbar.SEARCH"),dataType:"sap.ui.model.type.String"}])};return i});
//# sourceMappingURL=FilterBarDelegate.js.map