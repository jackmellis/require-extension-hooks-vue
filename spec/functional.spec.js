import test from 'ava';
import Functional from './vue-files/functional';

test('imports a scriptless component', t => {
  t.true(Functional !== undefined);
  t.is(typeof Functional.render, 'function');
  t.true(Functional.functional);
})
