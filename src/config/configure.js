(function (Mistral) {
    'use strict';
    Mistral.configure = function (options) {
        console.log(options);
        if (options.templates) {
            var vms = options.templates;
            for (var ii = 0; ii < vms.length; ii++) {
                Mistral.renderTemplate(vms[ii]);

            }
        }

        Mistral.config = options;
    };

})(window.Mistral);
