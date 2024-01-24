/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */

sap.ui.define([
	'sap/base/Log',
	'sap/ui/base/Object',
	'sap/ui/core/Core',
	'sap/ui/export/ExportBase',
	'sap/ui/export/ExportUtils',
	'sap/ui/export/library',
	'sap/ui/export/util/PDFCapabilities',
	'sap/ui/model/odata/v4/ODataModel',
	'./ExportDialog',
	'sap/m/BusyDialog'
], function(Log, BaseObject, Core, ExportBase, ExportUtils, Library, PDFCapabilities, ODataModel, ExportDialog, BusyDialog) {
	'use strict';

	const FileType = Library.FileType;
	const EdmType = Library.EdmType;

	/**
	 * @class The <code>sap.ui.export.PortableDocument</code> class allows you to export table data from a UI5 application to a Portable Document Format (*.PDF) file.
	 *
	 * @author SAP SE
	 * @version 1.120.3
	 *
	 * @since 1.96
	 * @alias sap.ui.export.PortableDocument
	 * @extends sap.ui.export.ExportBase
	 * @private
	 */
	var PortableDocument = ExportBase.extend('sap.ui.export.PortableDocument', {

		constructor: function(mSettings, mCapabilities) {
			ExportBase.call(this, mSettings, mCapabilities);

			if (!BaseObject.isA(this._mCapabilities, 'sap.ui.export.util.PDFCapabilities')) {
				this._mCapabilities = new PDFCapabilities(this._mCapabilities);
			}

			/* Only apply supported properties */
			['paperSize', 'orientation', 'font', 'fontSize', 'doEnableAccessibility', 'fitToPage', 'signature', 'signatureReason', 'pdfArchive', 'showPageNumber'].forEach(function(sProperty) {
				if (typeof mSettings[sProperty] !== 'undefined') {
					this._mSettings[sProperty] = mSettings[sProperty];
				}
			}.bind(this));
		}
	});

	/**
	 * Sets the data source configuration that will be used for exporting the data. If the passed parameter is null,
	 * the call will be ignored.
	 *
	 * @param {object|sap.ui.model.ListBinding|sap.ui.model.TreeBinding} oDataSource Possible types are a data
	 * source configuration, a <code>sap.ui.model.ListBinding</code> or <code>sap.ui.model.TreeBinding</code>
	 * @returns {object|null} - Valid dataSource object or null in case the dataSource configuration is not supported
	 *
	 * @since 1.96
	 * @public
	 */
	PortableDocument.prototype.processDataSource = function(oDataSource) {
		var mDataSource = null;
		var sDataSourceType = typeof oDataSource;

		if (!oDataSource) {
			return null;
		}

		if (sDataSourceType != 'object') {
			Log.error('Spreadsheet#processDataSource: Unable to apply data source of type ' + sDataSourceType);

			return null;
		}

		if (oDataSource.dataUrl && oDataSource.serviceUrl) {
			mDataSource = oDataSource;
		}

		if (oDataSource.isA && oDataSource.isA(['sap.ui.model.ListBinding', 'sap.ui.model.TreeBinding'])) {
			mDataSource = this.createDataSourceFromBinding(oDataSource);
		}

		return mDataSource;
	};

	/**
	 * Creates a valid dataSource configuration
	 *
	 * @param {sap.ui.model.ListBinding|sap.ui.model.TreeBinding} oBinding - A subclass of <code>sap.ui.model.ListBinding</code> or <code>sap.ui.model.TreeBinding</code>
	 * @returns {object} - Valid data source configuration built upon the ListBinding
	 *
	 * @private
	 */
	 PortableDocument.prototype.createDataSourceFromBinding = function(oBinding) {
		var oDataSource = null;

		if (oBinding.isA(['sap.ui.model.ClientListBinding', 'sap.ui.model.ClientTreeBinding'])) {
			Log.error('Unable to create dataSource configuration due to not supported Binding: ' + oBinding.getMetadata().getName());
		}

		/**
		 * All other <code>Bindings</code> need to provide a downloadUrl
		 */
		if (typeof oBinding.getDownloadUrl === 'function') {
			var oModel = oBinding.getModel(),
				sDataUrl = ExportUtils.interceptUrl(oBinding.getDownloadUrl('pdf')),
				sServiceUrl = ExportUtils.interceptUrl(oModel.sServiceUrl),
				bV4ODataModel = oModel.isA('sap.ui.model.odata.v4.ODataModel');

			var oDataUrl = new URL(sDataUrl, document.baseURI);
			oDataUrl.hash = '';

			// Reference the Model for later use
			this._oModel = oModel;

			/* Remove $format system query option because it would overwrite the "Accept" header */
			oDataUrl.search = oDataUrl.search.split('&').filter(function(val) {
				return val.indexOf('$format') == -1;
			}).join('&');

			oDataSource = {
				type: 'odata',
				version: bV4ODataModel ? 4 : 2,
				dataUrl: oDataUrl.toString(),
				serviceUrl: this._resolveServiceUrl(sServiceUrl),
				headers: bV4ODataModel ?  oModel.getHttpHeaders(true) : oModel.getHeaders(),
				count: ExportUtils.getCountFromBinding(oBinding)
			};
		}

		return oDataSource;
	};

	/**
	 * Resolves the service URL that contains the DocumentDescription
	 * relative to the current service URL. The returned service URL
	 * always ends with an forward slash.
	 *
	 * @param {string} sCurrentServiceUrl URL of the data service
	 * @returns {string} Converted service url
	 *
	 * @private
	 */
	PortableDocument.prototype._resolveServiceUrl = function(sCurrentServiceUrl) {
		var isRelative, sReference;

		sCurrentServiceUrl += sCurrentServiceUrl.endsWith('/') ? '' : '/';
		isRelative = /^[\./]/.test(sCurrentServiceUrl);
		sReference = this._mCapabilities.DocumentDescriptionReference;

		if (typeof sReference !== 'string' || !sReference) {
			return sCurrentServiceUrl.split('/').slice(0, -5).join('/') + '/default/iwbep/common/0001/';
		}

		sReference = sReference.endsWith('/') ? sReference : sReference.split('/').slice(0, -1).join('/') + '/';
		var oUrl = new URL(sCurrentServiceUrl, document.baseURI);

		oUrl = new URL(sReference, oUrl.href);

		return isRelative ? oUrl.pathname : oUrl.href;
	};

	/**
	 * Creates the DocumentDescription based on the given export
	 * settings and assigns a unique Id to it.
	 *
	 * @param {object} mSettings Export settings
	 * @returns {object} DocumentDescription object that contains all relevant export settings
	 *
	 * @private
	 */
	PortableDocument.prototype._createDocumentDescription = function(mSettings) {
		const oWorkbook = mSettings.workbook;
		const iODataVersion = mSettings.dataSource.version;

		const oDocumentDescription = {
			"Title": oWorkbook.context.title,
			"Format": {
				"PaperSize": mSettings.paperSize,
				"Orientation": mSettings.orientation
			},
			"PDFStandard": {
				"DoEnableAccessibility": mSettings.doEnableAccessibility
			},
			"TableColumns": []
		};


		/* Add capability related features */

		/* ArchiveFormat */
		if (this._mCapabilities.ArchiveFormat) {
			oDocumentDescription.PDFStandard["UsePDFAConformance"] = mSettings.pdfArchive;
		}

		/* CoverPage */
		if (this._mCapabilities.CoverPage) {
			const oMetaInfo = oWorkbook.context.metainfo;
			oDocumentDescription["CoverPage"] = [];

			if (oMetaInfo instanceof Array) {
				oMetaInfo.forEach(function(oGroup) {
					if (iODataVersion === 2) {
						oGroup.items.forEach(function(oItem) {
							const oCoverPageGroup = {
								"Title": oGroup.name,
								"Name": oItem.key,
								"Value": oItem.value
							};
							oDocumentDescription["CoverPage"].push(oCoverPageGroup);
						});
					} else {
						const oCoverPageGroup = {
							"Title": oGroup.name,
							"Content": []
						};

						oGroup.items.forEach(function(oItem) {
							oCoverPageGroup["Content"].push({
								"Name": oItem.key,
								"Value": oItem.value
							});
						});
						oDocumentDescription["CoverPage"].push(oCoverPageGroup);
					}
				});
			}
		}

		/* FitToPage */
		if (this._mCapabilities.FitToPage) {
			oDocumentDescription.Format["FitToPage"] = {
				"IsEnabled": mSettings.fitToPage,
				"MinimumFontSize": 4
			};
		}

		/* FontSize */
		if (this._mCapabilities.FontSize) {
			oDocumentDescription.Format["FontSize"] = Number(mSettings.fontSize);
		}

		/* HeaderFooter */
		if (this._mCapabilities.HeaderFooter && mSettings.showPageNumber) {
			oDocumentDescription["Footer"] = {
				"Center": {
					"Type": "PAGENUM"
				}
			};
		}

		/* Signature */
		if (this._mCapabilities.Signature) {
			oDocumentDescription["Signature"] = {
				"DoSign": mSettings.signature,
				"Reason": mSettings.signatureReason
			};
		}

		/* Treeview */
		if (this._mCapabilities.Treeview && oWorkbook.hierarchyLevel && oWorkbook.drillState) {
			if (iODataVersion === 2) {
				oDocumentDescription["Hierarchy"] = {
					"DistanceFromRootElement": oWorkbook.hierarchyLevel,
					"DrillStateElement": oWorkbook.drillState
				};
			} else {
				oDocumentDescription.Format["TableFormat"] = "TREE";
			}
		}

		/* Eliminate duplicate or unknown columns before adding them to the DocumentDescription */
		oWorkbook.columns.filter(function(oColumn, iIndex, aArray) {
			var sProperty = Array.isArray(oColumn.property) ? oColumn.property[0] : oColumn.property;

			if (!sProperty) {
				return false;
			}

			return aArray.findIndex(function(oOtherColumn) {
				var sOtherProperty = Array.isArray(oOtherColumn.property) ? oOtherColumn.property[0] : oOtherColumn.property;

				return sProperty === sOtherProperty;
			}) === iIndex;
		}).forEach((oColumnSettings) => {
			const oColumn = {
				"Name": Array.isArray(oColumnSettings.property) ? oColumnSettings.property[0] : oColumnSettings.property,
				"Header": oColumnSettings.label
			};

			if (this._mCapabilities.IANATimezoneFormat && oColumnSettings.type === EdmType.DateTime) {
				oColumn.Format = {
					DisplayFormat: iODataVersion == 2 ? "IANATIMEST" : "IANA-Timestamp"
				};

				if (oColumnSettings.timezoneProperty) {
					oColumn.Format.IANATimezoneProperty = oColumnSettings.timezoneProperty;
				} else if (oColumnSettings.timezone) {
					oColumn.Format.IANATimezone = oColumnSettings.timezone;
				}
			}

			oDocumentDescription.TableColumns.push(oColumn);
		});

		return oDocumentDescription;
	};

	/**
	 * Returns the name of the EntitySet that is being used with the given OData version.
	 *
	 * @param {object} mDataSource DataSource object containing information about OData version
	 * @returns {string} Name of the EntitySet according to the OData version
	 *
	 * @private
	 */
	PortableDocument.prototype._getEntitySetName = function(mDataSource) {
		var sCollectionName, iVersion;

		iVersion = mDataSource && mDataSource.version || 2; // Use OData V2 by default

		if (this._mCapabilities && typeof this._mCapabilities.DocumentDescriptionCollection === 'string') {
			sCollectionName = this._mCapabilities.DocumentDescriptionCollection;
		}

		return sCollectionName || (iVersion == 4 ? 'MyDocumentDescriptions' : 'SAP__MyDocumentDescriptions');
	};

	/**
	 * Returns the specific ODataModel that is being used for binding to the DocumentDescription EntitySet
	 *
	 * @param {object} oDataSource DataSource settings of the export configuration
	 * @returns {ODataModel} ODataModel, either V2 or V4.
	 *
	 * @private
	 */
	PortableDocument.prototype._getModel = function(oDataSource) {
		var iVersion = oDataSource.version || 2;

		return iVersion === 4 ? new ODataModel({
			serviceUrl: oDataSource.serviceUrl,
			synchronizationMode: 'None'
		}) : this._oModel;
	};

	/**
	 * Shows a warning dialog that the exported file might get cut off.
	 * If the count is less than the ResultSizeMaximum of the PDF capabilities,
	 * no dialog will be shown and the export will proceed automatically.
	 *
	 * @param {object} mSettings Export configuration object
	 * @returns {Promise} Promise that gets resolved if the requirements
	 * for the warning are not met or if the user decides to proceed.
	 * When the user cancels the export, the Promise will reject.
	 *
	 * @private
	 */
	PortableDocument.prototype._showWarning = function(mSettings) {
		var mParams, oWarningPromise;

		mParams = {
			rows: mSettings.dataSource.count,
			rowLimit: this._mCapabilities.ResultSizeMaximum,
			fileType: FileType.PDF
		};

		oWarningPromise = Promise.resolve();

		if (isNaN(mParams.rows) || (mParams.rows > mParams.rowLimit)) {
			oWarningPromise = ExportDialog.showWarningDialog(mParams);
		}

		return oWarningPromise;
	};

	/**
	 * Adds the ResultSizeMaximum from the com.sap.vocabularies.PDF.v1.Features
	 * annotation as $top to the data URL. If this property is not available on
	 * the annotation or its value is not a number, it will be ignored.
	 *
	 * @param {string} sUrl Data URL that is used to request the PDF document
	 * @returns {string} The modified data URL that contains $top. The value of $top is
	 * based on the ResultSizeMaximum of the com.sap.vocabularies.PDF.v1.Features
	 * annotation.
	 */
	PortableDocument.prototype._applyResultSize = function(sUrl) {
		var iLimit, mDataUrl;

		iLimit = parseInt(this._mCapabilities.ResultSizeMaximum);

		if (!isNaN(iLimit) && iLimit > 0) {

			mDataUrl = new URL(sUrl);
			mDataUrl.search += '&$top=' + iLimit;
			sUrl = mDataUrl.toString();
		}

		return sUrl;
	};

	/**
	 * Applies default settings to the export configuration.
	 *
	 * @param {object} mSettings Export configuration object
	 * @returns {Promise} Promise that gets resolved when the default settings have been applied
	 *
	 * @private
	 */
	PortableDocument.prototype.setDefaultExportSettings = function(mSettings) {
		var oContext = mSettings && mSettings.workbook && mSettings.workbook.context;

		if (!(oContext instanceof Object)) {
			oContext = mSettings.workbook.context = {};
		}

		if (typeof oContext.title === 'string' && oContext.title) {
			return Promise.resolve();
		}

		return Core.getLibraryResourceBundle('sap.ui.export', true).then(function(oResourceBundle) {
			oContext.title = oResourceBundle.getText('XLSX_DEFAULT_TITLE');
		});
	};

	/**
	 * Sends a POST request to the GW service which creates the
	 * DocumentDescription. The corresponding Id is assigned by
	 * the backend and passed to the event handler functions.
	 *
	 * @param {object} oDocumentDescription DocumentDescription instance that is being created
	 * @param {object} oDataSource DataSource settings of the export configuration
	 *
	 * @returns {Promise} A Promise that resolves with the newly created Id of the DocumentDescription
	 *
	 * @private
	 */
	PortableDocument.prototype.postDocumentDescription = function(oDocumentDescription, oDataSource) {
		var oBinding, oModel, sPath;

		oModel = this._getModel(oDataSource);
		sPath = '/' + this._getEntitySetName(oDataSource);

		if (!oModel || !oModel.isA(['sap.ui.model.odata.v4.ODataModel', 'sap.ui.model.odata.v2.ODataModel'])) {
			return Promise.reject('Unsupported Model');
		}

		return new Promise(function(fnResolve, fnReject) {

			if (oModel.isA('sap.ui.model.odata.v4.ODataModel')) {
				oBinding = oModel.bindList(sPath);

				oBinding.attachCreateCompleted(function(oEvent) {
					var success = oEvent.getParameter('success');

					if (success) {
						fnResolve(oEvent.getParameter('context').getObject()['Id']);
					} else {
						fnReject();
					}
				});

				oBinding.create(oDocumentDescription);
			} else {
				var bUseBatch = oModel.bUseBatch;

				oModel.setUseBatch(false);
				oModel.create(sPath, oDocumentDescription, {
					success: function(oData) {
						oModel.setUseBatch(bUseBatch);
						fnResolve(oData['Id']);
					},
					error: function(oError) {
						oModel.setUseBatch(bUseBatch);
						fnReject(oError);
					}
				});
			}
		});
	};

	/**
	 * Triggers the export process and returns a Promise the
	 * gets resolved as soon as the export is finished.
	 *
	 * @param {object} mSettings Export settings
	 * @returns {Promise} Promise that is being resolved as soon as the PDF export is finished
	 *
	 * @private
	 */
	PortableDocument.prototype.createBuildPromise = function(mSettings) {
		var that = this;
		var oDocumentDescription;
		var oBusyDialog;
		var oResourceBundle = Core.getLibraryResourceBundle('sap.ui.export');

		oBusyDialog = new BusyDialog('PDFExportBusyDialog', {
			title: oResourceBundle.getText('PROGRESS_TITLE'),
			text: oResourceBundle.getText('PDF_GENERATION_IN_PROGRESS'),
			showCancelButton: true,
			close: function(oEvent) {
				if (oEvent.getParameter('cancelPressed')) {
					that.cancel();
				}

				oBusyDialog.destroy();
				oBusyDialog = null;
			}
		});

		oDocumentDescription = that._createDocumentDescription(mSettings);
		oBusyDialog.open();

		return this._showWarning(mSettings).then(function() {
			return that.postDocumentDescription(oDocumentDescription, mSettings.dataSource);
		}).then(function(sDocumentDescriptionId) {
			return oBusyDialog && that.sendRequest(mSettings.dataSource.dataUrl, sDocumentDescriptionId);
		}).then(function(response) {
			ExportUtils.saveAsFile(response, mSettings.fileName);
		}).catch(function(oError) {
			/* Handle ignore Promise rejection due to cancellation by the user */
			if (!oError) {
				return;
			}

			oError.text()
				.then(function(sError) {
					ExportDialog.showErrorMessage(sError);
				})
				.catch(function() {
					ExportDialog.showErrorMessage(oResourceBundle.getText('PDF_GENERIC_ERROR'));
				});
		}).finally(function() {
			oBusyDialog && oBusyDialog.close();
		});
	};

	/**
	 * Requests the generated PDF via HTTP GET from the OData service.
	 *
	 * @param {string} sUrl Absolute data URL of the OData entity that should be exported as PDF
	 * @param {string} sDocumentDescriptionId GUID of the DocumentDescription that should be used for creating the PDF
	 * @returns {Promise} A Promise that gets resolved after the XHR request
	 *
	 * @private
	 */
	PortableDocument.prototype.sendRequest = function(sUrl, sDocumentDescriptionId) {
		sUrl = this._applyResultSize(sUrl);

		return new Promise(function(fnResolve, fnReject) {
			var oXHR = this.request = new XMLHttpRequest();

			/* Send GET request to receive PDF file */
			oXHR.open('GET', sUrl);
			oXHR.responseType = 'blob';
			oXHR.setRequestHeader('Accept', this.getMimeType());
			oXHR.setRequestHeader('SAP-Document-Description-Id', sDocumentDescriptionId);

			oXHR.addEventListener('abort', function() {
				fnReject(null);
			});

			oXHR.addEventListener('error', function() {
				fnReject('Error occured while requesting data');
			});

			oXHR.addEventListener('load', function() {
				var status = oXHR.status;

				if (status >= 200 && status < 400) {
					fnResolve(oXHR.response);
				} else {
					fnReject(oXHR.response);
				}
			});

			oXHR.send();
		}.bind(this));
	};

	/**
	 * Returns the specific MIME type
	 *
	 * @returns {string} MIME type for Portable Document Format
	 *
	 * @since 1.112
	 * @public
	 */
	PortableDocument.prototype.getMimeType = function() {
		return 'application/pdf';
	};

	/**
	 * Cancels the active request. If the request has not been sent
	 * or the response has been received already, this function has
	 * no effect.
	 *
	 * @since 1.96
	 * @public
	 */
	PortableDocument.prototype.cancel = function() {
		if (this.request && this.request.readyState != XMLHttpRequest.DONE) {
			this.request.abort();
			this.request = null;
		}
	};

	/**
	 * Cleans up the internal structures and removes all event handlers.
	 *
	 * The object must not be used anymore after destroy was called.
	 *
	 * @see sap.ui.export.ExportBase#destroy
	 * @public
	 */
	PortableDocument.prototype.destroy = function() {
		ExportBase.prototype.destroy.apply(this, arguments);

		this._oModel = null;
	};

	return PortableDocument;
});
