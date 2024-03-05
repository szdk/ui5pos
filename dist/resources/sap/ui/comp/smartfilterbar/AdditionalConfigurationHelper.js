/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library"],function(t){"use strict";var e=function(t,e){this.controlConfiguration=[];this.groupConfiguration=[];this._initialize(t,e)};e.prototype._initialize=function(e,i){var n,o,a,r,l,g,u,p,s,f;if(!e){e=[]}if(!i){i=[]}o=e.length;for(n=0;n<o;n++){r=e[n];l={};l.key=r.getKey();l.groupId=r.getGroupId();l.index=r.getIndex();l.label=r.getLabel();l.isVisible=r.getVisible();l.mandatory=r.getMandatory();l.width=r.getWidth();l.hasValueHelpDialog=r.getHasValueHelpDialog();l.hasValidation=r.getHasValidation();l.hasTypeAhead=r.getHasTypeAhead();l.controlType=r.getControlType();l.filterType=r.getFilterType();l.customControl=r.getCustomControl();l.visibleInAdvancedArea=r.getVisibleInAdvancedArea();l.preventInitialDataFetchInValueHelpDialog=r.getPreventInitialDataFetchInValueHelpDialog();l.isSetPreventInitialDataFetchInValueHelpDialog=r.isPropertyInitial("preventInitialDataFetchInValueHelpDialog");l.displayBehaviour=r.getDisplayBehaviour();l.defaultFilterValues=[];l.conditionType=r.getConditionType();l.historyEnabled=r.getHistoryEnabled();l.historyEnabledInitial=r.isPropertyInitial("historyEnabled");l.conditionPanelDefaultOperation=!r.isPropertyInitial("conditionPanelDefaultOperation")&&t.valuehelpdialog.ValueHelpRangeOperation[r.getConditionPanelDefaultOperation()]?r.getConditionPanelDefaultOperation():null;l.timezone=r.getTimezone();g=r.getDefaultFilterValues();if(g&&g.length){s=g.length;for(p=0;p<s;p++){u=g[p];f={};f.sign=u.getSign();f.operator=u.getOperator();f.low=u.getLow();f.high=u.getHigh();l.defaultFilterValues.push(f)}}this.controlConfiguration.push(l)}o=i.length;for(n=0;n<o;n++){a=i[n];l={key:a.getKey(),index:a.getIndex(),label:a.getLabel()};this.groupConfiguration.push(l)}};e.prototype.getControlConfigurationByKey=function(t){var e,i;i=this.controlConfiguration.length;for(e=0;e<i;e++){if(this.controlConfiguration[e].key===t){return this.controlConfiguration[e]}}return undefined};e.prototype.getControlConfiguration=function(){return this.controlConfiguration};e.prototype.getGroupConfiguration=function(){return this.groupConfiguration};e.prototype.getGroupConfigurationByKey=function(t){var e,i;i=this.groupConfiguration.length;for(e=0;e<i;e++){if(this.groupConfiguration[e].key===t){return this.groupConfiguration[e]}}return undefined};return e},true);
//# sourceMappingURL=AdditionalConfigurationHelper.js.map