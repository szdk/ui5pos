/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/ui/core/Element","sap/ui/core/Control","sap/ui/layout/form/FormElement","sap/m/Label","sap/m/Button","sap/m/Text","sap/ui/comp/smartfield/SmartLabel","sap/ui/comp/smartfield/SmartField","sap/base/Log"],function(e,t,i,a,l,s,r,o,n,u){"use strict";var f;var h;var p;var b;var d;var m=e.smartfield.ControlContextType;var g=a.extend("sap.ui.comp.smartform.GroupElement",{metadata:{library:"sap.ui.comp",interfaces:["sap.ui.comp.IFormGroupElement"],properties:{useHorizontalLayout:{type:"boolean",group:"Misc",defaultValue:null,deprecated:true},horizontalLayoutGroupElementMinWidth:{type:"int",group:"Misc",defaultValue:null,deprecated:true},elementForLabel:{type:"int",group:"Misc",defaultValue:0}},defaultAggregation:"elements",aggregations:{elements:{type:"sap.ui.core.Control",multiple:true,singularName:"element"}},events:{visibleChanged:{}},designtime:"sap/ui/comp/designtime/smartform/GroupElement.designtime"},_bVisibleElements:false,_bHorizontalLayoutUsed:false});g._myVBox=undefined;g.prototype.init=function(){a.prototype.init.apply(this,arguments);this._oObserver.observe(this,{properties:["useHorizontalLayout","horizontalLayoutGroupElementMinWidth","elementForLabel","_editable"]})};g.prototype._getFieldRelevantForLabel=function(){var e=this.getElements();var t=this.getElementForLabel();if(e.length>t&&e[t]instanceof n){return e[t]}return null};g.prototype._extractFields=function(e,t){var i=[];e.forEach(function(e){if(e instanceof f||e instanceof h){i=i.concat(e.getItems())}else{i.push(e)}});if(i.some(function(e){return e instanceof f||e instanceof h})){i=this._extractFields(i)}if(t){i=i.filter(function(e){return!(e instanceof l)})}return i};g.prototype.setTooltip=function(e){a.prototype.setTooltip.apply(this,[e]);var t=this._getFieldRelevantForLabel();var i=this._getLabel();c.call(this,i,t);return this};function c(e,t){if(e==this._oSetLabel){return}var a;if(this._oSetLabel&&this._oSetLabel instanceof i){a=W.call(this._oSetLabel)}if(!a){a=W.call(this)}if(a){if(e instanceof o){if(t&&t.setTooltipLabel){t.setTooltipLabel(a)}}else{e.setTooltip(a)}}}g.prototype.setLabel=function(e){if(!e&&this._bMoveLabelToVBox){return this.setAggregation("label",e)}if(this._oSetLabel&&typeof this._oSetLabel!=="string"){this._oSetLabel.detachEvent("_change",L,this)}var t;var i;var l;if(typeof e==="string"){t=this._getLabel();if(t){i=t.getText()}}else if(!e&&this._oSetLabel){i=this.getLabelText()}a.prototype.setLabel.apply(this,[e]);this._oSetLabel=e;y.call(this);if(typeof e==="string"){if(this._oLabel instanceof o&&e!=i&&(e.length>0||i.length>0)){l=this._getFieldRelevantForLabel();if(l&&e!=null){if(l.getComputedTextLabel){if(!l._oTextLabelSetByGroupElement){l._oTextLabelSetByGroupElement={oldText:l.getComputedTextLabel()}}l.setTextLabel(e)}}}if(!this._bHorizontalLayoutUsed){this.setAggregation("_label",this._oLabel,true)}this._oLabel.isRequired=v;this._oLabel.isDisplayOnly=_}else{if(e){if(e.isRequired){e.isRequired=v}if(e.isDisplayOnly){e.isDisplayOnly=_}e.attachEvent("_change",L,this)}else{l=this._getFieldRelevantForLabel();if(l){k.call(this,l,i)}}this.updateLabelOfFormElement()}return this};g.prototype.destroyLabel=function(){var e=this.getLabelText();a.prototype.destroyLabel.apply(this);delete this._oSetLabel;y.call(this);var t=this._getFieldRelevantForLabel();if(t){k.call(this,t,e)}this.updateLabelOfFormElement();return this};function L(e){if(e.getParameter("name")=="text"){var t=e.oSource;var i=t.getText();if(this._oLabel){this._oLabel.setText(i)}var a=this._getFieldRelevantForLabel();if(a&&a.getComputedTextLabel){if(!a._oTextLabelSetByGroupElement){a._oTextLabelSetByGroupElement={oldText:a.getComputedTextLabel()}}a.setTextLabel(i)}}}function y(){if(!this._bHorizontalLayoutUsed){return}var e=this.getFields();var t;if(e.length>0){var i=this.getFields()[0];if(i instanceof f){var a=i.getItems();var s=this._getLabel();if(a.length>0&&a[0]instanceof l){t=a[0]}this._bMoveLabelToVBox=true;if(t&&t!=s){i.removeItem(0);if(t._bCreatedByGroupElement){this.setAggregation("_label",t,true)}else{this.setAggregation("label",t)}}if(s&&t!=s){i.insertItem(s,0)}this._bMoveLabelToVBox=false;E.call(this)}}}function v(){if(this.getRequired&&this.getRequired()){return true}var e=this.getParent();if(e&&e.isA("sap.m.VBox")){e=e.getParent()}var t=e.getElements();for(var i=0;i<t.length;i++){var a=t[i];if(a.getRequired&&a.getRequired()===true&&(!a.getEditable||a.getEditable())&&(!a.getContextEditable||a.getContextEditable())){return true}}return false}function _(){if(this.getDisplayOnly){if(!this.isPropertyInitial("displayOnly")){return this.getDisplayOnly()}var e=this.getParent();if(e&&e.isA("sap.m.VBox")){e=e.getParent()}var t=e.getParent();if(t){var i=t.getParent();if(i){return!i.getEditable()}}}return false}function F(){var e=this.getParent();if(e&&e.isA("sap.m.VBox")){e=e.getParent()}if(e._oSetLabel&&!(typeof e._oSetLabel==="string")&&e._oSetLabel.getWrapping&&!e._oSetLabel.isPropertyInitial("wrapping")){return e._oSetLabel.getWrapping()}return true}function E(){var e=this._getFieldRelevantForLabel();if(e){if(this._oLabel){this._oLabel.setLabelFor(e)}return}var t=this.getFields();e=t.length>0?t[0]:null;if(e instanceof f){var a=e.getItems();if(a[1]instanceof h){e=a[1].getItems()[0]}else{e=a[1]}}var l=this._oLabel;if(l){l.setLabelFor(e)}else{l=this.getLabel();if(l instanceof i){l.setAlternativeLabelFor(e)}}}g.prototype.getLabel=function(){return this._oSetLabel};g.prototype._getLabel=function(){if(this._oLabel){return this._oLabel}else{return this._oSetLabel}};g.prototype.getLabelControl=function(){if(this._bHorizontalLayoutUsed){return null}else{return this._getLabel()}};g.prototype.getLabelText=function(){var e="";var t=this._getLabel();if(t){e=t.getText()}return e};g.prototype.getDataSourceLabel=function(){var e=this._getFieldRelevantForLabel();if(e&&e.isA("sap.ui.comp.smartfield.SmartField")){return e.getDataSourceLabel()}};g.prototype._createLabel=function(e){var t=null;var i=this._getFieldRelevantForLabel();if(i){if(i.getShowLabel&&i.getShowLabel()){t=new o(i.getId()+"-label");if(e){if(!i._oTextLabelSetByGroupElement){i._oTextLabelSetByGroupElement={oldText:i.getComputedTextLabel()}}i.setTextLabel(e);t.setText(e)}t.setLabelFor(i)}}else{t=new l(this.getId()+"-label",{text:e})}if(t){t._bCreatedByGroupElement=true;t.isRequired=v;t.isDisplayOnly=_;t.isWrapping=F;this._oLabel=t;if(!this._bHorizontalLayoutUsed){this.setAggregation("_label",t,true)}if(this._oSetLabel&&typeof this._oSetLabel!=="string"){this._oSetLabel.setAlternativeLabelFor(null)}}return t};g.prototype.updateLabelOfFormElement=function(){var e=false,t=null;var i=this.getElements();var l=this._getFieldRelevantForLabel();var s=this._getLabel();var r=false;if(s&&s._bCreatedByGroupElement){if(s instanceof o){if(!l||s._sSmartFieldId&&s._sSmartFieldId!=l.getId()){r=true}}else if(l){r=true}if(r){s.destroy();delete this._oLabel;s=null;if(this._oSetLabel&&!l){if(typeof this._oSetLabel==="string"){a.prototype.setLabel.apply(this,[this._oSetLabel]);s=this._oLabel;this._oLabel.isRequired=v;this._oLabel.isDisplayOnly=_}else{s=this._oSetLabel}y.call(this)}}}else if(s&&l){if(s==this._oLabel){s.destroy();delete this._oLabel}s=null}if(!s){if(this._oSetLabel){if(typeof this._oSetLabel==="string"){t=this._oSetLabel}else{t=this._oSetLabel.getText()}}else{t=""}}if(!s&&i.length>0){s=this._createLabel(t);e=true}if(s){if(s instanceof o){if(l&&l.setTextLabel&&l.getComputedTextLabel()){s.setText(l.getComputedTextLabel())}}c.call(this,s,l)}if(e){y.call(this);if(s&&s.setLabelFor&&!(s instanceof o)&&!l&&i.length>0){s.setLabelFor(i[0])}}};g.prototype.setEditMode=function(e){this._setEditable(e);return this};function x(e){var t=this.getElements();for(var i=0;i<t.length;i++){var a=t[i];C.call(this,a,e)}}function C(e,t){if(e instanceof n){if(!(e.data("editable")===false)){e.setContextEditable(t)}}}g.prototype.invalidateLabel=function(){var e=this._getLabel();if(e){e.invalidate()}};g.prototype._updateFormElementVisibility=function(){var e=this.getVisibleBasedOnElements();if(this._bVisibleElements!==e){this._bVisibleElements=e;if(this.isPropertyInitial("visible")){O.call(this);this.invalidate()}}};g.prototype._updateLayout=function(){var e=null;var t=null;var i=null;var a=this.getUseHorizontalLayout();var l;var s=0;var r;if(a==this._bHorizontalLayoutUsed){return}if(a&&!S.call(this)){return}var o=this.getElements();var n=this._getLabel();this._bNoObserverChange=true;if(a){if(o.length>0){if(o[0].getLayoutData()){i=o[0].getLayoutData()}this.removeAllFields();if(o.length>1){for(s=0;s<o.length;s++){r=o[s];if(s>0){D.call(this,r)}}t=V.call(this,o.slice(0))}if(t){l=[t]}else{l=o.slice(0)}e=B.call(this,l,n,i);this.addField(e);if(n){E.call(this)}}}else{var u=this.getFields();if(u[0]instanceof f){e=u[0];l=e.getItems();if(o.length>1&&l.length>0){if(n){if(l.length>1&&l[1]instanceof h){t=l[1]}}else if(l[0]instanceof h){t=l[0]}if(t){t.removeAllItems();t.destroy()}}e.removeAllItems();e.destroy()}this.removeAllFields();for(s=0;s<o.length;s++){r=o[s];T.call(this,r);this.addField(r)}if(n){if(n==this._oLabel){this.setAggregation("_label",n,true)}else{this.setAggregation("label",n)}}}this._bHorizontalLayoutUsed=a;this._bNoObserverChange=false};function S(){if((!f||!h||!p||!b||!d)&&!this._bVBoxRequested){f=sap.ui.require("sap/m/VBox");h=sap.ui.require("sap/m/HBox");p=sap.ui.require("sap/m/FlexItemData");b=sap.ui.require("sap/ui/core/VariantLayoutData");d=sap.ui.require("sap/ui/layout/GridData");if(!f||!h||!p||!b||!d){sap.ui.require(["sap/m/VBox","sap/m/HBox","sap/m/FlexItemData","sap/ui/core/VariantLayoutData","sap/ui/layout/GridData"],I.bind(this));this._bVBoxRequested=true}}if(f&&h&&p&&b&&d&&!this._bVBoxRequested){return true}else{return false}}function I(e,t,i,a,l){f=e;h=t;p=i;b=a;d=l;this._bVBoxRequested=false;if(!this._bIsBeingDestroyed){this._updateLayout()}}function D(e){var t=e.getLayoutData();if(t){if(t.getStyleClass&&!t.getStyleClass()){t.setStyleClass("sapUiCompGroupElementHBoxPadding")}}else{t=new p({styleClass:"sapUiCompGroupElementHBoxPadding"});t._bCreatedByGroupElement=true;e.setLayoutData(t)}}function T(e){var t=e.getLayoutData();if(t){if(t._bCreatedByGroupElement){t.destroy()}else if(t.getStyleClass&&t.getStyleClass()=="sapUiCompGroupElementHBoxPadding"){t.setStyleClass()}}}function B(e,t,i){if(!g._myVBox){g._myVBox=f.extend("SmartFormVBox",{metadata:{interfaces:["sap.ui.core.IFormContent"]},enhanceAccessibilityState:G,renderer:{apiVersion:2}})}this._bMoveLabelToVBox=true;var a=e.slice(0);if(t){a.splice(0,0,t)}var l=new g._myVBox(this.getId()+"--VBox",{items:a});this._bMoveLabelToVBox=false;l.addStyleClass("sapUiCompGroupElementVBox");l._oGroupElement=this;if(i&&(i instanceof d||i instanceof b||i.isA("sap.ui.layout.ResponsiveFlowLayoutData"))){l.setLayoutData(i.clone())}A.call(this,l);return l}function V(e){var t=new h(this.getId()+"--HBox",{items:e});t._oGroupElement=this;t.enhanceAccessibilityState=G;return t}function G(e,t){var i=this._oGroupElement._getLabel();if(i&&i!=e&&!(e instanceof h)){var a=t["labelledby"];if(!a){a=i.getId()}else{var l=a.split(" ");if((l?Array.prototype.indexOf.call(l,i.getId()):-1)<0){l.splice(0,0,i.getId());a=l.join(" ")}}t["labelledby"]=a}}g.prototype._updateGridDataSpan=function(){if(!this._bHorizontalLayoutUsed){return}var e=this.getFields();if(e.length>0){var t=e[0];if(t instanceof f){A.call(this,t)}}};function A(e){var t=this.getParent();if(!t||!t.addGroupElement){return}var i=t.getParent();while(i&&!i.addGroup&&i.getParent){i=i.getParent()}if(!i){return}var a="";var l=i.getLayout();if(l){a=l.getGridDataSpan()}var s=e.getLayoutData();var r;if(s){if(!(s instanceof d)&&!(s instanceof b)&&a){r=new d({span:a});r._bFromGroupElement=true;var o=new b({multipleLayoutData:[s,r]});o._bFromGroupElement=true;e.setLayoutData(o)}else if(s instanceof d){if(s._bFromGroupElement){if(!a){s.destroy()}else{s.setSpan(a)}}}else if(s instanceof b){var n=false;s.getMultipleLayoutData().forEach(function(e){if(e instanceof d){n=true;if(e._bFromGroupElement){if(!a){e.destroy()}else{e.setSpan(a)}}}});if(!n&&a){r=new d({span:a});r._bFromGroupElement=true;s.addMultipleLayoutData(r)}if(s._bFromGroupElement&&s.getMultipleLayoutData().length==1){r=s.getMultipleLayoutData()[0];e.setLayoutData(r);s.destroy()}}}else if(a){r=new d({span:a});r._bFromGroupElement=true;e.setLayoutData(r)}var u=this.getElements();for(var f=0;f<u.length;f++){var h=u[f];if(h&&h.setControlContext){if(a){h.setControlContext(m.SmartFormGrid)}else{h.setControlContext(m.Form)}}}}g.prototype._setLinebreak=function(e,t,i,a){if(!this._bHorizontalLayoutUsed){return}var l=this.getFields();if(l.length>0){var s=l[0];if(!(s instanceof f)){return}var r=s.getLayoutData();if(r){if(r instanceof b){var o=r.getMultipleLayoutData();for(var n=0;n<o.length;n++){r=o[n];if(r instanceof d){r.setLinebreakXL(e);r.setLinebreakL(t);r.setLinebreakM(i);r.setLinebreakS(a)}}}else if(r instanceof d){r.setLinebreakXL(e);r.setLinebreakL(t);r.setLinebreakM(i);r.setLinebreakS(a)}}}};g.prototype.setVisible=function(e){var t=this.isVisible();a.prototype.setVisible.apply(this,arguments);if(t!=e){O.call(this)}return this};g.prototype.isVisible=function(){if(this.isPropertyInitial("visible")){return this._bVisibleElements}else{return this.getVisible()}};function O(){this.fireVisibleChanged({visible:this.isVisible()});if(this.getParent()){this.getParent()._updateLineBreaks()}}g.prototype.getFormElement=function(){return this};g.prototype.addElement=function(e){if(!e){return this}e=this.validateAggregation("elements",e,true);P.call(this,e);var t;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){t=this._oLabel._sSmartFieldId}if(this._bHorizontalLayoutUsed){H.call(this,e,undefined,true)}else{this.addField(e)}if(t&&t!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(t)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};g.prototype.insertElement=function(e,t){if(!e){return this}e=this.validateAggregation("elements",e,true);P.call(this,e);var i;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){i=this._oLabel._sSmartFieldId}if(this._bHorizontalLayoutUsed){H.call(this,e,t,false)}else{this.insertField(e,t)}if(i&&i!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(i)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};g.prototype.getElements=function(){var e;var t;if(this._bHorizontalLayoutUsed){e=this.getFields();t=this._extractFields(e,true)}else{t=this.getFields()}return t};g.prototype.indexOfElement=function(e){var t=-1;if(this._bHorizontalLayoutUsed){var i=this.getElements();for(var a=0;a<i.length;a++){if(e==i[a]){t=a;break}}}else{t=this.indexOfField(e)}return t};g.prototype.removeElement=function(e){var t;var i;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){i=this._oLabel._sSmartFieldId}if(this._bHorizontalLayoutUsed){t=U.call(this,e,false)}else{t=this.removeField(e)}if(t){q.call(this,t)}if(i&&i!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(i)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return t};g.prototype.removeAllElements=function(){var e;if(this._bHorizontalLayoutUsed){e=U.call(this,undefined,true)}else{e=this.removeAllFields()}if(e&&Array.isArray(e)){for(var t=0;t<e.length;t++){q.call(this,e[t])}}this.updateLabelOfFormElement();this._updateFormElementVisibility();return e};g.prototype.destroyElements=function(){if(this._bHorizontalLayoutUsed){var e=this.getFields();if(e.length>0){var t=this._getLabel();if(t){e[0].removeItem(t);if(t==this._oLabel){this.setAggregation("_label",t,true)}else{this.setAggregation("label",t)}}this.destroyFields()}}else{this.destroyFields()}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};g.prototype._observeChanges=function(e){a.prototype._observeChanges.apply(this,arguments);if(e.object==this){switch(e.name){case"useHorizontalLayout":this._updateLayout();break;case"horizontalLayoutGroupElementMinWidth":u.error("HorizontalLayoutGroupElementMinWidth is deprecated",this);this._updateLayout();break;case"elementForLabel":this.updateLabelOfFormElement();break;case"_editable":x.call(this,e.current);break;default:break}}else{M.call(this,e)}};function H(e,t,i){var a=this._getLabel();var l=this.getFields();var s;var r;var o;if(l.length>0){s=l[0]}else{o=[e];var n=e.getLayoutData();s=B.call(this,o,a,n);this.addField(s);if(a){E.call(this)}return}if(!(s instanceof f)){return}o=s.getItems();if(a){if(o.length>1){r=o[1]}}else if(o.length>0){r=o[0]}if(r instanceof h){o=r.getItems();if((i||t>0)&&o.length>0){D.call(this,e)}if(i){r.addItem(e)}else{if(t==0&&o.length>0){D.call(this,o[0])}r.insertItem(e,t)}}else{var u=r;o=[];if(u){s.removeItem(u);if(i||t>0){o.push(u);o.push(e);D.call(this,e)}else{o.push(e);o.push(u);D.call(this,u)}r=V.call(this,o);s.addItem(r)}else{s.addItem(e)}if(a){E.call(this)}}}function P(e){if(e.getEditable){if(!e.getEditable()){e.data("editable",false)}}this._oObserver.observe(e,{properties:["visible"]});if(e.attachInnerControlsCreated){e.attachInnerControlsCreated(this._updateFormElementLabel,this)}if(e.setControlContext){e.setControlContext(m.Form)}if(e.getMetadata().getProperty("mandatory")){this._oObserver.observe(e,{properties:["mandatory"]})}C.call(this,e,this.getProperty("_editable"));R.call(this,e)}function R(e){if(e instanceof n){var t=this.getCustomData();for(var i=0;i<t.length;i++){z.call(this,e,t[i])}}}function z(t,i){if(t instanceof n&&e.smartform.inheritCostomDataToFields(i)&&!t.data(i.getKey())){var a=i.clone();a._bFromGroupElement=true;a._sOriginalId=i.getId();t.addCustomData(a)}}function M(e){if(e.name=="mandatory"){this.invalidateLabel()}else if(e.name=="visible"){this._updateFormElementVisibility()}}function U(e,t){var i=this._getLabel();var a=this.getFields();var l;var s;var r;var o;var n=false;var u;if(a.length>0){l=a[0]}if(!(l instanceof f)){return null}r=l.getItems();if(i){if(r.length>1){s=r[1]}}else if(r.length>0){s=r[0]}if(s instanceof h){if(t){o=s.removeAllItems();n=true}else{o=s.removeItem(e);r=s.getItems();if(r.length>0){T.call(this,r[0]);if(r.length==1){u=r[0];s.removeAllItems();l.removeItem(s);s.destroy();l.addItem(u)}}}}else{if(t){o=l.removeAllItems()}else{o=l.removeItem(e)}if(o){n=true}}if(n){if(i){l.removeItem(i);if(i==this._oLabel){this.setAggregation("_label",i,true)}else{this.setAggregation("label",i)}}this.removeField(l);l.destroy()}if(o){if(Array.isArray(o)){for(var p=0;p<o.length;p++){u=o[p];T.call(this,u)}}else{T.call(this,o)}}return o}function q(e){if(e.detachInnerControlsCreated){e.detachInnerControlsCreated(this._updateFormElementLabel,this)}if(e.setControlContext){e.setControlContext(m.None)}w.call(this,e);k.call(this,e,this.getLabelText())}function k(e,t){if(e._oTextLabelSetByGroupElement){if(e.getComputedTextLabel()==t){e.setTextLabel(e._oTextLabelSetByGroupElement.oldText)}delete e._oTextLabelSetByGroupElement}}function w(e,t){if(e instanceof n){var i=e.getCustomData();for(var a=0;a<i.length;a++){var l=i[a];if(l._bFromGroupElement&&(!t||t==l._sOriginalId)){e.removeCustomData(l);l.destroy()}}}}g.prototype._updateFormElementLabel=function(e){var t=this._getFieldRelevantForLabel();var i=this._getLabel();var a=e.oSource;var l=e.getParameters();if(i instanceof o&&a&&l&&a===t){i.updateLabelFor(l)}};g.prototype.addCustomData=function(e){if(!e){return this}a.prototype.addCustomData.apply(this,arguments);var t=this.getElements();for(var i=0;i<t.length;i++){z.call(this,t[i],e)}return this};g.prototype.insertCustomData=function(e,t){if(!e){return this}a.prototype.insertCustomData.apply(this,arguments);var i=this.getElements();for(var l=0;l<i.length;l++){z.call(this,i[l],e)}return this};g.prototype.removeCustomData=function(e){var t=a.prototype.removeCustomData.apply(this,arguments);if(t){var i=this.getElements();for(var l=0;l<i.length;l++){w.call(this,i[l],t.getId())}}return t};g.prototype.removeAllCustomData=function(){var e=a.prototype.removeAllCustomData.apply(this,arguments);if(e.length>0){var t=this.getElements();for(var i=0;i<t.length;i++){w.call(this,t[i])}}return e};g.prototype.destroyCustomData=function(){a.prototype.destroyCustomData.apply(this,arguments);var e=this.getElements();for(var t=0;t<e.length;t++){w.call(this,e[t])}return this};g.prototype.getVisibleBasedOnElements=function(){var e=false;var t=this.getElements();if(t&&t.length>0){e=t.some(function(e){return e.getVisible()})}return e};function W(){var e=this.getTooltip();if(!e||typeof e==="string"||e instanceof String){return e}else{return e.getText()}}g.prototype.clone=function(e,t){var i=this.removeAllElements();var l=a.prototype.clone.apply(this,arguments);for(var s=0;s<i.length;s++){var r=i[s];var o=r.clone(e,t);this.addElement(r);l.addElement(o)}return l};return g});
//# sourceMappingURL=GroupElement.js.map