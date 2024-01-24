/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/ui/unified/calendar/CalendarDate","./MonthRenderer","sap/ui/core/CalendarType"],function(e,a,t,r){"use strict";var n=e.extend(t);n.apiVersion=2;n.getStartDate=function(e){return e._getStartDate()};n.getClass=function(e,a){var t=["sapUiCalDatesRow","sapUiCalRow"];if(!a.getShowDayNamesLine()){t.push("sapUiCalNoNameLine")}return t};n.addWrapperAdditionalStyles=function(e,a){if(a._iTopPosition){e.style("top",a._iTopPosition+"px")}};n.renderMonth=function(e,a,r){if(a.isRelative&&a.isRelative()){n.renderCustomIntervals(e,a)}else{t.renderMonth.apply(this,arguments);this.renderWeekNumbers(e,a)}};n.renderCustomIntervals=function(e,a){var t;e.openStart("div",a.getId()+"-customintervals");e.openEnd();var r=a.getDays();t=100/r;var n=a._getRelativeInfo()._getIndexFromDate(a.getStartDate());for(var i=0;i<r;i++){e.openStart("div");e.class("sapUiCalItem");if(a._getRelativeInfo&&a._getRelativeInfo().bIsRelative){e.class("sapUiRelativeCalItem");e.attr("data-sap-ui-index",n+i);e.attr("tabindex","-1");var s=a._getRelativeInfo()._getDateFromIndex(n+i+1);e.attr("data-sap-day",a._oFormatYyyymmdd.format(s,true))}e.style("width",t+"%");e.openEnd();e.openStart("span");e.class("sapUiCalItemText");e.openEnd();e.text(a._getRelativeInfo?a._getRelativeInfo().intervalLabelFormatter(n+i):n+i);e.close("span");e.close("div")}e.close("div")};n.renderWeekNumbers=function(e,a){var t,n,i,s;if(a.getShowWeekNumbers()&&a.getPrimaryCalendarType()===r.Gregorian){t=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");e.openStart("div",a.getId()+"-weeks");e.class("sapUiCalRowWeekNumbers");e.openEnd();n=a.getDays();i=100/n;s=a.getWeekNumbers();s.forEach(function(r){e.openStart("div",a.getId()+"-week-"+r.number+"-text");e.class("sapUiCalRowWeekNumber");e.style("width",r.len*i+"%");e.attr("data-sap-ui-week",r.number);e.openEnd();e.text(t.getText("CALENDAR_DATES_ROW_WEEK_NUMBER",[r.number]));e.close("div")});e.close("div")}};n.renderDummyCell=function(){};n.renderHeader=function(e,a,t){var r=a._getLocaleData();var n=a.getId();var i=a.getDays();var s="";if(a._getShowHeader()){e.openStart("div",n+"-Head");e.openEnd();this.renderHeaderLine(e,a,r,t);e.close("div")}s=100/i+"%";if(a.getShowDayNamesLine()){e.openStart("div",n+"-Names");e.style("display","inline");e.attr("role","row");e.openEnd();this.renderDayNames(e,a,r,t.getDay(),i,false,s);e.close("div")}};n.renderHeaderLine=function(e,t,r,n){var i=t.getId();var s=t.getDays();var o=new a(n,t.getPrimaryCalendarType());var d="";var l=0;var v=[];var p=0;for(p=0;p<s;p++){l=o.getMonth();if(v.length>0&&v[v.length-1].iMonth==l){v[v.length-1].iDays++}else{v.push({iMonth:l,iDays:1})}o.setDate(o.getDate()+1)}var g=r.getMonthsStandAlone("wide",t.getPrimaryCalendarType());for(p=0;p<v.length;p++){var u=v[p];d=100/s*u.iDays+"%";e.openStart("div",i+"-Head"+p);e.class("sapUiCalHeadText");e.style("width",d);e.openEnd();e.text(g[u.iMonth]);e.close("div")}};n.renderDays=function(e,t,r){var n=t.getDays();var i=100/n+"%";var s=t.getShowDayNamesLine();var o=t.getPrimaryCalendarType();if(!r){r=t._getFocusedDate()}var d=this.getDayHelper(t,r);if(!s){if(t._bLongWeekDays||!t._bNamesLengthChecked){d.aWeekDays=d.oLocaleData.getDaysStandAlone("abbreviated",o)}else{d.aWeekDays=d.oLocaleData.getDaysStandAlone("narrow",o)}d.aWeekDaysWide=d.oLocaleData.getDaysStandAlone("wide",o)}var l=new a(r,o);e.openStart("div");e.attr("role","row");e.openEnd();for(var v=0;v<n;v++){this.renderDay(e,t,l,d,false,false,v,i,!s);l.setDate(l.getDate()+1)}e.close("div")};return n},true);
//# sourceMappingURL=DatesRowRenderer.js.map