/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/DelegateMediator"],function(e){"use strict";var t={types:{READONLY:e.types.READONLY,WRITEONLY:e.types.WRITEONLY,COMPLETE:e.types.COMPLETE},registerDefaultDelegate(t){e.registerDefaultDelegate(t)},getDelegateForControl(t){return e.getDelegateForControl(t.control,t.modifier,t.modelType,t.supportsDefault)},getKnownDefaultDelegateLibraries(){return e.getKnownDefaultDelegateLibraries()},getRequiredLibrariesForDefaultDelegate(t){return e.getRequiredLibrariesForDefaultDelegate(t.delegateName,t.control,t.modelType)}};return t});
//# sourceMappingURL=DelegateMediatorAPI.js.map