
var fs = require('fs'),
    path = require('path'),
    parseXML = require('xml2js').parseString;

module.exports = {
    loadSettings: function (targetPath) {
        var source = fs.readFileSync(path.join(targetPath, '/generator.xml'), 'utf8'),
            settings = null;

        var createSettings = function (parsedXML) {
            var GS = parsedXML.GeneratorSettings,
                settings = {
                    version: GS.$.version,
                    extras: [],
                    partials: [],
                    rules: [],
                    templates: {},
                    targetPath: targetPath,
                    dfcache: {}
                };

            if (GS.partials && GS.partials.length > 0 && GS.partials[0].partial) {
                GS.partials[0].partial.forEach(function (partial) {
                    settings.partials.push(partial.$);
                });
            }

            if (GS.extras && GS.extras.length > 0 && GS.extras[0].extra) {
                GS.extras[0].extra.forEach(function (extra) {
                    settings.extras.push(extra.$);
                });
            }

            if (GS.rules && GS.rules.length > 0 && GS.rules[0].rule) {
                GS.rules[0].rule.forEach(function (rule) {
                    settings.rules.push(rule.$);
                });
            }

            settings.rules.forEach(function (rule) {
                if (!settings.templates.hasOwnProperty(rule.template)) {
                    settings.templates[rule.template] = [];
                }

                settings.templates[rule.template].push(rule);
            });

            return settings;
        };

        parseXML(source, { async: false }, function (err, result) {
            settings = createSettings(result);
        });

        return settings;
    }
};