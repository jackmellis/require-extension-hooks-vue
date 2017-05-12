import test from 'ava';
import Vue from 'vue';
import pugTmpl from './vue-files/pug-template.vue';

test('import vue with pug template', t => {
  t.true(pugTmpl !== undefined);
  t.is(pugTmpl.name, 'pug-esm');
});

test('should have a render function', t => {
  t.is(typeof pugTmpl.render, 'function');
});

test('should render successfully', t => {
  let vm;
  t.notThrows(() => vm = new Vue(pugTmpl));
  vm.$mount();

  t.is(typeof vm.value, 'string');
  t.is(vm.$el.innerHTML, vm.value);
});

test('render uninstalled template should fail', t => {
  const err = t.throws(() => {
    require('./vue-files/uninstalled-template.vue');
  }, Error);

  t.regex(err.message, /swig/);
});

test('render unsupported template should fail', t => {
  const err = t.throws(() => {
    require('./vue-files/unknown-template.vue');
  }, Error);

  t.regex(err.message, /unknown\-tmpl/);
});