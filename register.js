const hooks = require('require-extension-hooks');
const plugin = require('./src');

hooks('vue').plugin(plugin).push();
