sap.ui.define([
    "sap/ui/model/SimpleType",
    "sap/ui/model/CompositeType",
    "sap/ui/model/ValidateException",
    "sap/base/i18n/ResourceBundle"
], function (
    SimpleType,
    CompositeType,
    ValidateException,
    ResourceBundle
) {

    let obj = {
        setResourceBundel : (i18n) => {
            obj.i18n = i18n;
        },
        other : {
            dateToTime : SimpleType.extend('ui5pos.szdk.inputCheck.other.dateToTime', {
                formatValue : (v) => {
                    if (!v) return '';
                    return new Date(v).toTimeString().split(' ')[0];
                }
            })
        },
        customer : {
            id : SimpleType.extend('ui5pos.szdk.inputCheck.customer.id', {
                formatValue : (i) => i ? i.trim() : '',
                parseValue : (i) => i ? i.trim() : '',
                validateValue : function (input) {
                    if (!input || input.trim().length == 0)
                        throw new ValidateException(obj.i18n.getText('input_required'));
                    if (input.trim().length != 5)
                        throw new ValidateException(obj.i18n.getText('input_length_unmatch', [5]));
                },
            }),
            name : SimpleType.extend('ui5pos.szdk.inputCheck.customer.name', {
                formatValue : (i) => i ? i.trim() : '',
                parseValue : (i) => i ? i.trim() : '',
                validateValue : function (input) {
                    if (input.trim().length > 30)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [30]));
                }
            }),
            address : SimpleType.extend('ui5pos.szdk.inputCheck.customer.address', {
                formatValue : (i) => i ? i.trim() : '',
                parseValue : (i) => i ? i.trim() : '',
                validateValue : function (input) {
                    if (input.trim().length > 60)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [60]));
                }
            }),
            city : SimpleType.extend('ui5pos.szdk.inputCheck.customer.city', {
                formatValue : (i) => i ? i.trim() : '',
                parseValue : (i) => i ? i.trim() : '',
                validateValue : function (input) {
                    if (input.trim().length > 15)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [15]));
                }
            }),
            postal : SimpleType.extend('ui5pos.szdk.inputCheck.customer.postal', {
                formatValue : (i) => i ? i.trim() : '',
                parseValue : (i) => i ? i.trim() : '',
                validateValue : function (input) {
                    if (input.trim().length > 10)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [10]));
                }
            }),
            country : SimpleType.extend('ui5pos.szdk.inputCheck.customer.country', {
                formatValue : (i) => i ? i.trim() : '',
                parseValue : (i) => i ? i.trim() : '',
                validateValue : function (input) {
                    if (input.trim().length > 15)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [15]));
                }
            }),
            phone : SimpleType.extend('ui5pos.szdk.inputCheck.customer.phone', {
                formatValue : (i) => i ? i.trim() : '',
                parseValue : (i) => i ? i.trim() : '',
                validateValue : function (input) {
                    if (!input || input.trim().length == 0)
                        throw new ValidateException(obj.i18n.getText('input_required'));
                    if (input.trim().length > 24)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [24]));
                    if (input.trim().length < 3)
                        throw new ValidateException(obj.i18n.getText('input_length_required', [3]));
                }
            }),
        },
        order : {
            netPrice : new (CompositeType.extend('ui5pos.szdk.inputCheck.order.netprice', {
                formatValue : (v) => {
                    let price = v[0], quantity = v[1], discount = v.length > 2 ? v[2] : 0;
                    price = price * quantity * (1 - discount);
                    return (Math.round(price * 100) / 100).toFixed(2);
                }
            }))(),
        },
        product : {
            id : SimpleType.extend('ui5pos.szdk.inputCheck.product.id', {
                formatValue : (raw) => {
                    let result = parseInt(raw);
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                parseValue: (input) => {
                    let result = parseInt(input);
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                validateValue: function (input) {
                    if (input) input = parseInt(input);
                    if (!input || input <= 0)
                        throw new ValidateException(obj.i18n.getText('input_invalid_product_id', [id]));
                }
            }),
            name : SimpleType.extend('ui5pos.szdk.inputCheck.product.name', {
                formatValue : (i) => i,
                parseValue : (i) => i,
                validateValue : function (input) {
                    if (!input || input.length == 0)
                        throw new ValidateException(obj.i18n.getText('input_required'));
                    if (input.length > 40)
                        throw new ValidateException(obj.i18n.getText('input_length_exceeded', [40]));
                },
            }),
            unitPrice : SimpleType.extend('ui5pos.szdk.inputCheck.product.unitPrice', {
                formatValue : (raw) => {
                    let result = Math.round(parseFloat(raw) * 100) / 100;
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                parseValue : (input) => {
                    let result = Math.round(parseFloat(input) * 100) / 100;
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                validateValue : function (input) {
                    input = parseFloat(input);
                    if (input !== 0 && !input || input < 0)
                        throw new ValidateException(obj.i18n.getText('input_invalid'))
                }
            }),
            unitInStock : SimpleType.extend('ui5pos.szdk.inputCheck.product.unitInStock', {
                formatValue : (raw) =>  {
                    let result = parseInt(raw);
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                parseValue : (input) => {
                    let result = parseInt(input);
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                validateValue : function (input) {
                    input = parseInt(input);
                    if (input !== 0 && !input)
                        throw new ValidateException(obj.i18n.getText('input_invalid'))
                }
            }),
            quantityPerUnit : SimpleType.extend('ui5pos.szdk.inputCheck.product.quantityPerUnit', {
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
            id : SimpleType.extend('ui5pos.szdk.inputCheck.category.id', {
                formatValue : (raw) => {
                    let result = parseInt(raw);
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                parseValue: (input) => {
                    let result = parseInt(input);
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                validateValue: function (input) {
                    if (input) input = parseInt(input);
                    if (!input || input <= 0)
                        throw new ValidateException(obj.i18n.getText('input_invalid_category_id', [id]));
                }
            }),
        },
        supplier : {
            id : SimpleType.extend('ui5pos.szdk.inputCheck.supplier.id', {
                formatValue : (raw) => {
                    let result = parseInt(raw);
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
                parseValue: (input) => {
                    let result = parseInt(input);
                    if (!isNaN(result) && typeof result == 'number') return result;
                },
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