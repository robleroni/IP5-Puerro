import { h } from '../../../../puerro/util/vdom';
import { mount } from '../../../../puerro/util/dom';

/**
 * @typedef {{ id: number, foo: string, baz: number  }} DemoType
 * @typedef {{ data: DemoType[], editing: DemoType }} DemoState
 */

const initialState = {
  data: Array(10000)
    .fill({ foo: 'bar', baz: 1 })
    .map((val, i) => ({ id: i, ...val })),
  editing: null,
};

/**
 *
 * @param {DemoState} state
 * @param {function(DemoType): void} edit
 *
 * @returns {function(DemoType): import('../../../../puerro/util/vdom').VNode}
 */
const tableRow = (state, edit) => row => {
  const editing = state.editing && state.editing.id === row.id;
  return h('tr', { click: edit(row) }, [
    h('td', {}, editing ? h('input', { value: row.foo }) : row.foo),
    h('td', {}, editing ? h('input', { value: row.baz }) : row.baz),
  ]);
};

/**
 *
 * @param {DemoState} state
 * @param {function(DemoState): void} setState
 *
 * @returns {function(DemoState): import('../../../../puerro/util/vdom').VNode} *
 */
const view = (state, setState) => {
  const edit = row => evt => {
    if (!state.editing || state.editing.id !== row.id) {
      setState({ editing: row });
    }
  };
  return h('tbody', {}, state.data.map(tableRow(state, edit)));
};

mount(document.getElementById('nodiffing'), view, initialState, false);
mount(document.getElementById('diffing'), view, initialState, true);