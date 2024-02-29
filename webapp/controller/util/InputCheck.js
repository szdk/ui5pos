sap.ui.define([
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException",
    "sap/base/i18n/ResourceBundle"
], function (
    SimpleType,
    ValidateException,
    ResourceBundle
) {

    let obj = {
        setResourceBundel : (i18n) => {
            obj.i18n = i18n;
        },
        product : {
            name : SimpleType.extend('product.id', {
                formatValue : (i) => i,
                parseValue : (i) => i,
                validateValue : function (input) {
                    if (!input || input.length == 0)
                        throw new ValidateException(obj.i18n.getText('input_required'));
                    if (input.length > 40)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [40]));
                },
            }),
            unitPrice : SimpleType.extend('product.unitPrice', {
                formatValue : (raw) => Math.round(parseFloat(raw) * 100) / 100,
                parseValue : (input) => Math.round(parseFloat(input) * 100) / 100,
                validateValue : function (input) {
                    input = parseFloat(input);
                    if (input !== 0 && !input || input < 0)
                        throw new ValidateException(obj.i18n.getText('input_invalid'))
                }
            }),
            unitInStock : SimpleType.extend('product.unitInStock', {
                formatValue : (raw) => parseInt(raw),
                parseValue : (input) => parseInt(input),
                validateValue : function (input) {
                    input = parseInt(input);
                    if (input !== 0 && !input)
                        throw new ValidateException(obj.i18n.getText('input_invalid'))
                }
            }),
            quantityPerUnit : SimpleType.extend('product.quantityPerUnit', {
                formatValue : (i) => i,
                parseValue : (i) => i,
                validateValue : function (input) {
                    if (!input || input.length == 0)
                        throw new ValidateException(obj.i18n.getText('input_required'));
                    if (input.length > 20)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [20]));
                },
            }),
        },
        category : {
            id : SimpleType.extend('category.id', {
                formatValue : (raw) => parseInt(raw),
                parseValue: (input) => parseInt(input),
                validateValue: function (input) {
                    if (input) input = parseInt(input);
                    if (!input || input <= 0)
                        throw new ValidateException(obj.i18n.getText('input_invalid_category_id', [id]));
                }
            }),
        },
        supplier : {
            id : SimpleType.extend('supplier.id', {
                formatValue : (raw) => parseInt(raw),
                parseValue: (input) => parseInt(input),
                validateValue: function (input) {
                    if (input) input = parseInt(input);
                    if (!input || input <= 0)
                        throw new ValidateException(obj.i18n.getText('input_invalid_supplier_id', [id]));
                }
            }),
        }
    };
    return obj;
});