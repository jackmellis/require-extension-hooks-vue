import test from 'ava';
import hooks from 'require-extension-hooks';

hooks('vue-json').push(function ({ content }) {
  // This is how vue-template-compiler gets the options
  const options = '((module.exports.default || module.exports).options || module.exports.default || module.exports)';
  const value = JSON.parse(content).value;
  return options + '.name = ' + JSON.stringify(value) + ';';
});

const CustomBlock = require('./vue-files/custom-block').default;

test('transpiles using another hook', t => {
  t.is(CustomBlock.name, 'custom');
});
