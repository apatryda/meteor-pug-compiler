import $ from 'cheerio';
import * as pug from 'pug';
import { CachingCompiler } from 'meteor/caching-compiler';

const doctypeRE = /^doctype[ \t]/m;

class PugCompiler extends CachingCompiler {
  constructor({ doctype = 'html' } = {}) {
    super({
      compilerName: 'pug-compiler',
      defaultCacheSize: 1024*1024*10,
    });
    this.doctype = doctype;
  }

  getCacheKey(inputFile) {
    return inputFile.getSourceHash();
  }

  compileResultSize(compileResult) {
    return compileResult.static
      ? compileResult.static.head.length + compileResult.static.body.length
      : compileResult.dynamic.length
    ;
  }

  compileOneFile(inputFile) {
    const source = inputFile.getContentsAsString();
    const options = doctypeRE.test(source)
      ? {}
      : { doctype: this.doctype }
    ;
    const compiled = pug.compile(source, options);

    try {
      const rendered = compiled({});
      const $contents = $(rendered);
      if ($contents.closest('head,body').length) {
        const $head = $contents.closest('head');
        const $body = $contents.closest('body');
        return { static: {
          head: {
            contents: $head.html() || '',
          },
          body: {
            contents: $body.html() || '',
            attrs: $body[0] ? $body[0].attribs : undefined,
          },
        } };
      }
    } catch (error) {}

    const compiledSource = pug.compileClient(source, options);
    const moduleSource = `\
${compiledSource}
export default template;
`
    ;
    return { dynamic: Babel.compile(moduleSource).code };
  }

  addCompileResult(inputFile, compileResult) {
    if (compileResult.static) {
      inputFile.addHtml({
        section: 'head',
        data: compileResult.static.head.contents,
        hash: inputFile.getSourceHash(),
      });

      inputFile.addHtml({
        section: 'body',
        data: compileResult.static.body.contents,
        hash: inputFile.getSourceHash(),
      });

      if (compileResult.static.body.attrs) {
        const packageName = inputFile.getPackageName();
        const packagePrefix = packageName ? `packages/${packageName}/` : '';
        const pathInPackage = inputFile.getPathInPackage()
        const stringifiedAttrs = JSON.stringify(compileResult.static.body.attrs);
        inputFile.addJavaScript({
          path: `${packagePrefix}${pathInPackage}.js`,
          data: `\
Meteor.startup(function() {
  var attrs = ${stringifiedAttrs};
  for (var prop in attrs) {
    document.body.setAttribute(prop, attrs[prop]);
  }
});
`
          ,
          hash: inputFile.getSourceHash(),
        });
      }
    } else {
      inputFile.addJavaScript({
        path: inputFile.getPathInPackage(),
        data: compileResult.dynamic,
        hash: inputFile.getSourceHash(),
        lazy: true,
      });
    }
  }
}

Plugin.registerCompiler({
  extensions: ['pug'],
}, () => new PugCompiler());
