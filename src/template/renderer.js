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
        Mistral.renderLoading(t);
        $.get(t.pathToTemplate)
            .success(function (resp) {
                if (t.onBefore) {
                    t.onBefore();
                }

                var output = resp;
                if (t.data) {
                    var renderData = {};
                    for (var d in t.data) {
                        if (typeof t.data[d] === 'function') {
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
                if (t.onAfter) {
                    t.onAfter();
                }
            });
    }

    Mistral.renderPath = function (path) {
        var r = Mistral.getRoute(path);
        for (var jj = 0; jj < r.templates.length; jj++) {
            Mistral.renderTemplate(r.templates[jj]);
        }
    };

    Mistral.renderLoading = function (t) {
        if (Mistral.config.loading) {
            //var loading = Mistral.getView(Mistral.config.loading.pathToTemplate);
            //$(t.renderIn).html(loading);
            $.get(Mistral.config.loading.pathToTemplate)
                .success(function (resp) {
                    $(t.renderIn).html(resp);
                });

        }
        else $(t.renderIn).html('loading...');
    };

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
