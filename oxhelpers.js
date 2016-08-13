
// Handlebars Helpers

var registerOxHelpers = function (Handlebars) {

    var Utils = {};
    //noinspection JSLint
    var undef = void 0;

    //Simple utility method to augment obj with all keys defined on value
    Utils.extend = function (obj /* , ...source */) {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
                    obj[key] = arguments[i][key];
                }
            }
        }

        return obj;
    };

    Utils.appendContextPath = function (contextPath, id) {
        return (contextPath ? contextPath + '.' : '') + id;
    };

    Utils.blockParams = function (params, ids) {
        params.path = ids;
        return params;
    };

    Utils.isBrowser = function () {
        return (typeof console !== 'undefined');
    };


    Utils.isBoolean = function (obj) {
        var type = typeof obj;
        //noinspection JSLint
        return obj !== undef && type === 'boolean' || type === 'Boolean';
    };


    Utils.isNumber = function (obj) {
        return obj !== undef && obj !== null && (typeof obj === 'number' || obj instanceof Number);
    };

    Utils.isString = function (obj) {
        return obj !== undef && obj !== null && (typeof obj === 'string' || obj instanceof String);
    };

    Utils.toString = function (str) {
        return Utils.isString(str) ? str : '' + str;

    };

    Utils.isObject = function (obj) {
        return obj !== null && obj !== undef && typeof obj === 'object';
    };


    Utils.isRegExp = function (obj) {
        return obj !== undef && obj !== null && (obj instanceof RegExp);
    };

    Utils.isFunction = function (obj) {
        return typeof obj === 'function';
    };

    Utils.isArray = function (value) {
        return (value && typeof value === 'object') ? Utils.toString.call(value) === '[object Array]' : false;
    };

    Utils.isEmpty = function (value) {
        return Handlebars.Utils.isEmpty(value);
    };

    /*
     This is to check if helper parameter is undefined. it is not standard js undefined
     */
    Utils.isUndefined = function (value) {
        //noinspection JSLint
        return value === undef || Utils.toString.call(value) === '[object Function]' || (value !== null && value.hash != null);
    };

    /**
     * String Utils
     */


    Utils.safeString = function (str) {
        return new Handlebars.SafeString(str);
    };

    Utils.nullToEmpty = function (val) {
        //noinspection JSLint
        if (val == null) {
            return '';
        } else {
            return val;//.toString();
        }
    };

    Utils.lowerCase = function (str) {
        str = Utils.nullToEmpty(str);
        return str.toLowerCase();
    };


    Utils.trim = function (str) {
        var trim = /\S/.test('\xA0') ? /^[\s\xA0]+|[\s\xA0]+$/g : /^\s+|\s+$/g;
        return str ? str.toString().replace(trim, '') : '';
    };

    /**
     * Trim space on left and right of a string
     * @param {String} myString source string
     * @return {String} trimmed string
     */
    Utils.trimWhitspace = function (str) {
        return str.replace(/^s+/g, '').replace(/\s+$/g, '');
    };

    //HTML escapes the passed string, making it safe for rendering as text within HTML content
    Utils.escapeExpression = function (string) {
        return Handlebars.Utils.escapeExpression(string);
    };

    Utils.escapeString = function (str, except) {
        return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+\^])/g, function (ch) {
            if (except && except.indexOf(ch) !== -1) {
                return ch;
            }
            return '\\' + ch;
        });
    };

    Utils.createFrame = function (object) {
        var obj = {};
        Utils.extend(obj, object);
        return obj;
    };

    Utils.result = function (value) {
        if (Utils.isFunction(value)) {
            return value();
        } else {
            return value;
        }
    };

    Utils.err = function (msg) {
        throw new Error(msg);
    };

    Utils.forceInt = function (value) {
        return value || 0;
    };

    Utils.detectType = function (value) {
        switch (typeof value) {
            case 'string':
                return 'str';
            case 'number':
                return 'num';
            case 'object':
                return 'obj';
            default:
                return 'other';
        }
    };

    Utils.indexOf = function (array, value) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    };

    /*
     # Object Utils
     */
    Utils.eachProperty = function (context, options) {
        var ret = '';
        for (var prop in context) {
            ret = ret + options.fn({
                    property: prop,
                    value: context[prop]
                });
        }
        return ret;
    };


    Utils.prop = function (name) {
        return function (obj) {
            return obj[name];
        };
    };


    Utils.showProps = function (obj, objName) {
        var result = '';
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                result += objName + '.' + i + ' = ' + obj[i] + '\n';
            }
        }
        return result;
    };


    Utils.listAllProperties = function (obj) {
        var objectToInspect = void 0;
        var result = [];
        objectToInspect = obj;
        while (objectToInspect !== null) {
            result = result.concat(Object.getOwnPropertyNames(objectToInspect));
            objectToInspect = Object.getPrototypeOf(objectToInspect);
        }
        return result;
    };


    Utils.listProps = function (obj) {
        var value;
        var result = [];
        if (!obj) {
            return [];
        }
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                value = obj[key];
                result.push(value);
            }
        }
        return result;
    };

    /**
     * Conditional output
     */

    Utils.getExt = function (str) {
        var extname = path.extname(str);
        if (extname) {
            str = extname;
        }
        if (str[0] === '.') {
            str = str.substring(1);
        }
        return str;
    };

    Utils.toggleOutput = function (ext, md, html) {
        if (ext === '') {
            return md;
        } else {
            return html;
        }
    };

    /**
     * Generate HTML or markdown based on extension defined.
     * @param  {String} ext      The extension defined.
     * @param  {String} markdown The content to use for markdown
     * @param  {String} html     The content to use for HTML
     * @return {String}
     */
    Utils.switchOutput = function (ext, markdown, html) {
        var output;
        switch (ext) {

            // return markdown
            case '.markdown':
            case '.md':
                output = markdown;
                break;

            // return HTML
            case '.html':
            case '.htm':
                output = html;
                break;

            default:
                output = html;
        }
        return output;
    };

    /**
     * Detect and return the indentation of a string.
     * @param   {String} str [description]
     * @returns {[type]}     Actual indentation, or undefined.
     */
    Utils.detectIndentation = function (str) {
        var tabs = str.match(/^[\t]+/g) || [];
        var spaces = str.match(/^[ ]+/g) || [];
        var prevalent = (tabs.length >= spaces.length ? tabs : spaces);
        var indentation = void 0;

        var i = 0;
        var il = prevalent.length;

        while (i < il) {
            if (!indentation || prevalent[i].length < indentation.length) {
                indentation = prevalent[i];
            }
            i++;
        }
        return indentation;
    };

    /**
     * Return all matches in the given string.
     * @param  {String} string [the input string]
     * @param  {RegEx}  regex  [regular expression pattern]
     * @param  {[type]} index  [description]
     * @return {[type]}        [description]
     */
    Utils.getMatches = function (string, regex, index) {
        // default to the first capturing group
        index = index || (index = 1);
        var matches = [];
        var match = void 0;
        while (match = regex.exec(string)) {
            matches.push(match[index]);
        }
        return matches;
    };

    Utils.cloneDeep = function clone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor(); // changed

        for (var key in obj) {
            temp[key] = clone(obj[key]);
        }
        return temp;
    };

    //-------------------- Register Custom Helpers

    (function () {

        var moneyFmtFn = function (num, includePennies, ccy) {
            num /= 100;
            ccy = ccy || '\u00A3 ';
            var negative = (num < 0);
            if (negative) {
                num = -num;
            }

            var p = num.toFixed(2).split(".");
            var chars = p[0].split("").reverse();
            var newstr = '';

            var count = 0;
            for (var x in chars) {
                if (chars.hasOwnProperty(x)) {
                    count++;
                    if (count % 3 == 1 && count != 1) {
                        newstr = chars[x] + ',' + newstr;
                    } else {
                        newstr = chars[x] + newstr;
                    }
                }
            }

            var result = ccy + newstr;
            if (includePennies) {
                result = result + "." + p[1];
            }
            if (negative) {
                result = '- ' + result;
            }

            return result;
        };


        var customHelpers = {
            /**
             * Helper to return qrcode
             * {{#qrcode 'demo' size='110'}}http://sample.com/{{this}}{{/qrcode}}
             {{qrcode 'demo'}}
             {{#qrcode 'demo' size='110'}}http://sample.com/{{this}}{{/qrcode}}
             * @param context
             * @param options
             * @returns {Handlebars.SafeString}
             */
            qrcode: function (context, options) {
                if (options === void 0) {
                    options = context;
                    context = this;

                }
                var size = options.hash.size || '110';
                var url = options.fn ? options.fn(context) : context;

                return new Handlebars.SafeString('<img src="https://chart.googleapis.com/chart?chs=' + size + 'x' + size + '&cht=qr&chl=' + Handlebars.escapeExpression(url) + '&chld=M|1&choe=UTF-8">');
            },

            enumFormatUpperCase: function (value) {
                if (value) {
                    return value.replace(/_/g, ' ');
                }
                return '';
            },

            enumFormat: function (value) {
                //todo deprecated
                if (value) {
                    var s = value.toLowerCase().replace(/_/g, ' ');
                    return s.charAt(0).toUpperCase() + s.slice(1);
                }
                return '';

            },

            'default': function (value, defaultValue) {
                return !Utils.isEmpty(value) ? value : defaultValue;
            },

            raw: function (options) {
                return  (options && options.fn ) ? options.fn() : options;
            },

            escape: function (value) {
                return Utils.escapeExpression(value);
            },


            phones: function (value) {
                var result = [];
                for (var i = 0; i < value.length; i++) {
                    var entry = value[i];
                    var numType = Utils.toString(entry.type || 'unspecified');
                    result.push(entry.number + ' (' + numType + ')');
                }
                return result.join(', ');
            },

            //deprecated
            statements: function (items, options) {
                var out = '';
                for (var i = 0; i < value.length; i++) {
                    out += '<h3 class="gray-bg">' + i + '</h3>';
                    out += options.fn(items[i]);
                    out += '<br>';
                }

                if (out == '') {
                    out = '(no statements)';
                }
                return out;
            },

            id_from_key: function (value) {
                if (value) {
                    var parts = value.split(':');
                    if (parts.length > 2) {
                        return parts[2];
                    }
                }
                return "";
            },

            id_from_complex_key: function (value, entityType) {
                if (value) {
                    var parts = value.split(entityType);
                    if (parts.length > 1) {
                        var subparts = parts[1].split(':');
                        if (subparts.length > 1) {
                            return subparts[1];
                        }
                    }
                }
                return "";
            },

            forceInt: function (value) {
                return Utils.forceInt(value);
            },

            thumb: function (value) {
                if (!value || value.length < 1) {
                    return '/backoffice/resources/img/other/no-image.png';
                }
                return value[0].url;
            },

            /**
             * format money
             * type = default, ps, short
             * includePennies = true | false
             * invert = true | false
             * absolute = true | false
             * ccy = '\u00A3 '
             * @param num
             * @param options
             * @returns {string}
             */
            moneyFmt: function (num, options) {
                options = options || {hash: {}};
                var type = options.hash.type || 'default',
                    invert = options.hash.invert == 'true',
                    includePennies = options.hash.includePennies != 'false',
                    absolute = options.hash.absolute == 'true',
                    ccy = options.hash.ccy || '\u00A3 ';


                if (invert) {
                    num = -num;
                }
                if (absolute) {
                    num = Math.abs(num)
                }
                var result = '';
                if (type === 'default') {
                    //console.log(num, includePennies, ccy);
                    result = num > 92233720368547750 ? '\u221E' : moneyFmtFn(num, includePennies, ccy);
                } else if (type === 'ps') {
                    result = moneyFmtFn(Math.abs(num), includePennies, ccy);
                    if (num < 0) {
                        result = '(' + result + ')';
                    }
                } else if (type === 'short') {
                    result = moneyFmtFn(num, false, ccy);
                }
                return result;
            },

            //deprecated
            moneyFmtPs: function (num) {
                var result = moneyFmtFn(Math.abs(num), true);
                if (num < 0) {
                    result = '(' + result + ')';
                }
                return result;
            },

            //deprecated
            invMoneyFmtPs: function (num) {
                return Handlebars.helpers.moneyFmtPs(-num);
            },

            //deprecated
            moneyFmtShrt: function (num) {
                return moneyFmtFn(num, false);
            },
            //deprecated
            negMoneyFmt: function (num) {
                return moneyFmtFn(-num, true);
            },
            //deprecated
            absMoneyFmt: function (num) {
                return moneyFmtFn(Math.abs(num), true);
            },

            percentageFmt: function (num) {
                return num > 92233720368547750 ? '\u221E' : moneyFmtFn(num, true, '%');
            },

            contactTypeByAccountType: function (accountType) {
                var plural = accountType.split('_')[0];
                return plural.substr(0, plural.length - 1).toLowerCase();
            },

            valueByKey: function (map, key) {
                var keyParts = key.split('.'),
                    value = map,
                    keyPart,
                    keyPartIndex;

                for (keyPartIndex in keyParts) {
                    if (keyParts.hasOwnProperty(keyPartIndex)) {
                        keyPart = keyParts[keyPartIndex];
                        value = value[keyPart];
                    }
                }

                return value;
            },

            //deprecated
            address: function (value) {
                if (Utils.isString(value)) {
                    value = JSON.parse(value);
                }

                var result = '';
                if (value.line1) {
                    result += value.line1 + ", ";
                }
                if (value.line2) {
                    result += value.line2 + ", ";
                }
                if (value.area) {
                    result += value.area + ", ";
                }
                if (value.postCode) {
                    result += value.postCode;
                }

                return result;
            },


            /**
             * format address
             * type= full | short | noline1  | areatown | streetareatown  | streetareatownpostcode  |
             * @param value
             * @param options
             * @returns {string}
             */
            addressFmt: function (value, options) {
                var type = options.hash.type || 'full',
                    result = '';
                //                if (options.hash && options.hash.dir === '') {
                //                    array = array.reverse();
                //                }

                if (!value) {
                    result = 'Not Specified';
                } else {

                    if (Utils.isString(value)) {
                        value = JSON.parse(value);
                    }

                    if (value.line1 && (type === 'full' || type === 'short')) {
                        result += value.line1;
                    }
                    if (value.streetName && (type.indexOf("street") >= 0)) {
                        if (result) result += ", ";
                        result += value.streetName;
                    }
                    if (value.line2 && (type === 'full' || type === 'noline1')) {
                        if (result) result += ", ";
                        result += value.line2;
                    }
                    if (value.area && (type === 'full' || type === 'noline1' || type.indexOf("area") >= 0)) {
                        if (result) result += ", ";
                        result += value.area;
                    }
                    if (value.town && (type === 'full' || type.indexOf("town") >= 0)) {
                        if (result) result += ", ";
                        result += value.town;
                    }
                    if (value.postCode && (type === 'full' || type === 'noline1' || type.indexOf("postcode") >= 0)) {
                        if (result) result += ", ";
                        result += value.postCode;
                    }
                }
                return result;
            },

            //deprecated
            shortAddress: function (value) {
                var out = '';
                if (!value) {
                    out = 'Not Specified';
                } else {
                    out = value.split(',')[0];
                }
                return out;
            },
            //deprecated
            detailsAddress: function (value) {
                var out = '';
                if (!value) {
                    out = '---';
                } else {
                    var parts = value.split(',');
                    parts = parts.splice(1, parts.length - 1);
                    out = parts.join(',');
                }
                return out;
            },

            if_not_empty_object: function (value, options) {
                if (JSON.stringify(value) !== '{}') {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            adminFees: function (value, coef) {
                if (!isNaN(value)) {
                    var price = value / 100;
                    if (!Utils.isNumber(coef)) {
                        coef = 12 / 52;
                    }
                    return Math.round(price * coef);
                }
            },


            bedroom_renderer: function (value) {
                if (value != null) {
                    if (value === 0) {
                        return 'Studio';
                    } else if (value === -1) {
                        return 'N/A';
                    } else {
                        return value + ' Bedroom';
                    }
                }
            },

            bedroom_renderer_short: function (value) {
                if (value != null) {
                    if (value === 0) {
                        return 'Studio';
                    } else if (value === -1) {
                        return 'N/A';
                    } else {
                        return value;
                    }
                }
            },

            count_renderer_short: function (value) {
                if (value != null) {
                    if (value === -1) {
                        return 'N/A';
                    } else {
                        return value;
                    }
                }
            },

            //deprecated
            person_name_by_key: function (value, type) {
                if (Utils.isBrowser()) {
                    var elId = Math.round(Math.random() * 5000);

                    if (value) {
                        var parts = value.split(':');
                        if (parts.length > 2) {
                            var id = parts[2];
                            $.get('/rest/' + type + 's/lookup/' + id, function (response) {
                                $('#el-' + elId).html(response.fullName);
                            });
                        }
                    }
                    return '<span id="el-' + elId + '">...</span>';
                } else {
                    return "not supported";
                }
            },

            personTypeColor: function (value) {
                var map = {
                    Landlord: 'blue',
                    Contractor: 'red',
                    Tenant: 'green'
                };
                return value ? map[value] : '';
            },


            status_icon: function (value) {
                if (value == 'REPORTED') {
                    return 'exclamation-red';
                } else if (value == 'CLOSED' || value == 'ACTIVE') {
                    return 'tick-circle';
                } else if (value == 'IN_PROGRESS') {
                    return 'exclamation';
                } else if (value == 'NOT_ISSUE') {
                    return 'tick-circle-gray';
                }
                return 'exclamation-red';
            },

            markdown: function (value) {
                if (Markdown) {
                    if (!Markdown.makeHtml) {
                        Markdown.Converter();
                    }

                    return Markdown.makeHtml(value);
                }
                return "Error: MarkDown engine not loaded";
            },

            limit: function (arr, len) {
                if (arr.length > len) {
                    arr = arr.slice(0, len);
                }

                return arr;
            },

            /**
             * {{#withHash}}
             * Build context from the attributes hash
             * @author Vladimir Kuznetsov <https://github.com/mistakster>
             *     {{#withHash subject="Feedback" message=this.text}}
             *        <h1>\{{subject}}</h1>
             *        <div>\{{message}}</div>
             *    \{{/withHash}}
             */
            withHash: function (options) {
                return options.fn(options.hash);
            }
        };

        for (var helper in customHelpers) {
            Handlebars.registerHelper(helper, customHelpers[helper]);
        }

    })();

    //-------------------- Register Logging Helpers


    (function () {
        var logHelpers = {
            /**
             * {{debug}}
             * Use console.log to return context of the 'this' and options from Handlebars
             * @param {Object} value
             * @example
             *   {{debug}}
             */
            debug: function (value) {
                if (Utils.isBrowser()) {
                    console.log('=================================');
                    console.log('Context: ', this);
                    if (!Utils.isUndefined(value)) {
                        console.log('Value: ', value);
                    }
                    return console.log('=================================');
                } else {
                    return "";
                }
            },


            //            log: function (value) {
            //                return console.log(value);
            //            },


            /**
             * {{inspect}}
             * @author: Brian Woodward <http://github.com/doowb>
             * @param  {[type]} obj [description]
             * @param  {[type]} ext [description]
             * @return {[type]}     [description]
             */
            inspect: function (context, options) {

                var ext = options.hash.ext || '.html';
                context = JSON.stringify(context, null, 2);


                // Wrap the returned JSON in either markdown code fences
                // or HTML, depending on the extension.
                var md = '\n```json\n' + context + '\n```';
                var html = '<pre><code class="json">\n' + context + '\n</code></pre>';
                var result = Utils.switchOutput(ext, md, html);
                return new Utils.safeString(result);
            },

            helpers: function () {
                var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                var ret = "", fnStr, param;
                var names = Object.getOwnPropertyNames(Handlebars.helpers);


                names.sort();
                names.forEach(function (x) {
                    fnStr = Handlebars.helpers[x].toString().replace(STRIP_COMMENTS, '');
                    param = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);

                    ret = ret + x + "(" + param + ") ,  ";
                });

                return ret;
            }
        };

        for (var helper in logHelpers) {
            Handlebars.registerHelper(helper, logHelpers[helper]);
        }

    })();

    //-------------------------------Register Inflections Helpers

    (function () {


        var inflectionHelpers = {
            /**
             *
             * @param single
             * @param plural
             * @param value
             * @returns {*}
             */
            pluralizer: function (single, plural, value) {
                if (Utils.isUndefined(value)) {
                    return '';
                }

                var number = value.length || value;
                return number === 1 ? single : plural;
            },
            /**
             *
             * @param count
             * @param singular
             * @param plural
             * @param include
             * @returns {*}
             */
            inflect: function (count, singular, plural, include) {
                var word;
                word = count > 1 || count === 0 ? plural : singular;
                if (Utils.isUndefined(include) || include === false) {
                    return word;
                } else {
                    return "" + count + " " + word;
                }
            },
            /**
             *
             * @param value
             * @returns {string}
             */
            ordinalize: function (value) {
                var normal, _ref;
                normal = Math.abs(Math.round(value));
                if (_ref = normal % 100, [11, 12, 13].indexOf(_ref) >= 0) {
                    return "" + value + "th";
                } else {
                    switch (normal % 10) {
                        case 1:
                            return "" + value + "st";
                        case 2:
                            return "" + value + "nd";
                        case 3:
                            return "" + value + "rd";
                        default:
                            return "" + value + "th";
                    }
                }
            }
        };

        for (var helper in inflectionHelpers) {
            Handlebars.registerHelper(helper, inflectionHelpers[helper]);
        }


    })();

    //-------------------------------Register Math Helpers

    (function () {


        var mathHelpers = {
            add: function (value, addition) {
                return value + addition;
            },
            subtract: function (value, substraction) {
                return value - substraction;
            },
            divide: function (value, divisor) {
                return value / divisor;
            },
            remainder: function (value, divisor) {
                return value % divisor;
            },
            multiply: function (value, multiplier) {
                return value * multiplier;
            },
            floor: function (value) {
                return Math.floor(value);
            },
            ceil: function (value) {
                return Math.ceil(value);
            },
            round: function (value) {
                return Math.round(value);
            }

        };

        for (var helper in mathHelpers) {
            Handlebars.registerHelper(helper, mathHelpers[helper]);
        }


    })();

    //-------------------------------Register Date Helpers

    (function () {
        var Dates = {};

        Dates.padNumber = function (num, count, padCharacter) {
            var lenDiff, padding;
            if (Utils.isUndefined(padCharacter)) {
                padCharacter = '0';
            }
            lenDiff = count - String(num).length;
            padding = '';
            if (lenDiff > 0) {
                while (lenDiff--) {
                    padding += padCharacter;
                }
            }
            return padding + num;
        };

        Dates.dayOfYear = function (date) {
            var oneJan;
            oneJan = new Date(date.getFullYear(), 0, 1);
            return Math.ceil((date - oneJan) / 86400000);
        };

        Dates.weekOfYear = function (date) {
            var oneJan;
            oneJan = new Date(date.getFullYear(), 0, 1);
            return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
        };

        Dates.isoWeekOfYear = function (date) {
            var dayDiff, dayNr, jan4, target;
            target = new Date(date.valueOf());
            dayNr = (date.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            jan4 = new Date(target.getFullYear(), 0, 4);
            dayDiff = (target - jan4) / 86400000;
            return 1 + Math.ceil(dayDiff / 7);
        };

        Dates.tweleveHour = function (date) {
            if (date.getHours() > 12) {
                return date.getHours() - 12;
            } else {
                return date.getHours();
            }
        };

        Dates.timeZoneOffset = function (date) {
            var hoursDiff, result;
            hoursDiff = -date.getTimezoneOffset() / 60;
            result = Dates.padNumber(Math.abs(hoursDiff), 4);
            return (hoursDiff > 0 ? '+' : '-') + result;
        };

        Dates.formats = /%(a|A|b|B|c|C|d|D|e|F|h|H|I|j|k|l|L|m|M|n|p|P|r|R|s|S|t|T|u|U|v|V|W|w|x|X|y|Y|z)/g;

        Dates.abbreviatedWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

        Dates.fullWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        Dates.abbreviatedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        Dates.fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


        Dates.format = function (date, format) {
            var match;
            match = null;
            return format.replace(Dates.formats, function (m, p) {
                switch (p) {
                    case 'a':
                        return Dates.abbreviatedWeekdays[date.getDay()];
                    case 'A':
                        return Dates.fullWeekdays[date.getDay()];
                    case 'b':
                        return Dates.abbreviatedMonths[date.getMonth()];
                    case 'B':
                        return Dates.fullMonths[date.getMonth()];
                    case 'c':
                        return date.toLocaleString();
                    case 'C':
                        return Math.round(date.getFullYear() / 100);
                    case 'd':
                        return Dates.padNumber(date.getDate(), 2);
                    case 'D':
                        return Dates.format(date, '%m/%d/%y');
                    case 'e':
                        return Dates.padNumber(date.getDate(), 2, ' ');
                    case 'F':
                        return Dates.format(date, '%Y-%m-%d');
                    case 'h':
                        return Dates.format(date, '%b');
                    case 'H':
                        return Dates.padNumber(date.getHours(), 2);
                    case 'I':
                        return Dates.padNumber(Dates.tweleveHour(date), 2);
                    case 'j':
                        return Dates.padNumber(Dates.dayOfYear(date), 3);
                    case 'k':
                        return Dates.padNumber(date.getHours(), 2, ' ');
                    case 'l':
                        return Dates.padNumber(Dates.tweleveHour(date), 2, ' ');
                    case 'L':
                        return Dates.padNumber(date.getMilliseconds(), 3);
                    case 'm':
                        return Dates.padNumber(date.getMonth() + 1, 2);
                    case 'M':
                        return Dates.padNumber(date.getMinutes(), 2);
                    case 'n':
                        return '\n';
                    case 'p':
                        if (date.getHours() > 11) {
                            return 'PM';
                        } else {
                            return 'AM';
                        }
                    case 'P':
                        return Dates.format(date, '%p').toLowerCase();
                    case 'r':
                        return Dates.format(date, '%I:%M:%S %p');
                    case 'R':
                        return Dates.format(date, '%H:%M');
                    case 's':
                        return date.getTime() / 1000;
                    case 'S':
                        return Dates.padNumber(date.getSeconds(), 2);
                    case 't':
                        return '\t';
                    case 'T':
                        return Dates.format(date, '%H:%M:%S');
                    case 'u':
                        if (date.getDay() === 0) {
                            return 7;
                        } else {
                            return date.getDay();
                        }
                    case 'U':
                        return Dates.padNumber(Dates.weekOfYear(date), 2);
                    case 'v':
                        return Dates.format(date, '%e-%b-%Y');
                    case 'V':
                        return Dates.padNumber(Dates.isoWeekOfYear(date), 2);
                    case 'W':
                        return Dates.padNumber(Dates.weekOfYear(date), 2);
                    case 'w':
                        return Dates.padNumber(date.getDay(), 2);
                    case 'x':
                        return date.toLocaleDateString();
                    case 'X':
                        return date.toLocaleTimeString();
                    case 'y':
                        return String(date.getFullYear()).substring(2);
                    case 'Y':
                        return date.getFullYear();
                    case 'z':
                        return Dates.timeZoneOffset(date);
                    default:
                        return match;
                }
            });
        };

        var fromUtcToLocal = function (value) {
            if (value && value !== '0') {
                var utcMs = parseInt(value, 10),
                    dateValue = new Date(utcMs);
                return dateValue.getTime() - dateValue.getTimezoneOffset() * 60000;
            }
            return 0;
        };

        var formatDateAdv = function (value, format, shift, toLocal) {
            var out;
            if (value != null) {

                var date = value === 0 ? new Date() : new Date(toLocal ? fromUtcToLocal(value) : value);
                if (Utils.isNumber(shift)) {
                    shift *= 1000 * 60 * 60 * 24;
                    date = new Date(date + shift);
                }
                if (!Utils.isString(format)) {
                    format = '%e %b %Y';
                }

                out = Dates.format(date, format);
            } else {
                out = 'Not Specified';
            }
            return out;
        };

        var dateHelpers = {

            //            formatDate: function (date, format) {
            //                date = new Date(fromUtcToLocal(date));
            //                return Dates.format(date, format);
            //            },

            dateFmt: function (value, format, shift) {

                return formatDateAdv(value, format, shift, false);
            },

            dateFmtLocal: function (value, format, shift) {

                return formatDateAdv(value, format, shift, true);
            },

            dateFmtUK: function (value) {
                return formatDateAdv(value, "%d/%m/%Y");
            },

            dateFmtShort: function (value) {
                return formatDateAdv(value, "%d %b %Y");
            },

            timeFmt: function (value) {
                return formatDateAdv(value, "%H:%M");
            },

            now: function (format) {
                return formatDateAdv(0, format);
            },

            timeago: function (date) {
                var interval, seconds;
                date = new Date(date);
                seconds = Math.floor((new Date() - date) / 1000);
                interval = Math.floor(seconds / 31536000);
                if (interval > 1) {
                    return "" + interval + " years ago";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return "" + interval + " months ago";
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return "" + interval + " days ago";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return "" + interval + " hours ago";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return "" + interval + " minutes ago";
                }
                if (Math.floor(seconds) === 0) {
                    return 'Just now';
                } else {
                    return Math.floor(seconds) + ' seconds ago';
                }
            }
        };

        for (var helper in dateHelpers) {
            Handlebars.registerHelper(helper, dateHelpers[helper]);
        }


    })();

    //--------------------------------Register Logic/Comparison Helpers

    (function () {

        var logicHelpers = {

            contains: function (str, pattern, options) {
                if (str.indexOf(pattern) !== -1) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            and: function (a, b, options) {
                if (a && b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            gt: function (value, test, options) {
                if (value > test) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            gte: function (value, test, options) {
                if (value >= test) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            is: function (value, test, options) {
                if (value === test) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            isnt: function (value, test, options) {
                if (value !== test) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            lt: function (value, test, options) {
                if (value < test) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            lte: function (value, test, options) {
                if (value <= test) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            /**
             * Or
             * Conditionally render a block if one of the values is truthy.
             */
            or: function (a, b, options) {
                if (a || b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            /**
             * {{#compare}}...{{/compare}}
             *
             * @credit: OOCSS
             * @param left value
             * @param operator The operator, must be between quotes ">", "=", "<=", etc...
             * @param right value
             * @param options option object sent by handlebars
             * @return {String} formatted html
             *
             * @example:
             *   {{#compare unicorns "<" ponies}}
             *     I knew it, unicorns are just low-quality ponies!
             *   {{/compare}}
             *
             *   {{#compare value ">=" 10}}
             *     The value is greater or equal than 10
             *     {{else}}
             *     The value is lower than 10
             *   {{/compare}}
             */
            compare: function (left, operator, right, options) {
                /*jshint eqeqeq: false*/

                if (arguments.length < 3) {
                    throw new Error('Handlerbars Helper "compare" needs 3 parameters');
                }

                if (options === undefined) {
                    options = right;
                    right = operator;
                    operator = '===';
                }

                var operators = {
                    '==': function (l, r) {
                        return l == r;
                    },
                    '===': function (l, r) {
                        return l === r;
                    },
                    '!=': function (l, r) {
                        return l != r;
                    },
                    '!==': function (l, r) {
                        return l !== r;
                    },
                    '<': function (l, r) {
                        return l < r;
                    },
                    '>': function (l, r) {
                        return l > r;
                    },
                    '<=': function (l, r) {
                        return l <= r;
                    },
                    '&&': function (l, r) {
                        return l && r;
                    },
                    '||': function (l, r) {
                        return l || r;
                    },
                    '>=': function (l, r) {
                        return l >= r;
                    },
                    'typeof': function (l, r) {
                        return typeof l == r;
                    }
                };

                if (!operators[operator]) {
                    throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
                }

                var result = operators[operator](left, right);

                return result ? options.fn(this) : options.inverse(this);
            },


            /**
             * {{if_eq}}
             *
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{if_eq this compare=that}}
             */
            if_eq: function (context, options) {
                if (context === options.hash.compare) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            /**
             * {{unless_eq}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{unless_eq this compare=that}}
             */
            unless_eq: function (context, options) {
                if (context === options.hash.compare) {
                    return options.inverse(this);
                }
                return options.fn(this);
            },

            /**
             * {{if_gt}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{if_gt this compare=that}}
             */
            if_gt: function (context, options) {
                if (context > options.hash.compare) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            /**
             * {{unless_gt}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{unless_gt this compare=that}}
             */
            unless_gt: function (context, options) {
                if (context > options.hash.compare) {
                    return options.inverse(this);
                }
                return options.fn(this);
            },

            /**
             * {{if_lt}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{if_lt this compare=that}}
             */
            if_lt: function (context, options) {
                if (context < options.hash.compare) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            /**
             * {{unless_lt}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{unless_lt this compare=that}}
             */
            unless_lt: function (context, options) {
                if (context < options.hash.compare) {
                    return options.inverse(this);
                }
                return options.fn(this);
            },

            /**
             * {{if_gteq}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{if_gteq this compare=that}}
             */
            if_gteq: function (context, options) {
                if (context >= options.hash.compare) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            /**
             * {{unless_gteq}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{unless_gteq this compare=that}}
             */
            unless_gteq: function (context, options) {
                if (context >= options.hash.compare) {
                    return options.inverse(this);
                }
                return options.fn(this);
            },

            /**
             * {{if_lteq}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{if_lteq this compare=that}}
             */
            if_lteq: function (context, options) {
                if (context <= options.hash.compare) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            /**
             * {{unless_lteq}}
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{unless_lteq this compare=that}}
             */
            unless_lteq: function (context, options) {
                if (context <= options.hash.compare) {
                    return options.inverse(this);
                }
                return options.fn(this);
            },

            /**
             * {{ifAny}}
             * Similar to {{#if}} block helper but accepts multiple arguments.
             * @author: Dan Harper <http://github.com/danharper>
             *
             * @param  {[type]} context [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             *
             * @example: {{ifAny this compare=that}}
             */
            ifAny: function () {
                var argLength = arguments.length - 2;
                var content = arguments[argLength + 1];
                var success = true;
                var i = 0;
                while (i < argLength) {
                    if (!arguments[i]) {
                        success = false;
                        break;
                    }
                    i += 1;
                }
                if (success) {
                    return content(this);
                } else {
                    return content.inverse(this);
                }
            }

        };
        // Aliases
        logicHelpers.ifeq = logicHelpers.if_eq;
        logicHelpers.unlessEq = logicHelpers.unless_eq;
        logicHelpers.ifgt = logicHelpers.if_gt;
        logicHelpers.unlessGt = logicHelpers.unless_gt;
        logicHelpers.iflt = logicHelpers.if_lt;
        logicHelpers.unlessLt = logicHelpers.unless_lt;
        logicHelpers.ifgteq = logicHelpers.if_gteq;
        logicHelpers.unlessGtEq = logicHelpers.unless_gteq;
        logicHelpers.ifLtEq = logicHelpers.if_lteq;
        logicHelpers.unlessLtEq = logicHelpers.unless_lteq;

        for (var helper in logicHelpers) {
            Handlebars.registerHelper(helper, logicHelpers[helper]);
        }


    })();

    //-------------------------------Register Collection Helpers

    (function () {

        var collectionHelpers = {
            /**    Conditionally render a block if the collection isn't empty. Opposite of empty
             * {{any}}
             * @param  {Array}  array
             * @param  {Object} options
             */
            any: function (array, options) {
                if (array && array.length > 0) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            /**
             * Returns all of the items in the collection after the specified count.
             * @param  {Array}  array Collection
             * @param  {Number} count Number of items to exclude
             * @return {Array}        Array excluding the number of items specified
             */
            after: function (array, count) {
                return array.slice(count);
            },

            /**
             * Use all of the items in the collection after the specified count
             * inside a block.
             * @param  {Array}  array
             * @param  {Number} count
             * @param  {Ojbect} options
             * @return {Array}
             */
            withAfter: function (array, count, options) {
                array = array.slice(count);
                var result = '';
                for (var item in array) {
                    result += options.fn(array[item]);
                }
                return result;
            },


            /**
             * {{arrayify}}
             * Converts a string such as "foo, bar, baz" to an ES Array of strings.
             * @credit: http://bit.ly/1840DsB
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            arrayify: function (str, separator) {
                var sep = Utils.isUndefined(separator) ? "," : separator;
                return Utils.nullToEmpty(str).split(separator).map(function (tag) {
                    return "\"" + tag + "\"";
                });
            },


            /**
             * Returns all of the items in the collection before the specified
             * count. Opposite of {{after}}.
             * @param  {Array}  array [description]
             * @param  {[type]} count [description]
             * @return {[type]}       [description]
             */
            before: function (array, count) {
                return array.slice(0, -count);
            },


            /**
             * Use all of the items in the collection before the specified count
             * inside a block. Opposite of {{withAfter}}
             * @param  {Array}  array   [description]
             * @param  {[type]} count   [description]
             * @param  {Object} options [description]
             * @return {[type]}         [description]
             */
            withBefore: function (array, count, options) {
                if (array.length > 0) {
                    array = array.slice(0, -count);
                    var result = '';
                    for (var item in array) {
                        result += options.fn(array[item]);
                    }
                } else {
                    return options.inverse(this);
                }
                return result;
            },


            /**
             * {{first}}
             * Returns the first item in a collection.
             *
             * @param  {Array}  array
             * @param  {[type]} count
             * @return {[type]}
             */
            first: function (array, count) {
                if (Utils.isUndefined(count)) {
                    return array[0];
                } else {
                    return array.slice(0, count);
                }
            },

            /**
             * {{withFirst}}
             * Use the first item in a collection inside a block.
             *
             * @param  {Array}  array   [description]
             * @param  {[type]} count   [description]
             * @param  {Object} options [description]
             * @return {[type]}         [description]
             */
            withFirst: function (array, count, options) {
                if (!Utils.isUndefined(array)) {
                    array = Utils.result(array);
                    if (!Utils.isUndefined(count)) {
                        count = parseFloat(Utils.result(count));
                    }
                    if (Utils.isUndefined(count)) {
                        options = count;
                        return options.fn(array[0]);
                    } else {
                        array = array.slice(0, count);
                        var result = '';
                        for (var item in array) {
                            result += options.fn(array[item]);
                        }
                        return result;
                    }
                } else if (Utils.isBrowser()) {

                    return console.error('{{withFirst}} takes at least one argument (array).');
                }
            },

            /**
             * Returns the last item in a collection. Opposite of `first`.
             * @param  {Array}  array [description]
             * @param  {[type]} count [description]
             * @return {[type]}       [description]
             */
            last: function (array, count) {
                if (Utils.isUndefined(count)) {
                    return array[array.length - 1];
                } else {
                    return array.slice(-count);
                }
            },

            /**
             * Use the last item in a collection inside a block.
             * Opposite of {{withFirst}}.
             * @param  {Array}  array   [description]
             * @param  {[type]} count   [description]
             * @param  {Object} options [description]
             * @return {[type]}         [description]
             */
            withLast: function (array, count, options) {
                if (Utils.isUndefined(count)) {
                    options = count;
                    return options.fn(array[array.length - 1]);
                } else {
                    array = array.slice(-count);
                    var result = '';
                    for (var item in array) {
                        result += options.fn(array[item]);
                    }
                    return result;
                }
            },

            /**
             * Joins all elements of a collection into a string
             * using a separator if specified.
             * @param  {Array}  array     [description]
             * @param  {[type]} separator [description]
             * @return {[type]}           [description]
             */
            join: function (array, separator) {
                return array.join(Utils.isUndefined(separator) ? ' ' : separator);
            },


            /**
             * Handlebars "joinAny" block helper that supports
             * arrays of objects or strings. implementation found here:
             * https://github.com/wycats/handlebars.js/issues/133
             *
             * @param  {[type]} items [description]
             * @param  {[type]} options [description]
             * @return {[type]}       [description]
             *
             * If "delimiter" is not speficified, then it defaults to ",".
             * You can use "start", and "end" to do a "slice" of the array.
             * @example:
             *   Use with objects:
             *   {{#join people delimiter=" and "}}{{name}}, {{age}}{{/join}}
             * @example:
             *   Use with arrays:
             *   {{join jobs delimiter=", " start="1" end="2"}}
             *
             */
            joinAny: function (items, options) {
                var delimiter = options.hash.delimiter || ",";
                var start = options.hash.start || 0;
                var len = (items ? items.length : 0);
                var end = options.hash.end || len;
                var out = '';
                if (end > len) {
                    end = len;
                }
                if (Utils.isFunction(options)) {
                    var i = start;
                    while (i < end) {
                        if (i > start) {
                            out += delimiter;
                        }
                        if (Utils.isString(items[i])) {
                            out += items[i];
                        } else {
                            out += options(items[i]);
                        }
                        i++;
                    }
                    return out;
                } else {
                    return [].concat(items).slice(start, end).join(delimiter);
                }
            },

            /**
             *   Returns the collection sorted.
             *   If param field is present it will sort by that field in array elem: a[field] > b[field]
             * @param array
             * @param field
             * @returns {*|Array|*[]}
             */
            sort: function (array, field) {
                if (Utils.isUndefined(field)) {
                    return array.sort();
                } else {
                    return array.sort(function (a, b) {
                        return a[field] > b[field];
                    });
                }
            },

            /**
             *  Uses the sorted collection inside the block.
             * @param array
             * @param field   - String name of the field or property to sort by. (Optional)
             * @param options
             * @returns {string}
             */
            withSort: function (array, field, options) {
                array = Utils.cloneDeep(array);
                var getDescendantProp = function (obj, desc) {
                    var arr = desc.split('.');
                    while (arr.length && (obj = obj[arr.shift()])) {
                        continue;
                    }
                    return obj;
                };
                var result = '';
                var item;
                var i;
                var len;
                if (Utils.isUndefined(field)) {
                    options = field;
                    array = array.sort();
                    if (options.hash.dir === 'desc') {
                        array = array.reverse();
                    }
                    for (i = 0, len = array.length; i < len; i++) {
                        item = array[i];
                        result += options.fn(item);
                    }
                } else {
                    array = array.sort(function (a, b) {
                        var aProp = getDescendantProp(a, field);
                        var bProp = getDescendantProp(b, field);
                        if (aProp > bProp) {
                            return 1;
                        } else {
                            if (aProp < bProp) {
                                return -1;
                            }
                        }
                        return 0;
                    });
                    if (options.hash.dir === 'desc') {
                        array = array.reverse();
                    }
                    for (item in array) {
                        result += options.fn(array[item]);
                    }
                }
                return result;
            },

            /**
             *  Sorts and groups collection inside the block.
             * @param context  - currently only arrays supported
             * @param field   - String name of the field or property to sort by. (Optional)
             * @param options  (i.e. dir="desc", sortby="price", sortDir="desc")
             * @returns {string}
             */
            withGroup: function (context, field, options) {
                var byField = Utils.isUndefined(field);

                if (byField) {
                    options = field;
                }

                var fn = options.fn, inverse = options.inverse;
                var i = 0, ret = "", data;
                var isDesc = false,
                    isSorted = false,
                    sortByField = "",
                    isSortByDesc = false;
                if (options.hash) {
                    isDesc = options.hash.dir === 'desc';
                    sortByField = options.hash.sortBy;
                    isSortByDesc = options.hash.sortDir === 'desc';
                    isSorted = sortByField != null;
                }

                if (Utils.isFunction(context)) {
                    context = context.call(this);
                }

                if (Utils.isObject(context)) {
                    context = Utils.cloneDeep(context);
                    var getDescendantProp = function (obj, desc) {
                        var arr = desc.split('.');
                        while (arr.length && (obj = obj[arr.shift()])) {
                            continue;
                        }
                        return obj;
                    };

                    var result = '';

                    if (!Utils.isArray(context)) {
                        var arr = [];
                        for (var l in context) {
                            if (context.hasOwnProperty(l)) {
                                var elem = context[l];
                                elem.key = context[l];
                                arr.push(elem);
                            }
                        }
                        context = arr;
                    }

                    if (byField) {
                        context = context.sort();
                        if (isDesc) {
                            context = context.reverse();
                        }
                        var item, k, len;
                        for (k = 0, len = context.length; k < len; k++) {
                            item = context[k];
                            result += options.fn(item);
                        }
                    } else {
                        context = context.sort(function (a, b) {
                            var aProp = getDescendantProp(a, field);
                            var bProp = getDescendantProp(b, field);
                            if (aProp > bProp) {
                                return 1;
                            } else if (aProp < bProp) {
                                return -1;
                            }
                            else if (isSorted) {
                                return  (getDescendantProp(a, sortByField) - getDescendantProp(b, sortByField)) * (isSortByDesc ? -1 : 1);
                            }
                            return 0;
                        });
                        if (isDesc) {
                            context = context.reverse();
                        }
                    }


                    if (options.data) {
                        data = Utils.createFrame(options.data);
                    }

                    var prev = null, cur = null;
                    for (var j = context.length; i < j; i++) {
                        if (data) {
                            data.index = i;
                            data.first = (i === 0);
                            data.last = (i === (context.length - 1));
                            cur = byField ? context[i] : getDescendantProp(context[i], field);
                            data.groupStart = prev != cur;
                            prev = cur;
                        }
                        ret = ret + fn(context[i], { data: data });
                    }

                }

                if (i === 0) {
                    ret = inverse(this);
                }

                return ret;
            },

            /**
             * Returns the length of the collection
             * @param array
             * @returns {length|Number|number|x.length|Function|document.length|*}
             */
            length: function (array) {
                return (!array) ? 0 : array.length;
            },

            /**
             * Conditionally render a block based on the length of a collection.
             * @param array
             * @param length
             * @param options
             * @returns {*}
             */
            lengthEqual: function (array, length, options) {
                if (array.length === length) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            /**
             *  Conditionally render a block if the collection is empty.
             * @param array
             * @param options
             * @returns {*}
             */
            empty: function (array, options) {
                if (array.length <= 0) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },

            /**
             * {{inArray}}
             * Conditionally render a block if a specified value is in the collection.
             * @param  {Array}  array   [description]
             * @param  {[type]} value   [description]
             * @param  {Object} options [description]
             * @return {[type]}         [description]
             */
            inArray: inArray = function (array, value, options) {
                if (array.indexOf(value) >= 0) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },


            /**
             * {{filterBy}}
             * @param  {[type]} array   [description]
             * @param  {[type]} value   [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             */
            filterBy: function (array, value) {
                if (array.hasOwnProperty(value)) {
                    return array[value];
                } else if (array instanceof Array && array.indexOf(value) >= 0) {
                    return array[value];
                } else {
                    return "";
                }
            },

            /**
             * {{iterate}}
             *
             * Similar to {{#each}} helper, but treats array-like objects
             * as arrays (e.g. objects with a `.length` property that
             * is a number) rather than objects. This lets us iterate
             * over our collections items.
             *
             * @param  {[type]} context [description]
             * @param  {Object} options [description]
             * @return {[type]}         [description]
             */
            iterate: function (context, options) {
                var fn = options.fn;
                var inverse = options.inverse;
                var i = 0;
                var ret = "";
                var data = void 0;
                if (options.data) {
                    data = Handlebars.createFrame(options.data);
                }
                if (Utils.isObject(context)) {
                    if (Utils.isNumber(context.length)) {
                        var j = context.length;
                        while (i < j) {
                            if (data) {
                                data.index = i;
                            }
                            ret = ret + fn(context[i], {data: data});
                            i++;
                        }
                    } else {
                        for (var key in context) {
                            if (context.hasOwnProperty(key)) {
                                if (data) {
                                    data.key = key;
                                }
                                ret = ret + fn(context[key], {data: data});
                                i++;
                            }
                        }
                    }
                }
                if (i === 0) {
                    ret = inverse(this);
                }
                return ret;
            },


            /**
             * {{forEach}}
             * Credit: http://bit.ly/14HLaDR
             *
             * @param  {[type]}   array [description]
             * @param  {Function} fn    [description]
             * @return {[type]}         [description]
             *
             * @example:
             *   var accounts = [
             *     {'name': 'John', 'email': 'john@example.com'},
             *     {'name': 'Malcolm', 'email': 'malcolm@example.com'},
             *     {'name': 'David', 'email': 'david@example.com'}
             *   ];
             *
             *   {{#forEach accounts}}
             *     <a href="mailto:{{ email }}" title="Send an email to {{ name }}">
             *       {{ name }}
             *     </a>{{#unless isLast}}, {{/unless}}
             *   {{/forEach}}
             */
            forEach: function (array, fn) {
                var total = array.length;
                var buffer = "";
                // Better performance: http://jsperf.com/for-vs-forEach/2
                var i = 0;
                var j = total;
                while (i < j) {
                    // stick an index property onto the item, starting
                    // with 1, may make configurable later
                    var item = array[i];
                    item['index'] = i + 1;
                    item['_total'] = total;
                    item['isFirst'] = i === 0;
                    item['isLast'] = i === (total - 1);
                    // show the inside of the block
                    buffer += fn.fn(item);
                    i++;
                }
                // return the finished buffer
                return buffer;
            },


            /**
             * {{eachProperty}}
             * Handlebars block helper to enumerate
             * the properties in an object
             *
             * @param  {[type]} context [description]
             * @param  {Object} options [description]
             * @return {[type]}         [description]
             */
            eachProperty: function (context, options) {
                var content = (function () {
                    var results = [];
                    for (var key in context) {
                        var value = context[key];
                        results.push(options.fn({
                            key: key,
                            value: value
                        }));
                    }
                    return results;
                })();
                return content.join('');
            },


            /**
             * {{eachIndex}}
             *
             * @param  {Array}  array   [description]
             * @param  {Object} options [description]
             * @return {[type]}         [description]
             * @example:
             *   {{#eachIndex collection}}
             *     {{item}} is {{index}}
             *   {{/eachIndex}}
             */
            eachIndex: function (array, options) {
                var i;
                var len;
                var result = '';
                var index;
                for (index = i = 0, len = array.length; i < len; index = ++i) {
                    var value = array[index];
                    result += options.fn({
                        item: value,
                        index: index
                    });
                }
                return result;
            },

            /**
             * {{eachIndexPlusOne}}
             *
             * @param  {Array}  array   [description]
             * @param  {Object} options [description]
             * @return {[type]}         [description]
             * @example:
             *   {{#eachIndexPlusOne collection}}
             *     {{item}} is {{index}}
             *   {{/eachIndexPlusOne}}
             */
            eachIndexPlusOne: function (array, options) {
                var result = '';
                var len;
                var i;
                var index;
                for (index = i = 0, len = array.length; i < len; index = ++i) {
                    var value = array[index];
                    result += options.fn({
                        item: value,
                        index: index + 1
                    });
                }
                return result;
            },

            eachWithClasses: eachWithClasses = function (array, fn) {
                var buffer, i, item, j;
                buffer = "";
                i = 0;
                j = array.length;
                while (i < j) {
                    item = array[i];
                    item.itemPosition = "";
                    if (i === 0) {
                        item.itemPosition = " " + fn.hash.prefix + "-first";
                    }
                    if (i === (array.length - 1)) {
                        item.itemPosition += " " + fn.hash.prefix + "-last";
                    }
                    item.itemAlt = (i % 2 ? fn.hash.prefix + "-alt" : "");
                    item.itemIndex = i;
                    buffer += fn(item);
                    i++;
                }
                return buffer;
            },
            times: function (n, block) {
                var accum = '';
                for (var i = 0; i < n; ++i)
                    accum += block.fn(i);
                return accum;
            },
            'for': function (from, to, incr, block) {
                var accum = '';
                for (var i = from; i < to; i += incr)
                    accum += block.fn(i);
                return accum;
            }

        };

        for (var helper in collectionHelpers) {
            Handlebars.registerHelper(helper, collectionHelpers[helper]);
        }

    })();


    //-------------------------------Register Layout Helpers

    (function () {

        var getBlocks = function (context, name) {
            var blocks = context._blocks;
            return blocks[name] || (blocks[name] = []);
        };

        var layoutHelpers = {

            /**
             * Layout helper see https://github.com/shannonmoeller/handlebars-layouts/blob/master/README.md
             * @param partial
             * @param options
             * @returns {*}
             */
            extend: function (partial, options) {
                var context = Object.create(this);
                var template = Handlebars.partials[partial];

                // Partial template required
                if (template == null) {
                    throw new Error('Missing layout partial: \'' + partial + '\'');
                }

                // New block context
                context._blocks = {};

                // Parse blocks and discard output
                options.fn(context);

                // Render final layout partial with revised blocks
                if (!Utils.isFunction(template)) {
                    template = Handlebars.compile(template);
                }

                // Compile, then render
                return template(context);
            },

            append: function (name, options) {
                getBlocks(this, name).push({
                    should: 'append',
                    fn: options.fn
                });
            },

            prepend: function (name, options) {
                getBlocks(this, name).push({
                    should: 'prepend',
                    fn: options.fn
                });
            },

            layoutReplace: function (name, options) {
                getBlocks(this, name).push({
                    should: 'replace',
                    fn: options.fn
                });
            },

            /**
             *  HG In original this is called block helper, but we renamed it layoutBlock, so it doesn't conflict with HBS JAVA
             * @param name
             * @param options
             * @returns {*}
             */
            layoutBlock: function (name, options) {
                var block = null;
                var retval = options.fn(this);
                var blocks = getBlocks(this, name);
                var length = blocks.length;
                var i = 0;

                for (; i < length; i++) {
                    block = blocks[i];

                    switch (block && block.fn && block.should) {
                        case 'append':
                            retval = retval + block.fn(this);
                            break;

                        case 'prepend':
                            retval = block.fn(this) + retval;
                            break;

                        case 'replace':
                            retval = block.fn(this);
                            break;
                    }
                }

                return retval;
            }

        };

        for (var helper in layoutHelpers) {
            Handlebars.registerHelper(helper, layoutHelpers[helper]);
        }

    })();
    //-------------------------------Register String Helpers


    (function () {

        var stringHelpers = {
            cleanHtml: function (str) {
                var sanitized = '';
                if (str !== null && str !== '') {
                    var reUselessTags = /(<.{0,1}body|<img|<.{0,1}div|<.{0,1}list).{0,}?>/g;
                    var reRemoveWhite = /\r|\n|\t/g;
                    var reList = /<li.{0,}?>/g;
                    var reListParagraphStart = /<(li|p).{0,}?>/g;
                    var reListParagraphEnd = /<(\/li|\/p).{0,}?>/g;
                    var reBreak = /<br.{0,}?>/g;
                    var reDoubleLineBreak = /\r+/g;
                    var reOpenLineBreak = /^\r/g;

                    sanitized = str
                        .replace(reList, '\n')
                        .replace(reListParagraphStart, '\n')
                        .replace(reListParagraphEnd, '\n')
                        .replace(reBreak, '\n')
                        .replace('&nbsp;', ' ')
                        .replace(/(<([^>]+)>)/g, '');
                }
                return sanitized;

            },

            /**
             * {{capitalizeFirst}}
             * Capitalize first word in a sentence
             * @param  {[type]} str [description]
             * @return {[type]}     [description]
             */
            capitalizeFirst: function (str) {
                if (Utils.isString(str)) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
            },

            /**
             * {{capitalizeEach}}
             * Capitalize each word in a sentence
             * @param  {[type]} str [description]
             * @return {[type]}     [description]
             */
            capitalizeEach: function (str) {
                if (Utils.isString(str)) {
                    return str.replace(/\w\S*/g, function (word) {
                        return word.charAt(0).toUpperCase() + word.substr(1);
                    });
                }
            },

            /**
             * {{center}}
             * Center a string using non-breaking spaces
             * @param  {[type]} str    [description]
             * @param  {[type]} spaces [description]
             * @return {[type]}        [description]
             */
            center: function (str, spaces) {
                if (Utils.isString(str)) {
                    var space = '';
                    var i = 0;
                    while (i < spaces) {
                        space += '&nbsp;';
                        i++;
                    }
                    return "" + space + str + space;
                }
            },

            /**
             * {{dashify}}
             * Replace periods in string with hyphens.
             * @param  {[type]} str [description]
             * @return {[type]}     [description]
             */
            dashify: function (str) {
                if (Utils.isString(str)) {
                    return str.split(".").join("-");
                }
            },

            /**
             * {{hyphenate}}
             * Replace spaces in string with hyphens.
             * @param  {[type]} str [description]
             * @return {[type]}     [description]
             */
            hyphenate: function (str) {
                if (Utils.isString(str)) {
                    return str.split(" ").join("-");
                }
            },

            /**
             * {{lowercase}}
             * Make all letters in the string lowercase
             * @param  {[type]} str [description]
             * @return {[type]}     [description]
             */
            lowercase: function (str) {
                if (Utils.isString(str)) {
                    return str.toLowerCase();
                }
            },

            /**
             * {{safeString}}
             * Output a Handlebars safeString
             * @param  {[type]} str [description]
             * @return {[type]}       [description]
             */
            safeString: function (str) {
                if (Utils.isString(str)) {
                    return new Utils.safeString(str);
                }
            },

            /**
             * {{sentence}}
             * Sentence case
             * @param  {[type]} str [description]
             * @return {[type]}     [description]
             */
            sentence: function (str) {
                if (Utils.isString(str)) {
                    return str.replace(/((?:\S[^\.\?\!]*)[\.\?\!]*)/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                }
            },

            /**
             * {{titleize}}
             * Title case. "This is Title Case"
             * @param  {[type]} str [description]
             * @return {[type]}     [description]
             */
            titleize: function (str) {
                if (Utils.isString(str)) {
                    var title = str.replace(/[ \-_]+/g, ' ');
                    var words = title.match(/\w+/g);
                    var capitalize = function (word) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    };
                    return ((function () {
                        var i, len, results;
                        results = [];
                        for (i = 0, len = words.length; i < len; i++) {
                            var word = words[i];
                            results.push(capitalize(word));
                        }
                        return results;
                    })()).join(' ');
                }
            },

            uppercase: function (str) {
                if (Utils.isString(str)) {
                    return str.toUpperCase();
                } else if (str && str.fn) {
                    return str.fn(this).toUpperCase();
                }
            },

            reverse: function (str) {
                if (Utils.isString(str)) {
                    return str.split('').reverse().join('');
                }
            },

            /**
             * {{count}}
             * Return the nuumber of occurrances of a string, within a string
             * @author: Jon Schlinkert <http://github.com/jonschlinkert>
             * @param  {String} str       The haystack
             * @param  {String} substring The needle
             * @return {Number}           The number of times the needle is found in the haystack.
             */
            count: function (str, substring) {
                if (Utils.isString(str)) {
                    var subStr = Utils.isUndefined(substring) ? '' : substring;
                    var n = 0;
                    var pos = 0;
                    var l = subStr.length;
                    while (true) {
                        pos = str.indexOf(subStr, pos);
                        if (pos > -1) {
                            n++;
                            pos += l;
                        } else {
                            break;
                        }
                    }
                    return n;
                }
            },

            /**
             * {{replace}}
             * Replace occurrences of string "A" with string "B"
             * @author: Jon Schlinkert <http://github.com/jonschlinkert>
             * @param  {[type]} str [description]
             * @param  {[type]} a   [description]
             * @param  {[type]} b   [description]
             * @return {[type]}     [description]
             */
            replace: function (str, a, b) {
                if (Utils.isString(str)) {
                    return str.split(a).join(b);
                }
            },

            /**
             * {{ellipsis}}
             * @author: Jon Schlinkert <http://github.com/jonschlinkert>
             * Truncate the input string and removes all HTML tags
             * @param  {String} str      The input string.
             * @param  {Number} limit    The number of characters to limit the string.
             * @param  {String} append   The string to append if charaters are omitted.
             * @return {String}          The truncated string.
             */
            ellipsis: function (str, limit, append) {
                if (Utils.isUndefined(append)) {
                    append = '';
                }

                var sanitized = (str == null ? '' : str.replace(/(<([^>]+)>)/g, ''));
                if (sanitized.length > limit) {
                    return sanitized.substr(0, limit - append.length) + append;
                } else {
                    return sanitized;
                }
            },

            /**
             * {{truncate}}
             * Truncates a string given a specified `length`,
             * providing a custom string to denote an `omission`.
             * @param  {[type]} str      string to truncate or ""
             * @param  {[type]} length   lentgh of string or 10
             * @param  {[type]} omission [description]
             * @return {[type]}          [description]
             */
            truncate: function (str, limit, omission) {
                if (Utils.isUndefined(omission)) {
                    omission = '';
                }
                limit = limit || 10;
                if (str != null && str.length > limit) {
                    return str.substring(0, limit - omission.length) + omission;
                } else {
                    return str;
                }
            },

            /**
             * {{startsWith}}
             * @author: Dan Fox <http://github.com/iamdanfox>
             *
             * Tests whether a string begins with the given prefix.
             * Behaves sensibly if the string is null.
             * @param  {[type]} prefix     [description]
             * @param  {[type]} testString [description]
             * @param  {[type]} options    [description]
             * @return {[type]}            [description]
             *
             * @example:
             *   {{#startsWith "Goodbye" "Hello, world!"}}
             *     Whoops
             *   {{else}}
             *     Bro, do you even hello world?
             *   {{/startsWith}}
             */
            startsWith: function (prefix, str, options) {
                if ((str != null ? str.indexOf(prefix) : void 0) === 0) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },
            //deprecated
            formatPhoneNumber: function (phoneNumber) {
                if (phoneNumber && phoneNumber.number) {
                    return "(" + phoneNumber.type + ") " + phoneNumber.number;

                } else {
                    phoneNumber = Utils.toString(phoneNumber);
                    return "(" + phoneNumber.substr(0, 3) + ") " + phoneNumber.substr(3, 3) + "-" + phoneNumber.substr(6, 4);
                }
            },
            occurrences: function (string, substring) {
                var l, n, pos;
                n = 0;
                pos = 0;
                l = substring.length;
                while (true) {
                    pos = string.indexOf(substring, pos);
                    if (pos > -1) {
                        n++;
                        pos += l;
                    } else {
                        break;
                    }
                }
                return n;
            }

        };

        for (var helper in stringHelpers) {
            Handlebars.registerHelper(helper, stringHelpers[helper]);
        }


    })();
};

if (typeof module !== 'undefined') {
    module.exports = {
        register: registerOxHelpers
    };
}