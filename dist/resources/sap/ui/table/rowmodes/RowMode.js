/*
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../utils/TableUtils","sap/ui/core/Element","sap/ui/thirdparty/jquery","sap/ui/Device"],function(e,t,jQuery,o){"use strict";var r=e.createWeakMapFacade();var a=t.extend("sap.ui.table.rowmodes.RowMode",{metadata:{library:"sap.ui.table",abstract:true}});var n={};a.prototype.init=function(){this._bFiredRowsUpdatedAfterRendering=false;r(this).bListeningForFirstRowsUpdatedAfterRendering=false;r(this).bNoDataDisabled=false;r(this).updateTableAsync=e.throttle(this.updateTable.bind(this),50,{asyncLeading:true})};a.prototype.exit=function(){this.detachEvents();this.cancelAsyncOperations();this.deregisterHooks()};a.prototype.setParent=function(){this.detachEvents();this.cancelAsyncOperations();this.deregisterHooks();t.prototype.setParent.apply(this,arguments);this.attachEvents();this.registerHooks()};a.prototype.attachEvents=function(){e.addDelegate(this.getTable(),n,this)};a.prototype.detachEvents=function(){e.removeDelegate(this.getTable(),n)};a.prototype.cancelAsyncOperations=function(){var e=this.getTable();if(e){clearTimeout(e._mTimeouts.refreshRowsCreateRows)}r(this).updateTableAsync.cancel()};a.prototype.registerHooks=function(){var t=this.getTable();var o=e.Hook.Keys;e.Hook.register(t,o.Table.RowsUnbound,this._onTableRowsUnbound,this);e.Hook.register(t,o.Table.UpdateRows,this._onTableUpdateRows,this);e.Hook.register(t,o.TableRenderer.RenderTableStyles,this.applyTableStyles,this);e.Hook.register(t,o.TableRenderer.RenderInTableBottomArea,this.renderInTableBottomArea,this);e.Hook.register(t,o.TableRenderer.RenderRowContainerStyles,this.applyRowContainerStyles,this);e.Hook.register(t,o.TableRenderer.RenderRowStyles,this.renderRowStyles,this);e.Hook.register(t,o.TableRenderer.RenderCellContentStyles,this.renderCellContentStyles,this)};a.prototype.deregisterHooks=function(){var t=this.getTable();var o=e.Hook.Keys;e.Hook.deregister(t,o.Table.RowsUnbound,this._onTableRowsUnbound,this);e.Hook.deregister(t,o.Table.UpdateRows,this._onTableUpdateRows,this);e.Hook.deregister(t,o.TableRenderer.RenderTableStyles,this.applyTableStyles,this);e.Hook.deregister(t,o.TableRenderer.RenderInTableBottomArea,this.renderInTableBottomArea,this);e.Hook.deregister(t,o.TableRenderer.RenderRowContainerStyles,this.applyRowContainerStyles,this);e.Hook.deregister(t,o.TableRenderer.RenderRowStyles,this.renderRowStyles,this);e.Hook.deregister(t,o.TableRenderer.RenderCellContentStyles,this.renderCellContentStyles,this)};a.prototype.getMinRequestLength=function(){h(this,"getMinRequestLength")};a.prototype.getComputedRowCounts=function(){h(this,"getComputedRowCounts")};a.prototype.getTableStyles=function(){h(this,"getTableStyles")};a.prototype.getTableBottomPlaceholderStyles=function(){return undefined};a.prototype.getRowContainerStyles=function(){h(this,"getRowContainerStyles")};a.prototype.getTable=function(){var t=this.getParent();return e.isA(t,"sap.ui.table.Table")?t:null};a.prototype.updateTable=function(e){var t=this.getTable();if(!t){return}r(this).updateTableAsync.cancel();t._adjustFirstVisibleRowToTotalRowCount();var o=this.updateTableRows();if(t._bInvalid){return}this.applyTableStyles();this.applyRowContainerStyles();this.applyTableBottomPlaceholderStyles();if(o||t.getRows().some(function(e){return e.getDomRef()==null})){this.renderTableRows()}if(o||t.getRows().length>0){this.fireRowsUpdated(e)}};a.prototype.getBaseRowContentHeight=function(){return 0};a.prototype.getBaseRowHeightOfTable=function(){var e=this.getTable();return e?e._getBaseRowHeight():0};a.prototype.getDefaultRowContentHeightOfTable=function(){var e=this.getTable();return e?e._getDefaultRowContentHeight():0};a.prototype.getTotalRowCountOfTable=function(){var e=this.getTable();return e?e._getTotalRowCount():0};a.prototype._onTableRowsUnbound=function(){clearTimeout(this.getTable()._mTimeouts.refreshRowsCreateRows);this.updateTable(e.RowsUpdateReason.Unbind)};a.prototype._onTableUpdateRows=function(e){var t=this.getTable();clearTimeout(t._mTimeouts.refreshRowsCreateRows);r(this).updateTableAsync(e)};a.prototype.applyTableStyles=function(e){var t=this.getTableStyles();if(e){e.style("height",t.height);e.style("min-height",t.minHeight);e.style("max-height",t.maxHeight);return}var o=this.getTable();var r=o?o.getDomRef():null;if(r){r.style.height=t.height;r.style.minHeight=t.minHeight;r.style.maxHeight=t.maxHeight}};a.prototype.applyTableBottomPlaceholderStyles=function(e){var t=this.getTableBottomPlaceholderStyles();if(e){e.style("height",t.height);return}var o=this.getTable();var r=o?o.getDomRef("placeholder-bottom"):null;if(r){r.style.height=t.height}};a.prototype.applyRowContainerStyles=function(e){var t=this.getRowContainerStyles();if(e){e.style("height",t.height);e.style("min-height",t.minHeight);e.style("max-height",t.maxHeight);return}var o=this.getTable();var r=o?o.getDomRef("tableCCnt"):null;if(r){r.style.height=t.height;r.style.minHeight=t.minHeight;r.style.maxHeight=t.maxHeight}};a.prototype.computeStandardizedRowCounts=function(e,t,o){var r=this.getRowCountConstraints();if(r.fixedTop===true){t=1}else if(r.fixedTop===false){t=0}if(r.fixedBottom===true){o=1}else if(r.fixedBottom===false){o=0}e=Math.max(0,e);t=Math.max(0,t);o=Math.max(0,o);if(t+o>=e){o=Math.max(o>0?1:0,o-Math.max(0,t+o-(e-1)));t=Math.max(t>0?1:0,t-Math.max(0,t+o-(e-1)))}if(t+o>=e){o=0}if(t+o>=e){t=0}return{count:e,scrollable:e-t-o,fixedTop:t,fixedBottom:o}};a.prototype.getRowCountConstraints=function(){var e=this.getTable();return e?e.getProperty("rowCountConstraints")||{}:{}};a.prototype.renderRowStyles=function(e){};a.prototype.renderCellContentStyles=function(e){};a.prototype.renderInTableBottomArea=function(e){var t=this.getTableBottomPlaceholderStyles();if(t===undefined){return}e.openStart("div",this.getTable().getId()+"-placeholder-bottom");e.class("sapUiTablePlaceholder");this.applyTableBottomPlaceholderStyles(e);e.openEnd();e.close("div")};a.prototype.initTableRowsAfterDataRequested=function(e){var t=this.getTable();var o=t.getBinding();clearTimeout(t._mTimeouts.refreshRowsCreateRows);if(!o||e<=0||t.getRows().length>0){return}o.attachEventOnce("dataRequested",function(){clearTimeout(t._mTimeouts.refreshRowsCreateRows);t._mTimeouts.refreshRowsCreateRows=setTimeout(function(){if(t.getRows().length>0){return}var o=s(t,e),r;for(var a=0;a<o.length;a++){r=o[a];r.setRowBindingContext(null,t);t.addAggregation("rows",r,true)}t._bRowAggregationInvalid=false},0)})};a.prototype.updateTableRows=function(){var t=this.getTable();var o=t.getRows();var r=this.getComputedRowCounts().count;var a=false;if(e.isNoDataVisible(t)&&!t.getBinding()){r=0}else if(e.isVariableRowHeightEnabled(t)&&r>0){r++}var n=t.getDomRef("tableCCnt");var s=window.getSelection();if(n&&s.containsNode(n,true)){s.empty()}if(t._bRowAggregationInvalid){a=o.length>0;t.destroyAggregation("rows",t._bInvalid?"KeepDom":true);o=[]}if(r===o.length){l(this,o);return a}e.dynamicCall(t._getSyncExtension,function(e){e.syncRowCount(r)});i(this,r);a=true;t._bRowAggregationInvalid=false;return a};a.prototype.renderTableRows=function(){var e=this.getTable();var t=e?e.getDomRef("tableCCnt"):null;if(!t){return}var r=jQuery.Event("BeforeRendering");r.setMarked("renderRows");r.srcControl=e;e._handleEvent(r);var a=sap.ui.getCore().createRenderManager();var n=e.getRenderer();n.renderTableCCnt(a,e);a.flush(t,false,false);a.destroy();var i=jQuery.Event("AfterRendering");i.setMarked("renderRows");i.srcControl=e;e._handleEvent(i);var s=e.getRows().length>0;var l=e.getDomRef();l.querySelector(".sapUiTableCtrlBefore").setAttribute("tabindex",s?"0":"-1");l.querySelector(".sapUiTableCtrlAfter").setAttribute("tabindex",s?"0":"-1");if(o.browser.safari){var h=document.getElementById(e.getId()+"-header");var d=document.getElementById(e.getId()+"-table");d.style.width=h.style.width}};a.prototype.getRowContexts=function(e){var t=this.getTable();return t?t._getRowContexts(e):[]};a.prototype.fireRowsUpdated=function(t){var o=this.getTable();if(!o||!o._bContextsAvailable){return}if(!this._bFiredRowsUpdatedAfterRendering){t=e.RowsUpdateReason.Render;if(!r(this).bListeningForFirstRowsUpdatedAfterRendering){r(this).bListeningForFirstRowsUpdatedAfterRendering=true;o.attachEvent("_rowsUpdated",function(){this._bFiredRowsUpdatedAfterRendering=true;r(this).bListeningForFirstRowsUpdatedAfterRendering=false}.bind(this))}}o._fireRowsUpdated(t)};a.prototype.disableNoData=function(){if(this.isNoDataDisabled()){return}r(this).bNoDataDisabled=true;var e=this.getTable();if(e){e.invalidate()}};a.prototype.enableNoData=function(){if(!this.isNoDataDisabled()){return}r(this).bNoDataDisabled=false;var e=this.getTable();if(e){e.invalidate()}};a.prototype.isNoDataDisabled=function(){return r(this).bNoDataDisabled};function i(e,t){var o=e.getTable();var r=o.getRows();if(r.length<t){var a=s(o,t-r.length);r=r.concat(a);l(e,r);a.forEach(function(e){o.addAggregation("rows",e,true)})}else{for(var n=r.length-1;n>=t;n--){o.removeAggregation("rows",n,true)}r.splice(t);l(e,r)}}function s(e,t){var o=[];var r=e.getRows().length;for(var a=0;a<t;a++){o.push(e._getRowClone(r+a))}return o}function l(e,t){var o=e.getTable();if(!o||t.length===0){return}var r=e.getRowContexts(t.length);for(var a=0;a<t.length;a++){t[a].setRowBindingContext(r[a],o)}}function h(e,t){throw new Error(e+": sap.ui.table.rowmodes.RowMode subclass does not implement #"+t)}n.onBeforeRendering=function(t){var o=t&&t.isMarked("renderRows");if(!o){this._bFiredRowsUpdatedAfterRendering=false;this.updateTable(e.RowsUpdateReason.Render)}};return a});
//# sourceMappingURL=RowMode.js.map