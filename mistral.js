// 1st MVRVM (Model View Route ViewModel) in the world created by Yoza Wiratama of Mistral Works
// to Support prototyping

(function () {
    //    "use strict";
    Mistral = {
        routes: [],
        config: {},
        configure: function (options) {
            if (options.viewModels) {
                var vms = options.viewModels;
                for (var ii = 0; ii < vms.length; ii++) {
                    var t = vms[ii];
                    Mistral.load(t.pathToTemplate, t, function (htmlTemplate, path, option) {
                        if (t.onBefore)
                            t.onBefore();

                        Mistral.renderIn(htmlTemplate, document.getElementById(option.renderIn), option, function (resp) {
                            if (option.onRendered)
                                option.onRendered();
                            if (option.onAfter)
                                option.onAfter();
                        });
                    });
                }
            }

            Mistral.config = options;
        },
        route: function (path, routeName, templates) {
            Mistral.routes.push({
                path: path,
                routeName: routeName,
                templates: templates
            });
        },
        render: function (path) {
            var r = Mistral.getRoute(path);
            console.log(r);
            for (var jj = 0; jj < r.templates.length; jj++) {
                var t = r.templates[jj];
                Mistral.load(t.pathToTemplate, t, function (htmlTemplate, path, option) {
                    if (t.onBefore)
                        t.onBefore();

                    Mistral.renderIn(htmlTemplate, document.getElementById(option.renderIn), option, function (resp) {
                        if (option.onRendered)
                            option.onRendered();
                        if (option.onAfter)
                            option.onAfter();
                    });
                });
            }
        },
        renderIn: function (html, nodeContainer, returnOption, callback) {
            nodeContainer.innerHTML = html;
            callback(returnOption);
        },
        routeOtherWise: function (path) {

            var r = Mistral.getRoute(window.location.hash.replace('#', ''));
            console.log(r);
            if (r)
                Mistral.go(r.path);
            else Mistral.go(path);
        },
        getRoute: function (path) {
            var result;
            for (var ii = 0; ii < Mistral.routes.length; ii++) {
                if (Mistral.routes[ii].path === path) {
                    result = Mistral.routes[ii];
                    break;
                }
            }
            return result;
        },
        getRouteByName: function (name) {
            var result;
            for (var ii = 0; ii < Mistral.routes.length; ii++) {
                if (Mistral.routes[ii].option)
                    if (Mistral.routes[ii].routeName === name) {
                        result = Mistral.routes[ii];
                        break;
                    }
            }
            return result;
        },
        go: function (path) {
            window.location.hash = '#' + path;
            Mistral.render(window.location.hash.replace('#', ''));
        },
        load: function (path, option, callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', path, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    callback(xobj.responseText, path, option);
                }
            };
            xobj.send(null);
        },
        get: function (uri, callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', uri, true);
            xobj.onreadystatechange = function () {
                callback(xobj)
            };
            xobj.send(null);
        }
    };

    window.onhashchange = function (ret) {
        Mistral.render(window.location.hash.replace('#', ''));
        if (Mistral.config.viewModels) {
            var vm = Mistral.config.viewModels;
            for (var ii = 0; ii < vm.length; ii++) {
                if (vm[ii].onRouteChanged())
                    vm[ii].onRouteChanged();
            }
        }
    }
    document.addEventListener('DOMContentLoaded', function () {
        Mistral.go(window.location.hash.replace('#', ''));
    }, false);
    Mst = Mistral;

})()