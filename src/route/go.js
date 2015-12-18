(function (Mistral) {
    'use strict';
    Mistral.go = function (path) {
        window.location.hash = '#' + path;
        Mistral.renderPath(window.location.hash.replace('#', ''));
    };

})(window.Mistral);
