/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/ui/core/Control","sap/ui/core/theming/Parameters","sap/ui/layout/form/Form","sap/ui/base/ManagedObjectObserver","sap/base/Log","sap/m/Label","sap/m/Button","sap/m/Text"],function(t,e,i,o,s,a,r,n,l){"use strict";var u;var h;var p;var c;var f;var n;var g;var d;var m=t.smartform.SmartFormValidationMode;var y=t.smartform.Importance;var b={ResponsiveGridLayout:{layout:undefined,path:"sap/ui/layout/form/ResponsiveGridLayout",name:"sap.ui.layout.form.ResponsiveGridLayout",requested:false,loaded:lt,promise:undefined},ResponsiveLayout:{layout:undefined,path:"sap/ui/layout/form/ResponsiveLayout",name:"sap.ui.layout.form.ResponsiveLayout",requested:false,loaded:ut,promise:undefined},ColumnLayout:{layout:undefined,path:"sap/ui/layout/form/ColumnLayout",name:"sap.ui.layout.form.ColumnLayout",requested:false,loaded:ht,promise:undefined}};var _={apiVersion:2,render:function(t,e){t.openStart("div",e);t.class("sapUiCompSmartForm");t.openEnd();var i=e.getAggregation("content");t.renderControl(i);t.close("div")}};var v=e.extend("sap.ui.comp.smartform.SmartForm",{metadata:{library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartform/SmartForm.designtime",properties:{title:{type:"string",group:"Misc",defaultValue:null},useHorizontalLayout:{type:"boolean",group:"Misc",defaultValue:null,deprecated:true},horizontalLayoutGroupElementMinWidth:{type:"int",group:"Misc",defaultValue:null,deprecated:true},checkButton:{type:"boolean",group:"Misc",defaultValue:false},entityType:{type:"string",group:"Misc",defaultValue:null},expandable:{type:"boolean",group:"Misc",defaultValue:false},expanded:{type:"boolean",group:"Misc",defaultValue:null},editTogglable:{type:"boolean",group:"Misc",defaultValue:false},editable:{type:"boolean",group:"Misc",defaultValue:false},ignoredFields:{type:"string",group:"Misc",defaultValue:null},flexEnabled:{type:"boolean",group:"Misc",defaultValue:true},validationMode:{type:"sap.ui.comp.smartform.SmartFormValidationMode",group:"Misc",defaultValue:m.Standard},importance:{type:"sap.ui.comp.smartform.Importance",group:"Misc",defaultValue:y.Low}},defaultAggregation:"groups",aggregations:{groups:{type:"sap.ui.comp.smartform.Group",multiple:true,singularName:"group"},content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},layout:{type:"sap.ui.comp.smartform.SmartFormLayout",multiple:false},semanticObjectController:{type:"sap.ui.comp.navpopover.SemanticObjectController",multiple:false},customToolbar:{type:"sap.m.Toolbar",multiple:false},toolbar:{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{editToggled:{parameters:{editable:{type:"boolean"}}},checked:{parameters:{erroneousFields:{type:"sap.ui.comp.smartfield.SmartField[]"}}}}},renderer:_});v.prototype.init=function(){this._oForm=new o(this.getId()+"--Form");this._oForm.getToolbar=function(){var t=this.getParent();if(t&&!t.getExpandable()){return t._getToolbar()}};this.setAggregation("content",this._oForm);this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");this._oObserver=new s(B.bind(this));this._oObserver.observe(this,{properties:["editTogglable","title","checkButton","useHorizontalLayout","horizontalLayoutGroupElementMinWidth","expandable","expanded"],aggregations:["layout","customData"],associations:["ariaLabelledBy"]})};v.prototype.onBeforeRendering=function(){rt.call(this)};v.prototype.onAfterRendering=function(){var t=this.getSmartFields(false,false),e=this.getImportance();if(!this.isPropertyInitial("importance")){t.forEach(function(t){t._setVisibilityBasedOnImportance(e)})}};v.prototype.addGroup=function(t){var e=this,i,o,s;if(!t){return this}s=this._getSmartFieldsByGroup(t,false);s.forEach(function(t){i=t.setImportance;t.setImportance=function(){i.apply(this,arguments);o=e.getImportance();this._setVisibilityBasedOnImportance(o)}});t=this.validateAggregation("groups",t,true);z.call(this,t);this._oForm.addFormContainer(t);L.call(this,t);return this};v.prototype.getGroups=function(){return this._oForm.getFormContainers()};v.prototype.indexOfGroup=function(t){return this._oForm.indexOfFormContainer(t)};v.prototype.insertGroup=function(t,e){if(!t){return this}t=this.validateAggregation("groups",t,true);z.call(this,t);this._oForm.insertFormContainer(t,e);L.call(this,t);return this};v.prototype.removeGroup=function(t){var e=this._oForm.removeFormContainer(t);if(e){e.detachEvent("_visibleChanged",ft,this);H.call(this,e);ft.call(this)}return e};v.prototype.removeAllGroups=function(){var t=this._oForm.removeAllFormContainers();for(var e=0;e<t.length;e++){t[e].detachEvent("_visibleChanged",ft,this);H.call(this,t[e])}ft.call(this);return t};v.prototype.destroyGroups=function(){var t=this.getGroups();for(var e=0;e<t.length;e++){t[e].detachEvent("_visibleChanged",ft,this)}this._oForm.destroyFormContainers();ft.call(this);return this};function L(t){var e=this.getUseHorizontalLayout();var i=this.getHorizontalLayoutGroupElementMinWidth();t.attachEvent("_visibleChanged",ft,this);if(i!=t.getHorizontalLayoutGroupElementMinWidth){t.setHorizontalLayoutGroupElementMinWidth(i)}if(e!=t.getUseHorizontalLayout()){t.setUseHorizontalLayout(e)}if(e){t._updateGridDataSpan();t._updateLineBreaks()}else{ft.call(this)}}v.prototype._getToolbar=function(){var t=this.getCustomToolbar();return t||this.getAggregation("toolbar")};v.prototype.propagateGridDataSpan=function(){var t=this.getGroups();for(var e=0;e<t.length;e++){var i=t[e];i._updateGridDataSpan();i._updateLineBreaks()}return this};v.prototype._getGridDataSpanNumbers=function(){var t=this.getLayout();var e;if(t&&t._getGridDataSpanNumbers){e=t._getGridDataSpanNumbers()}return e};v.prototype._toggleEditMode=function(){var t=this.getEditable();this.setEditable(!t)};v.prototype.check=function(t){var e={considerOnlyVisible:true,handleSuccess:false};if(typeof t==="boolean"){e.considerOnlyVisible=t}else{e=Object.assign(e,t)}if(this.getValidationMode()===m.Standard){return this._checkClientError(e)}else{return this._checkClientErrorAsync(e)}};v.prototype._checkClientError=function(t){if(t.considerOnlyVisible===undefined){t.considerOnlyVisible=true}var e=this.getSmartFields(t.considerOnlyVisible,t.considerOnlyVisible);var i=[];var o=null;e.forEach(function(e){if(e.checkClientError&&e.checkClientError({handleSuccess:t.handleSuccess})){if(t.considerOnlyVisible&&e.getVisible){if(!e.getVisible()){return}}o=e.getParent();while(o.getParent){o=o.getParent();if(o.isA("sap.ui.comp.smartform.Group")){if(!o.getExpanded()){o.setExpanded(true)}break}}i.push(e.getId())}});return i};v.prototype._checkClientErrorAsync=function(t){var e=this.getSmartFields(t.considerOnlyVisible,t.considerOnlyVisible),i,o=[],s;this.setBusy(true);if(t.considerOnlyVisible===undefined){t.considerOnlyVisible=true}i=e.map(function(e){if(t.considerOnlyVisible&&!e.getVisible()){return false}return e.checkValuesValidity({handleSuccess:t.handleSuccess}).catch(function(){s=e.getParent();while(s.getParent){s=s.getParent();if(s.isA("sap.ui.comp.smartform.Group")){if(!s.getExpanded()){s.setExpanded(true)}break}}o.push(e.getId())})});return Promise.all(i).then(function(){this.setBusy(false);return o}.bind(this))};v.prototype._displayError=function(t){var e=this._oRb.getText("FORM_CLIENT_CHECK_ERROR_TITLE");var i=this._oRb.getText("FORM_CLIENT_CHECK_ERROR");if(!g&&!this._bMessageBoxRequested){g=sap.ui.require("sap/m/MessageBox");if(!g){sap.ui.require(["sap/m/MessageBox"],C.bind(this));this._bMessageBoxRequested=true}}if(g){g.show(i,{icon:g.Icon.ERROR,title:e,styleClass:this.$()&&this.$().closest(".sapUiSizeCompact").length?"sapUiSizeCompact":""})}};function C(t){g=t;this._bMessageBoxRequested=false;if(!this._bIsBeingDestroyed){T.call(this)}}function T(){var t=this.check(true);if(t&&t.length>0){this._displayError(t);return true}return false}function E(){return this.check(true).then(function(t){if(t&&t.length){this._displayError(t)}return t}.bind(this))}v.prototype.setEditable=function(t){var e=this.getEditable();t=this.validateProperty("editable",t);if(e===t){return this}if(!t&&this.hasListeners("editToggled")){if(this.getValidationMode()===m.Standard){if(T.call(this)){return this}}else{E.call(this).then(function(e){if(e.length){return this.setProperty("editable",true)}S.call(this,t)}.bind(this));return this.setProperty("editable",t)}}this.setProperty("editable",t);S.call(this,t);return this};function S(t){if(this._oForm){this._oForm.setEditable(t)}this.fireEditToggled({editable:t});if(this._oEditToggleButton){this._oEditToggleButton.setIcon(t?"sap-icon://display":"sap-icon://edit");var e=this._oRb.getText(t?"FORM_TOOLTIP_DISPLAY":"FORM_TOOLTIP_EDIT");this._oEditToggleButton.setTooltip(e)}if(this.getCheckButton()&&t){Z.call(this)}else{tt.call(this)}}function B(t){if(t.object==this){if(t.name=="editTogglable"){F.call(this,t.current)}else if(t.name=="title"){M.call(this,t.current)}else if(t.name=="checkButton"){k.call(this,t.current)}else if(t.name=="useHorizontalLayout"){I.call(this,t.current)}else if(t.name=="horizontalLayoutGroupElementMinWidth"){G.call(this,t.current)}else if(t.name=="expanded"){V.call(this,t.current)}else if(t.name=="expandable"){O.call(this,t.current)}else if(t.name=="layout"){R.call(this,t.child,t.mutation)}else if(t.name=="customData"){x.call(this,t.child,t.mutation)}else if(t.name=="ariaLabelledBy"){X.call(this,t.ids,t.mutation)}}else if(t.object.isA("sap.ui.comp.smartform.SmartFormLayout")){mt.call(this,t.object,t.name,t.current,t.old)}}function F(t){if(t){J.call(this)}else{Q.call(this)}N.call(this)}function M(t){if(this._oPanel){this._oPanel.setHeaderText(t)}N.call(this)}function k(t){if(t){Z.call(this)}else{tt.call(this)}N.call(this)}function I(t){if(t){this.addStyleClass("sapUiCompSmartFormHorizontalLayout")}else{this.removeStyleClass("sapUiCompSmartFormHorizontalLayout")}var e=this.getGroups();if(e){e.forEach(function(e){if(e.getUseHorizontalLayout()!=t){e.setUseHorizontalLayout(t)}})}var i=this.getLayout();if(t){pt.call(this,i)}else{rt.call(this);pt.call(this,i)}}function R(t,e){if(e==="remove"){this._oObserver.unobserve(t)}else{this._oObserver.observe(t,{properties:true})}if(t.isA("sap.ui.comp.smartform.Layout")){this.propagateGridDataSpan()}rt.call(this);pt.call(this,e==="insert"?t:null)}function G(t){a.error("HorizontalLayoutGroupElementMinWidth is deprecated",this);var e=this.getGroups();if(e){e.forEach(function(e){e.setHorizontalLayoutGroupElementMinWidth(t)})}}v.prototype.getVisibleProperties=function(){var t=[];var e=this.getGroups();if(e){e.forEach(function(e){var i=e.getGroupElements();if(i.length>0){i.forEach(function(e){var i=e.getElements();if(i.length>0){i.forEach(function(e){if(e.getVisible()){var i=e.getBindingPath("value");if(i){t.push(i)}}})}})}})}return t};v.prototype.setCustomToolbar=function(t){var e=this.getCustomToolbar();if(e==t){return this}K.call(this);Q.call(this);tt.call(this);this.setAggregation("customToolbar",t);if(this.getTitle()){N.call(this)}if(this.getEditTogglable()){J.call(this)}if(this.getCheckButton()){Z.call(this)}return this};v.prototype.destroyCustomToolbar=function(){var t=this.getCustomToolbar();if(t){K.call(this);Q.call(this);tt.call(this)}this.destroyAggregation("customToolbar");if(this.getTitle()){N.call(this)}if(this.getEditTogglable()){J.call(this)}if(this.getCheckButton()){Z.call(this)}return this};function O(t){if(t){if(!u&&!this._bPanelRequested){u=sap.ui.require("sap/m/Panel");if(!u){sap.ui.require(["sap/m/Panel"],q.bind(this));this._bPanelRequested=true}}if(u){P.call(this)}}else if(this._oPanel){this.setAggregation("content",this._oForm);this._oPanel.destroy();this._oPanel=null}N.call(this)}function P(){this._oPanel=new u(this.getId()+"--Panel",{expanded:this.getExpanded(),expandable:true,headerText:this.getTitle(),expandAnimation:false});this._oPanel.getHeaderToolbar=function(){var t=this.getParent();if(t){return t._getToolbar()}};this._oPanel.attachExpand(A,this);this.setAggregation("content",this._oPanel);this._oPanel.addContent(this._oForm)}function q(t){u=t;this._bPanelRequested=false;if(this.getExpandable()&&!this._bIsBeingDestroyed){P.call(this)}}function A(t){this.setProperty("expanded",t.getParameter("expand"),true)}function V(t){if(this._oPanel){this._oPanel.setExpanded(t)}}function x(t,e){var i=this.getGroups();for(var o=0;o<i.length;o++){if(e==="insert"){D.call(this,i[o],t)}else{H.call(this,i[o],t.getId())}}}function z(t){var e=this.getCustomData();for(var i=0;i<e.length;i++){D.call(this,t,e[i])}}function D(e,i){if(t.smartform.inheritCostomDataToFields(i)){var o=i.clone();o._bFromSmartForm=true;o._sOriginalId=i.getId();e.addCustomData(o)}}function H(t,e){var i=t.getCustomData();for(var o=0;o<i.length;o++){var s=i[o];if(s._bFromSmartForm&&(!e||e==s._sOriginalId)){t.removeCustomData(s)}}}function X(t,e){var i;if(Array.isArray(t)){i=t}else{i=[t]}for(var o=0;o<i.length;o++){var s=i[o];if(e==="insert"){this._oForm.addAriaLabelledBy(s)}else{this._oForm.removeAriaLabelledBy(s)}}}v.prototype._getSmartFieldsByGroup=function(t,e){var i=[],o=[],s=[];i=t.getGroupElements();for(var a=0;a<i.length;a++){var r=i[a];if(!e||e&&r.isVisible()){o=r.getElements();for(var n=0;n<o.length;n++){var l=o[n];if(l.isA("sap.ui.comp.smartfield.SmartField")){s.push(l)}}}}return s};v.prototype.getSmartFields=function(t,e){var i=[],o,s=[];if(t===undefined){t=true}i=this.getGroups();for(var a=0;a<i.length;a++){var r=i[a];if(!t||t&&r.isVisible()){o=this._getSmartFieldsByGroup(r,e);s=s.concat(o)}}return s};v.prototype.setFocusOnEditableControl=function(){var t=[];this.getGroups().forEach(function(e){if(e.isVisible()){e.getGroupElements().forEach(function(e){if(e.isVisible()){t=t.concat(e.getElements())}})}});t.some(function(t){if(t.getEditable&&t.getEditable()&&t.focus&&t.getVisible()){if(t.isA("sap.ui.comp.smartfield.SmartField")){t.attachEventOnce("innerControlsCreated",function(t){setTimeout(t.oSource._oControl[t.oSource._oControl.current]["focus"].bind(t.oSource._oControl[t.oSource._oControl.current]),0)})}else{t.focus()}return true}})};v.prototype.clone=function(t,i){this.setAggregation("content",null);var o=this.getAggregation("toolbar");var s=this.getCustomToolbar();var a=this.getCustomData();var r=this.getGroups();var n=0;if(s){K.call(this);Q.call(this);tt.call(this)}else if(o){this.setAggregation("toolbar",null)}if(a.length>0){for(n=0;n<r.length;n++){H.call(this,r[n])}}var l=e.prototype.clone.apply(this,arguments);for(n=0;n<r.length;n++){var u=r[n].clone(t,i);l.addGroup(u)}if(this.getExpandable()&&this._oPanel){this.setAggregation("content",this._oPanel)}else{this.setAggregation("content",this._oForm)}if(s){if(this.getTitle()){N.call(this)}if(this.getEditTogglable()){J.call(this)}if(this.getCheckButton()){Z.call(this)}}else if(o){this.setAggregation("toolbar",o)}if(a.length>0){for(n=0;n<r.length;n++){z.call(this,r[n])}}return l};v.prototype.exit=function(){if(this._oForm){this._oForm.destroy()}if(this._oPanel){this._oPanel.destroy()}if(this._oTitle){this._oTitle.destroy()}if(this._oEditToggleButton){this._oEditToggleButton.destroy()}this._oForm=null;this._oPanel=null;this._oTitle=null;this._oRb=null;this._oEditToggleButton=null;this._oObserver.disconnect();this._oObserver=undefined};function w(){var t=this.getAggregation("toolbar");if(!t){t=new p(this.getId()+"-toolbar-sfmain",{height:"3rem",design:d.ToolbarDesign.Transparent});t._bCreatedBySmartForm=true;this.setAggregation("toolbar",t)}return t}function U(t){var e=this.getAggregation("toolbar");if(e){if(t){var i=e.getContent();if(i.length>0){return}}this.destroyAggregation("toolbar")}}function N(){var t=this.getTitle();if(t){if(!this.getCustomToolbar()&&!this.getCheckButton()&&!this.getEditTogglable()){if(this._oTitle){if(this._getToolbar()){K.call(this)}this._oForm.removeAriaLabelledBy(this._oTitle);this._oTitle.destroy();this._oTitle=null}if(!this._oPanel){this._oForm.setTitle(t)}}else{this._oForm.setTitle();if(!this._oTitle){if((!h||!p||!c||!f||!d)&&!this._bTitleRequested){h=sap.ui.require("sap/m/Title");p=sap.ui.require("sap/m/OverflowToolbar");c=sap.ui.require("sap/m/ToolbarSpacer");f=sap.ui.require("sap/m/ToolbarSeparator");d=sap.ui.require("sap/m/library");if(!h||!p||!c||!f||!d){sap.ui.require(["sap/m/Title","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/m/ToolbarSeparator","sap/m/library"],W.bind(this));this._bTitleRequested=true}}if(h&&!this._bTitleRequested){var e=i.get("sap.ui.layout.FormLayout:_sap_ui_layout_FormLayout_FormTitleSize");this._oTitle=new h(this.getId()+"-title-sfmain",{level:e.toUpperCase()})}}if(this._oTitle){this._oTitle.setText(t);this._oForm.addAriaLabelledBy(this._oTitle);j.call(this)}}}else{if(this._oTitle){K.call(this);this._oForm.removeAriaLabelledBy(this._oTitle);this._oTitle.destroy();this._oTitle=null}else{this._oForm.setTitle()}}}function W(t,e,i,o,s){h=t;p=e;c=i;f=o;d=s;this._bTitleRequested=false;if(!this._bIsBeingDestroyed){N.call(this)}}function j(){if(!this._oTitle){return}var t=this._getToolbar();if(!t){t=w.call(this)}t.insertContent(this._oTitle,0)}function K(){if(!this._oTitle){return}var t=this._getToolbar();t.removeContent(this._oTitle);U.call(this,true)}function Y(){if((!n||!p||!c||!f||!d)&&!this._bButtonRequested){n=sap.ui.require("sap/m/Button");p=sap.ui.require("sap/m/OverflowToolbar");c=sap.ui.require("sap/m/ToolbarSpacer");f=sap.ui.require("sap/m/ToolbarSeparator");d=sap.ui.require("sap/m/library");if(!n||!p||!c||!f||!d){sap.ui.require(["sap/m/Button","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/m/ToolbarSeparator","sap/m/library"],$.bind(this));this._bButtonRequested=true}}if(n&&!this._bButtonRequested){return true}return false}function $(t,e,i,o,s){n=t;p=e;c=i;f=o;d=s;this._bButtonRequested=false;if(!this._bIsBeingDestroyed){if(this._bEditRequested){this._bEditRequested=false;J.call(this)}if(this._bCheckRequested){this._bCheckRequested=false;Z.call(this)}}}function J(){if(!this.getEditTogglable()){return}if(!Y.call(this)){this._bEditRequested=true;return}var t=this._getToolbar();if(!t){t=w.call(this)}if(!this._oCheckButton){ot.call(this,t)}if(!this._oEditToggleButton){var e=this.getEditable()?"sap-icon://display":"sap-icon://edit";var i=this._oRb.getText(this.getEditable()?"FORM_TOOLTIP_DISPLAY":"FORM_TOOLTIP_EDIT");this._oEditToggleButton=new n(t.getId()+"-button-sfmain-editToggle",{icon:e,tooltip:i});this._oEditToggleButton.attachPress(this._toggleEditMode,this)}var o=t.getContent().length;if(this._oCheckButton){o--}t.insertContent(this._oEditToggleButton,o)}function Q(){if(!this._oEditToggleButton){return}var t=this._getToolbar();t.removeContent(this._oEditToggleButton);this._oEditToggleButton.destroy();this._oEditToggleButton=null;st.call(this,t);U.call(this,true)}function Z(){if(!this.getCheckButton()||!this.getEditable()){return}if(!Y.call(this)){this._bCheckRequested=true;return}var t=this._getToolbar();if(!t){t=w.call(this)}if(!this._oEditToggleButton){ot.call(this,t)}if(!this._oCheckButton){this._oCheckButton=new n(this.getId()+"-"+t.getId()+"-button-sfmain-check",{text:this._oRb.getText("SMART_FORM_CHECK")});this._oCheckButton.attachPress(this.getValidationMode()===m.Standard?et:it,this)}var e=t.getContent().length;t.insertContent(this._oCheckButton,e)}function tt(){if(!this._oCheckButton){return}var t=this._getToolbar();t.removeContent(this._oCheckButton);this._oCheckButton.destroy();this._oCheckButton=null;st.call(this,t);U.call(this,true)}function et(t){var e=[];e=this.check(true);this.fireChecked({erroneousFields:e})}function it(t){this.check(true).then(function(t){this.fireChecked({erroneousFields:t})}.bind(this))}function ot(t){var e;if(!t._bCreatedBySmartForm){var i=t.getContent();var o=false;for(var s=0;s<i.length;s++){if(i[s]instanceof c){o=true;break}}if(!o){e=new c(this.getId()+"-"+t.getId()+"-spacer");e._bCreatedBySmartForm=true;t.addContent(e)}if(!(i[i.length-1]instanceof f)){var a=new f(this.getId()+"-"+t.getId()+"-separator");a._bCreatedBySmartForm=true;t.addContent(a)}}else{e=new c(t.getId()+"-spacer");e._bCreatedBySmartForm=true;t.addContent(e)}}function st(t){var e=t.getContent();var i;if(!t._bCreatedBySmartForm){i=e[e.length-1];if(i instanceof f&&i._bCreatedBySmartForm){i.destroy()}e=t.getContent()}i=e[e.length-1];if(i instanceof c&&i._bCreatedBySmartForm){i.destroy()}}function at(t,e){if(!t.layout&&!t.requested){t.layout=sap.ui.require(t.path);if(!t.layout){t.promise=new Promise(function(e){sap.ui.require([t.path],t.loaded.bind(this));t.resolve=e;t.requestIds=[this.getId()]}.bind(this));t.requested=true}}else if(!t.layout&&t.requested&&t.promise&&t.requestIds.indexOf(this.getId())<0){t.promise.then(function(){if(!this._bIsBeingDestroyed){rt.call(this)}}.bind(this));t.requestIds.push(this.getId())}if(t.layout&&!t.requested&&!(e instanceof t.layout)){if(e){e.destroy()}e=new t.layout(this._oForm.getId()+"-layout");this._oForm.setLayout(e);return true}return false}function rt(){var t=this.getLayout();var e=this._oForm.getLayout();var i=this.getUseHorizontalLayout();var o=false;if(t&&t.isA("sap.ui.comp.smartform.ColumnLayout")){if(i){throw new Error("ColumnLayout and useHorizontalLayout must not ne used at the same time on "+this)}o=at.call(this,b.ColumnLayout,e);if(o){dt.call(this,t)}}else if(i&&(!t||!t.getGridDataSpan())){o=at.call(this,b.ResponsiveLayout,e)}else if(!e||!b.ResponsiveGridLayout.layout||!(e instanceof b.ResponsiveGridLayout.layout)){o=at.call(this,b.ResponsiveGridLayout,e);if(o){this._oFormLayoutNotInitial=true;ct.call(this,t)}}if(o){var s=this.getGroups();for(var a=0;a<s.length;a++){var r=s[a];r._updateLayoutData()}}}function nt(t,e){t.layout=e;t.requested=false;t.resolve();delete t.resolve;delete t.requestIds;t.promise=undefined;if(!this._bIsBeingDestroyed){rt.call(this)}}function lt(t){nt.call(this,b.ResponsiveGridLayout,t)}function ut(t){nt.call(this,b.ResponsiveLayout,t)}function ht(t){nt.call(this,b.ColumnLayout,t)}function pt(t){if(!t||t.isA("sap.ui.comp.smartform.Layout")){ct.call(this,t)}else if(t.isA("sap.ui.comp.smartform.ColumnLayout")){dt.call(this,t)}}function ct(t){var e=this._oForm.getLayout();if(!e||!e.isA(b.ResponsiveGridLayout.name)){return}if(this.getUseHorizontalLayout()){if(t&&t.getGridDataSpan()){gt.call(this,e);e.setColumnsL(1);e.setColumnsM(1);if(t.getBreakpointM()>0){e.setBreakpointM(t.getBreakpointM())}if(t.getBreakpointL()>0){e.setBreakpointL(t.getBreakpointL())}if(t.getBreakpointXL()>0){e.setBreakpointXL(t.getBreakpointXL())}this._oFormLayoutNotInitial=true}}else{if(t){e.setLabelSpanXL(t.getLabelSpanXL()?t.getLabelSpanXL():-1);e.setLabelSpanL(t.getLabelSpanL()?t.getLabelSpanL():4);e.setLabelSpanM(t.getLabelSpanM()?t.getLabelSpanM():4);e.setLabelSpanS(t.getLabelSpanS()?t.getLabelSpanS():12);e.setEmptySpanXL(t.getEmptySpanXL()?t.getEmptySpanXL():-1);e.setEmptySpanL(t.getEmptySpanL()?t.getEmptySpanL():0);e.setEmptySpanM(t.getEmptySpanM()?t.getEmptySpanM():0);e.setColumnsXL(t.getColumnsXL()?t.getColumnsXL():-1);e.setColumnsL(t.getColumnsL()?t.getColumnsL():3);e.setColumnsM(t.getColumnsM()?t.getColumnsM():2);e.setSingleContainerFullSize(t.getSingleGroupFullSize());e.setBreakpointXL(t.getBreakpointXL()?t.getBreakpointXL():1440);e.setBreakpointL(t.getBreakpointL()?t.getBreakpointL():1024);e.setBreakpointM(t.getBreakpointM()?t.getBreakpointM():600);this._oFormLayoutNotInitial=true}else{gt.call(this,e)}ft.call(this,t,e)}}function ft(t,e){if(this.getUseHorizontalLayout()){return}if(!e){e=this._oForm.getLayout();t=this.getLayout()}if(!e||!e.isA(b.ResponsiveGridLayout.name)){return}var i=this.getGroups();var o=-1;var s=3;var a=true;var r=0;for(var n=0;n<i.length;n++){if(i[n].isVisible()){r++}}if(t){s=t.getColumnsL()?t.getColumnsL():3;o=t.getColumnsXL()>0?t.getColumnsXL():-1;a=t.getSingleGroupFullSize()}if(i&&r>0&&r<o&&a){e.setColumnsXL(r)}else if(e.getColumnsXL()!=o){e.setColumnsXL(o)}if(i&&r>0&&r<s&&a){e.setColumnsL(r)}else if(e.getColumnsL()!=s){e.setColumnsL(s)}}function gt(t){if(this._oFormLayoutNotInitial){t.setLabelSpanXL(-1);t.setLabelSpanL(4);t.setLabelSpanM(4);t.setLabelSpanS(12);t.setEmptySpanXL(-1);t.setEmptySpanL(0);t.setEmptySpanM(0);t.setColumnsXL(-1);t.setColumnsL(3);t.setColumnsM(2);t.setSingleContainerFullSize(true);t.setBreakpointXL(1440);t.setBreakpointL(1024);t.setBreakpointM(600);this._oFormLayoutNotInitial=false}}function dt(t){var e=this._oForm.getLayout();if(!e||!e.isA(b.ColumnLayout.name)){return}if(this.getUseHorizontalLayout()){throw new Error("ColumnLayout and useHorizontalLayout must not ne used at the same time on "+this)}else{e.setColumnsXL(t.getColumnsXL());e.setColumnsL(t.getColumnsL());e.setColumnsM(t.getColumnsM());e.setLabelCellsLarge(t.getLabelCellsLarge());e.setEmptyCellsLarge(t.getEmptyCellsLarge())}}function mt(t,e,i,o){pt.call(this,t);if(e==="gridDataSpan"){this.propagateGridDataSpan();if(i===""||o===""){rt.call(this)}}}v.prototype._suggestTitleId=function(t){this._oForm._suggestTitleId(t);return this};return v});
//# sourceMappingURL=SmartForm.js.map