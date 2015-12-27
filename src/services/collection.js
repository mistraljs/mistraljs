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
                    if (domain) {
                        updated = JSON.parse(domain);
                        param['id'] = Random.id(27);
                        updated.push(param);
                    }
                    else {
                        updated.push(param);
                    }
                    localStorage[self.name] = JSON.stringify(updated);
                    Mistral.refresh();
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
