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
