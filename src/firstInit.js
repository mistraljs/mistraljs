var objectToString = Object.prototype.toString;
var isArray = Array.isArray || function isArrayPolyfill(object) {
    return objectToString.call(object) === '[object Array]';
};

function isFunction(object) {
    return typeof object === 'function';
}

function typeStr(obj) {
    return isArray(obj) ? 'array' : typeof obj;
}

function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}

function hasProperty(obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
}

var regExpTest = RegExp.prototype.test;

function testRegExp(re, string) {
    return regExpTest.call(re, string);
}
var nonSpaceRe = /\S/;

function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
}

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
        return entityMap[s];
    });
}

var whiteRe = /\s*/;
var spaceRe = /\s+/;
var equalsRe = /\s*=/;
var curlyRe = /\s*\}/;
var tagRe = /#|\^|\/|>|\{|&|=|!/;
Mistral.escape = escapeHtml;
