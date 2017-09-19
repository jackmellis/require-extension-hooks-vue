import test from 'ava';
import Vue from 'vue';
import component from './vue-files/css-module-with-computed-props.vue';

test('import component with named CSS module', t => {
  t.true(component.computed !== undefined);
  t.deepEqual(Object.keys(component.computed), ['message', '$style', 'green']);
  const vm = new Vue(component).$mount();
  t.deepEqual([vm.message, vm.$style.color, vm.green.color], ['I should be displayed in red.', '-style-color', 'green-color']);
})
