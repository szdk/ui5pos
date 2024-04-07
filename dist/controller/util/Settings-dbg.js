sap.ui.define([
    "sap/ui/Device",
    "sap/base/i18n/Localization",
    "sap/ui/core/Theming",
],
function (
    Device,
    Localization,
    Theming,
) {
    "use strict";
    let obj = {
        loadFromLocal : function (model) {
            let settings = model.getData();
            let stored = localStorage.getItem('szdk/ui5pos/settings');
            if (stored) {
                stored = JSON.parse(stored);
                
                settings.odata.serviceUrl = (typeof stored.odata != 'undefined' && typeof stored.odata.serviceUrl != 'undefined') ? stored.odata.serviceUrl : settings.odata.serviceUrl;
                settings.odata.useMock = (typeof stored.odata != 'undefined' && typeof stored.odata.useMock != 'undefined') ? stored.odata.useMock : settings.odata.useMock;
                settings.odata.delay = (typeof stored.odata != 'undefined' && typeof stored.odata.delay != 'undefined') ? stored.odata.delay : settings.odata.delay;
                settings.odata.generateID = (typeof stored.odata != 'undefined' && typeof stored.odata.generateID != 'undefined') ? stored.odata.generateID : settings.odata.generateID;
                settings.odata.updateQuantity = (typeof stored.odata != 'undefined' && typeof stored.odata.updateQuantity != 'undefined') ? stored.odata.updateQuantity : settings.odata.updateQuantity;
                settings.odata.updateMethod = (typeof stored.odata != 'undefined' && typeof stored.odata.updateMethod != 'undefined') ? stored.odata.updateMethod : settings.odata.updateMethod;

                settings.theme = stored.theme || settings.theme;
                settings.lang = stored.lang || settings.lang;
                settings.density = stored.density || settings.density;
            }
            localStorage.setItem('szdk/ui5pos/settings', JSON.stringify(settings));
            model.setData(settings);
            if (settings.lang != 'auto')
                obj.updateLang(settings.lang);
            obj.updateTheme(settings.theme);
            obj.updateContentDensity(settings.density);
        },

        updateSettings : function (newSettings, model) {
            if (typeof (newSettings.odata && newSettings.odata.generateID) != 'undefined')
                model.setProperty('/odata/generateID', newSettings.odata.generateID);
            if (typeof (newSettings.odata && newSettings.odata.updateQuantity) != 'undefined')
                model.setProperty('/odata/updateQuantity', newSettings.odata.updateQuantity);

            if ((typeof newSettings.theme != 'undefined') && newSettings.theme != model.getProperty('/theme')) {
                model.setProperty('/theme', newSettings.theme);
                obj.updateTheme(newSettings.theme);
            }

            if ((typeof newSettings.lang != 'undefined') && newSettings.lang != model.getProperty('/lang')) {
                model.setProperty('/lang', newSettings.lang);
                obj.updateLang(newSettings.lang);
            }

            if ((typeof newSettings.density != 'undefined') && newSettings.density != model.getProperty('/density')) {
                model.setProperty('/density', newSettings.density);
                obj.updateContentDensity(newSettings.density);
            }

            localStorage.setItem('szdk/ui5pos/settings', JSON.stringify(model.getData()));
        },

        updateContentDensity : function (density) {
            if (density == 'auto')
                density = Device.support.pointer ? 'compact' : 'cozy';
            if (density == 'compact') {
                document.body.classList.remove('sapUiSizeCozy');
                document.body.classList.add('sapUiSizeCompact');
            } else {
                document.body.classList.remove('sapUiSizeCompact');
                document.body.classList.add('sapUiSizeCozy');
            }
        },

        updateTheme : function (theme) {
            if (theme == 'auto') {
                let dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                let contrast = window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches;
                if (contrast)
                    theme = dark ? 'high_cont_dark' : 'high_cont_light';
                else
                    theme = dark ? 'dark' : 'light';
            }
            if (theme == 'dark')
                Theming.setTheme('sap_horizon_dark');
            else if (theme == 'light')
                Theming.setTheme('sap_horizon');
            else if (theme == 'high_cont_dark')
                Theming.setTheme('sap_horizon_hcb');
            else if (theme == 'high_cont_light')
                Theming.setTheme('sap_horizon_hcw');
        },

        updateLang : function (lang) {
            if (lang == 'auto') {
                lang = navigator.language;
            }
            Localization.setLanguage(lang);
        }
    };
    return obj;
});