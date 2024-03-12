/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["./common/BaseControl","./charttooltip/TooltipContainer","sap/ui/core/Element","sap/ui/core/Popup","./common/utils/FormatDataUtil","sap/ui/thirdparty/jquery"],function(o,t,i,e,n,jQuery){"use strict";var p=o.extend("sap.viz.ui5.controls.VizTooltip",{metadata:{library:"sap.viz",properties:{formatString:{type:"any",defaultValue:null}}},renderer:{apiVersion:2,render:function(o,t){o.openStart("div",t).openEnd().close("div")}}});p.prototype.init=function(){o.prototype.init.apply(this,arguments);this._uid=null;this._oTooltipContainer=null;this._oPopup=null};p.prototype.exit=function(){o.prototype.exit.apply(this,arguments);var t=i.getElementById(this._uid);if(t){if(t._vizFrame){t._vizFrame.off("showInstantTooltip");t._vizFrame.off("hideInstantTooltip");var e=t._onConnectPopover()||{};if(e.ref===this){t._onConnectPopover(null)}}else{t._onConnectPopover(jQuery.proxy(function(o){if(!t._vizFrame){return}t._vizFrame.off("showInstantTooltip");t._vizFrame.off("hideInstantTooltip")},this))}}if(this._oPopup){this._oPopup.destroy();this._oPopup=null}if(this._oTooltipContainer){this._oTooltipContainer.destroy();this._oTooltipContainer=null}this._uid=null};p.prototype.connect=function(o){this._uid=o;if(!this._oPopup){this._createTooltip()}var t=i.getElementById(this._uid);var e=t.getUiConfig();if(!e||e.applicationSet!=="fiori"){return}var n=this;function p(){if(!t._vizFrame){return}n._chartType=t._vizFrame.type();t._vizFrame.off("showTooltip");t._vizFrame.off("hideTooltip");t._vizFrame.on("showInstantTooltip",function(o){n._prepareTooltip(o.data);n._oPopup.close(0);n._oPopup.open(0)});t._vizFrame.on("hideInstantTooltip",function(){n._oPopup.close(0)})}p.ref=this;if(t._vizFrame){p()}t._onConnectPopover(p)};p.prototype._createTooltip=function(o){this._oTooltipContainer=new t;this._oPopup=new e;this._oPopup.setContent(this._oTooltipContainer);this._oPopup.setShadow(false)};p.prototype._prepareTooltip=function(o){var t={formatString:this.getFormatString(),chartType:this._chartType,mode:"tooltip"};var i=n.formatData(o,t);this._oTooltipContainer.setContent(i);var p=e.Dock.CenterBottom;var r=e.Dock.LeftTop;var a=o.point.x;var s=10;var l=o.point.y;var u=0+" "+-s;var f=document.createEvent("MouseEvents");f.initMouseEvent("mousemove",true,true,window,0,0,0,a,l,false,false,false,false,0,null);f=jQuery.event.fix(f);this._oPopup.setPosition(p,r,f,u,"flipfit")};p.prototype.addStyleClass=function(){this._oTooltipContainer.addStyleClass.apply(this._oTooltipContainer,arguments)};p.prototype.removeStyleClass=function(){this._oTooltipContainer.removeStyleClass.apply(this._oTooltipContainer,arguments)};return p});
//# sourceMappingURL=VizTooltip.js.map