sap.ui.define([
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException"
],
function (SimpleType, ValidateException) {
    "use strict";
    return {
        category : {
            categoryId : SimpleType.extend('category.categoryID', {
                formatValue : (raw) => parseInt(raw),
                parseValue : (input) => parseInt(input),
                validateValue : function (id) {
                    id = parseInt(id);
                    if (!id || id == 0) throw new ValidateException(this.i18n.getText('input_invalid_category_id', [id]));
                    //todo
                }
            }),
        }
    };
}
);