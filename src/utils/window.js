(function (mistral) {
    'use strict';

    window.onhashchange = function (ret) {
        Mistral.renderPath(window.location.hash.replace('#', ''));
        if (Mistral.config.templates) {
            var vm = Mistral.config.templates;
            for (var ii = 0; ii < vm.length; ii++) {
                console.log(typeof vm[ii].onRouteChanged === 'function');
                if (typeof vm[ii].onRouteChanged === 'function')
                    vm[ii].onRouteChanged();
            }
        }
    };

})(window.mistral);
