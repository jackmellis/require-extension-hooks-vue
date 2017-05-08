import test from 'ava';
import Vue from 'vue';
import component from './vue-files/nested-parent';

test('imports a component which imports another component', t => {
  t.true(component !== undefined);
  t.is(typeof component.render, 'function');
});

test('renders parent and child correctly', t => {
  let vm = new Vue(component).$mount();
  let html = vm.$el.outerHTML;
  let expected = `<div><div>nested</div></div>`;

  t.is(html, expected);
});
