// Create global Mistral obj and its namespaces
// build processes may have already created an Mistral obj
window.Mistral = window.Mistral || {};
window.Session = window.Session || {};
window.Random = window.Random || {};
window.Mistral.routes = [];
window.Mistral.config = {};
window.Mistral.version = '0.1.3';
window.Mistral.name = 'Mistral.js';
window.Mistral.tags = ['{{', '}}'];
var objectToString = Object.prototype.toString;
var isArray = Array.isArray || function isArrayPolyfill(object) {
    return objectToString.call(object) === '[object Array]';
};

function isFunction(object) {
    return typeof object === 'function';
}

function typeStr(obj) {
    return isArray(obj) ? 'array' : typeof obj;
}

function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}

function hasProperty(obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
}

var regExpTest = RegExp.prototype.test;

function testRegExp(re, string) {
    return regExpTest.call(re, string);
}
var nonSpaceRe = /\S/;

function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
}

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
        return entityMap[s];
    });
}

var whiteRe = /\s*/;
var spaceRe = /\s+/;
var equalsRe = /\s*=/;
var curlyRe = /\s*\}/;
var tagRe = /#|\^|\/|>|\{|&|=|!/;
Mistral.escape = escapeHtml;

(function (Mistral) {
    'use strict';
    Mistral.configure = function (options) {
        console.log(options);
        if (options.templates) {
            var vms = options.templates;
            for (var ii = 0; ii < vms.length; ii++) {
                Mistral.renderTemplate(vms[ii]);

            }
        }

        Mistral.config = options;
    };

})(window.Mistral);

(function (Mistral, Random) {
    'use strict';
    //dbTypes : localstorage, service, indexeddb, mongodb
    Mistral.Collection = function (name, param) {
        if (name) {
            var self = this;
            self.name = name;
            if (param) {

            }
            else {
                self.dbType = "localstorage";
                self.autoRefresh = true;
                self.url = undefined;
                //for (var m in param.methods) {
                //    self[m] = param.methods[m];
                //}
                self.insert = function (param) {
                    var updated = [];
                    var domain = localStorage[self.name];
                    param['id'] = Random.id(27);
                    if (domain) {
                        updated = JSON.parse(domain);
                        updated.push(param);
                    }
                    else {
                        updated.push(param);
                    }
                    localStorage[self.name] = JSON.stringify(updated);
                    Mistral.refresh();
                    return param.id;
                },
                    self.update = function (query, set) {
                        var domain = localStorage[self.name];
                        if (domain) {
                            domain = JSON.parse(domain);
                            _.each(domain, function (item) {
                                if (_.isMatch(item, query)) {
                                    for (var s in set) {
                                        item[s] = set[s];
                                    }
                                }

                            });
                            localStorage[self.name] = JSON.stringify(domain);
                            Mistral.refresh();
                            //console.log(match);
                        }
                        else console.log("Collection undefined");
                    },
                    self.remove = function (param) {
                        var domain = localStorage[self.name];
                        if (domain) {
                            domain = JSON.parse(domain);
                            domain = _.without(domain, _.findWhere(domain, param));
                            localStorage[self.name] = JSON.stringify(domain);
                            Mistral.refresh();
                        }
                        else console.log("Collection undefined");
                    },
                    self.find = function (param) {
                        var domain = localStorage[self.name];
                        if (domain) {
                            domain = JSON.parse(domain);
                            return _.where(domain, param);
                        }
                        else return [];
                    },
                    self.findOne = function (param) {
                        var domain = localStorage[self.name];
                        if (domain) {
                            domain = JSON.parse(domain);
                            return _.findWhere(domain, param);
                        }
                        else return [];
                    }
            }
        }
        else console.error("Collection name is required");

    };

})(window.Mistral, window.Random);

(function (Session) {
    'use strict';
    var Sessions = {};
    Session.set = function (name, value) {
        Sessions[name] = value;
    };
    Session.setReactive = function(name, value, vmname){
        Sessions[name] = value;
        Mistral.refresh(vmname);
    };
    Session.get = function (name) {
        return Sessions[name];
    };

    Session.equals = function(name, value){
        return Session.get(name) == value;
    }

})(window.Session);

(function (Mistral) {
    'use strict';
    Mistral.getCurretRoute = function(){
        return Mistral.getRoute(window.location.hash.replace('#', ''));
    };

    Mistral.getRoute = function (path) {
        var result;
        for (var ii = 0; ii < Mistral.routes.length; ii++) {
            if (Mistral.routes[ii].path === path) {
                result = Mistral.routes[ii];
                break;
            }
        }
        return result;
    };

    Mistral.getRouteByName = function (name) {
        var result;
        for (var ii = 0; ii < Mistral.routes.length; ii++) {
            if (Mistral.routes[ii].option)
                if (Mistral.routes[ii].routeName === name) {
                    result = Mistral.routes[ii];
                    break;
                }
        }
        return result;
    };

})(window.Mistral);

