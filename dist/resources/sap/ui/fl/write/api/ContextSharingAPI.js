/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/variants/context/Component","sap/ui/fl/write/api/ContextBasedAdaptationsAPI","sap/ui/core/ComponentContainer","sap/ui/fl/Layer","sap/ui/fl/registry/Settings"],function(e,t,n,r,a,o){"use strict";var i;var s={createComponent(s){if(s.layer!==a.CUSTOMER){return Promise.resolve()}var u=e.getFlexReferenceForControl(s.variantManagementControl);return o.getInstance().then(function(e){return e.isContextSharingEnabled()&&!n.adaptationExists({reference:u,layer:a.CUSTOMER})}).then(function(e){if(e){if(!i||i.bIsDestroyed){var n=new t("contextSharing");n.showMessageStrip(true);n.setSelectedContexts({role:[]});i=new r("contextSharingContainer",{component:n});return n.getRootControl().oAsyncState.promise.then(function(){return i})}return i}})}};return s});
//# sourceMappingURL=ContextSharingAPI.js.map