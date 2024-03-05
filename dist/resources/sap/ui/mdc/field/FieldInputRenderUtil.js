/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/InvisibleText"],function(t){"use strict";const e={getAriaRole:function(t,e){const i=t.getAriaAttributes();if(i.role){return i.role}else{return e.getAriaRole.apply(this,arguments)}},getAccessibilityState:function(e,i){const r=e.getAriaAttributes();const s=i.getAccessibilityState.apply(this,arguments);if(r.aria){for(const t in r.aria){s[t]=r.aria[t]}}if(!r.valueHelpEnabled&&s.describedby){const e=t.getStaticId("sap.m","INPUT_VALUEHELP");const i=s.describedby.value.split(" ");let r="";for(let t=0;t<i.length;t++){const s=i[t];if(s!==e){r=r?r+" "+s:s}}if(r){s.describedby.value=r}else{delete s.describedby}}return s},writeInnerAttributes:function(t,e,i){i.writeInnerAttributes.apply(this,arguments);const r=e.getAriaAttributes();for(const e in r){if(e!=="aria"&&e!=="role"&&e!=="valueHelpEnabled"){t.attr(e,r[e])}}}};return e});
//# sourceMappingURL=FieldInputRenderUtil.js.map