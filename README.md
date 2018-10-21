# meteor-pug-compiler

Meteor plugin for importing Pug templates

## Installation

```bash
meteor add apatryda:pug-compiler
```

## Usage

```js
import example from './example.pug';
const locals = {
  name: 'Artur',
};

console.log('example.pug rendered as a HTML string:', example(locals));
```
