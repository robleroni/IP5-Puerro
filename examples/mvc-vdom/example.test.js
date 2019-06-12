import { describe } from '../../src/test/test';
import { view, MyController } from './example';
import { createDomElement, h } from '../../src/vdom/vdom';

describe('MVC with virtual DOM', test => {

  // before
  const $root = createDomElement('div');
  const model = { counter: 0 };
  const view = x => h(); // not necessary for testing the logic
  const controller = new MyController($root, model, view);

  test('using counter', assert => {
    // inital
    assert.is(controller.model.counter, 0);

    // when
    controller.increment()

    // then
    assert.is(controller.model.counter, 1);

    // when
    controller.decrement()

    // then
    assert.is(controller.model.counter, 0);
  });
});
