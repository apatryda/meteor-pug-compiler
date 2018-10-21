// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

import test1 from './tests/test1.pug';
import test2 from './tests/test2.pug';
import test3 from './tests/test3.pug';

Tinytest.add('pug-compiler - test1', function (test) {
  test.equal(test1(),
    '<div class="message" id="test1">Hello world!</div>'
  );
});

Tinytest.add('pug-compiler - test2', function (test) {
  test.equal(test2(),
    '<div id="test2"><ul><li class="one"><a href="#">Link 1</a></li><li class="two"><a href="#">Link 2</a></li><li class="three"><a href="#">Link 3</a></li></ul></div>'
  );
});

Tinytest.add('pug-compiler - test3', function (test) {
  test.equal(test3(),
    '<div id="test3"><article><header><h2>Some title</h2></header><section><p>A first paragraph</p><p>A second\nmultiline\nparagraph</p></section></article></div>'
  );
});
