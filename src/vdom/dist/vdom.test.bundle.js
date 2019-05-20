(function () {
  'use strict';

  /**
   * A Module that abstracts Virtual DOM interactions.
   * It's purpose is to perform actions on DOM-like Objects
   *
   * @module vdom
   */

  /**
   * Creates a new HTML Element.
   * If the attribute is a function it will add it as an EventListener.
   * Otherwise as an attribute.
   *
   * @param {string} tagName name of the tag
   * @param {object} attributes attributes or listeners to set in element
   * @param {*} innerHTML content of the tag
   *
   * @returns {function(content): HTMLElement}
   */
  const createDomElement = (tagName, attributes = {}, innerHTML = '') => {
    const $element = document.createElement(tagName);
    $element.innerHTML = innerHTML;
    Object.keys(attributes)
      .filter(key => null != attributes[key]) // don't render attributes with value null/undefined
      .forEach(key => {
        if (typeof attributes[key] === 'function') {
          $element.addEventListener(key, attributes[key]);
        } else {
          $element.setAttribute(key, attributes[key]);
        }
      });
    return $element;
  };

  /**
   * compares two VDOM nodes and returns true if they are different
   *
   * @param {VNode} node1
   * @param {VNode} node2
   */
  const changed = (node1, node2) => {
    const nodeChanged =
      typeof node1 !== typeof node2 ||
      ((typeof node1 === 'string' || typeof node1 === 'number') && node1 !== node2) ||
      node1.type !== node2.type;
    const attributesChanged =
      !!node1.attributes &&
      !!node2.attributes &&
      (Object.keys(node1.attributes).length !== Object.keys(node2.attributes).length ||
        Object.keys(node1.attributes).some(
          a =>
            node1.attributes[a] !== node2.attributes[a] &&
            (null == node1.attributes[a] ? '' : node1.attributes[a]).toString() !==
              (null == node2.attributes[a] ? '' : node2.attributes[a]).toString()
        ));
    return nodeChanged || attributesChanged;
  };

  function Assert() {
    const ok = [];
    return {
      getOk: () => ok,
      is: (actual, expected) => {
        const result = actual === expected;
        if (!result) {
          console.log(`expected "${expected}" but was "${actual}"`);
          try {
            throw Error();
          } catch (err) {
            console.log(err);
          }
        }
        ok.push(result);
      },
      true: cond => ok.push(cond),
    };
  }

  /**
   * Reports an executed test to the DOM
   *
   * @param {string} origin
   * @param {Array<bool>} ok
   */
  function report(origin, ok) {
    const style = `
    color: ${ok.every(elem => elem) ? 'green' : 'red'};
    padding-left: 20px;
  `;
    const $report = createDomElement('div', { style },`
    ${ok.filter(elem => elem).length}/${ok.length} Tests in ${origin} ok.
  `);
    document.body.appendChild($report);
  }

  /**
   * Creates group heading, to group tests together
   *
   * @param {string} name
   */
  function reportGroup(name) {
    const style = `
    font-weight: bold;
    margin-top: 10px;
  `;
    const $reportGroup = createDomElement('div', { style }, `Test ${name}`);
    document.body.appendChild($reportGroup);
  }

  /**
   * Adds and executes a test.
   *
   * @param {String} name
   * @param {Function} callback
   */
  function test(name, callback) {
    const assert = Assert();
    callback(assert);
    report(name, assert.getOk());
  }

  /**
   * Adds a testGroup to the test report
   *
   * @param {String} name
   * @param {Function} callback
   */
  function describe(name, callback) {
    reportGroup(name);
    return callback(test);
  }

  describe('vdom', test => {

    test('createDomElement with plain text', assert => {
      // given
      const tagName = 'div';
      const content = 'test123';

      // when
      const $el = createDomElement(tagName, {}, content);

      // then
      assert.is($el.innerText, content);
      assert.is($el.tagName.toLowerCase(), tagName);
    });

    test('createDomElement with child nodes', assert => {
      // given
      const tagName = 'ul';
      const content = `
      <li>test</li>
      <li>123</li>
    `;

      // when
      const $el = createDomElement(tagName, {}, content);

      //  then
      assert.is($el.childElementCount, 2);
    });

    test('createDomElement with attribute', assert => {
      // given
      const tagName = 'p';
      const content = 'test';
      const attributes = { style: 'color: green' };

      // when
      const $el = createDomElement(tagName, attributes, content);

      // then
      assert.is($el.getAttribute('style'), 'color: green');
    });

    test('nodeChanged', assert => {
      // given
      let node1 = 1,
        node2 = 1;

      // when
      let result = changed(node1, node2);

      // then
      assert.is(result, false);

      // when
      node2 = 2;
      result = changed(node1, node2);

      // then
      assert.is(result, true);

      // when
      node2 = { tagName: 'p' };
      result = changed(node1, node2);

      // then
      assert.is(result, true);

      // when
      node1 = { tagName: 'p' };
      result = changed(node1, node2);

      // then
      assert.is(result, false);
    });

    test('attributesChanged', assert => {
      // given
      let node1 = { attributes: { test: 1 } };
      let node2 = { attributes: { test: 1 } };

      // when
      let result = changed(node1, node2);

      // then
      assert.is(result, false);

      // when
      node2.attributes.test = 2;
      result = changed(node1, node2);

      // then
      assert.is(result, true);

      // when
      delete node2.attributes.test;
      result = changed(node1, node2);

      // then
      assert.is(result, true);
    });
  });

}());