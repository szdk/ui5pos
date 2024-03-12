/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["./BaseController","sap/m/library","sap/ui/comp/library","./Util","sap/ui/comp/filterbar/VariantConverterTo","sap/ui/comp/filterbar/VariantConverterFrom","sap/base/util/merge","sap/ui/comp/smartfilterbar/FilterProvider","sap/ui/mdc/p13n/panels/FilterPanel","sap/ui/comp/util/FormatUtil","sap/ui/comp/smartfilterbar/FilterProviderUtils","sap/ui/core/library","sap/ui/comp/odata/MetadataAnalyser","sap/ui/comp/smartfilterbar/SFBMultiInput","sap/ui/comp/providers/TokenParser","sap/ui/comp/p13n/P13nConditionPanel","sap/m/Token","sap/m/MultiInput","sap/ui/comp/valuehelpdialog/ValueHelpDialog"],function(e,t,a,i,r,l,n,o,s,u,p,f,d,h,m,c,g,y,F){"use strict";var _=f.ValueState;var C=a.smartfilterbar.FilterType;var P=e.extend("sap.ui.comp.personalization.FilterController",{constructor:function(a,i){e.apply(this,arguments);this.setType(t.P13nPanelType.filter);this.setItemType(t.P13nPanelType.filter+"Items");this._aDropdownFields=[];this.aFilterItems=[];this._aSFBMultiInputs=[];this._aFilterPanelFields=[];this._aCustomFields=[];this._aCustomColumnKeysWithSlash=[];this.aSFBControlConfig=[];this._aRangeKeyFields=[];this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp")},metadata:{events:{afterFilterModelDataChange:{}}}});P.prototype.setTable=function(t){e.prototype.setTable.apply(this,arguments)};P.prototype.getColumn2Json=function(e,t,r){if(this.getTableType()!==a.personalization.TableType.AnalyticalTable&&this.getTableType()!==a.personalization.TableType.Table&&this.getTableType()!==a.personalization.TableType.TreeTable){return null}if(!i.isFilterable(e)){return null}if(!e.getFiltered||e.getFiltered&&!e.getFiltered()){return null}return{columnKey:t,exclude:false,operation:e.getFilterOperator(),value1:e.getFilterValue(),value2:""}};P.prototype.getColumn2JsonTransient=function(e,t,r,l){if(!i.isFilterable(e)){return null}var n;if(this.getTableType()===a.personalization.TableType.AnalyticalTable||this.getTableType()===a.personalization.TableType.Table||this.getTableType()===a.personalization.TableType.TreeTable){if(i.getColumnType(e)==="boolean"){n=i._getCustomProperty(e,"values")}return{columnKey:t,text:r,tooltip:l!==r?l:undefined,maxLength:i._getCustomProperty(e,"maxLength"),precision:i._getCustomProperty(e,"precision"),scale:i._getCustomProperty(e,"scale"),type:i.getColumnType(e),typeInstance:i._getCustomProperty(e,"typeInstance"),values:n,nullable:i._getCustomProperty(e,"nullable")}}if(this.getTableType()===a.personalization.TableType.ResponsiveTable){if(i.getColumnType(e)==="boolean"){n=i._getCustomProperty(e,"values")}return{columnKey:t,text:r,tooltip:l!==r?l:undefined,maxLength:i._getCustomProperty(e,"maxLength"),precision:i._getCustomProperty(e,"precision"),scale:i._getCustomProperty(e,"scale"),type:i.getColumnType(e),typeInstance:i._getCustomProperty(e,"typeInstance"),values:n,nullable:i._getCustomProperty(e,"nullable")}}if(this.getTableType()===a.personalization.TableType.ChartWrapper){return{columnKey:t,text:r,tooltip:l!==r?l:undefined,maxLength:i._getCustomProperty(e,"maxLength"),precision:i._getCustomProperty(e,"precision"),scale:i._getCustomProperty(e,"scale"),type:i.getColumnType(e),typeInstance:i._getCustomProperty(e,"typeInstance"),values:n,nullable:i._getCustomProperty(e,"nullable")}}};P.prototype.handleIgnore=function(e,t){e.sort.sortItems.splice(t,1)};P.prototype.syncJson2Table=function(e){var t=this.getColumnMap();var i=n({},t);this.fireBeforePotentialTableChange();if(this.getTableType()===a.personalization.TableType.AnalyticalTable||this.getTableType()===a.personalization.TableType.Table||this.getTableType()===a.personalization.TableType.TreeTable){e.filter.filterItems.forEach(function(e){var a=t[e.columnKey];if(a){if(!a.getFiltered()){a.setFiltered(true)}delete i[e.columnKey]}});for(var r in i){var l=i[r];if(l&&l.getFiltered()){l.setFiltered(false)}}}this.fireAfterPotentialTableChange()};P.prototype.getDataSuiteFormat2Json=function(e){var t=this.createControlDataStructure();if(!e.SelectOptions||!e.SelectOptions.length){return t}t.filter.filterItems=e.SelectOptions.map(function(e){var t=l.convertOption(e.Ranges[0].Option,e.Ranges[0].Low);return{columnKey:e.PropertyName,exclude:e.Ranges[0].Sign==="E",operation:t.op,value1:t.v,value2:e.Ranges[0].High}});return t};P.prototype.getDataSuiteFormatSnapshot=function(e){var t=this.getUnionData(this.getControlDataInitial(),this.getControlData());if(!t.filter||!t.filter.filterItems||!t.filter.filterItems.length){return}var a=this.getColumnMap(),l=i.getColumnKeysOfType("date",a),n=i.getColumnKeysOfType("datetime",a),o=i.getColumnKeysOfType("time",a);t.filter.filterItems.forEach(function(t){var i,s,u=true,p=t.columnKey,f=r.addRangeEntry(e,p);if(this._getSmartTable()){u=this._getSmartTable()._oTableProvider.getIsUTCDateHandlingEnabled()}if(this._getSmartChart()){u=this._getSmartChart()._oChartProvider.getIsUTCDateHandlingEnabled()}if(l.includes(p)){i="date"}else if(n.includes(p)){i="datetime"}else if(o.includes(p)){i="time"}if(l.concat(n,o).includes(p)){s=!!a[p]?.data("p13nData")?.typeInstance?.isA("sap.ui.comp.odata.type.FiscalDate");r.addP13nRanges(f,[t],i,u,s);return}r.addRanges(f,[t])},this)};P.prototype._getFilterPropertyFromColumn=function(e){var t,a,i,r=this._getColumnByKey(e);if(!r){i=this.getColumnMap();r=i&&i[e]}if(r){if(r.getFilterProperty){a=r.getFilterProperty()}t=r.data("p13nData");if(t&&!a){a=t["filterProperty"]}}return a};P.prototype._createFilterFieldControl=function(e){if(e.conditionType){e.control=e.conditionType.initializeFilterItem()}else if(!e.control&&e.fCreateControl){e.fCreateControl(e);delete e.fCreateControl}};P.prototype._getControlDataReduceFilterItems=function(){var e=this.getControlDataReduce();return e&&e.filter&&e.filter.filterItems};P.prototype._updateControlDataReduce=function(e){var t=this.getControlDataReduce();if(!e||!(t&&t.filter&&t.filter.filterItems)){return}e.reverse();t.filter.filterItems=e;this.setControlDataReduce2Model(t);this.fireAfterPotentialModelChange({json:t})};P.prototype._getColumnByKey=function(e){var t,a,i,r,l,n=this.getTable();if(n){t=n.getColumns();i=t.length;for(r=0;r<i;r++){a=t[r];l=a.data("p13nData");if(l&&l.columnKey===e){return a}}}return null};P.prototype._getIsCustomColumn=function(e){var t=this._getColumnByKey(e),a=t&&t.data("p13nData");return!a?false:!a.typeInstance};P.prototype._getFilterQueryPanelParameter=function(){return new URLSearchParams(window.location.search).get("sap-ui-xx-filterQueryPanel")==="true"};P.prototype.getPanel=function(e){if(!i.hasFilterableColumns(this.getColumnMap())){return null}if(e&&e.column){var t=i.getColumnKey(e.column);if(t){var a=this.getTransientData();a.filter.filterItems.forEach(function(e){e["isDefault"]=e.columnKey===t})}}var r=this.getTable(),l=this._getSmartFilterBar();if(l&&l._oFilterProvider){this._aDropdownFields=l._oFilterProvider._aFilterBarDropdownFieldMetadata}else if(r&&r.oParent&&r.oParent._oTableProvider&&r.oParent._oTableProvider._aTableViewMetadata){this._aDropdownFields=r.oParent._oTableProvider._aTableViewMetadata.filter(function(e){return e.hasFixedValues})}return new Promise(function(e){sap.ui.require(["sap/ui/comp/p13n/P13nFilterPanel","sap/m/P13nItem","sap/m/P13nAnyFilterItem","sap/ui/comp/providers/ValueListProvider"],function(t,a,r,l){var n,u=true;if(u){var p,f,d;if(!this.oSmartTable){this.oSmartTable=this._getSmartTable()}if(!this.oSmartChart){this.oSmartChart=this._getSmartChart()}if(!this.oSmartFilterBar){this.oSmartFilterBar=this._getSmartFilterBar();this.aSFBControlConfig=this.oSmartFilterBar&&this.oSmartFilterBar.getControlConfiguration()}if(this.oSmartTable){d=this.oSmartTable}else if(this.oSmartChart){d=this.oSmartChart}if(d){p=d.getModel();f=d.getEntitySet();n=d.getId()}if(!f&&!d&&this.getTable()&&this.getTable().isA("sap.ui.table.AnalyticalTable")){p=this.getTable().getModel();f=this.getTable().getBinding("rows")&&this.getTable().getBinding("rows").getPath().slice(1).split("(")[0]}try{this.oMDCFilterPanel=new s({enableReorder:false,change:this._mdcFilterPanelChangeHandler.bind(this),itemFactory:this._itemFactoryHandler.bind(this)});this._detachFieldsFromMDCFilterPanel();if(!this.oFilterProviderPromise){this.oFilterProviderPromise=o._createFilterProvider({entitySet:f,model:p,defaultDropDownDisplayBehaviour:this.oSmartTable&&this.oSmartTable.data("defaultDropDownDisplayBehaviour"),defaultTokenDisplayBehaviour:this.oSmartTable&&this.oSmartTable.data("defaultTokenDisplayBehaviour"),defaultSingleFieldDisplayBehaviour:this.oSmartTable&&this.oSmartTable.data("defaultSingleFieldDisplayBehaviour"),dateFormatSettings:this.oSmartTable&&this.oSmartTable.data("dateFormatSettings"),useContainsAsDefaultFilter:this.oSmartTable&&this.oSmartTable.data("useContainsAsDefaultFilter"),defaultFilterBarExpanded:this.oSmartTable&&this.oSmartTable.data("defaultFilterBarExpanded"),defaultShowAllFilters:this.oSmartTable&&this.oSmartTable.data("defaultShowAllFilters"),annotationSuppressed:true,useDateRangeType:false,context:"mdcFilterPanel",smartContainerId:n,additionalConfiguration:this.oSmartFilterBar&&this.oSmartFilterBar.getAdditionalConfiguration()})}this.oFilterProviderPromise.then(function(e){this._aActiveFilterPanelFieldNames=[];if(!e._aCustomFieldMetadata){e._aCustomFieldMetadata=[]}this.oFilterProvider=e;this.oMDCFilterPanel.setModel(e.oModel,e.sFilterModelName);if(!this._aSplitIntervalFields){this._aSplitIntervalFields=this._getSplitIntervalFieldNames()}this.oMDCFilterPanel.setP13nData(this._prepareP13nData());this._updateFilterData()}.bind(this))}catch(e){this.oMDCFilterPanel=this._createBasicFilterPanel()}return e(this.oMDCFilterPanel)}else{var h=this.getColumnMap(true),m=new t({containerQuery:true,enableEmptyOperations:true,items:{path:"$sapmP13nPanel>/transientData/filter/filterItems",template:new a({columnKey:"{$sapmP13nPanel>columnKey}",text:"{$sapmP13nPanel>text}",tooltip:"{$sapmP13nPanel>tooltip}",maxLength:"{$sapmP13nPanel>maxLength}",precision:"{$sapmP13nPanel>precision}",scale:"{$sapmP13nPanel>scale}",type:"{$sapmP13nPanel>type}",typeInstance:"{$sapmP13nPanel>typeInstance}",isDefault:"{$sapmP13nPanel>isDefault}",values:"{$sapmP13nPanel>values}",nullable:"{$sapmP13nPanel>nullable}"})},filterItems:{path:"$sapmP13nPanel>/controlDataReduce/filter/filterItems",template:new r({key:"{$sapmP13nPanel>key}",columnKey:"{$sapmP13nPanel>columnKey}",exclude:"{$sapmP13nPanel>exclude}",operation:"{$sapmP13nPanel>operation}",value1:"{$sapmP13nPanel>value1}",value2:"{$sapmP13nPanel>value2}"})},messageStrip:this.getMessageStrip(),beforeNavigationTo:this.setModelFunction(),filterItemChanged:function(e){var t=e.getParameter("reason");var a=e.getParameter("index");var i=e.getParameter("itemData");var r=this.getControlDataReduce();if(i&&t==="added"){if(a>-1){r.filter.filterItems.splice(a,0,i)}else{r.filter.filterItems.push(i)}}if(t==="removed"&&a>-1){r[this.getType()][this.getItemType()].splice(a,1)}this.setControlDataReduce2Model(r);this.fireAfterPotentialModelChange({json:r})}.bind(this)});if(this._aDropdownFields&&this._aDropdownFields.length>0){this._aDropdownFields=this._aDropdownFields.filter(function(e){var t=h[e.name];return!!i._getCustomProperty(t,"fullName")})}m._oConditionPanel.data("dropdownFields",this._aDropdownFields);var c=function(e,t){var a=this.getColumnMap(true),r=a[t],n=i._getCustomProperty(r,"fullName"),o=this._getSmartFilterBar(),s,u=this._getSmartTable(),p,f=o&&o.getControlConfiguration(),d,h,c,g,y,F;if(e.isA("sap.m.ComboBox")||e.isA("sap.m.MultiComboBox")){d="items";h=false;if(o&&o._oFilterProvider){s=o._oFilterProvider;c=s._sTextArrangementDisplayBehaviour||"idOnly"}else if(u&&u._oTableProvider){s=u._oTableProvider;c=s._oDefaultDropDownDisplayBehaviour||"idOnly"}this._aDropdownFields.forEach(function(e){if(e.name===t){p=e["com.sap.vocabularies.Common.v1.Text"];if(p){c=s._oMetadataAnalyser.getTextArrangementValue(p)}else if(e["com.sap.vocabularies.UI.v1.TextArrangement"]){c=s._oMetadataAnalyser.getTextArrangementValue(e)}}});if(Array.isArray(f)&&f.length>0){for(F=0;F<f.length;F++){g=f[F];if(g.getKey()===t){c=g.getDisplayBehaviour();break}}}}else{d="suggestionRows";h=true}if(o&&o._oFilterProvider&&o._oFilterProvider._aFilterBarMultiValueFieldMetadata){y=o._oFilterProvider._aFilterBarMultiValueFieldMetadata.filter(function(e){return e.name===t})[0];if(y){m._oConditionPanel.setDisplayFormat(y.displayFormat)}}if(n){e.setShowSuggestion&&e.setShowSuggestion(true);e.setFilterSuggests&&e.setFilterSuggests(false);e.setModel(this.getTable().getModel());return new l({fieldName:t,control:e,model:this.getTable().getModel(),maxLength:i._getCustomProperty(r,"maxLength"),displayBehaviour:c,resolveInOutParams:false,loadAnnotation:true,fullyQualifiedFieldName:n,aggregation:d,typeAheadEnabled:h,enableShowTableSuggestionValueHelp:false})}}.bind(this);m._oConditionPanel._fSuggestCallback=c;m._enableEnhancedExcludeOperations();m.addStyleClass("sapUiSmallMarginTop");return e(m)}}.bind(this))}.bind(this))};P.prototype._removeFilter=function(e){var t=this._getControlDataReduceFilterItems().filter(function(t){return t.columnKey!==e});this._updateControlDataReduce(t);this._getControlByName(e).setTokens([])};P.prototype._createBasicFilterPanel=function(){var e=new s({enableReorder:false,change:this._mdcFilterPanelChangeHandler.bind(this),itemFactory:this._createBasicFilterField.bind(this)});this.oMDCFilterPanel=e;e.setP13nData(this._prepareP13nData());this._detachFieldsFromMDCFilterPanel();this._updateBasicFilters();return e};P.prototype._updateBasicFilters=function(e){var t,a,i=e||this._getControlDataReduceFilterItems();this._aCustomFields.forEach(function(e){e.setTokens([])});if(Array.isArray(i)){i.reverse().forEach(function(e){t=this._getControlByName(e.columnKey);if(t){a=new g({text:this._getFormattedRangeTokenText(e.operation,e.value1,e.value2,e.exclude,e.columnKey)}).data("range",{exclude:e.exclude,operation:e.operation,keyField:e.columnKey,value1:e.value1,value2:e.value2});t.addToken(a)}}.bind(this))}};P.prototype._getFormattedRangeTokenText=function(e,t,a,i,r){var l=this._getKeyFieldByKey(r),n=t,o=a,s=true;if(l){if(!l.typeInstance&&c._createKeyFieldTypeInstance){c._createKeyFieldTypeInstance(l)}if(l.typeInstance){n=l.typeInstance.formatValue(t,"string",s);o=l.typeInstance.formatValue(a,"string",s)}}return u.getFormattedRangeText(e,n,o,i)};P.prototype._getKeyFieldByKey=function(e){var t;if(this._aRangeKeyFields){this._aRangeKeyFields.some(function(a){if(typeof a!=="string"){if(a.key===e){t=a;return true}}return false})}return t};P.prototype._createBasicFilterField=function(e){var t,a=this._getSmartTable(),i=a&&a.getId(),r,l=e.name,n=this._getControlByName(l);if(!n){r="FilterPanel-"+i+"-"+l;n=new y(r,{editable:true,enabled:true,showValueHelp:true,valueHelpOnly:true});n.attachTokenUpdate(function(e){var t,a,i=this._getControlDataReduceFilterItems(),r=e.getParameter("removedTokens"),l=r.length;if(e.getParameter("type")==="removed"){i=i.filter(function(e){for(t=0;t<l;t++){a=r[t].data("range");if(a&&a.keyField===e.columnKey&&a.value1===e.value1&&a.value2===e.value2){l-=1;return false}}return true});this._updateControlDataReduce(i)}}.bind(this));t=new m;t.addKeyField({key:l,label:e.label});t.associateInput(n);t.setDefaultOperation("EQ");n._sControlName=l;n.attachValueHelpRequest(this._vhRequest.bind(this,e,n));this._aCustomFields.push(n)}return n};P.prototype._getSplitIntervalFieldNames=function(){var e,t,a=[],i=this.oFilterProvider;if(i&&i.aAllFields){for(e=0;e<i.aAllFields.length;e++){t=i.aAllFields[e];if(t.filterRestriction===C.Interval&&t.type!=="Edm.DateTime"){a.push(t.name)}}}return a};P.prototype._vhRequest=function(e,t){var a,r=this._getColumnByKey(e.name),l=t&&t.getId()+"-valueHelpDialog",n=new F(l,{key:e.name,supportRangesOnly:true,supportRanges:true,title:e.label,cancel:function(){n.close()}});n.attachOk(this._onOk.bind(this,t,n));n.attachAfterClose(function(){this.destroy()});n.setProperty("_enhancedExcludeOperations",true);a={label:e.label,key:e.name,type:i._getCustomProperty(r,"type")||"string",maxLength:i._getCustomProperty(r,"maxLength"),scale:i._getCustomProperty(r,"scale"),precision:i._getCustomProperty(r,"precision"),nullable:i._getCustomProperty(r,"nullable")};c._createKeyFieldTypeInstance(a);this._aRangeKeyFields.push(a);n.setRangeKeyFields([a]);n.setTokens(t.getTokens());n.open()};P.prototype._onOk=function(e,t,a){var i=a.getParameter("tokens"),r=[];if(!i){t.close();return}e.setTokens(i);var l=this._getControlDataReduceFilterItems();i.forEach(function(e){r.push(e.data("range"))});l=l.filter(function(t){return t.columnKey!==e._sControlName});l.push(this._createConditionForRanges(r));l=l.flat();this._updateControlDataReduce(l);t.close()};P.prototype._getFieldMetadata=function(e,t){var a=null;if(Array.isArray(e)){e.some(function(e){if(e&&e.fields){e.fields.some(function(e){if(e&&e.name===t){a=e}return a!==null})}return a!==null})}return a};P.prototype._itemFactoryHandler=function(e){var t,a,r,l,n,o=e.name,s=this.oFilterProvider,u=this._getControlByName(o),p=this._getFilterPropertyFromColumn(o),f=this._getColumnByKey(o),d;if(u&&u.isA("sap.m.DatePicker")&&u.getValue()&&!this._checkIfFilterHasValue(o)){u.setValue("")}if(p&&p.includes("/")){d=s._oMetadataAnalyser.extractNavigationPropertyField(p,s.sEntitySet);d=s._createFieldMetadata(d)}else{d=s._getFieldMetadata(p)}if(d&&p&&o!==p){d=Object.assign({},d)}this._aActiveFilterPanelFieldNames.push(o);if(!u){if(!d){if(!this._aViewMetadata){this._aViewMetadata=s._oMetadataAnalyser._getAllFilterableFieldsByEntityForAllEndpoints(s.sEntitySet,true,false,null)}d=this._getFieldMetadata(this._aViewMetadata,o);if(d){d=s._createFieldMetadata(d)}}try{d=this._updateFieldMetadata(d,e,p)}catch(e){}if(this.aSFBControlConfig&&d){for(t=0;t<this.aSFBControlConfig.length;t++){a=this.aSFBControlConfig[t];if(a.getKey()===d.fieldName){r=a.getDisplayBehaviour();if(r&&!a.isPropertyInitial("displayBehaviour")){n=Object.assign({},d);n.displayBehaviour=r}l=a.getControlType();if(l){if(!n){n=Object.assign({},d)}n.controlType=l}break}}}if(n){n.fCreateControl(n);u=n.control}else if(d){d.fCreateControl(d);u=d.control}if(!u){u=new h({editable:true,enabled:true,showValueHelp:true,valueHelpOnly:true});d={fieldName:o,type:i._getCustomProperty(f,"edmType")||i._getCustomProperty(f,"type"),filterType:i._getCustomProperty(f,"type"),maxLength:i._getCustomProperty(f,"maxLength"),scale:i._getCustomProperty(f,"scale"),precision:i._getCustomProperty(f,"precision"),nullable:i._getCustomProperty(f,"nullable"),isDigitSequence:i._getCustomProperty(f,"isDigitSequence"),label:e.label};s._associateValueHelpDialog(u,d,true,true);s._aCustomFieldMetadata.push(d);u.bindProperty("value",{path:s.sFilterModelName+">/"+d.fieldName+"/value",type:s._getType(d)});s._handleMultiInput(u,d,s._getType(d))}u.setModel(this.getTable().getModel());u._sControlName=e.name;this._aFilterPanelFields.push(u);if(u.isA("sap.m.Select")||u.isA("sap.m.TimePicker")){u.setWidth("100%")}if(u.isA("sap.m.MultiInput")){u.attachTokenUpdate(this._fieldChangeHandler.bind(this))}else{u.attachChange(this._fieldChangeHandler.bind(this))}}if(u.getValueState&&u.getValueState()===_.Error){u.setValueState(_.None)}return u};P.prototype._fieldChangeHandler=function(e){var t,a,i,r=[],l,n=this.oFilterProvider,o,s=e.getSource(),u=s._sControlName,p={exclude:false,columnKey:u,operation:"EQ",value1:null,value2:null};setTimeout(function(){Promise.all(n._getCurrentValidationPromises()).then(function(){o=n.getFilterData();for(t in o){if(o.hasOwnProperty(t)){a=o[t];if(a){i=n._getFieldMetadata(t);if(i&&i.fieldNameOData&&t!==i.fieldNameOData){t=i.fieldNameOData}p.columnKey=t;if(p.columnKey&&p.columnKey.includes("___")){p.columnKey=p.columnKey.replaceAll("___","/")}l=Object.assign({},p);if(Array.isArray(a.ranges)&&a.ranges.length>0){r.push(this._createConditionForRanges(a.ranges))}if(Array.isArray(a.items)&&a.items.length>0){r.push(this._createConditionForItems(a.items,p))}if(a.hasOwnProperty("low")&&a.low){r.push(this._createConditionForIntervals(a,t,p))}if(a.value){if(s&&s.getValueState()!==_.Error){l=Object.assign({},p);l.value1=a.value;r.push(l)}}if(typeof a!=="object"||a instanceof Date){l=Object.assign({},p);l.value1=a;r.push(l)}}}}r=r.flat();this._updateControlDataReduce(r);if(s._oFieldViewMetadata&&this.oFilterProvider._oMetadataAnalyser.getMultiUnitBehaviorEnabled()){if(s._oFieldViewMetadata.isMeasureField){this._setWarningState(s)}if(d.isUnitOfMeasure(s._oFieldViewMetadata)||d.isCurrencyCode(s._oFieldViewMetadata)){this._clearWarningState(s)}}}.bind(this))}.bind(this))};P.prototype._setWarningState=function(e){var t=e._oFieldViewMetadata,a=this.oFilterProvider&&this.oFilterProvider._getFieldMetadata(t.unit),i=a&&a.label,r=this._oResourceBundle.getText("UNIT_WARNING_TEXT",i),l=this._checkIfFilterHasValue(t.name),n=this._checkIfFilterHasValue(a.name);if(t.filterRestriction==="single"){return}if(!n&&l){setTimeout(function(){e.setValueState(_.Warning);e.setValueStateText(r)})}if(!l){e.setValueState(_.None)}};P.prototype._clearWarningState=function(e){var t=e._oFieldViewMetadata,a=t&&t.name,i=t&&t.label,r=this._oResourceBundle.getText("UNIT_WARNING_TEXT",i),l,n=this._checkIfFilterHasValue(t.name),o;if(t.filterRestriction==="single"){return}this.oFilterProvider.aAllFields.forEach(function(e){if(e.isCurrencyField&&e["Org.OData.Measures.V1.ISOCurrency"].Path===a||e.isMeasureField&&e["Org.OData.Measures.V1.Unit"]&&e["Org.OData.Measures.V1.Unit"].Path===a){l=this._getControlByName(e.name);if(l){o=this._checkIfFilterHasValue(e.name);if(n&&l.getValueState()===_.Warning){l.setValueState(_.None)}if(!n&&o&&l.getValueState()===_.None){l.setValueState(_.Warning);l.setValueStateText(r)}}}}.bind(this))};P.prototype._checkIfFilterHasValue=function(e,t){var a=t||this.oFilterProvider.getFilterData(),i=a[e]||a._CUSTOM&&a._CUSTOM[e];if(i===null||typeof i==="undefined"){return false}if(typeof i==="string"&&i){return true}if(typeof i==="number"){return true}if(typeof i==="object"&&Object.prototype.toString.call(i)==="[object Date]"){return true}if(typeof i==="object"&&(i.hasOwnProperty("low")||i.hasOwnProperty("high"))){return!!i.low||!!i.high}if(typeof i==="object"&&(i.hasOwnProperty("value")||i.hasOwnProperty("items")||i.hasOwnProperty("ranges"))){return!!i.value||i.items&&!!i.items.length||i.ranges&&!!i.ranges.length}return false};P.prototype._updateFieldMetadata=function(e,t,a){var i,r,l=t.name,n=this.oFilterProvider,o=false,s=this._getIsCustomColumn(l),u=this._getColumnByKey(l);if(e){if(t&&!s&&e.fieldName&&e.fieldName.includes("/")){o=true}if(s){i=u&&(u.getHeader&&u.getHeader()||u.getLabel&&u.getLabel());if(i&&i.getText()){e.label=i.getText()}}}if(a&&a.includes("/")){e=n._oMetadataAnalyser.extractNavigationPropertyField(a,n.sEntitySet);e=n._createFieldMetadata(e)}if(!e){l=this._getFilterPropertyFromColumn(l);r=n.aAllFields&&n.aAllFields.find(function(e){return e.name===l});r=n._createFieldMetadata(r);e=Object.assign({},r)}if(s||o){e=this._prepareFieldMetadataForCustomColumn(e,t)}return e};P.prototype._prepareFieldMetadataForCustomColumn=function(e,t){var a=t.name,r,l,n,o,s,u=t.name,p=this._getColumnByKey(u),f=this.oFilterProvider;if(u.includes("/")){this._aCustomColumnKeysWithSlash.push(u);u=u.replaceAll("/","___")}e.customColumnKey=a;e.fieldName=u;e.name=u;o=!!e.ui5Type&&e.ui5Type.oConstraints;e.label=p&&(p.getHeader?p.getHeader().getText():p.getLabel().getText());n=i._getCustomProperty(p,"maxLength");l=i._getCustomProperty(p,"scale");r=i._getCustomProperty(p,"precision");if(o&&(n||l||r)){s=e.ui5Type;e=Object.assign({},e,{ui5Type:Object.assign({},e.ui5Type,{oConstraints:Object.assign({},e.ui5Type.oConstraints)})});for(var d in s){if(!s.hasOwnProperty(d)){e.ui5Type[d]=s[d]}}}if(n){e.maxLength=n;if(o){e.ui5Type.oConstraints.maxLength=n}}if(l){e.scale=l;if(o){e.ui5Type.oConstraints.scale=l}}if(r){e.precision=r;if(o){e.ui5Type.oConstraints.precision=r}}f._aCustomFieldMetadata.push(e);this._updateFilterData();return e};P.prototype._prepareP13nData=function(){var e=[],t,a=this._getControlDataReduceFilterItems();this.getTransientData().filter.filterItems.forEach(function(i){t=a&&a.some(function(e){return e.columnKey===i.columnKey});if(i.isDefault){t=true}e.push({name:i.columnKey,label:i.text,active:t})});return e};P.prototype._mdcFilterPanelChangeHandler=function(e){if(e.getParameter("reason")===this.oMDCFilterPanel.CHANGE_REASON_REMOVE){this._handleFieldRemove(e)}};P.prototype._handleFieldRemove=function(e){try{var t=this.oFilterProvider,a=e.getParameter("item").name,i,r=t._getFieldMetadata(a),l=this._getControlByName(a),n=t.getFilterData(),o=this._getControlDataReduceFilterItems();if(o&&o.length>0){o=o.filter(function(e){return e.columnKey!==a})}this._updateControlDataReduce(o);if(!r){i=this._getFilterPropertyFromColumn(a);r=t.aAllFields.find(function(e){return e.name===i});r=t._createFieldMetadata(r);r.name=a;r.fieldName=a;r.control=l}t._createInitialModelForField(n,r);if(l&&l.getValue&&l.getValue()){l.setValue(null)}}catch(t){this._removeFilter(e.getParameter("item").name)}};P.prototype._detachFieldsFromMDCFilterPanel=function(){var e,t=this.oMDCFilterPanel.exit;this.oMDCFilterPanel.exit=function(){t.apply(this,arguments);this._aFilterPanelFields.forEach(function(t){if(t){e=t.getParent();if(e){e.removeContent(t)}}});this._aCustomFields.forEach(function(t){if(t){e=t.getParent();if(e){e.removeContent(t)}}});if(this._aActiveFilterPanelFieldNames){this._aActiveFilterPanelFieldNames=null}}.bind(this)};P.prototype._createConditionForRanges=function(e){var t,a,i=[],r;for(t=0;t<e.length;t++){a=Object.assign({},e[t]);if(!a.columnKey){a.columnKey=a.keyField}try{r=this.oFilterProvider._getFieldMetadata(a.columnKey);if(r&&r.fieldNameOData){a.columnKey=r.fieldNameOData}if(a.columnKey&&a.columnKey.includes("___")){a.columnKey=a.columnKey.replaceAll("___","/")}}catch(e){}delete a.keyField;delete a.tokenText;i.push(a)}return i};P.prototype._createConditionForItems=function(e,t){var a,i,r=[],l;for(a=0;a<e.length;a++){i=e[a];l=Object.assign({},t);l.value1=i.key;l.token=i.text;r.push(l)}return r};P.prototype._createConditionForIntervals=function(e,t,a){var i,r=this.oFilterProvider,l=[],n;i=Object.assign({},a);i.operation="BT";if(e.low&&e.high){i.value1=e.low;i.value2=e.high}else if(e.low){if(r._aFilterBarDateTimeFieldNames.indexOf(t)>-1){n=r._getFieldMetadata(t);l=[e.low];if(typeof e.low==="string"){l=u.parseDateTimeOffsetInterval(e.low);l[0]=n.ui5Type.parseValue(l[0],"string")}if(l.length===2){l[1]=n.ui5Type.parseValue(l[1],"string")}if(l.length===1){i.operation="EQ"}}else{l=u.parseFilterNumericIntervalData(e.low)}if(l){i.value1=l[0];i.value2=l[1]}}return i};P.prototype._updateFilterData=function(e){var t,a,i,r,l,n,o=this.oFilterProvider,s=e?e:this._getControlDataReduceFilterItems();o.clear();n=Object.assign({},o.getFilterData());if(s&&s.length>0){for(t=0;t<s.length;t++){l=Object.assign({},s[t]);r=l.keyField?l.keyField:l.columnKey;if(this._aCustomColumnKeysWithSlash.includes(r)){r=r.replaceAll("/","___")}i=n[r];if(!l.keyField){l.keyField=l.columnKey;delete l.columnKey}if(l.token){a={key:l.value1,text:l.token};if(!i.items){i.items=[]}i.items.push(a)}else if(l.conditionTypeInfo){if(!l.conditionTypeInfo.data.operation){l.conditionTypeInfo.data.operation=l.conditionTypeInfo.data.operator}i.conditionTypeInfo=l.conditionTypeInfo;i.ranges.push(l)}else if(i&&i.hasOwnProperty("low")){if(o._aFilterBarDateTimeFieldNames&&o._aFilterBarDateTimeFieldNames.indexOf(r)>-1){if(l.value1 instanceof Date){l.value1=l.value1.toISOString()}if(l.value2 instanceof Date){l.value2=l.value2.toISOString()}}if(this._aSplitIntervalFields&&this._aSplitIntervalFields.indexOf(l.keyField)>-1){a={low:l.value1+"-"+l.value2,high:null}}else{a={low:l.value1,high:l.value2}}n[r]=a}else if(i===null||typeof i!=="object"){n[r]=l.value1}else{if(!(i&&i.ranges)){i.ranges=[]}n[r].ranges.push(l)}}o.setFilterData(n)}};P.prototype._getControlByName=function(e){var t,a,i,r=this._aFilterPanelFields.length?this._aFilterPanelFields:this._aCustomFields;for(t=0;t<r.length;t++){i=r[t];if(i._sControlName===e){a=i;break}}return a};P.prototype.getChangeType=function(e,t){if(!t||!t.filter||!t.filter.filterItems){return a.personalization.ChangeType.Unchanged}if(t&&t.filter&&t.filter.filterItems){t.filter.filterItems.forEach(function(e){delete e.key;delete e.source})}if(e&&e.filter&&e.filter.filterItems){e.filter.filterItems.forEach(function(e){delete e.key;delete e.source})}var i=JSON.stringify(e.filter.filterItems)!==JSON.stringify(t.filter.filterItems);return i?a.personalization.ChangeType.ModelChanged:a.personalization.ChangeType.Unchanged};P.prototype.getChangeData=function(e,t){if(!e||!e.filter||!e.filter.filterItems){return this.createControlDataStructure()}if(t&&t.filter&&t.filter.filterItems){t.filter.filterItems.forEach(function(e){delete e.key;delete e.source})}if(e&&e.filter&&e.filter.filterItems){e.filter.filterItems.forEach(function(e){delete e.key;delete e.source})}if(!t||!t.filter||!t.filter.filterItems){return{filter:i.copy(e.filter)}}if(JSON.stringify(e.filter.filterItems)!==JSON.stringify(t.filter.filterItems)){return{filter:i.copy(e.filter)}}return null};P.prototype.getUnionData=function(e,t){if(!t||!t.filter||!t.filter.filterItems){return{filter:i.copy(e.filter)}}return{filter:i.copy(t.filter)}};P.prototype._getSmartFilterBar=function(){var e,t=this.getTable();if(t){e=t.oParent&&t.oParent._oSmartFilter}if(!e&&t&&this.getTableType()===a.personalization.TableType.ChartWrapper){e=t.getChartObject()&&t.getChartObject().oParent&&t.getChartObject().oParent._oSmartFilter}return e?e:null};P.prototype._getSmartTable=function(){var e=this.getTable()&&this.getTable().getParent();return e&&e.isA("sap.ui.comp.smarttable.SmartTable")?e:null};P.prototype._getSmartChart=function(){var e=this.getTable();if(e&&this.getTableType()===a.personalization.TableType.ChartWrapper){return e&&e.getChartObject()&&e.getChartObject().getParent()}return null};P.prototype.exit=function(){e.prototype.exit.apply(this,arguments);this._aDropdownFields=null;this.aFilterItems=null;this._aSFBMultiInputs=null;this.oSmartChart=null;this.oSmartTable=null;this.oSmartFilterBar=null;this.aSFBControlConfig=null;this._aSplitIntervalFields=null;if(this.oFilterProviderPromise){this.oFilterProviderPromise=null}if(this.oFilterProvider&&this.oFilterProvider.destroy){this.oFilterProvider.destroy();this.oFilterProvider=null}if(this._aFilterPanelFields&&this._aFilterPanelFields.length>0){this._aFilterPanelFields.forEach(function(e){e.destroy()})}if(this._aCustomFields&&this._aCustomFields.length>0){this._aCustomFields.forEach(function(e){e.destroy()})}this._aFilterPanelFields=null;this._aCustomFields=null;this._aActiveFilterPanelFieldNames=null;this._aViewMetadata=null;this._aCustomColumnKeysWithSlash=null};return P});
//# sourceMappingURL=FilterController.js.map