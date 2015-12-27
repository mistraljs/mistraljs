(function (Random) {
    'use strict';
    Random.id = function (length) {
        var text = "";
        var d = new Date();
        var n = d.getTime();
        var possible = n+"LhE4vAuGr5xMScHCWlUtZejPRbY21fXns8yJimKkQVd6TwO9qF7D3gp0IaBNzo "+n;

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };


})(window.Random);
