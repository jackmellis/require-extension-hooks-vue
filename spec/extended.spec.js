import test from 'ava';
import Vue from 'vue';
import component from './vue-files/already-extended';

test('imports an extended .vue file', t => {
  t.true(component !== undefined);
  t.is(component.options.name, 'already-extended');
});

test('appends a render function', t => {
  t.is(typeof component.options.render, 'function');
});

test('can be extended with Vue.extend', t => {
  let extended;
  t.notThrows(() => extended = Vue.extend(component));

  t.true(extended !== undefined);
  t.is(typeof extended, 'function');
});

test('can be instantiated with new Vue.extend', t => {
  let Extended = Vue.extend(component);
  let vm;
  t.notThrows(() => vm = new Extended());
  vm.$mount();

  t.is(typeof vm.value, 'string');
  t.is(vm.$el.innerHTML, vm.value);
});

test('can be instantiated with new Vue', t => {
  let vm;
  t.notThrows(() => vm = new Vue(component));
  vm.$mount();

  t.is(typeof vm.value, 'string');
  t.is(vm.$el.innerHTML, vm.value);
});
