/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/EventBus"],function(n){"use strict";var e=function(){};e._aEventIds=["ControlForPersonalizationRendered"];e._aUnsubscribedEventIds=[];e._oHistory={};e.start=function(){e._aEventIds.forEach(function(s){if(e._aUnsubscribedEventIds.indexOf(s)===-1){n.getInstance().subscribe("sap.ui",s,e.saveEvent);e._oHistory[s]=[]}})};e.saveEvent=function(n,s,t){var r={channelId:n,eventId:s,parameters:t.getId()};if(e._oHistory[s]){var i=e._oHistory[s].some(function(n){return n.channelId===r.channelId&&n.eventId===r.eventId&&n.parameters===r.parameters});if(!i){e._oHistory[s].push(r)}}};e.getHistoryAndStop=function(s){n.getInstance().unsubscribe("sap.ui",s,e.saveEvent);e._addUnsubscribedEvent(s);return e._oHistory[s]||[]};e._addUnsubscribedEvent=function(n){if(e._aUnsubscribedEventIds.indexOf(n)===-1){e._aUnsubscribedEventIds.push(n)}};return e});
//# sourceMappingURL=EventHistory.js.map