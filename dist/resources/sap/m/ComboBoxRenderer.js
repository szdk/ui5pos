/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ComboBoxBaseRenderer","sap/ui/core/Renderer","sap/m/inputUtils/ListHelpers"],function(e,t,a){"use strict";var s=t.extend(e);s.apiVersion=2;s.CSS_CLASS_COMBOBOX="sapMComboBox";s.addOuterClasses=function(t,a){e.addOuterClasses.apply(this,arguments);t.class(s.CSS_CLASS_COMBOBOX)};s.addInnerClasses=function(t,a){e.addInnerClasses.apply(this,arguments);t.class(s.CSS_CLASS_COMBOBOX+"Inner")};s.addButtonClasses=function(t,a){e.addButtonClasses.apply(this,arguments);t.class(s.CSS_CLASS_COMBOBOX+"Arrow")};s.addPlaceholderClasses=function(t,a){e.addPlaceholderClasses.apply(this,arguments);t.class(s.CSS_CLASS_COMBOBOX+"Placeholder")};s.writeInnerAttributes=function(t,s){var r=s.isOpen(),i,n,d;var l=s._getSuggestionsPopover();e.writeInnerAttributes.apply(this,arguments);t.attr("aria-expanded",r);if(!l){return}var o=l.getFocusedListItem();var u=l.getValueStateActiveState();if(!r||!o&&!u){return}if(u){t.attr("aria-activedescendant",s._getFormattedValueStateText().getId());return}i=o.isA("sap.m.GroupHeaderListItem")||o.isA("sap.ui.core.SeparatorItem");n=s.getSelectedItem();d=n&&a.getListItem(n);o=i?o:d;if(o){t.attr("aria-activedescendant",o.getId())}};return s},true);
//# sourceMappingURL=ComboBoxRenderer.js.map