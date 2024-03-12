/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/ui/core/Control","sap/ui/layout/form/SemanticFormElement","sap/ui/layout/form/FormHelper","sap/m/Label","sap/m/Button","sap/m/Text","sap/ui/comp/smartfield/SmartLabel","sap/ui/comp/smartfield/SmartField","sap/base/Log"],function(e,t,i,a,r,o,l,s,n,u){"use strict";var f;var h;var p=e.smartfield.ControlContextType;var m=i.extend("sap.ui.comp.smartform.SemanticGroupElement",{metadata:{library:"sap.ui.comp",interfaces:["sap.ui.comp.IFormGroupElement"],properties:{elementForLabel:{type:"int",group:"Misc",defaultValue:0}},defaultAggregation:"elements",aggregations:{elements:{type:"sap.ui.core.Control",multiple:true,singularName:"element"}},events:{visibleChanged:{}}},_bVisibleElements:false});function d(e,i){if(e==this._oSetLabelFromOutside){return}var a;if(this._oSetLabelFromOutside&&this._oSetLabelFromOutside instanceof t){a=b.call(this._oSetLabelFromOutside)}if(!a){a=b.call(this)}if(a){if(e instanceof s){if(i&&i.setTooltipLabel){i.setTooltipLabel(a)}}else{e.setTooltip(a)}}}function b(){var e=this.getTooltip();if(!e||typeof e==="string"||e instanceof String){return e}else{return e.getText()}}function g(e){if(e.getParameter("name")=="text"){var t=e.oSource;var i=t.getText();if(this._oLabel){this._oLabel.setText(i)}var a=this._getFieldRelevantForLabel();if(a&&a.getComputedTextLabel){if(!a._oTextLabelSetBySemanticGroupElement){a._oTextLabelSetBySemanticGroupElement={oldText:a.getComputedTextLabel()}}a.setTextLabel(i)}}}function c(){if(this.getRequired&&this.getRequired()){return true}var e=this.getParent();var t=e.getElements();for(var i=0;i<t.length;i++){var a=t[i];if(a.getRequired&&a.getRequired()===true&&(!a.getEditable||a.getEditable())&&(!a.getContextEditable||a.getContextEditable())){return true}}return false}function y(){if(this.getDisplayOnly){if(!this.isPropertyInitial("displayOnly")){return this.getDisplayOnly()}var e=this.getParent();var t=e.getParent();if(t){var i=t.getParent();if(i){return!i.getEditable()}}}return false}function L(){var e=this.getParent();if(e._oSetLabelFromOutside&&!(typeof e._oSetLabelFromOutside==="string")&&e._oSetLabelFromOutside.getWrapping&&!e._oSetLabelFromOutside.isPropertyInitial("wrapping")){return e._oSetLabelFromOutside.getWrapping()}return true}function _(e,t){if(e._oTextLabelSetBySemanticGroupElement){if(e.getComputedTextLabel()==t){e.setTextLabel(e._oTextLabelSetBySemanticGroupElement.oldText)}delete e._oTextLabelSetBySemanticGroupElement}}function v(e){e._bCreatedBySemanticGroupElement=true;e.isRequired=c;e.isDisplayOnly=y;e.isWrapping=L;return e}function F(e){if(e.getEditable){if(!e.getEditable()){e.data("editable",false)}}this._oObserver.observe(e,{properties:["visible"]});if(e.attachInnerControlsCreated){e.attachInnerControlsCreated(this._updateFormElementLabel,this)}if(e.setControlContext){e.setControlContext(p.Form)}if(e.getMetadata().getProperty("mandatory")){this._oObserver.observe(e,{properties:["mandatory"]})}x.call(this,e,this.getProperty("_editable"));O.call(this,e);if(e.isA("sap.ui.comp.smartfield.SmartField")&&e._isInnerControlCreationDelayed&&e.getMode()==="display"){e._forceInitialise()}if(e.isA("sap.ui.comp.smartfield.SmartField")){e.attachInnerControlsCreated(function(){this._observeChanges({object:e,name:"visible"});e.getInnerControls().forEach(function(t){var i=t.getBinding("text");if(i){i.attachChange(function(){this._observeChanges({object:e,name:"visible"})}.bind(this))}}.bind(this))}.bind(this))}}function S(e){if(e.name=="mandatory"){this.invalidateLabel()}else if(e.name=="visible"){this._updateFormElementVisibility()}}function E(){this.fireVisibleChanged({visible:this.isVisible()});if(this.getParent()){this.getParent()._updateLineBreaks()}}function C(e){var t=this.getElements();for(var i=0;i<t.length;i++){var a=t[i];x.call(this,a,e)}}function x(e,t){if(e instanceof n){if(!(e.data("editable")===false)){e.setContextEditable(t)}}}function O(e){if(e instanceof n){var t=this.getCustomData();for(var i=0;i<t.length;i++){T.call(this,e,t[i])}}}function D(e,t){if(e instanceof n){var i=e.getCustomData();for(var a=0;a<i.length;a++){var r=i[a];if(r._bFromSemanticGroupElement&&(!t||t==r._sOriginalId)){e.removeCustomData(r);r.destroy()}}}}function T(t,i){if(t instanceof n&&e.smartform.inheritCostomDataToFields(i)&&!t.data(i.getKey())){var a=i.clone();a._bFromSemanticGroupElement=true;a._sOriginalId=i.getId();t.addCustomData(a)}}function I(e){if(e.detachInnerControlsCreated){e.detachInnerControlsCreated(this._updateFormElementLabel,this)}if(e.setControlContext){e.setControlContext(p.None)}D.call(this,e);_.call(this,e,this.getLabelText())}m.prototype.init=function(){i.prototype.init.apply(this,arguments);this._oObserver.observe(this,{properties:["elementForLabel","_editable","delimiter"]})};m.prototype._getFieldRelevantForLabel=function(){var e=this.getElements();var t=this.getElementForLabel();if(e.length>t&&e[t]instanceof n){return e[t]}return null};m.prototype._extractFields=function(e,t){var i=[];e.forEach(function(e){i.push(e)});if(t){i=i.filter(function(e){return!(e instanceof r)})}return i};m.prototype._observeChanges=function(e){i.prototype._observeChanges.apply(this,arguments);if(e.object==this){switch(e.name){case"useHorizontalLayout":u.error("useHorizontalLayout can't be used with SemanticGroupElement",this);break;case"elementForLabel":this.updateLabelOfFormElement();break;case"_editable":C.call(this,e.current);break;default:break}}else{S.call(this,e)}};m.prototype._getLabel=function(){if(this._oLabel){return this._oLabel}else{return this._oSetLabelFromOutside}};m.prototype._createLabel=function(e){var t=null;var i=this._getFieldRelevantForLabel();if(i){if(i.getShowLabel&&i.getShowLabel()){t=new s(i.getId()+"-label");if(e){if(!i._oTextLabelSetBySemanticGroupElement){i._oTextLabelSetBySemanticGroupElement={oldText:i.getComputedTextLabel()}}i.setTextLabel(e);t.setText(e)}t.setLabelFor(i)}}else{t=new r(this.getId()+"-label",{text:e})}if(t){t=v(t);this._oLabel=t;this.setAggregation("_label",t,true);if(this._oSetLabelFromOutside&&typeof this._oSetLabelFromOutside!=="string"){this._oSetLabelFromOutside.setAlternativeLabelFor(null)}}return t};m.prototype._updateFormElementLabel=function(e){var t=this._getFieldRelevantForLabel();var i=this._getLabel();var a=e.oSource;var r=e.getParameters();if(i instanceof s&&a&&r&&a===t){i.updateLabelFor(r)}};m.prototype._updateFormElementVisibility=function(){var e=this.getVisibleBasedOnElements();if(this._bVisibleElements!==e){this._bVisibleElements=e;if(this.isPropertyInitial("visible")){E.call(this);this.invalidate()}}};m.prototype._updateGridDataSpan=function(){};m.prototype._setLinebreak=function(e,t,i,a){var r=this.getFields();if(r.length>0){var o=r[0];if(!(o instanceof f)){return}var l=o.getLayoutData();if(l instanceof h){l.setLinebreakXL(e);l.setLinebreakL(t);l.setLinebreakM(i);l.setLinebreakS(a)}}};m.prototype.getFieldsForRendering=function(){var e,t,i,r,o=this.getDelimiter(),l=this.getId()+"-delimiter-",s=true,n=true,u=false,f=true,h=true,p=[],m=this.getFields();for(e=0;e<m.length;e++){r=m[e];if(!r.isA("sap.ui.core.ISemanticFormContent")){s=false;break}if(n){var d=r.isA("sap.ui.comp.smartfield.SmartField"),b=r._getEmbeddedSmartField(),g=d&&!!b;if(d&&!r.getEditable()){n=g?!b.getEditable():true}else{n=false}if(!n){h=false}}if(!u){u=r._hasSemanticObject();if(!u){f=false}}if(!f&&!h){break}}if(!s){return}if(!this._bLayoutDataCreated){V.call(this)}if(this.getProperty("_editable")&&!h||f){i=this.getAggregation("_delimiters",[]);for(var c=0;c<m.length;c++){r=m[c];if(r.getVisible()){if(p.length>0){t=i[c-1];if(t===undefined){t=a.createDelimiter(o,l+c);t.addStyleClass("sapUiFormDelimiter");this.addAggregation("_delimiters",t)}p.push(t)}p.push(r)}}}else{var y=this.getAggregation("_displayField");if(!y){G.call(this,true);y=this.getAggregation("_displayField")}p.push(y)}return p};function V(){var e=this.getFields().filter(function(e){return e.getVisible()});var t=this.getAggregation("_delimiters",[]);var i=this.getParent();var a=i&&i.getParent();var r=a&&a.getLayout();var o;var l=0;if(!r||!r.getLayoutDataForDelimiter){return}if(this.getProperty("_editable")){for(l=0;l<t.length;l++){var s=t[l];if(!s.getLayoutData()){o=r.getLayoutDataForDelimiter();if(o){if(o instanceof Promise){o.then(function(e){e._bSetBySemanticFormElement=true;this.setLayoutData(e)}.bind(s))}else if(o.isA("sap.ui.core.LayoutData")){o._bSetBySemanticFormElement=true;s.setLayoutData(o)}}}}if(e.length>1){for(l=0;l<e.length;l++){var n=e[l];o=n.getLayoutData();if(!o||o._bSetBySemanticFormElement){o=r.getLayoutDataForSemanticField(e.length,l+1,o);if(o){if(o instanceof Promise){o.then(function(e){e._bSetBySemanticFormElement=true;this.setLayoutData(e)}.bind(n))}else if(o.isA("sap.ui.core.LayoutData")&&!o._bSetBySemanticFormElement){o._bSetBySemanticFormElement=true;n.setLayoutData(o)}}}}}this._bLayoutDataCreated=true}}var A={onBeforeRendering:function(){P.call(this,true)}};function G(e){var t=this.getAggregation("_displayField");if(t){P.call(this,false)}else{var i=this.getId()+"-display";t=a.createSemanticDisplayControl("",i);t.addDelegate(A,true,this);this.setAggregation("_displayField",t)}}function P(e){var t=this.getAggregation("_displayField");if(t&&(t.getDomRef()||e)){if(e&&t._bNoForceUpdate){t._bNoForceUpdate=false;return}var i=this.getFields();var r=[];var o=false;for(var l=0;l<i.length;l++){var s=i[l];if(s.getVisible()){var n=s.getFormValueProperty?s.getFormValueProperty():null;var u;if(s.getFormFormattedValue){u=s.getFormFormattedValue();if(u instanceof Promise){o=true}}else if(n){u=s.getProperty(n)}else if(s.getMetadata().getProperty("value")){u=s.getValue()}else if(s.getMetadata().getProperty("text")){u=s.getText()}r.push(u)}}t._bNoForceUpdate=true;if(o){Promise.all(r).then(function(e){var t=this.getAggregation("_displayField");var i=B.call(this,e);t._bNoForceUpdate=true;a.updateSemanticDisplayControl(t,i)}.bind(this))}else{var f=B.call(this,r);a.updateSemanticDisplayControl(t,f)}}else if(t&&t._bNoForceUpdate){t._bNoForceUpdate=false}}function B(e){var t=this.getDelimiter();var i="";for(var a=0;a<e.length;a++){i=i+e[a];if(a<e.length-1){i=i+" "+t+" "}}return i}m.prototype.setTooltip=function(e){i.prototype.setTooltip.apply(this,[e]);var t=this._getFieldRelevantForLabel();var a=this._getLabel();d.call(this,a,t);return this};m.prototype.setLabel=function(e){if(this._oSetLabelFromOutside&&typeof this._oSetLabelFromOutside!=="string"){this._oSetLabelFromOutside.detachEvent("_change",g,this)}var t;var a;var r;if(typeof e==="string"){t=this._getLabel();if(t){a=t.getText()}}else if(!e&&this._oSetLabelFromOutside){a=this.getLabelText()}i.prototype.setLabel.apply(this,[e]);this._oSetLabelFromOutside=e;if(typeof e==="string"){if(this._oLabel instanceof s&&e!=a&&(e.length>0||a.length>0)){r=this._getFieldRelevantForLabel();if(r&&e!=null){if(r.getComputedTextLabel){if(!r._oTextLabelSetBySemanticGroupElement){r._oTextLabelSetBySemanticGroupElement={oldText:r.getComputedTextLabel()}}r.setTextLabel(e)}}}this.setAggregation("_label",this._oLabel,true);this._oLabel.isRequired=c;this._oLabel.isDisplayOnly=y}else{if(e){if(e.isRequired){e.isRequired=c}if(e.isDisplayOnly){e.isDisplayOnly=y}e.attachEvent("_change",g,this)}else{r=this._getFieldRelevantForLabel();if(r){_.call(this,r,a)}}this.updateLabelOfFormElement()}return this};m.prototype.destroyLabel=function(){var e=this.getLabelText();i.prototype.destroyLabel.apply(this);delete this._oSetLabelFromOutside;var t=this._getFieldRelevantForLabel();if(t){_.call(this,t,e)}this.updateLabelOfFormElement();return this};m.prototype.getLabel=function(){return this._oSetLabelFromOutside};m.prototype.getLabelControl=function(){return this._getLabel()};m.prototype.getLabelText=function(){var e="";var t=this._getLabel();if(t){e=t.getText()}return e};m.prototype.getDataSourceLabel=function(){var e=this._getFieldRelevantForLabel();if(e&&e.isA("sap.ui.comp.smartfield.SmartField")){return e.getDataSourceLabel()}};m.prototype.updateLabelOfFormElement=function(){var e=false,t=null;var a=this.getElements();var r=this._getFieldRelevantForLabel();var o=this._getLabel();var l=false;if(o&&o._bCreatedBySemanticGroupElement){if(o instanceof s){if(!r||o._sSmartFieldId&&o._sSmartFieldId!=r.getId()){l=true}}else if(r){l=true}if(l){o.destroy();delete this._oLabel;o=null;if(this._oSetLabelFromOutside&&!r){if(typeof this._oSetLabelFromOutside==="string"){i.prototype.setLabel.apply(this,[this._oSetLabelFromOutside]);o=this._oLabel;this._oLabel.isRequired=c;this._oLabel.isDisplayOnly=y}else{o=this._oSetLabelFromOutside}}}}else if(o&&r){if(o==this._oLabel){o.destroy();delete this._oLabel}o=null}if(!o){if(this._oSetLabelFromOutside){if(typeof this._oSetLabelFromOutside==="string"){t=this._oSetLabelFromOutside}else{t=this._oSetLabelFromOutside.getText()}}else{t=""}}if(!o&&a.length>0){o=this._createLabel(t);e=true}if(o){if(o instanceof s){if(r&&r.setTextLabel&&r.getComputedTextLabel()){o.setText(r.getComputedTextLabel())}}d.call(this,o,r)}if(e){if(o&&o.setLabelFor&&!(o instanceof s)&&!r&&a.length>0){o.setLabelFor(a[0])}}};m.prototype.invalidateLabel=function(){var e=this._getLabel();if(e){e.invalidate()}};m.prototype.getUseHorizontalLayout=function(){u.error("getUseHorizontalLayout can't be used with SemanticGroupElement",this)};m.prototype.setUseHorizontalLayout=function(e){u.error("setUseHorizontalLayout can't be used with SemanticGroupElement",this)};m.prototype.getHorizontalLayoutGroupElementMinWidth=function(){u.error("getHorizontalLayoutGroupElementMinWidth can't be used with SemanticGroupElement",this)};m.prototype.setHorizontalLayoutGroupElementMinWidth=function(e){u.error("setHorizontalLayoutGroupElementMinWidth can't be used with SemanticGroupElement",this)};m.prototype.setVisible=function(e){var t=this.isVisible();i.prototype.setVisible.apply(this,arguments);if(t!=e){E.call(this)}return this};m.prototype.isVisible=function(){if(this.isPropertyInitial("visible")){return this._bVisibleElements}else{return this.getVisible()}};m.prototype.getVisibleBasedOnElements=function(){var e=false;var t=this.getElements();if(t&&t.length>0){e=t.some(function(e){return e.getVisible()})}return e};m.prototype.getFormElement=function(){return this};m.prototype.addElement=function(e){if(!e){return this}e=this.validateAggregation("elements",e,true);F.call(this,e);var t;if(this._oLabel&&this._oLabel._bCreatedBySemanticGroupElement&&this._oLabel._sSmartFieldId){t=this._oLabel._sSmartFieldId}this.addField(e);if(t&&t!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(t)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};m.prototype.insertElement=function(e,t){if(!e){return this}e=this.validateAggregation("elements",e,true);F.call(this,e);var i;if(this._oLabel&&this._oLabel._bCreatedBySemanticGroupElement&&this._oLabel._sSmartFieldId){i=this._oLabel._sSmartFieldId}this.insertField(e,t);if(i&&i!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(i)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};m.prototype.getElements=function(){var e;e=this.getFields();return e};m.prototype.indexOfElement=function(e){var t=-1;t=this.indexOfField(e);return t};m.prototype.removeElement=function(e){var t;var i;if(this._oLabel&&this._oLabel._bCreatedBySemanticGroupElement&&this._oLabel._sSmartFieldId){i=this._oLabel._sSmartFieldId}t=this.removeField(e);if(t){I.call(this,t)}if(i&&i!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(i)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return t};m.prototype.removeAllElements=function(){var e=this.removeAllFields();if(e&&Array.isArray(e)){for(var t=0;t<e.length;t++){I.call(this,e[t])}}this.updateLabelOfFormElement();this._updateFormElementVisibility();return e};m.prototype.destroyElements=function(){this.destroyFields();this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};m.prototype.addCustomData=function(e){if(!e){return this}i.prototype.addCustomData.apply(this,arguments);var t=this.getElements();for(var a=0;a<t.length;a++){T.call(this,t[a],e)}return this};m.prototype.insertCustomData=function(e,t){if(!e){return this}i.prototype.insertCustomData.apply(this,arguments);var a=this.getElements();for(var r=0;r<a.length;r++){T.call(this,a[r],e)}return this};m.prototype.removeCustomData=function(e){var t=i.prototype.removeCustomData.apply(this,arguments);if(t){var a=this.getElements();for(var r=0;r<a.length;r++){D.call(this,a[r],t.getId())}}return t};m.prototype.removeAllCustomData=function(){var e=i.prototype.removeAllCustomData.apply(this,arguments);if(e.length>0){var t=this.getElements();for(var a=0;a<t.length;a++){D.call(this,t[a])}}return e};m.prototype.destroyCustomData=function(){i.prototype.destroyCustomData.apply(this,arguments);var e=this.getElements();for(var t=0;t<e.length;t++){D.call(this,e[t])}return this};m.prototype.clone=function(e,t){var a=this.removeAllElements();var r=i.prototype.clone.apply(this,arguments);for(var o=0;o<a.length;o++){var l=a[o];var s=l.clone(e,t);this.addElement(l);r.addElement(s)}return r};return m});
//# sourceMappingURL=SemanticGroupElement.js.map