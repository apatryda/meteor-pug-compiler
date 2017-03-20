Package.describe({
  name: 'apatryda:pug-compiler',
  version: '0.0.2',
  summary: 'Meteor plugin for importing Pug templates',
  git: 'https://github.com/apatryda/meteor-pug-compiler.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'pug-compiler',
  use: [
    'urigo:static-html-compiler@0.1.8',
    'ecmascript@0.2.0',
  ],
  sources: [
    'pug-compiler.js',
  ],
  npmDependencies: {
    'pug': '2.0.0-beta11',
  },
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('isobuild:compiler-plugin@1.0.0');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('apatryda:pug-compiler');
  api.addFiles([
    'tests/test1.pug',
    'tests/test2.pug',
    'tests/test3.pug',
  ], 'server');
  api.mainModule('pug-compiler-tests.js');
});
