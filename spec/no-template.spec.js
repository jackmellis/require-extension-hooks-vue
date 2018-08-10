import test from 'ava';
import Sinon from 'sinon';
import Vue from 'vue';
import component from './vue-files/no-template';

test.beforeEach(t => {
  t.context.sinon = Sinon.createSandbox();
});
test.afterEach(t => {
  t.context.sinon.restore();
});

test('does not attempt to import a template', t => {
  t.true(component.template === undefined);
  t.true(component.render === undefined);
});

test('does not render anything', t => {
  let {sinon} = t.context;
  sinon.stub(console, 'error');

  let vm = new Vue(component);
  vm.$mount();

  t.falsy(vm.$el.outerHTML);
  t.true(console.error.called);
});
