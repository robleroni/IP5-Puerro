import { h } from '../../../../puerro/util/vdom';

import { controller } from './controllers/index';
import { counterComponent } from './components/counter';
import { addView } from './views/add';
import { multiplyView } from './views/multiply';
import { mountWithActions } from '../../../../puerro/util/dom';
import { initialState } from './models/index';


const mainView = (controller) => 
  h('main', {}, 
    h('div',{}, 
      counterComponent(controller.getCount1(), 'count1', c => controller.addCount1(c)),
      counterComponent(controller.getCount2(), 'count2', c => controller.addCount2(c)),
    ),
    h('div',{}, 
      addView(controller),
      multiplyView(controller),
    )
  );

mountWithActions(document.body, ({ state, act }) => mainView(controller({ state, act })), initialState);