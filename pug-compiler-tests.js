import { Tinytest } from 'meteor/tinytest';

import test1 from './tests/test1.pug';
import test2 from './tests/test2.pug';
import test3 from './tests/test3.pug';
import test4 from './tests/imports/test4.pug';

Tinytest.add('pug-compiler - test1', function (test) {
  test.equal(test1(),
    '<div class="message" id="test1">Hello world!</div>'
  );
});

Tinytest.add('pug-compiler - test2', function (test) {
  if (Meteor.isClient) {
    test.equal(document.body.getAttribute('data-test2'),
      'ok'
    );
  }
  test.equal(test2(),
    '<body data-test2="ok"></body>'
  );
});

Tinytest.add('pug-compiler - test3', function (test) {
  test.equal(test3(),
    '<div id="test3"><article><header><h2>Some title</h2></header><section><p>A first paragraph</p><p>A second\nmultiline\nparagraph</p></section></article></div>'
  );
});

Tinytest.add('pug-compiler - test4', function (test) {
  test.equal(test4({ anchors: [
    'Label 1',
    'Label 2',
    'Label 3',
  ] }),
    '\
<div id="test4"><ul>\
<li><a href="#anchor-1">Label 1</a></li>\
<li><a href="#anchor-2">Label 2</a></li>\
<li><a href="#anchor-3">Label 3</a></li>\
</ul></div>'
  );
});
