Package.describe({
  name: 'apatryda:pug-compiler',
  version: '0.1.0',
  summary: 'Meteor plugin for importing Pug templates',
  git: 'https://github.com/apatryda/meteor-pug-compiler.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'pug-compiler',
  use: [
    'babel-compiler@7.0.0',
    'caching-compiler@1.2.0',
    'ecmascript@0.11.1',
  ],
  sources: [
    'pug-compiler.js',
  ],
  npmDependencies: {
    'cheerio': '0.22.0',
    'pug': '2.0.3',
  },
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.6.1');
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
