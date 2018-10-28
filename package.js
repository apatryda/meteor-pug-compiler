Package.describe({
  name: 'apatryda:pug-compiler',
  version: '0.1.2',
  summary: 'Meteor plugin for importing Pug templates',
  git: 'https://github.com/apatryda/meteor-pug-compiler.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'pug-compiler',
  use: [
    'babel-compiler@7.2.0',
    'caching-compiler@1.2.0',
    'ecmascript@0.12.0',
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
  api.versionsFrom('METEOR@1.8');
  api.use('isobuild:compiler-plugin@1.0.0');
});

Package.onTest(function(api) {
  api.use([
    'apatryda:pug-compiler',
    'ecmascript',
    'tinytest',
  ]);
  api.addFiles([
    'tests/test1.pug',
    'tests/test2.pug',
    'tests/test3.pug',
    'pug-compiler-tests.js',
  ]);
});
