import test from 'ava';
import hooks from 'require-extension-hooks';
hooks('cstm').push(function ({content}) {
  return content.replace(/\<(.+)?:(.+)?\/\>/g, '$1 : "$2"');
});

const CustomScript = require('./vue-files/custom-script').default;

test('transpiles using another hook', t => {
  t.is(CustomScript.name, 'custom');
});
