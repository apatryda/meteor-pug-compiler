import $ from 'cheerio';
import * as pug from 'pug';
import { CachingCompiler } from 'meteor/caching-compiler';

const { PUG_COMPILER_DEFAULT_DOCTYPE = 'html' } = process.env;
const hiddenDoctypeRE = /^\/\/- doctype[ \t]+(.+)(?:[\n\r]|$)/;
const doctypeRE = /^doctype[ \t]/m;

class PugCompiler extends CachingCompiler {
  constructor() {
    super({
      compilerName: 'pug-compiler',
      defaultCacheSize: 1024*1024*10,
    });
  }

  getCacheKey(inputFile) {
    return inputFile.getSourceHash();
  }

  compileResultSize(compileResult) {
    return compileResult.dynamic.length;
  }

  compileOneFile(inputFile) {
    const source = inputFile.getContentsAsString();
    const pugOptions = {};
    const hasDoctype = doctypeRE.test(source);

    if (!hasDoctype) {
      const hiddenDoctypeMatch = hiddenDoctypeRE.exec(source);
      pugOptions.doctype = hiddenDoctypeMatch
        ? hiddenDoctypeMatch[1]
        : PUG_COMPILER_DEFAULT_DOCTYPE
      ;
    }

    const compiledSource = pug.compileClient(source, pugOptions);
    const dynamic = `${compiledSource};module.exports = template;`;

    const path = inputFile.getPathInPackage();
    const splitPath = path.split('/');

    if (!splitPath.includes('imports')) {
      try {
        const compiled = pug.compile(source, pugOptions);
        const rendered = compiled({});
        const $contents = $(rendered);
        if ($contents.closest('head,body').length) {
          const $head = $contents.closest('head');
          const $body = $contents.closest('body');
          return {
            dynamic,
            static: {
              head: {
                contents: $head.html() || '',
              },
              body: {
                contents: $body.html() || '',
                attrs: $body[0] ? $body[0].attribs : undefined,
              },
            },
          };
        }
      } catch (error) {
        console.warn(`Problems processing seemingly static template ${path}`, error.stack || error);
      }
    }

    return { dynamic };
  }

  addCompileResult(inputFile, compileResult) {
    const arch = inputFile.getArch();
    const hash = inputFile.getSourceHash();
    const path = inputFile.getPathInPackage();

    let data = compileResult.dynamic;
    let lazy = true;

    if (arch.startsWith('web.') && compileResult.static) {
      inputFile.addHtml({
        data: compileResult.static.head.contents,
        section: 'head',
      });

      inputFile.addHtml({
        data: compileResult.static.body.contents,
        section: 'body',
      });

      if (compileResult.static.body.attrs) {
        const stringifiedAttrs = JSON.stringify(compileResult.static.body.attrs);
        data = `\
Meteor.startup(function() {
  var attrs = ${stringifiedAttrs};
  for (var prop in attrs) {
    document.body.setAttribute(prop, attrs[prop]);
  }
});
${compileResult.dynamic}
`
        ;
        lazy = false;
      }
    }

    inputFile.addJavaScript({ data, hash, lazy, path });
  }
}

Plugin.registerCompiler({
  extensions: ['pug'],
}, () => new PugCompiler());
