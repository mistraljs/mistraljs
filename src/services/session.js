(function (Session) {
    'use strict';
    var Sessions = {};
    Session.set = function (name, value) {
        Sessions[name] = value;
    };
    Session.setReactive = function(name, value, vmname){
        Sessions[name] = value;
        Mistral.refresh(vmname);
    };
    Session.get = function (name) {
        return Sessions[name];
    };

    Session.equals = function(name, value){
        return Session.get(name) == value;
    }

})(window.Session);
