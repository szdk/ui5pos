/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */

sap.ui.define([
	'sap/ui/thirdparty/jquery', './Factory'
], function(jQuery, Factory) {
	"use strict";

	/**
	 * @namespace FakeFlpConnector.
	 * @name sap.ui.comp.navpopover.FakeFlpConnector
	 * @author SAP SE
	 * @version 1.120.3
	 * @private
	 * @since 1.58.0
	 */
	function FakeFlpConnector() {
	}

	function getCrossApplicationNavigation(oSetting) {
		return {
			hrefForExternal: function(oTarget) {
				if (!oTarget || !oTarget.target || !oTarget.target.shellHash) {
					return null;
				}
				return oTarget.target.shellHash;
			},
			hrefForExternalAsync: function(oTarget) {
				if (!oTarget || !oTarget.target || !oTarget.target.shellHash) {
					return Promise.resolve(null);
				}
				return Promise.resolve(oTarget.target.shellHash);
			},
			getDistinctSemanticObjects: function() {
				var aSemanticObjects = [];
				for ( var sSemanticObject in oSetting) {
					aSemanticObjects.push(sSemanticObject);
				}
				var oDeferred = jQuery.Deferred();
				setTimeout(function() {
					oDeferred.resolve(aSemanticObjects);
				}, 0);
				return oDeferred.promise();
			},
			getLinks: function(aParams) {
				var aLinks = [];
				if (!Array.isArray(aParams)) {
					if (oSetting[aParams.semanticObject]) {
						aLinks = oSetting[aParams.semanticObject].links;
					} else {
						aLinks = [];
					}
				} else {
					aParams.forEach(function(aParams_) {
						if (oSetting[aParams_[0].semanticObject]) {
							aLinks.push([
								oSetting[aParams_[0].semanticObject].links
							]);
						} else {
							aLinks.push([ [] ]);
						}
					});
				}
				var oDeferred = jQuery.Deferred();
				setTimeout(function() {
					oDeferred.resolve(aLinks);
				}, 0);
				return oDeferred.promise();
			}
		};
	}

	function getURLParsing(oSetting) {
		return {
			parseShellHash: function(sIntent) {
				var fnFindAction = function(aLinks) {
					var aLink = aLinks.filter(function(oLink) {
						return oLink.intent === sIntent;
					});
					return aLink[0];
				};
				for ( var sSemanticObject in oSetting) {
					var oLink = fnFindAction(oSetting[sSemanticObject].links);
					if (oLink) {
						return {
							semanticObject: sSemanticObject,
							action: oLink.action
						};
					}
				}
				return {
					semanticObject: null,
					action: null
				};
			}
		};
	}

	FakeFlpConnector.enableFakeConnector = function(oSetting) {
		if (FakeFlpConnector.getServiceReal) {
			return;
		}
		FakeFlpConnector.getServiceReal = Factory.getService;
		Factory.getService = FakeFlpConnector._createFakeService(oSetting);
	};

	FakeFlpConnector._createFakeService = function(oSetting) {
		return function(sServiceName, bAsync) {
			switch (sServiceName) {
				case "CrossApplicationNavigation":
					return bAsync ? Promise.resolve(getCrossApplicationNavigation(oSetting)) : getCrossApplicationNavigation(oSetting);
				case "URLParsing":
					return bAsync ? Promise.resolve(getURLParsing(oSetting)) : getURLParsing(oSetting);
				default:
					return FakeFlpConnector.getServiceReal(sServiceName, bAsync);
			}
		};
	};

	FakeFlpConnector.disableFakeConnector = function() {
		if (FakeFlpConnector.getServiceReal) {
			Factory.getService = FakeFlpConnector.getServiceReal;
			FakeFlpConnector.getServiceReal = undefined;
		}
	};

	return FakeFlpConnector;

}, true);
