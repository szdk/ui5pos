/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/core/Control","sap/m/List","sap/m/ActionListItem"],function(t,e,i){"use strict";var o=t.extend("sap.viz.ui5.controls.chartpopover.SubActionItemsPage",{metadata:{library:"sap.viz",properties:{items:{type:"object[]"}}},renderer:{apiVersion:2,render:function(t,e){t.openStart("div").class("viz-controls-chartPopover-subActionItemsPage").openEnd().renderControl(e._oList).close("div")}}});o.prototype.init=function(){this._oList=new e({})};o.prototype.onAfterRendering=function(){setTimeout(function(){this._oList&&this._oList.focus()}.bind(this),10)};o.prototype.exit=function(){if(this._oList){this._oList.destroy();this._oList=null}};o.prototype.setItems=function(t){this._oList.destroyItems();if(Array.isArray(t)){var e;for(var o=0;o<t.length;o++){e=new i({text:t[o].text,press:t[o].press?t[o].press:function(){},tooltip:t[o].text});this._oList.addItem(e)}}this.setProperty("items",t);return this};o.prototype._createId=function(t){return this.getId()+"-"+t};return o});
//# sourceMappingURL=SubActionItemsPage.js.map