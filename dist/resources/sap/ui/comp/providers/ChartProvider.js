/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/odata/MetadataAnalyser","sap/ui/comp/odata/ChartMetadata","sap/ui/comp/odata/FiscalMetadata","sap/ui/comp/odata/type/FiscalDate","sap/ui/comp/odata/type/CalendarDate","sap/ui/comp/odata/CalendarMetadata","sap/ui/comp/odata/ODataType","./ControlProvider","sap/ui/core/format/DateFormat","sap/ui/core/date/UI5Date"],function(t,e,a,i,n,r,s,o,l,h){"use strict";var d=function(a){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");if(a){this._oParentODataModel=a.model;this.sEntitySet=a.entitySet;this._sIgnoredFields=a.ignoredFields;this._bSkipAnnotationParse=a.skipAnnotationParse==="true";this._sChartQualifier=a.chartQualifier;this._sPresentationVariantQualifier=a.presentationVariantQualifier;this._oDefaultDropDownDisplayBehaviour=a.defaultDropDownDisplayBehaviour;this._bUseTimeseries=a.useTimeSeries;this._sNotAssignedText=a.notAssignedText;try{this._oDateFormatSettings=a.dateFormatSettings?JSON.parse(a.dateFormatSettings):undefined;if(!this._oDateFormatSettings.hasOwnProperty("UTC")){this._oDateFormatSettings["UTC"]=true}}catch(t){}if(a.chartLibrary){e.feedWithChartLibrary(a.chartLibrary)}}this._aODataFieldMetadata=[];this._oChartViewMetadata=null;this._oChartDataPointMetadata=null;this._aIgnoredFields=[];this._oMetadataAnalyser=new t(this._oParentODataModel);this._intialiseMetadata()};d.prototype._intialiseMetadata=function(){var t,a=[],i,n,r=0;this._aODataFieldMetadata=this._oMetadataAnalyser.getFieldsByEntitySetName(this.sEntitySet);this._sFullyQualifiedEntityTypeName=this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.sEntitySet);if(!this._bSkipAnnotationParse){this._oPresentationVariant=this._oMetadataAnalyser.getPresentationVariantAnnotation(this._sFullyQualifiedEntityTypeName,this._sPresentationVariantQualifier);if(this._oPresentationVariant&&this._oPresentationVariant.chartAnnotation){this._oChartAnnotation=this._oPresentationVariant.chartAnnotation}else{this._oChartAnnotation=this._oMetadataAnalyser.getChartAnnotation(this._sFullyQualifiedEntityTypeName,this._sChartQualifier)}}if(!this._oDefaultDropDownDisplayBehaviour){this._oDefaultDropDownDisplayBehaviour=this._oMetadataAnalyser.getTextArrangementValue(this._sFullyQualifiedEntityTypeName)}this._generateIgnoredFieldsArray();this._oControlProvider=new o({metadataAnalyser:this._oMetadataAnalyser,model:this._oParentODataModel,fieldsMetadata:this._aODataFieldMetadata,dateFormatSettings:this._oDateFormatSettings,defaultDropDownDisplayBehaviour:this._oDefaultDropDownDisplayBehaviour,enableDescriptions:false,entitySet:this.sEntitySet});if(this._aODataFieldMetadata){this._prepareHierarchy();r=this._aODataFieldMetadata.length}for(n=0;n<r;n++){i=this._aODataFieldMetadata[n];if(this._aIgnoredFields.indexOf(i.name)>-1||!i.visible){continue}if(i.type.indexOf("Edm.")===0){t=this._getFieldViewMetadata(i);this._enrichWithChartViewMetadata(i,t);a.push(i)}}if(this._oChartAnnotation){this._oChartViewMetadata=Object.assign({},this._oChartAnnotation);this._oChartViewMetadata.chartType=e.getChartType(this._oChartViewMetadata.chartType);this._oChartViewMetadata.fields=a}};d.prototype._prepareHierarchy=function(){for(var t=0;t<this._aODataFieldMetadata.length;t++){if(this._aODataFieldMetadata[t].hierarchy){for(var e=0;e<this._aODataFieldMetadata.length;e++){this._aODataFieldMetadata[e].hierarchy=this._aODataFieldMetadata[e].hierarchy||{};this._aODataFieldMetadata[e].hierarchy.up=this._aODataFieldMetadata[e].hierarchy.up||{};if(this._aODataFieldMetadata[t].hierarchy.field===this._aODataFieldMetadata[e].name){this._aODataFieldMetadata[t].hierarchy.down=this._getFieldViewMetadata(this._aODataFieldMetadata[e]);this._aODataFieldMetadata[e].hierarchy.up[this._aODataFieldMetadata[t].hierarchy.type]=this._getFieldViewMetadata(this._aODataFieldMetadata[t])}}}}};d.prototype._setAnnotationMetadata=function(t){if(t&&t.fullName){var e=this._oMetadataAnalyser.getSemanticObjectsFromAnnotation(t.fullName);if(e){t.semanticObjects=e}}};d.prototype._getFieldViewMetadata=function(t){var e=this._oControlProvider.getFieldViewMetadata(t,false);this._setAnnotationMetadata(e);return e};d.prototype._generateIgnoredFieldsArray=function(){if(this._sIgnoredFields){this._aIgnoredFields=this._sIgnoredFields.split(",")}};d.prototype._enrichWithChartViewMetadata=function(e,a){function i(t,e,a){if(e.aggregationRole){return e.aggregationRole===t}if(a){var i=t=="dimension"?a.dimensionFields:a.measureFields;return i&&i.indexOf(e.name)!=-1}return false}e.isMeasure=i("measure",e,this._oChartAnnotation);e.isDimension=i("dimension",e,this._oChartAnnotation);e.isHierarchyDimension=e.hierarchy&&e.hierarchy.type===t.hierarchyType.nodeFor&&i("dimension",e.hierarchy.down,this._oChartAnnotation);e.quickInfo=a.quickInfo;e.modelType=a.modelType;e.hasValueListAnnotation=a.hasValueListAnnotation;e.fullName=a.fullName;e.timeUnitType=this._getTimeUnitType(e);e.dateFormatter=this._getDateFormatter(e);e.isTimeDimension=e.timeUnitType!==undefined;e.role=this._getRole(e);e.hierarchyLevel=this._getHierarchyLevel(e);e.dataPoint=this._getDataPoint(e);e.isNullable=t.isNullable(e);e.filterType=a.filterType;if(a.template){e.template=a.template}if(e.isDimension){e.displayBehaviour=a.displayBehaviour}else if(e.isHierarchyDimension){var n=e.hierarchy.up[t.hierarchyType.nodeExternalKeyFor]||a;e.displayBehaviour=n.displayBehaviour;e.description=n.description||n.name}e.isSemanticObject=a.semanticObjects?true:false;this._setInResult(e);this._setSortOrder(e)};d.prototype._getTimeUnitType=function(t){var e;switch(t.type){case"Edm.Date":e="Date";break;case"Edm.DateTime":case"Edm.DateTimeOffset":if(t.displayFormat==="Date"){e="Date"}break;case"Edm.String":if(a.isFiscalValue(t)){var i=a.getFiscalAnnotationType(t);if(i){var n={IsFiscalWeek:{timeUnitType:undefined},IsFiscalQuarter:{timeUnitType:undefined},IsFiscalPeriod:{timeUnitType:undefined},IsFiscalYearWeek:{timeUnitType:undefined},IsFiscalYearQuarter:{timeUnitType:undefined},IsFiscalYear:{timeUnitType:"fiscalyear"},IsFiscalYearPeriod:{timeUnitType:"fiscalyearperiod"}};e=n[i].timeUnitType;break}}var r=this._getCalendarAnnotationType(t);if(r){var s={IsCalendarYearWeek:{timeUnitType:"yearweek"},IsCalendarYearMonth:{timeUnitType:"yearmonth"},IsCalendarYearQuarter:{timeUnitType:"yearquarter"},IsCalendarWeek:{timeUnitType:undefined},IsCalendarMonth:{timeUnitType:undefined},IsCalendarQuarter:{timeUnitType:undefined},IsCalendarYear:{timeUnitType:undefined},IsCalendarDate:{timeUnitType:"yearmonthday"}};e=s[r].timeUnitType;break}break}return e};d.prototype._getDateFormatter=function(t){var e,a;var i;switch(t.type){case"Edm.Date":a=l.getDateInstance(this._oDateFormatSettings);break;case"Edm.Time":a=l.getTimeInstance(this._oDateFormatSettings);break;case"Edm.DateTimeOffset":case"Edm.DateTime":if(t.type==="Edm.DateTimeOffset"&&t.timezone){a=l.getDateTimeWithTimezoneInstance(this._oDateFormatSettings);break}if(t.displayFormat==="Date"){a=l.getDateInstance(this._oDateFormatSettings)}else{var n=Object.assign({},this._oDateFormatSettings);delete n.UTC;a=l.getDateTimeInstance(n)}break;case"Edm.String":if(r.isDate(t)&&this._oDateFormatSettings){if(!e){var o=s.getType("Edm.String",this._oDateFormatSettings,i,{isCalendarDate:true});e=function(t){return o.formatValue(t,"string")}}}else if(!this._bUseTimeseries){e=this._getDateFormatterForAnnotation(t,i)}break}if(a){e=function(t,e){if(t===""){return this._sNotAssignedText}if(!t){return null}var i=h.getInstance(t);return a.format(i,e)}.bind(this)}return e};d.prototype._getDateFormatterForAnnotation=function(t,e){var o={};var h=null;if(a.isFiscalValue(t)){var d=new i(null,null,{fiscalType:a.getFiscalAnnotationType(t)});h=function(t){if(t==""){return this._sNotAssignedText}return d.formatValue(t,"string")}.bind(this);return h}if(this._oDateFormatSettings){Object.assign(o,this._oDateFormatSettings)}if(r.isCalendarValue(t)){var u=this._getCalendarAnnotationType(t);if(u==="IsCalendarDate"){o.pattern="d MMMM y";var p=s.getType("Edm.String",o,e,{isCalendarDate:true});var y=l.getInstance({pattern:"yyyyMMdd"});h=function(t){if(t==""){return this._sNotAssignedText}var e=y.parse(t);return p.formatValue(e,"string")}.bind(this)}else{var f=new n(null,null,{calendarType:u});h=function(t){if(t==""){return this._sNotAssignedText}return f.formatValue(t,"string")}.bind(this)}return h}return null};d.prototype._getCalendarAnnotationType=function(t){return r.getCalendarAnnotationType(t)||(r.isDate(t)?"IsCalendarDate":undefined)};d.prototype._setInResult=function(t){if(this._oPresentationVariant){if(this._oPresentationVariant.requestAtLeastFields&&this._oPresentationVariant.requestAtLeastFields.indexOf(t.name)>-1){t.inResult=true}}};d.prototype._setSortOrder=function(t){t.sorted=false;t.sortOrder="Ascending";var e;if(this._oPresentationVariant&&this._oPresentationVariant.sortOrderFields){e=this._oPresentationVariant.sortOrderFields.length;for(var a=0;a<e;a++){if(this._oPresentationVariant.sortOrderFields[a].name===t.name){t.sorted=true;t.sortOrder=this._oPresentationVariant.sortOrderFields[a].descending?"Descending":"Ascending";t.sortIndex=a;break}}}};d.prototype._unmarkTextDimensions=function(t,e){var a,i;for(a=0;a<t.length;a++){i=t[a];if(i.isDimension){if(e.indexOf(i.name)>-1){i.isDimension=false}}}};d.prototype._getRole=function(t){if(this._oChartAnnotation){if((t.isDimension||t.isHierarchyDimension)&&this._oChartAnnotation.dimensionAttributes[t.name]){return e.getDimensionRole(this._oChartAnnotation.dimensionAttributes[t.name].role)}else if(t.isMeasure&&this._oChartAnnotation.measureAttributes[t.name]){return e.getMeasureRole(this._oChartAnnotation.measureAttributes[t.name].role)}}};d.prototype._getHierarchyLevel=function(t){if(this._oChartAnnotation){if(t.isHierarchyDimension&&this._oChartAnnotation.dimensionAttributes[t.name]){var e=null;try{e=parseInt(this._oChartAnnotation.dimensionAttributes[t.name].hierarchyLevel)}catch(t){e=0}return e}return 0}};d.prototype._getTextPropertyForHierachyDimension=function(e){var a=e.hierarchy.up[t.hierarchyType.nodeExternalKeyFor]||e;return a.description||a.name};d.prototype._getDataPoint=function(t){if(this._oChartAnnotation&&t.isMeasure&&this._oChartAnnotation.measureAttributes[t.name]&&this._oChartAnnotation.measureAttributes[t.name].dataPoint){var e=this._oChartAnnotation.measureAttributes[t.name].dataPoint;var a=e.split("#");var i=a.length===2?a[1]:"";return this._getMeasureDataPoint(i,t.name)}return null};d.prototype.getChartViewMetadata=function(){return this._oChartViewMetadata};d.prototype.getViewField=function(t){var e=this._oChartViewMetadata.fields.filter(function(e){return e.name===t})[0];return e};d.prototype.getChartDataPointMetadata=function(){if(!this._oChartDataPointMetadata&&this._sFullyQualifiedEntityTypeName){this._oChartDataPointMetadata=this._oMetadataAnalyser.getDataPointAnnotation(this._sFullyQualifiedEntityTypeName)}return this._oChartDataPointMetadata};d.prototype._getMeasureDataPoint=function(t,e){var a=this.getChartDataPointMetadata();if(a){var i=null;if(t){if(a.additionalAnnotations){i=a.additionalAnnotations[t]}}else if(a.primaryAnnotation){i=a.primaryAnnotation}if(i!=null&&i.Value&&i.Value.Path==e){return i}}return null};d.prototype.getIsUTCDateHandlingEnabled=function(){return this._oDateFormatSettings?this._oDateFormatSettings.UTC:false};d.prototype.destroy=function(){if(this._oMetadataAnalyser&&this._oMetadataAnalyser.destroy){this._oMetadataAnalyser.destroy()}this._oMetadataAnalyser=null;if(this._oControlProvider&&this._oControlProvider.destroy){this._oControlProvider.destroy()}this._oControlProvider=null;this._aODataFieldMetadata=null;this._oChartViewMetadata=null;this._oChartDataPointMetadata=null;this._sIgnoredFields=null;this.bIsDestroyed=true};d.prototype.provideSemanticColoring=function(t){var a={};if(t.Criticality){if(t.Criticality.Path){a={Calculated:t.Criticality.Path}}else{a={Static:e.getCriticalityType(t.Criticality.EnumMember)}}}else{var i={};var n=this._buildThresholds(i,t.CriticalityCalculation);if(n){a={ConstantThresholds:i}}else{a={DynamicThresholds:i}}}return a};d.prototype.calculateDimensionColoring=function(t){var a=e.getValueCriticality(t);if(!a){return null}var i,n,r={Positive:{Values:[]},Critical:{Values:[]},Negative:{Values:[]},Neutral:{Values:[]}};for(var s=0;s<a.length;s++){n=a[s];i=e.calculateValue(n.Value);if(n.Criticality.EnumMember.endsWith("Positive")){r.Positive.Values.push(i)}else if(n.Criticality.EnumMember.endsWith("Critical")){r.Critical.Values.push(i)}else if(n.Criticality.EnumMember.endsWith("Negative")){r.Negative.Values.push(i)}else{r.Neutral.Values.push(i)}}return r};d.prototype._buildThresholds=function(t,a){var i=true;t.ImprovementDirection=e.getImprovementDirectionType(a.ImprovementDirection.EnumMember);var n=e.getCriticalityThresholds();var r=n.length;var s={oneSupplied:false};var o={oneSupplied:false};for(var l=0;l<r;l++){s[n[l]]=a[n[l]]?a[n[l]].Path:undefined;s.oneSupplied=s.oneSupplied||s[n[l]];if(!s.oneSupplied){o[n[l]]=e.calculateConstantValue(a[n[l]]);o.oneSupplied=o.oneSupplied||o[n[l]]}}if(s.oneSupplied){i=false;for(var l=0;l<r;l++){if(s[n[l]]){t[n[l]]=s[n[l]]}}}else{var h;t.AggregationLevels=[];if(o.oneSupplied){h={VisibleDimensions:null};for(var l=0;l<r;l++){if(o[n[l]]){h[n[l]]=o[n[l]]}}t.AggregationLevels.push(h)}if(a.ConstantThresholds&&a.ConstantThresholds.length>0){for(var l=0;l<a.ConstantThresholds.length;l++){var d=a.ConstantThresholds[l];var u=d.AggregationLevel?[]:null;if(d.AggregationLevel&&d.AggregationLevel.length>0){for(var p=0;p<d.AggregationLevel.length;p++){u.push(d.AggregationLevel[p].PropertyPath)}}h={VisibleDimensions:u};for(var p=0;p<r;p++){var y=e.calculateConstantValue(d[n[p]]);if(y){h[n[p]]=y}}t.AggregationLevels.push(h)}}}return i};d.prototype.getMaxItems=function(){var t=-1;if(this._oPresentationVariant&&this._oPresentationVariant.maxItems){t=this._oPresentationVariant.maxItems}return t};d.prototype.getIgnoredChartTypesForTimeSeries=function(){return e.getIgnoredChartTypesForTimeSeries()};return d},true);
//# sourceMappingURL=ChartProvider.js.map