(function (Mistral) {
    'use strict';
    Mistral.go = function (path) {
        window.location.hash = '#' + path;
        Mistral.renderPath(window.location.hash.replace('#', ''));
    };

})(window.Mistral);

(function (Mistral) {
    'use strict';
    Mistral.routeOtherWise = function (path) {
        var r = Mistral.getRoute(window.location.hash.replace('#', ''));
        console.log(r);
        if (r)
            Mistral.go(r.path);
        else Mistral.go(path);
    };

})(window.Mistral);

(function (Mistral) {
    'use strict';
    Mistral.refresh = function (vmname) {
        if (typeof vmname === "string") {
            console.log('string')
            var curr = Mistral.getCurretRoute();
            if (curr) {
                for (var jj = 0; jj < curr.templates.length; jj++) {
                    if (curr.templates[jj].name === vmname)
                        Mistral.renderTemplate(curr.templates[jj]);

                }
            }
            else console.error('Error No route found');

        }
        else if (isArray(vmname)) {
            console.log('array')
            var curr = Mistral.getCurretRoute();
            if (curr) {
                for (var jj = 0; jj < curr.templates.length; jj++) {
                    for (var kk = 0; kk < vmname.length; kk++) {
                        if (curr.templates[jj].name === vmname[kk])
                            Mistral.renderTemplate(curr.templates[jj]);
                    }
                }
            }
            else console.error('Error No route found');
        }
        else {
            Mistral.renderPath(window.location.hash.replace('#', ''));
        }

        var vms = Mistral.config.templates;
        for(var ii = 0; ii < vms.length; ii++){
            Mistral.renderTemplate(vms[ii]);
        }
    };
})(window.Mistral);

(function (Mistral) {
    'use strict';
    Mistral.route = function (path, routeName, templates) {
        Mistral.routes.push({
            path: path,
            routeName: routeName,
            templates: templates
        });
    };

})(window.Mistral);

(function (Mistral) {
    'use strict';

    function Context(v, parentContext) {
        var self = this;
        self.view = v;
        self.cache = {
            '.': self.view
        };
        self.parent = parentContext;
        self.push = function push(view) {
            return new Context(view, this);
        };
        self.lookup = function lookup(name) {
            var cache = this.cache;
            var value;
            if (cache.hasOwnProperty(name)) {
                value = cache[name];
            } else {
                var context = this,
                    names, index, lookupHit = false;

                while (context) {
                    if (name.indexOf('.') > 0) {
                        value = context.view;
                        names = name.split('.');
                        index = 0;

                        while (value != null && index < names.length) {
                            if (index === names.length - 1)
                                lookupHit = hasProperty(value, names[index]);

                            value = value[names[index++]];
                        }
                    } else {
                        value = context.view[name];
                        lookupHit = hasProperty(context.view, name);
                    }

                    if (lookupHit)
                        break;

                    context = context.parent;
                }

                cache[name] = value;
            }

            if (isFunction(value))
                value = value.call(this.view);

            return value;
        };
    }

    Mistral.Context = Context;
})(window.Mistral);

