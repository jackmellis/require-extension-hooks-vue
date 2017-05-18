import test from 'ava';
import Vue from 'vue';
import c from './vue-files/external';
import c2 from './vue-files/external/pug';

test('imports component with external html', t => {
  t.true(c !== undefined);
  t.is(typeof c.render, 'function');
});

test('imports component with external js', t => {
  t.is(c.name, 'external');
  t.is(typeof c.data, 'function');
});

test('correctly renders component', t => {
  let vm;
  t.notThrows(() => vm = new Vue(c));
  vm.$mount();

  t.is(typeof vm.value, 'string');
  t.true(!!vm.$el.querySelector('#external_template'));
  t.is(vm.$el.querySelector('#external_template').innerHTML, vm.value);
});

test('correctly renders an external template in another language (pug)', t => {
  let vm = new Vue(c2);
  vm.$mount();

  t.is(typeof vm.value, 'string');
  t.is(vm.$el.innerHTML, vm.value);
});
