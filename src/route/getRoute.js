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
