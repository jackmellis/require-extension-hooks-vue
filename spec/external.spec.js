import test from 'ava';
import Vue from 'vue';
import c from './vue-files/external';
import c2 from './vue-files/external/pug';
import c3 from './vue-files/non-self-closing';

test('imports component with external html', t => {
  t.true(c !== undefined);
  t.is(typeof c.render, 'function');
});

test('imports component with external js', t => {
  t.is(c.name, 'external');
  t.is(typeof c.data, 'function');
});

test('imports component with non-self-closing tags', t => {
  t.is(c3.name, 'external');
  t.is(typeof c3.data, 'function');
});

test('imports component with external css-module', t => {
  t.is(c.name, 'external');
  t.is(typeof c.computed, 'object');
  t.is(typeof c.computed.$style, 'function');
  t.is(c.computed.$style().color, '-style-color');
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
