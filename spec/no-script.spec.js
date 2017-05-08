import test from 'ava';

test('throws if no script tags exist', t => {
  t.throws(() => require('./vue-files/no-script'));
});

test('throws if no closing script tag exists', t => {
  t.throws(() => require('./vue-files/no-script-end'));
});
