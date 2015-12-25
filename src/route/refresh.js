(function (Mistral) {
    'use strict';
    Mistral.refresh = function (vmname) {
        if (typeof vmname === "string") {
            console.log('string')
            var curr = Mistral.getCurretRoute();
            if (curr) {
                for (var jj = 0; jj < curr.templates.length; jj++) {
                    if (curr.templates[jj].name === vmname)
                        Mistral.renderTemplate(curr.templates[jj]);

                }
            }
            else console.error('Error No route found');

        }
        else if (isArray(vmname)) {
            console.log('array')
            var curr = Mistral.getCurretRoute();
            if (curr) {
                for (var jj = 0; jj < curr.templates.length; jj++) {
                    for (var kk = 0; kk < vmname.length; kk++) {
                        if (curr.templates[jj].name === vmname[kk])
                            Mistral.renderTemplate(curr.templates[jj]);
                    }
                }
            }
            else console.error('Error No route found');
        }
        else {
            Mistral.renderPath(window.location.hash.replace('#', ''));
        }
    };
})(window.Mistral);
