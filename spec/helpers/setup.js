require('browser-env')();
const hooks = require('require-extension-hooks');
const plugin = require('../../');

hooks('vue').plugin(plugin).push().plugin('babel').push();

require('vue').config.productionTip = false;
