(function (Mistral) {
    'use strict';
    //dbTypes : localstorage, service, indexeddb, mongodb
    Mistral.Collection = function (name,param) {
        var self = this;
        self.name = name;
        self.dbType = param.dbType;
        self.auto = param.auto;
        self.url = param.url;
        for (var m in param.methods) {
            self[m] = param.methods[m];
        }
    };

})(window.Mistral);
