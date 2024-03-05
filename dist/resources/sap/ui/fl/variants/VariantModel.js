/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_omit","sap/base/util/restricted/_isEqual","sap/base/util/each","sap/base/util/includes","sap/base/util/isEmptyObject","sap/base/util/merge","sap/base/util/ObjectPath","sap/base/Log","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/core/BusyIndicator","sap/ui/core/Element","sap/ui/core/Lib","sap/ui/fl/apply/_internal/changes/Applier","sap/ui/fl/apply/_internal/changes/Reverter","sap/ui/fl/apply/_internal/controlVariants/URLHandler","sap/ui/fl/apply/_internal/flexObjects/FlexObjectFactory","sap/ui/fl/apply/_internal/flexState/controlVariants/Switcher","sap/ui/fl/apply/_internal/flexState/controlVariants/VariantManagementState","sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/apply/_internal/controlVariants/Utils","sap/ui/fl/Layer","sap/ui/fl/LayerUtils","sap/ui/fl/Utils","sap/ui/fl/registry/Settings","sap/ui/fl/write/api/ContextBasedAdaptationsAPI","sap/ui/model/BindingMode","sap/ui/model/json/JSONModel"],function(e,t,n,a,r,i,o,s,c,l,h,f,u,p,g,d,v,m,C,V,y,R,D,b,S,x,F){"use strict";var M={};function P(e,t){return E(function(e,t){var n=t.model;var a=t.vmReference;var r=false;var i=o.get([a,"modified"],n.oData);var s=e.key;var c=e.key;return Promise.resolve().then(function(){if(o.get([a,"currentVariant"],n.oData)&&n.oData[a].currentVariant!==s){c=n.oData[a].currentVariant;r=true;return n.updateCurrentVariant({variantManagementReference:a,newVariantReference:s,appComponent:n.oAppComponent,internallyCalled:true})}}).then(function(){if(i){var e=m.getControlChangesForVariant({reference:n.sFlexReference,vmReference:a,vReference:c});return I({changes:e,vmReference:a,vReference:c,revert:!r,model:n})}return Promise.resolve()}).then(function(){if(!r){n.callVariantSwitchListeners(a,n.oData[a].currentVariant)}})}.bind(null,e.getParameters(),t),t.model)}function I(e){var t=e.model._getDirtyChangesFromVariantChanges(e.changes);t=t.reverse();return Promise.resolve().then(function(){if(e.revert){return p.revertMultipleChanges(t,{appComponent:e.model.oAppComponent,modifier:c,flexController:e.model.oFlexController})}return undefined}).then(function(){e.model.oChangePersistence.deleteChanges(t)})}function E(e,t){t._oVariantSwitchPromise=t._oVariantSwitchPromise.catch(function(){}).then(e);t.oFlexController.setVariantSwitchPromise(t._oVariantSwitchPromise);return t._oVariantSwitchPromise}function _(e,t){M[e]=t}function U(e,t){return v.switchVariant(e).then(function(){if(this.oData[e.vmReference].updateVariantInURL){g.updateVariantInURL({vmReference:e.vmReference,newVReference:e.newVReference,model:this})}this.callVariantSwitchListeners(e.vmReference,e.newVReference,undefined,t)}.bind(this))}function w(e){var t=b.getInstanceOrUndef();if(t&&!t.isVariantPersonalizationEnabled()){e.remove=false;e.rename=false;e.change=false}}function A(e){var t=b.getInstanceOrUndef();var n=t&&(t.isKeyUser()||!t.getUserId()||t.isPublicFlVariantEnabled()&&t.getUserId().toUpperCase()===e.author.toUpperCase());e.remove=n;e.rename=n;e.change=n}function L(e,t,n){var a=n?R.getCurrentLayer():y.USER;if(e.layer===a&&e.key!==t){return true}return false}function T(e){return new Promise(function(t){if(e.getDomRef()){t()}else{e.addEventDelegate({onAfterRendering(){t()}})}})}function O(){var e=D.getUshellContainer();if(e){var t=[D.getUShellService("UserInfo"),D.getUShellService("URLParsing"),D.getUShellService("CrossApplicationNavigation"),D.getUShellService("ShellNavigation")];return Promise.all(t).then(function(e){_("UserInfo",e[0]);_("URLParsing",e[1]);_("CrossApplicationNavigation",e[2]);_("ShellNavigation",e[3])}).catch(function(e){throw new Error(`Error getting service from Unified Shell: ${e}`)})}}function k(e,t){return i({},e.find(function(e){return e.key===t}))}function B(e,t,n){var a={layer:e,control:t,reference:n};var r=S.hasAdaptationsModel(a);return r&&S.getDisplayedAdaptationId(a)}var N=F.extend("sap.ui.fl.variants.VariantModel",{constructor:function(e,t){this.pSequentialImportCompleted=Promise.resolve();F.apply(this,[e]);this.sharing={PRIVATE:"private",PUBLIC:"public"};this.oFlexController=t.flexController;this.oChangePersistence=this.oFlexController._oChangePersistence;this.sFlexReference=C.getFlexReferenceForControl(t.appComponent);this.oAppComponent=t.appComponent;this._oResourceBundle=f.getResourceBundleFor("sap.ui.fl");this._oVariantSwitchPromise=Promise.resolve();this._oVariantAppliedListeners={};this.fnUpdateListener=this.updateData.bind(this);this.oDataSelector=m.getVariantManagementMap();this.oDataSelector.addUpdateListener(this.fnUpdateListener);this.updateData();this.setDefaultBindingMode(x.OneWay)}});N.prototype.updateData=function(){var e=this.oDataSelector.get({reference:this.sFlexReference});var t=Object.assign({},this.getData());Object.entries(e).forEach(function(e){var n=e[0];var a=Object.assign({},e[1]);t[n]||={};t[n].variants=a.variants.map(function(e){var a=(t[n].variants||[]).find(function(t){return t.key===e.key});return Object.assign({},a||{},e)});t[n].currentVariant=a.currentVariant;t[n].defaultVariant=a.defaultVariant;t[n].modified=a.modified});this.setData(t);this.refresh(true)};N.prototype.invalidateMap=function(){this.oDataSelector.checkUpdate({reference:this.sFlexReference})};N.prototype.initialize=function(){return Promise.all([b.getInstance(),O()]).then(function(){g.initialize({model:this})}.bind(this))};N.prototype.updateCurrentVariant=function(e){var t={vmReference:e.variantManagementReference,currentVReference:this.getCurrentVariantReference(e.variantManagementReference),newVReference:e.newVariantReference,flexController:this.oFlexController,appComponent:e.appComponent||this.oAppComponent,modifier:c,reference:this.sFlexReference};if(e.internallyCalled){return U.call(this,t,e.scenario)}return E(U.bind(this,t,e.scenario),this)};N.prototype.getCurrentVariantReference=function(e){return this.oData[e].currentVariant};N.prototype.getVariantManagementReference=function(e){var t="";var n=-1;Object.keys(this.oData).some(function(a){return this.oData[a].variants.some(function(r,i){if(r.key===e){t=a;n=i;return true}})}.bind(this));return{variantManagementReference:t,variantIndex:n}};N.prototype.getVariant=function(e,t){var n=t||this.getVariantManagementReference(e).variantManagementReference;return k(this.oData[n].variants,e)};N.prototype.getVariantTitle=function(e,t){return k(this.oData[t].variants,e).title};function j(e,t){var n=m.getVariantChangesForVariant({vmReference:e,reference:this.sFlexReference});var a=this.oData[e].defaultVariant;if(t.getExecuteOnSelectionForStandardDefault()&&a===e&&!n.setExecuteOnSelect){var r=k(this.oData[e].variants,e);r.instance.setExecuteOnSelection(true);this.oData[e].variants[0].executeOnSelect=true;return true}return false}N.prototype.attachVariantApplied=function(e){var t=h.getElementById(e.vmControlId);var n=this.getVariantManagementReferenceForControl(t);return this.waitForVMControlInit(n).then(function(e,n){this._oVariantAppliedListeners[e]||={};var a=j.call(this,e,t);if(n.callAfterInitialVariant||a){var r={appComponent:this.oAppComponent,reference:this.sFlexReference,vmReference:e,flexController:this.oFlexController};m.waitForInitialVariantChanges(r).then(function(){var t=this.oData[e].currentVariant;this.callVariantSwitchListeners(e,t,n.callback)}.bind(this))}return T(n.control).then(function(){if(V.getRelevantVariantManagementControlId(n.control,this.getVariantManagementControlIds())===n.vmControlId){this.oData[e].showExecuteOnSelection=true;this.checkUpdate(true);this._oVariantAppliedListeners[e][n.control.getId()]=n.callback}else{s.error("Error in attachVariantApplied: The passed VariantManagement ID does not match the "+"responsible VariantManagement control")}}.bind(this))}.bind(this,n,e))};N.prototype.callVariantSwitchListeners=function(e,t,a,r){if(this._oVariantAppliedListeners[e]){var i=k(this.oData[e].variants,t);if(r){i.createScenario=r}if(a){a(i)}else{n(this._oVariantAppliedListeners[e],function(e,t){t(i)})}}};N.prototype.detachVariantApplied=function(e,t){var n=this.getVariantManagementReferenceForControl(h.getElementById(e));if(this._oVariantAppliedListeners[n]){delete this._oVariantAppliedListeners[n][t]}};N.prototype.eraseDirtyChangesOnVariant=function(e,t){var n=m.getControlChangesForVariant({reference:this.sFlexReference,vmReference:e,vReference:t});var a=this._getDirtyChangesFromVariantChanges(n);return I({changes:n,vmReference:e,vReference:t,model:this,revert:true}).then(function(){return a})};N.prototype.addAndApplyChangesOnVariant=function(e){this.oChangePersistence.addChanges(e,this.oAppComponent);return e.reduce(function(e,t){return e.then(function(){var e=h.getElementById(c.getControlIdBySelector(t.getSelector(),this.oAppComponent));return u.applyChangeOnControl(t,e,{modifier:c,appComponent:this.oAppComponent,view:D.getViewForControl(e)}).then(e=>{if(!e.success){var n=e.error||new Error("The change could not be applied.");this._oChangePersistence.deleteChange(t,true);throw n}})}.bind(this))}.bind(this),Promise.resolve())};N.prototype._getVariantTitleCount=function(e,t){var n=this.getData();return n[t].variants.reduce(function(t,n){if(e.toLowerCase()===n.title.toLowerCase()&&n.visible){t++}return t},0)};function H(e,t){var n={id:t.newVariantReference,variantName:t.title,contexts:t.contexts,layer:t.layer,adaptationId:t.adaptationId,reference:e.getFlexObjectMetadata().reference,generator:t.generator,variantManagementReference:t.variantManagementReference};if(t.layer===y.VENDOR){n.user="SAP"}if(t.currentVariantComparison===1){if(t.sourceVariantSource.instance.getLayer()===t.layer){n.variantReference=t.sourceVariantSource.instance.getVariantReference()}else{n.variantReference=e.getVariantReference()}}else if(t.currentVariantComparison===0){n.variantReference=e.getVariantReference()}else if(t.currentVariantComparison===-1){n.variantReference=t.sourceVariantReference}return d.createFlVariant(n)}N.prototype._duplicateVariant=function(e){var t=e.sourceVariantReference;var n=e.variantManagementReference;var a=this.getVariant(t);var r=m.getControlChangesForVariant({vmReference:n,vReference:t,reference:this.sFlexReference}).map(function(e){return e.convertToFileContent()});e.currentVariantComparison=R.compareAgainstCurrentLayer(a.instance.getLayer(),e.layer);if(e.currentVariantComparison===1){e.sourceVariantSource=this.getVariant(a.instance.getVariantReference())}var o={instance:H(a.instance,e),controlChanges:r,variantChanges:{}};r=o.controlChanges.slice();var s={};o.controlChanges=r.reduce(function(t,n){if(R.compareAgainstCurrentLayer(n.layer,e.layer)>=0){s=i({},n);s.layer=e.layer;s.variantReference=o.instance.getId();s.support||={};s.support.sourceChangeFileName=n.fileName;s.packageName="$TMP";s.fileName=D.createDefaultFileName(s.changeType);t.push(d.createFromFileContent(s))}return t},[]);return o};N.prototype.copyVariant=function(e){var t=this._duplicateVariant(e);t.generator=e.generator;this.oData[e.variantManagementReference].variants.push({key:t.instance.getId(),rename:true,change:true,remove:true,sharing:e.layer===y.USER?this.sharing.PRIVATE:this.sharing.PUBLIC});var n=[];if(e.layer===y.PUBLIC){t.instance.setFavorite(false);var a={selector:c.getSelector(e.newVariantReference,e.appComponent),changeType:"setFavorite",fileType:"ctrl_variant_change",generator:e.generator,layer:y.USER,reference:this.sFlexReference,content:{favorite:true}};n.push(d.createUIChange(a))}n=this.oChangePersistence.addDirtyChanges(n.concat([t.instance].concat(t.controlChanges).concat(e.additionalVariantChanges)));return this.updateCurrentVariant({variantManagementReference:e.variantManagementReference,newVariantReference:t.instance.getId(),appComponent:e.appComponent,internallyCalled:true,scenario:"saveAs"}).then(function(){return n})};N.prototype.removeVariant=function(e){var t=this.oChangePersistence.getDirtyChanges().filter(function(t){return t.getVariantReference&&t.getVariantReference()===e.variant.getId()||t.getId()===e.variant.getId()});return this.updateCurrentVariant({variantManagementReference:e.variantManagementReference,newVariantReference:e.sourceVariantReference,appComponent:e.component}).then(function(){this.oChangePersistence.deleteChanges(t)}.bind(this))};N.prototype._collectModelChanges=function(e,t,n){const a=this.getData()[e];const r=a.variants;const i=[];const o=b.getInstanceOrUndef();const s=e=>r.find(t=>t.key===e);const c=(e,n,a)=>{const r=["setTitle","setExecuteOnSelect","setVisible"].includes(n);const s=r&&o?.isPublicFlVariantEnabled()&&e.layer===y.PUBLIC?y.PUBLIC:t;i.push({variantReference:e.key,changeType:n,layer:s,...a})};n.getParameter("renamed")?.forEach(({key:e,name:t})=>{const n=s(e);c(n,"setTitle",{title:t,originalTitle:n.title})});n.getParameter("fav")?.forEach(({key:e,visible:t})=>{const n=s(e);c(n,"setFavorite",{favorite:t,originalFavorite:n.favorite})});n.getParameter("exe")?.forEach(({key:e,exe:t})=>{const n=s(e);c(n,"setExecuteOnSelect",{executeOnSelect:t,originalExecuteOnSelect:n.executeOnSelect})});n.getParameter("deleted")?.forEach(e=>{const t=s(e);c(t,"setVisible",{visible:false})});n.getParameter("contexts")?.forEach(({key:e,contexts:t})=>{const n=s(e);c(n,"setContexts",{contexts:t,originalContexts:n.contexts})});const l=n.getParameter("def");if(l){i.push({variantManagementReference:e,changeType:"setDefault",defaultVariant:l,originalDefaultVariant:a.defaultVariant,layer:t})}return i};N.prototype.manageVariants=function(e,t,n,a,r){return new Promise(function(i){e.attachEventOnce("manage",{resolve:i,variantManagementReference:t,layer:n},this.fnManageClickRta,this);e.openManagementDialog(true,a,r)}.bind(this))};N.prototype.createVariantChange=function(e,t){var n=this.setVariantProperties(e,t);var a={changeType:t.changeType,layer:t.layer,generator:t.generator,reference:this.sFlexReference};if(t.adaptationId!==undefined){a.adaptationId=t.adaptationId}else{a.adaptationId=B(t.layer,t.appComponent,this.sFlexReference)}if(t.changeType==="setDefault"){a.fileType="ctrl_variant_management_change";a.selector=c.getSelector(e,t.appComponent)}else{a.fileType="ctrl_variant_change";a.selector=c.getSelector(t.variantReference,t.appComponent)}var r=d.createUIChange(a);r.setContent(n);if(t.changeType==="setTitle"){r.setText("title",t.title,"XFLD")}return r};N.prototype.addVariantChange=function(e,t){var n=this.createVariantChange(e,t);this.oChangePersistence.addDirtyChange(n);return n};N.prototype.addVariantChanges=function(e,t){var n=t.map(function(t){return this.createVariantChange(e,t)}.bind(this));this.oChangePersistence.addDirtyChanges(n);return n};N.prototype.deleteVariantChange=function(e,t,n){this.setVariantProperties(e,t);this.oChangePersistence.deleteChange(n)};N.prototype.setVariantProperties=function(e,t){var n=this.getData();var a=this.getVariant(t.variantReference,e).instance;var r={};switch(t.changeType){case"setTitle":a.setName(t.title,true);break;case"setFavorite":r.favorite=t.favorite;a.setFavorite(t.favorite);break;case"setExecuteOnSelect":r.executeOnSelect=t.executeOnSelect;a.setExecuteOnSelection(t.executeOnSelect);break;case"setVisible":r.visible=t.visible;r.createdByReset=false;a.setVisible(t.visible);break;case"setContexts":r.contexts=t.contexts;a.setContexts(t.contexts);break;case"setDefault":r.defaultVariant=t.defaultVariant;var i=g.getStoredHashParams({model:this});if(i){if(n[e].defaultVariant!==n[e].currentVariant&&i.indexOf(n[e].currentVariant)===-1){g.update({parameters:i.concat(n[e].currentVariant),updateURL:!this._bDesignTimeMode,updateHashEntry:true,model:this})}else if(n[e].defaultVariant===n[e].currentVariant&&i.indexOf(n[e].currentVariant)>-1){i.splice(i.indexOf(n[e].currentVariant),1);g.update({parameters:i,updateURL:!this._bDesignTimeMode,updateHashEntry:true,model:this})}}break;default:break}return r};N.prototype._ensureStandardVariantExists=function(t){var n=this.getData();var a=n[t]||{};var i=e(a,["initPromise"]);if(!n[t]||r(i)){var o=d.createFlVariant({id:t,variantManagementReference:t,variantName:this._oResourceBundle.getText("STANDARD_VARIANT_TITLE"),user:V.DEFAULT_AUTHOR,layer:y.BASE,reference:this.sFlexReference});m.addRuntimeSteadyObject(this.sFlexReference,this.oAppComponent.getId(),o)}};N.prototype.setModelPropertiesForControl=function(e,t,n){this.oData[e].showFavorites=true;var a=this._bDesignTimeMode;if(a!==t){this._bDesignTimeMode=t;if(t){g.clearAllVariantURLParameters({model:this})}else if(a){g.update({parameters:g.getStoredHashParams({model:this}),updateURL:true,updateHashEntry:false,model:this})}}if(!(typeof this.fnManageClick==="function"&&typeof this.fnManageClickRta==="function")){this._initializeManageVariantsEvents()}n.detachManage(this.fnManageClick,this);if(t&&this.oData[e]._isEditable){this.oData[e].variantsEditable=false;this.oData[e].variants.forEach(function(n){n.rename=true;n.change=true;n.sharing=this.sharing.PUBLIC;n.remove=L(n,e,t)}.bind(this))}else if(this.oData[e]._isEditable){n.attachManage({variantManagementReference:e},this.fnManageClick,this);this.oData[e].variantsEditable=true;this.oData[e].variants.forEach(function(n){n.remove=L(n,e,t);switch(n.layer){case y.USER:n.rename=true;n.change=true;n.sharing=this.sharing.PRIVATE;w(n);break;case y.PUBLIC:n.sharing=this.sharing.PUBLIC;A(n);break;default:n.rename=false;n.change=false;n.sharing=this.sharing.PUBLIC}}.bind(this))}else{this.oData[e].variantsEditable=false;this.oData[e].variants.forEach(function(e){e.remove=false;e.rename=false;e.change=false})}};N.prototype._initializeManageVariantsEvents=function(){this.fnManageClickRta=function(e,t){var n=this._collectModelChanges(t.variantManagementReference,t.layer,e);t.resolve(n)};this.fnManageClick=function(e,t){(async()=>{if(!this.oFlexController||!this.getData()){return}var n=this._collectModelChanges(t.variantManagementReference,y.USER,e);if(n.some(e=>e.visible===false&&e.variantReference===this.getCurrentVariantReference(t.variantManagementReference))){await this.updateCurrentVariant({variantManagementReference:t.variantManagementReference,newVariantReference:t.variantManagementReference})}var a=[];n.forEach(function(e){e.appComponent=this.oAppComponent}.bind(this));a=a.concat(this.addVariantChanges(t.variantManagementReference,n));this.oChangePersistence.saveDirtyChanges(this.oAppComponent,false,a)})()}};function z(e,t,n,a){if(!this._bDesignTimeMode){return e.saveSequenceOfDirtyChanges(t,a).then(function(e){this.invalidateMap();if(e){var t=e.response[0];this.oData[n].variants.forEach(function(e){if(e.key===t.fileName){e.author=t.support.user}})}}.bind(this))}return Promise.resolve()}N.prototype._handleSaveEvent=function(e){if(!this._bDesignTimeMode){var t=e.getSource();var n=e.getParameters();return this._handleSave(t,n)}return Promise.resolve()};N.prototype._handleSave=function(e,t){var n=D.getAppComponentForControl(e);var a=this.getLocalId(e.getId(),n);var r;return E(function(e,t,n){var a=this.getCurrentVariantReference(e);var o=m.getControlChangesForVariant({reference:this.sFlexReference,vmReference:e,vReference:a});if(n.overwrite){return this.oFlexController.saveSequenceOfDirtyChanges(this._getDirtyChangesFromVariantChanges(o),t).then(function(e){this.invalidateMap();return e}.bind(this))}var s=n.layer||(n.public?y.PUBLIC:y.USER);var l=n.layer||y.USER;var h=n.newVariantReference||D.createDefaultFileName("flVariant");var f={variantManagementReference:e,appComponent:t,layer:s,title:n.name,contexts:n.contexts,sourceVariantReference:a,newVariantReference:h,generator:n.generator,additionalVariantChanges:[],adaptationId:B(l,t,this.sFlexReference)};var u={content:{},reference:this.sFlexReference,generator:f.generator,layer:l,adaptationId:f.adaptationId};if(n.def){var p=i({changeType:"setDefault",content:{defaultVariant:h},fileType:"ctrl_variant_management_change",selector:c.getSelector(e,f.appComponent)},u);f.additionalVariantChanges.push(d.createUIChange(p))}if(n.execute){var g=i({changeType:"setExecuteOnSelect",content:{executeOnSelect:true},fileType:"ctrl_variant_change",selector:c.getSelector(f.newVariantReference,f.appComponent)},u);f.additionalVariantChanges.push(d.createUIChange(g))}return this.copyVariant(f).then(function(n){r=n;return I({changes:o,vmReference:e,vReference:a,model:this}).then(z.bind(this,this.oFlexController,r,e,t))}.bind(this))}.bind(this,a,n,t),this).then(function(){return r})};N.prototype.getLocalId=function(e,t){return c.getSelector(e,t).id};N.prototype.getVariantManagementReferenceForControl=function(e){var t=e.getId();var n=D.getAppComponentForControl(e);return n&&n.getLocalId(t)||t};N.prototype.switchToDefaultForVariantManagement=function(e){if(this.oData[e].currentVariant!==this.oData[e].defaultVariant){l.show(200);this.updateCurrentVariant({variantManagementReference:e,newVariantReference:this.oData[e].defaultVariant}).then(function(){l.hide()})}};N.prototype.switchToDefaultForVariant=function(e){Object.keys(this.oData).forEach(function(t){if(!e||this.oData[t].currentVariant===e){this.switchToDefaultForVariantManagement(t)}}.bind(this))};function q(e,t){this.oData[t].variants.forEach(function(n){var a=n.title&&n.title.match(/{(\w+)>(\w.+)}/);if(a){var r=a[1];var i=a[2];var o=e.getModel(r);if(o){var s=o.getResourceBundle().getText(i);var c={variantReference:n.key,changeType:"setTitle",title:s,layer:n.layer,appComponent:this.oAppComponent};var l=this.createVariantChange(t,c);m.addRuntimeSteadyObject(this.sFlexReference,this.oAppComponent.getId(),l)}else{e.attachEventOnce("modelContextChange",q.bind(this,e,t))}}}.bind(this))}N.prototype.registerToModel=function(e){var t=this.getVariantManagementReferenceForControl(e);this._ensureStandardVariantExists(t);this.oData[t]._isEditable=e.getEditable();this.oData[t].showExecuteOnSelection=false;q.call(this,e,t);e.attachEvent("select",{vmReference:t,model:this},P);e.attachSave(this._handleSaveEvent,this);this.setModelPropertiesForControl(t,false,e);var n=e.getUpdateVariantInURL();this.oData[t].updateVariantInURL=n;g.registerControl({vmReference:t,updateURL:!!n,model:this});g.handleModelContextChange({model:this,vmControl:e});if(this.oData[t].initPromise){this.oData[t].initPromise.resolveFunction();delete this.oData[t].initPromise}this.oData[t].init=true;var a={appComponent:this.oAppComponent,reference:this.sFlexReference,vmReference:t,flexController:this.oFlexController};this._oVariantSwitchPromise=this._oVariantSwitchPromise.then(m.waitForInitialVariantChanges.bind(undefined,a))};N.prototype.waitForVMControlInit=function(e){if(!this.oData[e]){this.oData[e]={}}else if(this.oData[e].init){return Promise.resolve()}this.oData[e].initPromise={};this.oData[e].initPromise.promise=new Promise(function(t){this.oData[e].initPromise.resolveFunction=t}.bind(this));return this.oData[e].initPromise.promise};N.prototype._getDirtyChangesFromVariantChanges=function(e){var t=e.map(function(e){return e.getId()});return this.oChangePersistence.getDirtyChanges().filter(function(e){return a(t,e.getId())&&!e.getSavedToVariant()})};N.prototype.getCurrentControlVariantIds=function(){return Object.keys(this.oData||{}).reduce(function(e,t){return e.concat([this.oData[t].currentVariant])}.bind(this),[])};N.prototype.getVariantManagementControlIds=function(){var e;return Object.keys(this.oData||{}).reduce(function(t,n){if(this.oAppComponent.byId(n)){e=this.oAppComponent.createId(n)}else{e=n}t.push(e);return t}.bind(this),[])};N.prototype.destroy=function(){this.oDataSelector.removeUpdateListener(this.fnUpdateListener);m.clearRuntimeSteadyObjects(this.sFlexReference,this.oAppComponent.getId());m.resetCurrentVariantReference(this.sFlexReference);F.prototype.destroy.apply(this)};N.prototype.getUShellService=function(e){return D.getUshellContainer()&&M[e]};return N});
//# sourceMappingURL=VariantModel.js.map