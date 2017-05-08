import test from 'ava';
import Vue from 'vue';
import basicEsm from './vue-files/basic.esm';
import basic from './vue-files/basic';

test('imports a basic .esm .vue file', t => {
  t.true(basicEsm !== undefined);
  t.is(basicEsm.name, 'basic-esm');
});

test('imports a basic .vue file', t => {
  t.true(basic !== undefined);
  t.is(basic.name, 'basic');
});

test('appends a render function', t => {
  t.is(typeof basicEsm.render, 'function');
  t.is(typeof basic.render, 'function');
});

test('can be extended with Vue.extend', t => {
  let extended;
  t.notThrows(() => extended = Vue.extend(basic));

  t.true(extended !== undefined);
  t.is(typeof extended, 'function');
});

test('can be instantiated with new Vue.extend', t => {
  let Extended = Vue.extend(basic);
  let vm;
  t.notThrows(() => vm = new Extended());
  vm.$mount();

  t.is(typeof vm.value, 'string');
  t.is(vm.$el.innerHTML, vm.value);
});

test('can be instantiated with new Vue', t => {
  let vm;
  t.notThrows(() => vm = new Vue(basic));
  vm.$mount();

  t.is(typeof vm.value, 'string');
  t.is(vm.$el.innerHTML, vm.value);
});