(function (Mistral) {
    'use strict';
    Mistral.parseTemplate = function (template, tags) {
        if (!template)
            return [];

        var sections = []; // Stack to hold section tokens
        var tokens = []; // Buffer to hold the tokens
        var spaces = []; // Indices of whitespace tokens on the current line
        var hasTag = false; // Is there a {{tag}} on the current line?
        var nonSpace = false; // Is there a non-space char on the current line?

        // Strips all whitespace tokens array for the current line
        // if there was a {{#tag}} on it and otherwise only space.
        function stripSpace() {
            if (hasTag && !nonSpace) {
                while (spaces.length)
                    delete tokens[spaces.pop()];
            } else {
                spaces = [];
            }

            hasTag = false;
            nonSpace = false;
        }

        var openingTagRe, closingTagRe, closingCurlyRe;

        function compileTags(tagsToCompile) {
            if (typeof tagsToCompile === 'string')
                tagsToCompile = tagsToCompile.split(spaceRe, 2);

            if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
                throw new Error('Invalid tags: ' + tagsToCompile);

            openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
            closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
            closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
        }

        compileTags(tags || Mistral.tags);

        var scanner = new Mistral.Scanner(template);

        var start, type, value, chr, token, openSection;
        while (!scanner.eos()) {
            start = scanner.pos;

            // Match any text between tags.
            value = scanner.scanUntil(openingTagRe);

            if (value) {
                for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
                    chr = value.charAt(i);

                    if (isWhitespace(chr)) {
                        spaces.push(tokens.length);
                    } else {
                        nonSpace = true;
                    }

                    tokens.push(['text', chr, start, start + 1]);
                    start += 1;

                    // Check for whitespace on the current line.
                    if (chr === '\n')
                        stripSpace();
                }
            }

            // Match the opening tag.
            if (!scanner.scan(openingTagRe))
                break;

            hasTag = true;

            // Get the tag type.
            type = scanner.scan(tagRe) || 'name';
            scanner.scan(whiteRe);

            // Get the tag value.
            if (type === '=') {
                value = scanner.scanUntil(equalsRe);
                scanner.scan(equalsRe);
                scanner.scanUntil(closingTagRe);
            } else if (type === '{') {
                value = scanner.scanUntil(closingCurlyRe);
                scanner.scan(curlyRe);
                scanner.scanUntil(closingTagRe);
                type = '&';
            } else {
                value = scanner.scanUntil(closingTagRe);
            }

            // Match the closing tag.
            if (!scanner.scan(closingTagRe))
                throw new Error('Unclosed tag at ' + scanner.pos);

            token = [type, value, start, scanner.pos];
            tokens.push(token);

            if (type === '#' || type === '^') {
                sections.push(token);
            } else if (type === '/') {
                // Check section nesting.
                openSection = sections.pop();

                if (!openSection)
                    throw new Error('Unopened section "' + value + '" at ' + start);

                if (openSection[1] !== value)
                    throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
            } else if (type === 'name' || type === '{' || type === '&') {
                nonSpace = true;
            } else if (type === '=') {
                // Set the tags for the next time around.
                compileTags(value);
            }
        }

        // Make sure there are no open sections when we're done.
        openSection = sections.pop();

        if (openSection)
            throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

        return nestTokens(squashTokens(tokens));
    }

})(window.Mistral);

(function (Mistral) {
    'use strict';

    function Renderer() {
        this.cache = {};
    }

    Renderer.prototype.clearCache = function clearCache() {
        this.cache = {};
    };

    Renderer.prototype.parse = function parse(template, tags) {
        var cache = this.cache;
        var tokens = cache[template];

        if (tokens == null)
            tokens = cache[template] = Mistral.parseTemplate(template, tags);

        return tokens;
    };


    Renderer.prototype.render = function render(template, view, partials) {
        var tokens = this.parse(template);
        var context = (view instanceof Mistral.Context) ? view : new Mistral.Context(view);
        return this.renderTokens(tokens, context, partials, template);
    };


    Renderer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate) {
        var buffer = '';

        var token, symbol, value;
        for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
            value = undefined;
            token = tokens[i];
            symbol = token[0];

            if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
            else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
            else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
            else if (symbol === '&') value = this.unescapedValue(token, context);
            else if (symbol === 'name') value = this.escapedValue(token, context);
            else if (symbol === 'text') value = this.rawValue(token);

            if (value !== undefined)
                buffer += value;
        }

        return buffer;
    };

    Renderer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate) {
        var self = this;
        var buffer = '';
        var value = context.lookup(token[1]);

        // This function is used to render an arbitrary template
        // in the current context by higher-order sections.
        function subRender(template) {
            return self.render(template, context, partials);
        }

        if (!value) return;

        if (isArray(value)) {
            for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
                buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
            }
        } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
            buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
        } else if (isFunction(value)) {
            if (typeof originalTemplate !== 'string')
                throw new Error('Cannot use higher-order sections without the original template');

            // Extract the portion of the original template that the section contains.
            value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

            if (value != null)
                buffer += value;
        } else {
            buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }
        return buffer;
    };

    Renderer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate) {
        var value = context.lookup(token[1]);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/Mistral.js/issues/186
        if (!value || (isArray(value) && value.length === 0))
            return this.renderTokens(token[4], context, partials, originalTemplate);
    };

    Renderer.prototype.renderPartial = function renderPartial(token, context, partials) {
        if (!partials) return;

        var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
        if (value != null)
            return this.renderTokens(this.parse(value), context, partials, value);
    };

    Renderer.prototype.unescapedValue = function unescapedValue(token, context) {
        var value = context.lookup(token[1]);
        if (value != null)
            return value;
    };

    Renderer.prototype.escapedValue = function escapedValue(token, context) {
        var value = context.lookup(token[1]);
        if (value != null)
            return Mistral.escape(value);
    };

    Renderer.prototype.rawValue = function rawValue(token) {
        return token[1];
    };

    var mRenderer = new Renderer();
    Renderer.clearCache = function clearCache() {
        return mRenderer.clearCache();
    };
    Mistral.parse = function parse(template, tags) {
        return mRenderer.parse(template, tags);
    };
    Mistral.render = function render(template, view, partials) {
        if (typeof template !== 'string') {
            throw new TypeError('Invalid template! Template should be a "string" ' +
                'but "' + typeStr(template) + '" was given as the first ' +
                'argument for Mistral#render(template, view, partials)');
        }

        return mRenderer.render(template, view, partials);
    };

    Mistral.renderTemplate = function (t) {
        $.get(t.pathToTemplate)
            .success(function (resp) {
                if (t.onBefore)
                    t.onBefore();

                var output = resp;
                if (t.data){
                    var renderData = {};
                    for(var d in t.data){
                        if(typeof t.data[d] === 'function'){
                            renderData[d] = t.data[d]();
                        }
                        else renderData[d] = t.data[d];
                    }
                    output = Mistral.render(resp, renderData);
                }
                if (t.templates) {
                    var partial = {};
                    var data = {};
                    for (var ii = 0; ii < t.templates.length; ii++) {
                        var v = t.templates[ii];
                        if (v.data) $.extend(data, v.data);
                        partial[v.renderPartials] = Mistral.getView(v.pathToTemplate);
                    }
                    output = Mistral.render(output, data, partial);
                }
                $(t.renderIn).html(output);
                if (t.onRendered)
                    t.onRendered();
                if (t.onAfter)
                    t.onAfter();
            });
    }

    Mistral.renderPath = function (path) {
        var r = Mistral.getRoute(path);
        for (var jj = 0; jj < r.templates.length; jj++) {
            Mistral.renderTemplate(r.templates[jj]);

        }
    }

    Mistral.getView = function (path) {
        var result = '';
        $.ajax({
            url: path,
            type: 'GET',
            async: false,
            cache: false,
            timeout: 30000,
            error: function () {
                result = 'error';
            },
            success: function (view) {
                result = view;

            }
        });
        return result;
    }

    Mistral.Renderer = Renderer;
})(window.Mistral);

