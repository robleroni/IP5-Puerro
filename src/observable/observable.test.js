import { describe } from '../test/test';
import { Observable, ObservableList } from './observable';

describe('observable', test => {
  test('value', assert => {
    const obs = Observable('');

    //  initial state
    assert.is(obs.get(), '');

    //  subscribers get notified
    let found;
    obs.onChange(val => (found = val));
    obs.set('firstValue');
    assert.is(found, 'firstValue');

    //  value is updated
    assert.is(obs.get(), 'firstValue');

    //  it still works when the receiver symbols changes
    const newRef = obs;
    newRef.set('secondValue');
    // listener updates correctly
    assert.is(found, 'secondValue');

    //  Attributes are isolated, no "new" needed
    const secondAttribute = Observable('');

    //  initial state
    assert.is(secondAttribute.get(), '');

    //  subscribers get notified
    let secondFound;
    secondAttribute.onChange(val => (secondFound = val));
    secondAttribute.set('thirdValue');
    assert.is(found, 'secondValue');
    assert.is(secondFound, 'thirdValue');

    //  value is updated
    assert.is(secondAttribute.get(), 'thirdValue');

    // subsribers get notified with access on old value
    let newFound, oldFound;
    secondAttribute.onChange((newVal, oldVal) => {
      newFound = newVal;
      oldFound = oldVal;
    });
    secondAttribute.set('fourthValue');
    assert.is(newFound, 'fourthValue');
    assert.is(oldFound, 'thirdValue');

    //  value is updated
    assert.is(secondAttribute.get(), 'fourthValue');
  });

  test('list', assert => {
    const raw = [];
    const list = ObservableList(raw); // decorator pattern

    assert.is(list.count(), 0);
    let addCount = 0;
    let removeCount = 0;
    list.onAdd(item => (addCount += item));
    list.add(1);
    assert.is(addCount, 1);
    assert.is(list.count(), 1);
    assert.is(raw.length, 1);

    const index = list.indexOf(1);
    assert.is(index, 0);
    assert.is(list.get(index), 1);

    list.onRemove(item => (removeCount += item));
    list.remove(1);
    assert.is(removeCount, 1);
    assert.is(list.count(), 0);
    assert.is(raw.length, 0);
  });
});