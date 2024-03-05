/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/model/base/ManagedObjectModel"],function(e,t){"use strict";function a(e){return e.charAt(0).toUpperCase()+e.slice(1)}var o=e.extend("sap.ui.fl.util.ManagedObjectModel",{metadata:{library:"sap.ui.fl",properties:{data:{type:"object"},name:{type:"string",defaultValue:"$sap.ui.fl.ManagedObjectModel"}},associations:{object:{type:"sap.ui.core.Element"}}},constructor:function(...o){e.apply(this,o);this._oManagedObjectModel=new t(e.getElementById(this.getObject()),this.getData());["data","name","object"].forEach(function(e){this[`set${a(e)}`]=function(){throw new Error(`sap.ui.fl.util.ManagedObjectModel: Can't change the value of \`${e}\` after the object is `+`initialized. Please recreate the object with correct values in the constructor.`)}},this)}});o.prototype.setParent=function(...t){const[a]=t;const o=this.getParent();if(o){o.setModel(null,this.getName())}if(a){a.setModel(this._oManagedObjectModel,this.getName())}e.prototype.setParent.apply(this,t)};o.prototype.exit=function(){this._oManagedObjectModel.destroy()};return o});
//# sourceMappingURL=ManagedObjectModel.js.map