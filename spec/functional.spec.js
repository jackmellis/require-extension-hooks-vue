import test from 'ava';
import Scriptless from './vue-files/scriptless';
import FunctionalScriptless from './vue-files/functional-scriptless';
import FunctionalScript from './vue-files/functional-script';

test('scriptless components are not functional', t => {
  t.true(Scriptless !== undefined);
  t.is(typeof Scriptless.render, 'function');
  t.falsy(Scriptless.functional);
});

test('template with functional attribute is functional', t => {
  t.true(FunctionalScriptless !== undefined);
  t.is(typeof FunctionalScriptless.render, 'function');
  t.true(FunctionalScriptless.functional);
});

test('template with functional attribute is functional (with script)', t => {
  t.true(FunctionalScript !== undefined);
  t.is(typeof FunctionalScript.render, 'function');
  t.true(FunctionalScript.functional);
});

test('template with functional attribute has functional render function', t => {
  t.true(FunctionalScriptless.render.toString().includes( 'function (_h, _vm)' ) );
});

test('template with functional attribute has functional render function (with script)', t => {
  t.true(FunctionalScript.render.toString().includes( 'function (_h, _vm)' ) );
});
