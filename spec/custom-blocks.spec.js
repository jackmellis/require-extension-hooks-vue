import test from 'ava';
import hooks from 'require-extension-hooks';
import { COMPONENT_OPTIONS } from '../';

hooks('vue-block-json-name').push(function ({ content }) {
  const value = JSON.parse(content).value;
  return COMPONENT_OPTIONS + '.name = ' + JSON.stringify(value) + ';';
});

const CustomBlock = require('./vue-files/custom-block').default;

test('transpiles using another hook', t => {
  t.is(CustomBlock.name, 'custom');
});
