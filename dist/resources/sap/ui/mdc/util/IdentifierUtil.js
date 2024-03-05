/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/DataType"],function(e){"use strict";const t={replace:function(t){const i=e.getType("sap.ui.core.ID");if(!i.isValid(t)){t=t.replace(/[^A-Za-z0-9_.:]+/g,"__mdc__");if(!i.isValid(t)){t="__mdc__"+t}}return t},getFilterFieldId:function(e,i){return e.getId()+"--filter--"+t.replace(i)},getPropertyKey:function(e){return e.name},getPropertyPath:function(e){return e.path},getView:function(e){let t=null;if(e){let i=e.getParent();while(i){if(i.isA("sap.ui.core.mvc.View")){t=i;break}i=i.getParent()}}return t}};return t});
//# sourceMappingURL=IdentifierUtil.js.map