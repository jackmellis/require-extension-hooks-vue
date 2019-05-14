require('browser-env')();
const hooks = require('require-extension-hooks');
const plugin = require('../../');

// https://github.com/JeffreyWay/laravel-mix/issues/1748#issuecomment-416782967
// https://github.com/vuejs/vue-test-utils/issues/936
// better fix for "TypeError: Super expression must either be null or
// a function" than pinning an old version of prettier.
// eslint-disable-next-line no-undef
window.Date = Date;

hooks('vue').plugin(plugin).push().plugin('babel').push();

require('vue').config.productionTip = false;
