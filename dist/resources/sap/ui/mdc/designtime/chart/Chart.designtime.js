/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/p13n/Engine","sap/ui/mdc/Chart","../Util"],function(e,n,t){"use strict";const i={actions:{settings:function(){return{handler:function(n,t){const i=n.getP13nMode();const r=i.indexOf("Type");if(r>-1){i.splice(r,1)}if(n.isPropertyHelperFinal()){return e.getInstance().getRTASettingsActionHandler(n,t,i)}else{return n.finalizePropertyHelper().then(function(){return e.getInstance().getRTASettingsActionHandler(n,t,i)})}}}}},aggregations:{_toolbar:{propagateMetadata:function(e){return null}}}};const r=["_toolbar"],a=["headerLevel","headerVisible"];return t.getDesignTime(n,a,r,i)});
//# sourceMappingURL=Chart.designtime.js.map