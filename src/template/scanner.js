(function (Mistral) {
    'use strict';

    function Scanner(string) {
        var self = this;
        self.string = string;
        self.tail = string;
        self.pos = 0;
        self.eos = function eos() {
            return this.tail === '';
        };
        self.scan = function scan(re) {
            var match = this.tail.match(re);
            if (!match || match.index !== 0)
                return '';
            var string = match[0];
            this.tail = this.tail.substring(string.length);
            this.pos += string.length;
            return string;
        };
        self.scanUntil = function scanUntil(re) {
            var index = this.tail.search(re),
                match;

            switch (index) {
                case -1:
                    match = this.tail;
                    this.tail = '';
                    break;
                case 0:
                    match = '';
                    break;
                default:
                    match = this.tail.substring(0, index);
                    this.tail = this.tail.substring(index);
            }

            this.pos += match.length;

            return match;
        };
    }

    Mistral.Scanner = Scanner;

})(window.Mistral);
