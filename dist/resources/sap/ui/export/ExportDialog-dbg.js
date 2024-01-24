/*!
 * SAPUI5
 * (c) Copyright 2009-2023 SAP SE. All rights reserved.
 */

/**
 * Export progress dialog
 * @private
 */
sap.ui.define([
	'sap/ui/core/library',
	'sap/ui/core/format/NumberFormat',
	'sap/ui/export/ExportUtils',
	'sap/m/library',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/ProgressIndicator',
	'sap/m/Text',
	'sap/m/MessageBox'
], function(coreLibrary, NumberFormat, ExportUtils, MLibrary, Dialog, Button, ProgressIndicator, Text, MessageBox) {
	'use strict';

	var ValueState = coreLibrary.ValueState;

	var DialogType = MLibrary.DialogType;
	var ButtonType = MLibrary.ButtonType;

	/**
	 * The method returns a new Promise that results in a new
	 * progress dialog.
	 *
	 * @returns {Promise} - Promise for progress dialog
	 */
	function createProgressDialog() {
		return new Promise(function(fnResolve, fnReject) {
			var dialog;

			ExportUtils.getResourceBundle().then(function(oResourceBundle) {
				var cancelButton = new Button({
					text : oResourceBundle.getText("CANCEL_BUTTON"),
					press : function() {
						if (dialog && dialog.oncancel) {
							dialog.oncancel();
						}
						dialog.finish();
					}
				});

				var progressIndicator = new ProgressIndicator({
					displayAnimation: false,
					displayValue: '0 / 0',
					showValue : true,
					height : "0.75rem",
					state: ValueState.Information
				});
				progressIndicator.addStyleClass("sapUiMediumMarginTop");

				var oMessage = new Text({text : oResourceBundle.getText("PROGRESS_FETCHING_MSG")});
				dialog = new Dialog({
					title : oResourceBundle.getText("PROGRESS_TITLE"),
					type : DialogType.Message,
					contentWidth : "500px",
					content : [
						oMessage,
						progressIndicator
					],
					endButton : cancelButton,
					ariaLabelledBy: [oMessage]
				});

				dialog.updateStatus = function(iFetched, iTotal, sMessage) {
					var iPercentage;

					if (typeof iFetched === 'string' && iFetched) {
						sMessage = iFetched;
						oMessage.setText(sMessage);
					}

					if (!isNaN(iFetched) & !isNaN(iTotal)) {
						iPercentage = iFetched / iTotal * 100;
					}

					/* Update status text to reflect the current step (bundle instead of fetching data) */
					if (iPercentage >= 100) {
						progressIndicator.setState(ValueState.Success);
						cancelButton.setEnabled(false);
						oMessage.setText(sMessage || oResourceBundle.getText("PROGRESS_BUNDLE_MSG"));
					}

					progressIndicator.setPercentValue(iPercentage);

					/* If count was not provided, the export will automatically
					 * try to fetch until the maximum amount of rows per data sheet
					 */
					if (isNaN(iTotal) || iTotal <= 0 || iTotal >= 1048575) {
						iTotal = '\u221E';
					}

					if (!isNaN(iFetched)) {
						progressIndicator.setDisplayValue('' + iFetched + ' / ' + iTotal);
					}
				};

				dialog.finish = function() {
					dialog.close();
					dialog.destroy();
				};

				fnResolve(dialog);
			});
		});
	}

	/**
	 * Shows a warning dialog that can show several warning messages, either alone or combined.
	 *
	 * @param {Object} mParams Configuration of the warning dialog
	 * @param {number} mParams.rows Number of rows that will be exported
	 * @param {number} mParams.columns Number of columns that will be exported
	 * @param {boolean} mParams.cellLimit Number of cells that are suported
	 * @param {boolean} mParams.rowLimit Number of rows that are supported
	 * @param {String} mParams.fileType File type of the exported document
	 * @returns {Promise} Promise that gets resolved when the user wants to export, regardless of the warning
	 */
	function showWarningDialog(mParams) {
		return new Promise(function(fnResolve, fnReject) {

			ExportUtils.getResourceBundle().then(function(oResourceBundle) {
				var aText, bContinue, oWarningDialog, oWarningText, oNumberFormat, sRowCount, sCellCount, sCellLimit, sLimit, sFileType;

				aText = [];
				bContinue = false;
				oNumberFormat = NumberFormat.getIntegerInstance({groupingEnabled: true});
				sFileType = oResourceBundle.getText(mParams.fileType + "_FILETYPE");
				sLimit = oNumberFormat.format(mParams.rowLimit);

				if (mParams.rows) {
					sRowCount = oNumberFormat.format(mParams.rows);

					if (mParams.columns) {
						sCellCount = oNumberFormat.format(mParams.rows * mParams.columns);
						aText.push(oResourceBundle.getText("MSG_WARNING_CELL_COUNT", [sRowCount, mParams.columns, sCellCount]));
					} else {
						aText.push(oResourceBundle.getText("MSG_WARNING_ROW_COUNT", [sRowCount]));
					}

					if (mParams.rows > mParams.rowLimit) {
						aText.push(oResourceBundle.getText("MSG_WARNING_ROW_LIMIT", [sLimit, sFileType]));
					}

					if (mParams.rows * mParams.columns > mParams.cellLimit) {
						sCellLimit = oNumberFormat.format(mParams.cellLimit);
						aText.push(oResourceBundle.getText("MSG_WARNING_CELL_LIMIT", [sCellLimit]));
					}
				} else {
					aText.push(oResourceBundle.getText("MSG_WARNING_COUNT_UNKNOWN"));
					aText.push(oResourceBundle.getText("MSG_WARNING_ROW_LIMIT", [sLimit, sFileType]));
					aText.push(oResourceBundle.getText("MSG_WARNING_ADVICE"));
				}

				aText.push(oResourceBundle.getText("MSG_WARNING_EXPORT_ANYWAY"));

				oWarningText = new Text({
					text: aText.join('\n\n')
				});
				oWarningDialog = new Dialog({
					title: oResourceBundle.getText('WARNING_TITLE'),
					type: DialogType.Message,
					state: ValueState.Warning,
					content: oWarningText,
					contentWidth: '550px', // UX recommendation
					ariaLabelledBy: oWarningText,
					endButton: new Button({
						type: ButtonType.Transparent,
						text: oResourceBundle.getText("CANCEL_BUTTON"),
						press: function () {
							oWarningDialog.close();
						}
					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: oResourceBundle.getText("EXPORT_BUTTON"),
						press: function () {
							bContinue = true;
							oWarningDialog.close();
						}
					}),
					afterClose: function() {
						oWarningDialog.destroy();
						bContinue ? fnResolve() : fnReject();
					}
				});
				oWarningDialog.open();
			});

		});
	}

	/**
	 * Displays the given error message to the user.
	 *
	 * @param {string|Error} sMessage Error or message that will be shown in the error dialog
	 */
	function showErrorMessage(sMessage) {
		if (!sMessage) {
			return;
		}

		if (sMessage instanceof Error) {
			sMessage = sMessage.message;
		}

		ExportUtils.getResourceBundle().then(function(oResourceBundle) {
			var sErrorMessage = sMessage || oResourceBundle.getText('PROGRESS_ERROR_DEFAULT');

			// Replace technical error message in case of "out of memory"
			if (sMessage.toLowerCase().indexOf('invalid string length') > -1) {
				sErrorMessage = oResourceBundle.getText('MSG_ERROR_OUT_OF_MEMORY');
			}

			MessageBox.error(sErrorMessage, {
				title : oResourceBundle.getText("PROGRESS_ERROR_TITLE")
			});
		});
	}

	return {
		getProgressDialog : createProgressDialog,
		showErrorMessage: showErrorMessage,
		showWarningDialog: showWarningDialog
	};

}, /* bExport= */true);
