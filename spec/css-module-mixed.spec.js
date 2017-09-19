import test from 'ava';
import Vue from 'vue';
import component from './vue-files/css-module-mixed.vue';

test('import component with mixed CSS modules', t => {
  t.true(component.computed !== undefined);
  t.deepEqual(Object.keys(component.computed), ['$style', 'green', 'blue']);
  const vm = new Vue(component).$mount();
  t.deepEqual([vm.$style.color, vm.green.color, vm.blue.color], ['-style-color', 'green-color', 'blue-color']);
})
