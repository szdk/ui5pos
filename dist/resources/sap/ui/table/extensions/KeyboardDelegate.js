/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../utils/TableUtils","../library","sap/ui/base/Object","sap/ui/Device","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/ui/core/Configuration"],function(e,t,i,n,o,jQuery,s){"use strict";var r=e.CELLTYPE;var l=t.SelectionMode;var a={CTRL:1,SHIFT:2,ALT:4};var f=5;var u="1rem";function g(e,t){e.setMarked("sapUiTableSkipItemNavigation",t!==false)}function c(t){if(e.getCellInfo(t.target).isOfType(r.ANY)){t.preventDefault();t.stopPropagation()}}var d=i.extend("sap.ui.table.extensions.KeyboardDelegate",{constructor:function(e){i.call(this)},destroy:function(){i.prototype.destroy.apply(this,arguments)},getInterface:function(){return this}});function v(t,i){if(!I(t,i)){return}var n=e.getCellInfo(e.getCell(t,i.target));if(n.isOfType(r.ANYCOLUMNHEADER)){C(t,n,i)}else if(n.isOfType(r.ANYCONTENTCELL)){h(t,n,i)}}function C(t,i,n){var o=e.getHeaderRowCount(t);if(e.isNoDataVisible(t)){var s=e.getFocusedItemInfo(t);if(s.row-o<=1){g(n)}}else if(i.isOfType(r.COLUMNROWHEADER)&&o>1){g(n);e.focusItem(t,o*(e.getVisibleColumnCount(t)+1),n)}}function h(t,i,n){var o=t._getKeyboardExtension();var s=o.isInActionMode();var r=d._isKeyCombination(n,null,a.CTRL);var l=r||s;var f=e.getParentCell(t,n.target);if(!l&&f){f.trigger("focus");return}g(n);if(e.isLastScrollableRow(t,i.cell)){var u=R(t,n);if(u){n.preventDefault();return}}if(i.rowIndex===t.getRows().length-1||e.isVariableRowHeightEnabled(t)&&i.rowIndex===t.getRows().length-2&&t.getRows()[i.rowIndex+1].getRowBindingContext()===null){if(!s&&f){f.trigger("focus")}else{var c=t.getCreationRow();if(!c||!c._takeOverKeyboardHandling(n)){o.setActionMode(false)}}return}F(t,i.type,i.rowIndex+1,i.columnIndex,l);n.preventDefault()}function p(t,i){var n=e.getCellInfo(e.getCell(t,i.target));if(!n.isOfType(r.ANYCONTENTCELL)||!I(t,i)){return}var o=d._isKeyCombination(i,null,a.CTRL);var s=t._getKeyboardExtension();var l=s.isInActionMode();var f=o||l;var u=e.getParentCell(t,i.target);if(!f&&u){u.trigger("focus");return}g(i);if(e.isFirstScrollableRow(t,n.cell)){var c=y(t,i);if(c){i.preventDefault();return}}if(n.rowIndex===0){g(i,n.isOfType(r.ROWACTION)||f);if(!l&&u){u.trigger("focus")}else{s.setActionMode(false)}return}F(t,n.type,n.rowIndex-1,n.columnIndex,f);i.preventDefault()}function I(e,t){var i=d._isKeyCombination(t,null,a.CTRL);return!t.isMarked()&&(i||!(t.target instanceof window.HTMLInputElement)&&!(t.target instanceof window.HTMLTextAreaElement))}function m(t,i){if(i.isMarked()){return}var n=e.getCellInfo(e.getCell(t,i.target));var o=s.getRTL();if(!n.isOfType(r.COLUMNHEADER)||!o){return}var l=e.getFocusedItemInfo(t);var a=l.cellInRow-(e.hasRowHeader(t)?1:0);var f=e.getVisibleColumnCount(t);if(e.hasRowActions(t)&&a===f-1){g(i)}}function E(e){return new Promise(function(t){e.attachEventOnce("_rowsUpdated",t)})}function T(e){if(e._hasPendingRequests()){return E(e).then(function(){return T(e)})}return Promise.resolve()}function R(e,t,i,n){var o=e._getFirstRenderedRowIndex()===e._getMaxFirstRenderedRowIndex();if(o){return null}return A(e,t,true,i,n)}function y(e,t,i,n){var o=e._getFirstRenderedRowIndex()===0;if(o){return null}return A(e,t,false,i,n)}function A(t,i,n,o,s){var l=e.getCellInfo(e.getCell(t,i.target));var f=t._getKeyboardExtension().isInActionMode();var u=d._isKeyCombination(i,null,a.CTRL);var g=u||f;var c=f&&l.isOfType(r.DATACELL);if(c){t._getKeyboardExtension().setSilentFocus(t.getDomRef("focusDummy"));setTimeout(function(){t._getScrollExtension().scrollVertically(n===true,o)},0)}else{t._getScrollExtension().scrollVertically(n===true,o)}return E(t).then(function(){if(s){s()}else if(g){F(t,l.type,l.rowIndex,l.columnIndex,true)}})}function O(e,t){var i=e._getRowCounts();var n=R(e,t,false,function(){x(e,i.fixedTop+i.scrollable-1)});if(n){return}if(i.fixedBottom>0){x(e,i.fixedTop+i.scrollable)}else{e._getKeyboardExtension().setActionMode(false)}}function x(t,i){var n=t.getRows()[i];var o=n.isGroupHeader()||e.isRowSelectorSelectionAllowed(t);if(o){F(t,r.ROWHEADER,i)}else{var s=d._getFirstInteractiveElement(n);if(s){d._focusElement(t,s[0])}else{F(t,r.DATACELL,i,0,false,true);if(n.getIndex()===t._getTotalRowCount()-1){t._getKeyboardExtension().setActionMode(false)}}}}function _(e,t){var i=e._getRowCounts();var n=y(e,t,false,function(){w(e,i.fixedTop)});if(n){return}if(i.fixedTop>0){w(e,i.fixedTop-1)}else{e._getKeyboardExtension().setActionMode(false)}}function w(t,i){var n=t.getRows()[i];var o=n.isGroupHeader()||e.isRowSelectorSelectionAllowed(t);var s=d._getLastInteractiveElement(n);if(s){d._focusElement(t,s[0])}else if(o){F(t,r.ROWHEADER,i)}else{F(t,r.DATACELL,i,0,false,true);if(n.getIndex()===0){t._getKeyboardExtension().setActionMode(false)}}}function b(t,i){var n=e.getFocusedItemInfo(t);var o=t._getKeyboardExtension().getLastFocusedCellInfo();e.focusItem(t,n.cellInRow+n.columnCount*o.row,i)}function L(t,i){var n=e.getFocusedItemInfo(t);e.focusItem(t,n.cellInRow,i)}function N(e,t){e._getKeyboardExtension().setSilentFocus(e.$().find("."+t))}d._isKeyCombination=function(e,t,i){if(i==null){i=0}var s=typeof t==="string"?String.fromCharCode(e.charCode):e.keyCode;var r=0;r|=(n.os.macintosh?e.metaKey:e.ctrlKey)&&t!==o.CONTROL?a.CTRL:0;r|=e.shiftKey&&t!==o.SHIFT?a.SHIFT:0;r|=e.altKey&&t!==o.ALT?a.ALT:0;var l=t==null||s===t;var f=i===r;return l&&f};function S(t,i){var n=e.getCell(t,i);var o=e.getCellInfo(n);return t.getRows()[o.rowIndex]}function D(t,i){var n=e.getCellInfo(i.target);if(n.isOfType(r.COLUMNROWHEADER)){t._getSelectionPlugin().onHeaderSelectorPress()}else if(d._allowsToggleExpandedState(t,i.target)){S(t,i.target).toggleExpandedState()}else if(n.isOfType(r.ROWHEADER)){l()}else if(n.isOfType(r.DATACELL|r.ROWACTION)){var o=!t.hasListeners("cellClick");if(!t._findAndfireCellEvent(t.fireCellClick,i)){if(e.isRowSelectionAllowed(t)){l();o=false}}if(o){var s=e.getInteractiveElements(i.target);if(s){t._getKeyboardExtension().setActionMode(true)}}}function l(){var n=null;if(t._legacyMultiSelection){n=function(e){t._legacyMultiSelection(e.getIndex(),i)}}e.toggleRowSelection(t,i.target,null,n)}}function M(t,i){var n=t.getParent();var o=n._getVisibleColumns();var s=o.indexOf(t);var r;if(i&&s<o.length-1){r=n.indexOfColumn(o[s+1])+1}else if(!i&&s>0){r=n.indexOfColumn(o[s-1])}if(r!=null){e.Column.moveColumnTo(t,r)}}function K(e,t){var i=e.getColumns().filter(function(e){return e.getVisible()||(e.getGrouped?e.getGrouped():false)});for(var n=0;n<i.length;n++){var o=i[n];if(o===t){return n}}return-1}function H(t,i,n){if(!n){if(t._oRangeSelection.selected){e.toggleRowSelection(t,i,true)}else{e.toggleRowSelection(t,i,false)}}else{e.toggleRowSelection(t,i,false)}}d._focusElement=function(e,t,i){if(!e||!t){return}if(i==null){i=false}if(i){e._getKeyboardExtension().setSilentFocus(t)}else{t.focus()}if(t instanceof window.HTMLInputElement){t.select()}};function F(t,i,n,o,s,l){if(!t||i==null||n==null||n<0||n>=t.getRows().length){return}var a=t.getRows()[n];var f;if(i===r.ROWHEADER){t._getKeyboardExtension().setFocus(t.getDomRef("rowsel"+n));return}else if(i===r.ROWACTION){f=t.getDomRef("rowact"+n)}else if(i===r.DATACELL&&(o!=null&&o>=0)){var u=t.getColumns()[o];var g=K(t,u);if(g>=0){f=a.getDomRef("col"+g)}}if(!f){return}if(s){var c=e.getInteractiveElements(f);if(c){d._focusElement(t,c[0]);return}}if(l){t._getKeyboardExtension()._bStayInActionMode=true}f.focus()}function U(e){return e.classList.contains("sapUiTableTreeIconNodeOpen")||e.classList.contains("sapUiTableTreeIconNodeClosed")}d._allowsToggleExpandedState=function(t,i){return e.Grouping.isInGroupHeaderRow(i)||e.Grouping.isInTreeMode(t)&&i.classList.contains("sapUiTableCellFirst")&&(i.querySelector(".sapUiTableTreeIconNodeOpen")||i.querySelector(".sapUiTableTreeIconNodeClosed"))||U(i)};d._isElementInteractive=function(t){if(!t){return false}return jQuery(t).is(e.INTERACTIVE_ELEMENT_SELECTORS)};d._getFirstInteractiveElement=function(t){var i=e.getFirstInteractiveElement(t,true);if(!i){return null}return jQuery(i)};d._getLastInteractiveElement=function(t){if(!t){return null}var i=t.getParent();var n=t.getCells();var o;var s;if(e.hasRowActions(i)){n.push(t.getRowAction())}for(var r=n.length-1;r>=0;r--){o=e.getParentCell(i,n[r].getDomRef());s=e.getInteractiveElements(o);if(s){return s.last()}}return null};d._getPreviousInteractiveElement=function(t,i){if(!t||!i){return null}var n=jQuery(i);if(!this._isElementInteractive(n)){return null}var o=e.getParentCell(t,i);var s;var l;var a;var f;var u;var g;var c;s=e.getInteractiveElements(o);if(s[0]!==n[0]){return s.eq(s.index(i)-1)}l=e.getCellInfo(o);f=t.getRows()[l.rowIndex].getCells();if(l.isOfType(r.ROWACTION)){c=f.length-1}else{u=t.getColumns()[l.columnIndex];g=K(t,u);c=g-1}for(var d=c;d>=0;d--){a=f[d].getDomRef();o=e.getParentCell(t,a);s=e.getInteractiveElements(o);if(s){return s.last()}}return null};d._getNextInteractiveElement=function(t,i){if(!t||!i){return null}var n=jQuery(i);if(!this._isElementInteractive(n)){return null}var o=e.getParentCell(t,i);var s;var l;var a;var f;var u;var g;var c;s=e.getInteractiveElements(o);if(s.get(-1)!==n[0]){return s.eq(s.index(i)+1)}l=e.getCellInfo(o);if(l.isOfType(r.ROWACTION)){return null}g=t.getRows()[l.rowIndex];f=g.getCells();u=t.getColumns()[l.columnIndex];c=K(t,u);for(var d=c+1;d<f.length;d++){a=f[d].getDomRef();o=e.getParentCell(t,a);s=e.getInteractiveElements(o);if(s){return s.first()}}if(e.hasRowActions(t)){o=e.getParentCell(t,g.getRowAction().getDomRef());s=e.getInteractiveElements(o);if(s.get(-1)!==n[0]){return s.eq(s.index(i)+1)}}return null};function W(t){var i=e.getRowIndexOfFocusedCell(t);var n=t.getRows()[i];var o=n.getIndex();var s=t._getSelectionPlugin();t._oRangeSelection={startIndex:o,selected:s.isSelected(n)}}d.prototype.enterActionMode=function(){var t=this._getKeyboardExtension();var i=document.activeElement;var n=e.getInteractiveElements(i);var o=e.getParentCell(this,i);var s=e.getCellInfo(o);if(s.isOfType(r.ANYCOLUMNHEADER)){return false}if(n){t.suspendItemNavigation();i.tabIndex=-1;d._focusElement(this,n[0],true);return true}else if(o){this._getKeyboardExtension().suspendItemNavigation();return true}return false};d.prototype.leaveActionMode=function(t){t=t==null?true:t;var i=this._getKeyboardExtension();var n=document.activeElement;var o=e.getParentCell(this,n);i.resumeItemNavigation();if(t){if(o){d._focusElement(this,o[0],true)}else{var s=this._getItemNavigation();if(s){var r=s.aItemDomRefs;var l=r.indexOf(n);if(l>-1){s.setFocusedIndex(l)}}i.setSilentFocus(n)}}};d.prototype.onfocusin=function(t){if(t.isMarked("sapUiTableIgnoreFocusIn")){return}var i=jQuery(t.target);if(i.hasClass("sapUiTableOuterBefore")||i.hasClass("sapUiTableOuterAfter")||t.target!=this.getDomRef("overlay")&&this.getShowOverlay()){this.$("overlay").trigger("focus")}else if(i.hasClass("sapUiTableCtrlBefore")){var n=e.isNoDataVisible(this);if(!n||n&&this.getColumnHeaderVisible()){L(this,t)}else{this._getKeyboardExtension().setSilentFocus(this.$("noDataCnt"))}}else if(i.hasClass("sapUiTableCtrlAfter")){if(!e.isNoDataVisible(this)){b(this,t)}}var o=e.getCellInfo(t.target);var s=o.isOfType(r.ROWHEADER)&&e.Grouping.isInGroupHeaderRow(t.target);var l=o.isOfType(r.ROWHEADER)&&!s&&e.isRowSelectorSelectionAllowed(this);var a=o.isOfType(r.DATACELL)&&this._getKeyboardExtension()._bStayInActionMode;var f=e.getCellInfo(e.getParentCell(this,t.target)).isOfType(r.ANYCONTENTCELL);var u=d._isElementInteractive(t.target);var g=this._getKeyboardExtension().isInActionMode();var c=g&&(s||l||a)||u&&f;if(a){this._getKeyboardExtension()._bStayInActionMode=false}this._getKeyboardExtension().setActionMode(c,false)};d.prototype.onkeydown=function(t){if(t.isMarked()){return}var i=this._getKeyboardExtension();var n=e.getCellInfo(t.target);var s=this.getSelectionMode();var f=this._getSelectionPlugin();if(d._isKeyCombination(t,o.F2)){var u=i.isInActionMode();var g=e.getCell(this,t.target);var c=e.getParentCell(this,t.target)!=null;n=e.getCellInfo(g);if(!u&&c){g.trigger("focus")}else if(n.isOfType(r.ANYCOLUMNHEADER)){var v=e.getInteractiveElements(g);if(v){v[0].focus()}}else{i.setActionMode(!u)}return}if(d._isKeyCombination(t,o.F4)&&d._allowsToggleExpandedState(this,t.target)){S(this,t.target).toggleExpandedState();return}if(d._isKeyCombination(t,o.SPACE)&&U(t.target)){t.preventDefault();return}if(this._getKeyboardExtension().isInActionMode()||!n.isOfType(r.ANY)){return}if(d._isKeyCombination(t,o.SPACE)){t.preventDefault()}if(d._isKeyCombination(t,o.SHIFT)&&s===l.MultiToggle&&(n.isOfType(r.ROWHEADER)&&e.isRowSelectorSelectionAllowed(this)||n.isOfType(r.DATACELL|r.ROWACTION))){W(this)}else if(d._isKeyCombination(t,o.A,a.CTRL)){t.preventDefault();if(n.isOfType(r.ANYCONTENTCELL|r.COLUMNROWHEADER)&&s===l.MultiToggle){f.onKeyboardShortcut("toggle",t)}}else if(d._isKeyCombination(t,o.A,a.CTRL+a.SHIFT)){if(n.isOfType(r.ANYCONTENTCELL|r.COLUMNROWHEADER)){f.onKeyboardShortcut("clear",t)}}else if(d._isKeyCombination(t,o.F4)){if(n.isOfType(r.DATACELL)){i.setActionMode(true)}}};d.prototype.onkeypress=function(t){if(t.isMarked()){return}var i=this._getKeyboardExtension();var n=e.getCellInfo(t.target);if(d._isKeyCombination(t,"+")){if(d._allowsToggleExpandedState(this,t.target)){S(this,t.target).expand()}else if(n.isOfType(r.DATACELL|r.ROWACTION)){i.setActionMode(true)}}else if(d._isKeyCombination(t,"-")){if(d._allowsToggleExpandedState(this,t.target)){S(this,t.target).collapse()}else if(n.isOfType(r.DATACELL|r.ROWACTION)){i.setActionMode(true)}}};d.prototype.oncontextmenu=function(t){if(t.isMarked("sapUiTableHandledByPointerExtension")){return}var i=e.getCellInfo(document.activeElement);if(i.isOfType(r.ANY)){t.preventDefault();e.Menu.openContextMenu(this,t)}};d.prototype.onkeyup=function(t){if(t.isMarked()){return}var i=e.getCellInfo(t.target);if(d._isKeyCombination(t,o.SHIFT)){delete this._oRangeSelection}if(i.isOfType(r.COLUMNHEADER)){if(d._isKeyCombination(t,o.SPACE)||d._isKeyCombination(t,o.ENTER)){e.Menu.openContextMenu(this,t)}}else if(d._isKeyCombination(t,o.SPACE)){D(this,t)}else if(d._isKeyCombination(t,o.SPACE,a.SHIFT)){e.toggleRowSelection(this,i.rowIndex);W(this)}else if(this._legacyMultiSelection&&!i.isOfType(r.COLUMNROWHEADER)&&(d._isKeyCombination(t,o.SPACE,a.CTRL)||d._isKeyCombination(t,o.ENTER,a.CTRL))){D(this,t)}};d.prototype.onsaptabnext=function(t){var i=this._getKeyboardExtension();var n=e.getCellInfo(t.target);var o;if(i.isInActionMode()){var s;o=e.getCell(this,t.target);n=e.getCellInfo(o);if(!n.isOfType(r.ANYCONTENTCELL)){return}var l=this.getRows()[n.rowIndex];var a=d._getLastInteractiveElement(l);var f=a===null||a[0]===t.target;if(f){var u=l.getIndex();var g=e.isLastScrollableRow(this,o);var c=this._getTotalRowCount()-1===u;var v=e.isRowSelectorSelectionAllowed(this);t.preventDefault();if(c){i.setActionMode(false)}else if(g){O(this,t)}else{var C=n.rowIndex;if(v){F(this,r.ROWHEADER,C+1)}else{var h=this.getRows().length;var p=false;for(var I=n.rowIndex+1;I<h;I++){C=I;l=this.getRows()[C];s=d._getFirstInteractiveElement(l);p=l.isGroupHeader();if(s||p){break}}if(s){d._focusElement(this,s[0])}else if(p){F(this,r.ROWHEADER,C)}else{O(this,t)}}}}else if(n.isOfType(r.ROWHEADER)){t.preventDefault();s=d._getFirstInteractiveElement(l);d._focusElement(this,s[0])}else{t.preventDefault();s=d._getNextInteractiveElement(this,t.target);d._focusElement(this,s[0])}}else if(n.isOfType(r.ANYCOLUMNHEADER)){if(this.getCreationRow()&&this.getCreationRow().getVisible()&&!e.hasData(this)){N(this,"sapUiTableCtrlAfter")}else if(e.isNoDataVisible(this)){this.$("noDataCnt").trigger("focus");t.preventDefault()}else if(this.getRows().length>0){b(this,t);t.preventDefault()}}else if(n.isOfType(r.ANYCONTENTCELL)){N(this,"sapUiTableCtrlAfter")}else if(t.target===this.getDomRef("overlay")){i.setSilentFocus(this.$().find(".sapUiTableOuterAfter"))}else if(!n.isOfType(r.ANY)){o=e.getParentCell(this,t.target);if(o){t.preventDefault();o.trigger("focus")}}};d.prototype.onsaptabprevious=function(t){var i=this._getKeyboardExtension();var n=e.getCellInfo(t.target);var o;if(i.isInActionMode()){var s;o=e.getCell(this,t.target);n=e.getCellInfo(o);if(!n.isOfType(r.ANYCONTENTCELL)){return}var l=this.getRows()[n.rowIndex];var a=l.getIndex();var f=d._getFirstInteractiveElement(l);var u=f!==null&&f[0]===t.target;var g=e.isRowSelectorSelectionAllowed(this);var c=g||l.isGroupHeader();if(u&&c){t.preventDefault();F(this,r.ROWHEADER,n.rowIndex)}else if(u&&!c||n.isOfType(r.ROWHEADER)||f===null){var v=e.isFirstScrollableRow(this,o);var C=a===0;t.preventDefault();if(C){i.setActionMode(false)}else if(v){_(this,t)}else{var h=n.rowIndex;var p=false;for(var I=n.rowIndex-1;I>=0;I--){h=I;l=this.getRows()[h];s=d._getLastInteractiveElement(l);p=l.isGroupHeader();if(s||c||p){break}}if(s){d._focusElement(this,s[0])}else if(p||c){F(this,r.ROWHEADER,h)}else{_(this,t)}}}else{t.preventDefault();s=d._getPreviousInteractiveElement(this,t.target);d._focusElement(this,s[0])}}else if(n.isOfType(r.ANYCONTENTCELL)||t.target===this.getDomRef("noDataCnt")){if(this.getColumnHeaderVisible()&&!n.isOfType(r.ROWACTION)){L(this,t);t.preventDefault()}else{N(this,"sapUiTableCtrlBefore")}}else if(t.target===this.getDomRef("overlay")){this._getKeyboardExtension().setSilentFocus(this.$().find(".sapUiTableOuterBefore"))}else if(!n.isOfType(r.ANY)){o=e.getParentCell(this,t.target);if(o){t.preventDefault();o.trigger("focus")}}};d.prototype.onsapdown=function(e){c(e);v(this,e)};d.prototype.onsapdownmodifiers=function(t){if(t.isMarked()){g(t);return}c(t);if(d._isKeyCombination(t,null,a.CTRL)){v(this,t);return}var i=this._getKeyboardExtension();if(d._isKeyCombination(t,null,a.ALT)&&d._allowsToggleExpandedState(this,t.target)){g(t);S(this,t.target).expand();return}if(i.isInActionMode()){return}var n=e.getCellInfo(t.target);if(d._isKeyCombination(t,null,a.SHIFT)){if(n.isOfType(r.ANYCONTENTCELL)){if(!this._oRangeSelection){g(t);return}var o=e.getRowIndexOfFocusedCell(this);var s=this.getRows()[o].getIndex();var l=this._oRangeSelection.startIndex>s;var f;if(s===this._getTotalRowCount()-1){return}if(e.isLastScrollableRow(this,t.target)){if(this._oRangeSelection.pScroll){g(t);return}else{f=R(this,t);this._oRangeSelection.pScroll=f}}if(f){g(t);f.then(function(){return T(this)}.bind(this)).then(function(){H(this,o-(l?1:0),l);delete this._oRangeSelection.pScroll}.bind(this))}else{H(this,o+(l?0:1),l)}}else{g(t)}}if(d._isKeyCombination(t,null,a.ALT)){if(n.isOfType(r.DATACELL)){i.setActionMode(true)}g(t)}};d.prototype.onsapup=function(e){c(e);p(this,e)};d.prototype.onsapupmodifiers=function(t){if(t.isMarked()){g(t);return}c(t);if(d._isKeyCombination(t,null,a.CTRL)){p(this,t);return}if(d._isKeyCombination(t,null,a.ALT)&&d._allowsToggleExpandedState(this,t.target)){g(t);S(this,t.target).collapse();return}var i=this._getKeyboardExtension();if(i.isInActionMode()){return}var n=e.getCellInfo(t.target);if(d._isKeyCombination(t,null,a.SHIFT)){if(n.isOfType(r.ANYCONTENTCELL)){if(!this._oRangeSelection){g(t);return}var o=e.getRowIndexOfFocusedCell(this);var s=this.getRows()[o].getIndex();var l=this._oRangeSelection.startIndex<s;var f;if(s===0){g(t);return}if(e.isFirstScrollableRow(this,t.target)){if(this._oRangeSelection.pScroll){g(t);return}else{f=y(this,t);this._oRangeSelection.pScroll=f}}if(f){g(t);f.then(function(){return T(this)}.bind(this)).then(function(){H(this,l?1:0,l);delete this._oRangeSelection.pScroll}.bind(this))}else{H(this,o-(l?0:1),l)}}else{g(t)}}if(d._isKeyCombination(t,null,a.ALT)){if(n.isOfType(r.DATACELL)){i.setActionMode(true)}g(t)}};d.prototype.onsapleft=function(e){c(e);m(this,e)};d.prototype.onsapleftmodifiers=function(t){if(t.isMarked()){g(t);return}c(t);if(this._getKeyboardExtension().isInActionMode()){return}var i=e.getCellInfo(t.target);var n=s.getRTL();if(d._isKeyCombination(t,null,a.SHIFT)){if(i.isOfType(r.DATACELL)){if(!this._oRangeSelection){g(t);return}var o=e.getFocusedItemInfo(this);var l=e.hasRowHeader(this)&&o.cellInRow===1;if(l&&!e.isRowSelectorSelectionAllowed(this)){g(t)}}else if(i.isOfType(r.ROWACTION)){if(!this._oRangeSelection){g(t)}}else if(i.isOfType(r.ROWHEADER)&&n){if(!e.isRowSelectionAllowed(this)){g(t)}}else if(i.isOfType(r.COLUMNROWHEADER)&&n){g(t)}else if(i.isOfType(r.COLUMNHEADER)){var f=-e.convertCSSSizeToPixel(u);var v=0;if(n){f=f*-1}for(var C=i.columnIndex;C<i.columnIndex+i.columnSpan;C++){v+=e.Column.getColumnWidth(this,C)}e.Column.resizeColumn(this,i.columnIndex,v+f,true,i.columnSpan);g(t)}}else if(d._isKeyCombination(t,null,a.CTRL)){if(i.isOfType(r.COLUMNHEADER)){g(t);M(this.getColumns()[i.columnIndex],n)}}else if(d._isKeyCombination(t,null,a.ALT)){g(t)}};d.prototype.onsaprightmodifiers=function(t){if(t.isMarked()){g(t);return}c(t);if(this._getKeyboardExtension().isInActionMode()){return}var i=e.getCellInfo(t.target);var n=s.getRTL();if(d._isKeyCombination(t,null,a.SHIFT)){if(i.isOfType(r.DATACELL)){if(!this._oRangeSelection){g(t)}}else if(i.isOfType(r.ROWHEADER)){if(!e.isRowSelectionAllowed(this)){g(t)}}else if(i.isOfType(r.ROWACTION)&&n){if(!this._oRangeSelection){g(t)}}else if(i.isOfType(r.COLUMNHEADER)){var o=e.convertCSSSizeToPixel(u);var l=0;if(n){o=o*-1}for(var f=i.columnIndex;f<i.columnIndex+i.columnSpan;f++){l+=e.Column.getColumnWidth(this,f)}e.Column.resizeColumn(this,i.columnIndex,l+o,true,i.columnSpan);g(t)}else if(i.isOfType(r.COLUMNROWHEADER)){g(t)}}else if(d._isKeyCombination(t,null,a.CTRL)){if(i.isOfType(r.COLUMNHEADER)){g(t);M(this.getColumns()[i.columnIndex],!n)}}else if(d._isKeyCombination(t,null,a.ALT)){g(t)}};d.prototype.onsaphome=function(t){c(t);if(this._getKeyboardExtension().isInActionMode()){return}if(e.Grouping.isInGroupHeaderRow(t.target)){g(t);return}var i=e.getCellInfo(t.target);if(i.isOfType(r.DATACELL|r.ROWACTION|r.COLUMNHEADER)){var n=e.getFocusedItemInfo(this);var o=n.cell;var s=n.cellInRow;var l=this.getComputedFixedColumnCount();var a=e.hasRowHeader(this);var f=a?1:0;if(e.hasFixedColumns(this)&&s>l+f){g(t);e.focusItem(this,o-s+l+f,null)}else if(a&&s>1){g(t);e.focusItem(this,o-s+f,null)}}};d.prototype.onsapend=function(t){c(t);if(this._getKeyboardExtension().isInActionMode()){return}if(e.Grouping.isInGroupHeaderRow(t.target)){g(t);return}var i=e.getCellInfo(t.target);if(i.isOfType(r.ANY)){var n=e.getFocusedItemInfo(this);var o=n.cell;var s=n.columnCount;var l=this.getComputedFixedColumnCount();var a=n.cellInRow;var f=e.hasRowHeader(this);var u=f?1:0;var d=false;if(i.isOfType(r.COLUMNHEADER)&&e.hasFixedColumns(this)){var v=parseInt(i.cell.attr("colspan")||1);if(v>1&&a+v-u===l){d=true}}if(f&&a===0){g(t);e.focusItem(this,o+1,null)}else if(e.hasFixedColumns(this)&&a<l-1+u&&!d){g(t);e.focusItem(this,o+l-a,null)}else if(e.hasRowActions(this)&&i.isOfType(r.DATACELL)&&a<s-2){g(t);e.focusItem(this,o-a+s-2,null)}}};d.prototype.onsaphomemodifiers=function(t){c(t);if(this._getKeyboardExtension().isInActionMode()){return}if(d._isKeyCombination(t,null,a.CTRL)){var i=e.getCellInfo(t.target);if(i.isOfType(r.ANYCONTENTCELL|r.COLUMNHEADER)){g(t);var n=e.getFocusedItemInfo(this);var o=n.row;if(o>0){var s=n.cell;var l=n.columnCount;var f=e.getHeaderRowCount(this);var u=this._getRowCounts();if(o<f+u.fixedTop){if(i.isOfType(r.ROWACTION)){e.focusItem(this,s-l*(o-f),t)}else{e.focusItem(this,s-l*o,t)}}else if(o>=f+u.fixedTop&&o<f+e.getNonEmptyRowCount(this)-u.fixedBottom){this._getScrollExtension().scrollVerticallyMax(false);if(u.fixedTop>0||i.isOfType(r.ROWACTION)){e.focusItem(this,s-l*(o-f),t)}else{e.focusItem(this,s-l*o,t)}}else{this._getScrollExtension().scrollVerticallyMax(false);e.focusItem(this,s-l*(o-f-u.fixedTop),t)}}}}};d.prototype.onsapendmodifiers=function(t){c(t);if(this._getKeyboardExtension().isInActionMode()){return}if(d._isKeyCombination(t,null,a.CTRL)){var i=e.getCellInfo(t.target);if(i.isOfType(r.ANY)){var n=e.getFocusedItemInfo(this);var o=n.row;var s=e.getHeaderRowCount(this);var l=e.getNonEmptyRowCount(this);var f=this._getRowCounts();g(t);if(f.fixedBottom===0||o<s+l-1||e.isNoDataVisible(this)&&o<s-1){var u=n.cell;var v=n.columnCount;if(e.isNoDataVisible(this)){e.focusItem(this,u+v*(s-o-1),t)}else if(o<s){if(f.fixedTop>0){e.focusItem(this,u+v*(s+f.fixedTop-o-1),t)}else{this._getScrollExtension().scrollVerticallyMax(true);e.focusItem(this,u+v*(s+l-f.fixedBottom-o-1),t)}}else if(o>=s&&o<s+f.fixedTop){this._getScrollExtension().scrollVerticallyMax(true);e.focusItem(this,u+v*(s+l-f.fixedBottom-o-1),t)}else if(o>=s+f.fixedTop&&o<s+l-f.fixedBottom){this._getScrollExtension().scrollVerticallyMax(true);e.focusItem(this,u+v*(s+l-o-1),t)}else{e.focusItem(this,u+v*(s+l-o-1),t)}}}}};d.prototype.onsappageup=function(t){c(t);if(this._getKeyboardExtension().isInActionMode()){return}var i=e.getCellInfo(t.target);if(i.isOfType(r.ANYCONTENTCELL|r.COLUMNHEADER)){var n=e.getFocusedItemInfo(this);var o=n.row;var s=e.getHeaderRowCount(this);var l=this._getRowCounts();if(l.fixedTop===0&&o>=s||l.fixedTop>0&&o>s){g(t);var a=n.cell;var f=n.columnCount;if(o<s+l.fixedTop){e.focusItem(this,a-f*(o-s),t)}else if(o===s+l.fixedTop){var u=e.getNonEmptyRowCount(this)-l.fixedTop-l.fixedBottom;var d=this.getFirstVisibleRow();y(this,t,true);if(d<u){if(l.fixedTop>0||i.isOfType(r.ROWACTION)){e.focusItem(this,a-f*(o-s),t)}else{e.focusItem(this,a-f*s,t)}}}else if(o>s+l.fixedTop&&o<s+e.getNonEmptyRowCount(this)){e.focusItem(this,a-f*(o-s-l.fixedTop),t)}else{e.focusItem(this,a-f*(o-s-e.getNonEmptyRowCount(this)+1),t)}}if(i.isOfType(r.ROWACTION)&&o===s&&l.fixedTop>0){g(t)}}};d.prototype.onsappagedown=function(t){c(t);if(this._getKeyboardExtension().isInActionMode()){return}var i=e.getCellInfo(t.target);if(i.isOfType(r.ANY)){var n=e.getFocusedItemInfo(this);var o=n.row;var s=e.getHeaderRowCount(this);var l=e.getNonEmptyRowCount(this);var a=this._getRowCounts();g(t);if(e.isNoDataVisible(this)&&o<s-1||a.fixedBottom===0||o<s+l-1){var f=n.cell;var u=n.columnCount;if(o<s-1&&!i.isOfType(r.COLUMNROWHEADER)){e.focusItem(this,f+u*(s-o-1),t)}else if(o<s){if(!e.isNoDataVisible(this)){e.focusItem(this,f+u*(s-o),t)}}else if(o>=s&&o<s+l-a.fixedBottom-1){e.focusItem(this,f+u*(s+l-a.fixedBottom-o-1),t)}else if(o===s+l-a.fixedBottom-1){var d=e.getNonEmptyRowCount(this)-a.fixedTop-a.fixedBottom;var v=this._getTotalRowCount()-a.fixedBottom-this.getFirstVisibleRow()-d*2;R(this,t,true);if(v<d&&a.fixedBottom>0){e.focusItem(this,f+u*(s+l-o-1),t)}}else{e.focusItem(this,f+u*(s+l-o-1),t)}}}};d.prototype.onsappageupmodifiers=function(t){c(t);if(this._getKeyboardExtension().isInActionMode()){return}if(d._isKeyCombination(t,null,a.ALT)){var i=e.getCellInfo(t.target);var n=e.getFocusedItemInfo(this);if(i.isOfType(r.DATACELL|r.COLUMNHEADER)){var o=n.cell;var s=n.cellInRow;var l=e.hasRowHeader(this);var u=l?1:0;var v=f;g(t);if(l&&(e.Grouping.isInGroupHeaderRow(t.target)||s===1)){e.focusItem(this,o-s,null)}else if(s-u<v){e.focusItem(this,o-s+u,null)}else{e.focusItem(this,o-v,null)}}else if(i.isOfType(r.ROWACTION)){e.focusItem(this,n.cell-1,null)}}};d.prototype.onsappagedownmodifiers=function(t){c(t);if(this._getKeyboardExtension().isInActionMode()){return}if(d._isKeyCombination(t,null,a.ALT)){var i=e.getCellInfo(t.target);if(i.isOfType(r.DATACELL|r.ROWHEADER|r.ANYCOLUMNHEADER)){var n=e.getFocusedItemInfo(this);var o=n.cellInRow;var s=e.hasRowHeader(this);var l=s?1:0;var u=e.getVisibleColumnCount(this);var v=parseInt(i.cell.attr("colspan")||1);g(t);if(o+v-l<u){var C=n.cell;var h=f;if(s&&o===0){e.focusItem(this,C+1,null)}else if(v>h){e.focusItem(this,C+v,null)}else if(o+v-l+h>u){e.focusItem(this,C+u-o-1+l,null)}else if(!e.Grouping.isInGroupHeaderRow(t.target)){e.focusItem(this,C+h,null)}}else if(i.isOfType(r.DATACELL)&&e.hasRowActions(this)&&o===n.columnCount-2){e.focusItem(this,n.cell+1,null)}}}};d.prototype.onsapenter=function(e){D(this,e)};return d});
//# sourceMappingURL=KeyboardDelegate.js.map