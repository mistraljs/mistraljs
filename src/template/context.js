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
