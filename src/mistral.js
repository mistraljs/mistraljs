// Create global Mistral obj and its namespaces
// build processes may have already created an Mistral obj
window.Mistral = window.Mistral || {};
window.Session = window.Session || {};
window.Random = window.Random || {};
window.Mistral.routes = [];
window.Mistral.config = {};
window.Mistral.version = '0.1.3';
window.Mistral.name = 'Mistral.js';
window.Mistral.tags = ['{{', '}}'];