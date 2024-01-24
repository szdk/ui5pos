/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Item","sap/ui/base/ManagedObject","sap/ui/core/IconPool","./AccButton","sap/m/ImageHelper"],function(t,e,i,a,r,o){"use strict";var s=t.ButtonType;var p=e.extend("sap.m.TabStripItem",{metadata:{library:"sap.m",properties:{additionalText:{type:"string",group:"Misc",defaultValue:""},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},iconTooltip:{type:"string",group:"Accessibility",defaultValue:null},modified:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{_closeButton:{type:"sap.m.Button",multiple:false},_image:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{itemClosePressed:{allowPreventDefault:true,parameters:{item:{type:"sap.m.TabStripItem"}}},itemPropertyChanged:{parameters:{itemChanged:{type:"sap.m.TabStripItem"},propertyKey:{type:"string"},propertyValue:{type:"any"}}}}}});p.DISPLAY_TEXT_MAX_LENGTH=25;p.CSS_CLASS="sapMTabStripItem";p.CSS_CLASS_LABEL="sapMTabStripItemLabel";p.CSS_CLASS_MODIFIED_SYMBOL="sapMTabStripItemModifiedSymbol";p.CSS_CLASS_TEXT="sapMTabStripItemAddText";p.CSS_CLASS_BUTTON="sapMTabStripItemButton";p.CSS_CLASS_MODIFIED="sapMTabStripItemModified";p.CSS_CLASS_SELECTED="sapMTabStripItemSelected";p.CSS_CLASS_STATE="sapMTabStripSelectListItemModified";p.CSS_CLASS_STATE_INVISIBLE="sapMTabStripSelectListItemModifiedInvisible";p.CSS_CLASS_CLOSE_BUTTON="sapMTabStripSelectListItemCloseBtn";p.CSS_CLASS_CLOSE_BUTTON_INVISIBLE="sapMTabStripSelectListItemCloseBtnInvisible";p.prototype.init=function(){var t=new r({type:s.Transparent,icon:a.getIconURI("decline"),tooltip:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("TABSTRIP_ITEM_CLOSE_BTN"),tabIndex:"-1",ariaHidden:"true"}).addStyleClass(p.CSS_CLASS_CLOSE_BUTTON);this.setAggregation("_closeButton",t)};p.prototype.setProperty=function(t,e,a){if(t==="modified"){a=true}i.prototype.setProperty.call(this,t,e,a);if(t==="text"&&this.getAdditionalText()!==""&&this.getAggregation("_image")||t==="additionalText"&&this.getText()!==""&&this.getAggregation("_image")){this.getAggregation("_image").setDecorative(e!=="")}if(this.getParent()&&this.getParent().changeItemState){this.getParent().changeItemState(this.getId(),e)}this.fireItemPropertyChanged({itemChanged:this,propertyKey:t,propertyValue:e});return this};p.prototype.setIcon=function(t,e){var i,a=["sapMTabContIcon"],r=this.getAggregation("_image"),s=this.getId()+"-img",p=!!(this.getText()||this.getAdditionalText());if(!t){this.setProperty("icon",t,e);if(r){this.destroyAggregation("_image")}return this}if(this.getIcon()!==t){this.setProperty("icon",t,e);i={src:t,id:s,decorative:p,tooltip:this.getIconTooltip()};r=o.getImageControl(s,r,undefined,i,a);this.setAggregation("_image",r,e)}return this};p.prototype._getImage=function(){return this.getAggregation("_image")};return p});
//# sourceMappingURL=TabStripItem.js.map