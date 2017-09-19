import test from 'ava';
import Vue from 'vue';
import component from './vue-files/css-module-default.vue';

test('import component with default CSS module', t => {
  t.true(component.computed !== undefined);
  t.true(component.computed.$style !== undefined);
  const vm = new Vue(component).$mount();
  t.is(vm.$style.color, '-style-color')
})
