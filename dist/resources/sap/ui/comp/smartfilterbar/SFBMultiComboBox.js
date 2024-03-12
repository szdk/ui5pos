/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/m/MultiComboBox","sap/m/MultiComboBoxRenderer","sap/ui/comp/util/ComboBoxUtils","sap/m/inputUtils/ListHelpers"],function(e,t,r,i){"use strict";var o=i.CSS_CLASS+"Token";var n=e.extend("sap.ui.comp.smartfilterbar.SFBMultiComboBox",{metadata:{library:"sap.ui.comp",interfaces:["sap.ui.comp.IDropDownTextArrangement"],properties:{textArrangement:{type:"string",group:"Misc",defaultValue:""}}},renderer:t});n.prototype.onBeforeRendering=function(){e.prototype.onBeforeRendering.apply(this,arguments);this._parseCurrentValue();this._processTextArrangement()};n.prototype._processTextArrangement=function(){var e,t,i,n,s,a=this.getSelectedKeys(),p=this.getTextArrangement();if(!p||a.length===0){return}for(e=0;e<a.length;e++){i=a[e];n=this.getItemByKey(""+i);s=r.formatDisplayBehaviour(n,p);if(s){t=n.data(o);if(t&&t.isA("sap.m.Token")){t.setText(s)}}}};n.prototype._parseCurrentValue=function(){var e=this.getValue();if(e){this.addSelectedKeys([e]);this.setValue("")}};n.prototype.useHighlightItemsWithContains=function(){return true};return n});
//# sourceMappingURL=SFBMultiComboBox.js.map