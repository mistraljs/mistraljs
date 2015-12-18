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
