import test from 'ava';
import Vue from 'vue';
import component from './vue-files/css-module-named.vue';

test('import component with named CSS module', t => {
  t.true(component.computed !== undefined);
  t.true(component.computed.red !== undefined);
  const vm = new Vue(component).$mount();
  t.is(vm.red.color, 'red-color');
})
