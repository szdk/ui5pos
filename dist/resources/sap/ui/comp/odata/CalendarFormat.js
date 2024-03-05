/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/odata/PeriodDateFormat"],function(e){"use strict";var a=e.extend("sap.ui.comp.odata.CalendarFormat",{metadata:{library:"sap.ui.comp"},constructor:function(a,t){e.apply(this,arguments)}});a.getDateInstance=function(e){return new a(null,e)};a.prototype.getName=function(){return"sap.ui.comp.odata.CalendarFormat"};a.oRegexFormatPatterns={year:/[1-9][0-9]{3}/,period:/[0-9]{3}/,quarter:/[1-4]/,week:/0[1-9]|[1-4][0-9]|5[0-3]/,day:/366|3[0-6][0-9]|[1-2][0-9][0-9]|[1-9][0-9]|[1-9]/,month:/0[1-9]|1[0-2]/};a.oRegexParsePatterns={year:/[0-9]{1,4}/,period:/[0-9]{1,3}/,quarter:/[1-4]/,week:/[0-9]{1,2}/,day:/[1-9]/,month:/[0-9]{1,2}/};a.prototype.oSymbols={"":"",y:{format:a.oRegexFormatPatterns.year,parse:a.oRegexParsePatterns.year},Y:{format:a.oRegexFormatPatterns.year,parse:a.oRegexParsePatterns.year},M:{format:a.oRegexFormatPatterns.month,parse:a.oRegexParsePatterns.month},L:{format:a.oRegexFormatPatterns.month,parse:a.oRegexParsePatterns.month},Q:{format:a.oRegexFormatPatterns.quarter,parse:a.oRegexParsePatterns.quarter},W:{format:a.oRegexFormatPatterns.week,parse:a.oRegexParsePatterns.week},D:{format:a.oRegexFormatPatterns.day,parse:a.oRegexParsePatterns.day},d:{format:a.oRegexFormatPatterns.day,parse:a.oRegexParsePatterns.day}};return a});
//# sourceMappingURL=CalendarFormat.js.map