(function (Mistral) {
    'use strict';

    function Scanner(string) {
        var self = this;
        self.string = string;
        self.tail = string;
        self.pos = 0;
        self.eos = function eos() {
            return this.tail === '';
        };
        self.scan = function scan(re) {
            var match = this.tail.match(re);
            if (!match || match.index !== 0)
                return '';
            var string = match[0];
            this.tail = this.tail.substring(string.length);
            this.pos += string.length;
            return string;
        };
        self.scanUntil = function scanUntil(re) {
            var index = this.tail.search(re),
                match;

            switch (index) {
                case -1:
                    match = this.tail;
                    this.tail = '';
                    break;
                case 0:
                    match = '';
                    break;
                default:
                    match = this.tail.substring(0, index);
                    this.tail = this.tail.substring(index);
            }

            this.pos += match.length;

            return match;
        };
    }

    Mistral.Scanner = Scanner;

})(window.Mistral);

function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        token = tokens[i];

        if (token) {
            if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
                lastToken[1] += token[1];
                lastToken[3] = token[3];
            } else {
                squashedTokens.push(token);
                lastToken = token;
            }
        }
    }

    return squashedTokens;
}

function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        token = tokens[i];

        switch (token[0]) {
            case '#':
            case '^':
                collector.push(token);
                sections.push(token);
                collector = token[4] = [];
                break;
            case '/':
                section = sections.pop();
                section[5] = token[2];
                collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
                break;
            default:
                collector.push(token);
        }
    }

    return nestedTokens;
}

(function (Random) {
    'use strict';
    Random.id = function (length) {
        var text = "";
        var d = new Date();
        var n = d.getTime();
        var possible = "LhE4vAuGr5xMScHCWlUtZejPRbY21fXns8yJimKkQVd6TwO9qF7D3gp0IaBNzo"+n;
        possible = _.shuffle(possible.split('')).join('');
        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };


})(window.Random);

(function (mistral) {
    'use strict';

    window.onhashchange = function (ret) {
        Mistral.renderPath(window.location.hash.replace('#', ''));
        if (Mistral.config.viewModels) {
            var vm = Mistral.config.viewModels;
            for (var ii = 0; ii < vm.length; ii++) {
                console.log(typeof vm[ii].onRouteChanged === 'function');
                if (typeof vm[ii].onRouteChanged === 'function')
                    vm[ii].onRouteChanged();
            }
        }
    };

})(window.mistral);


