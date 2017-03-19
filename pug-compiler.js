import * as pug from 'pug';
import { StaticHtmlCompiler } from 'meteor/urigo:static-html-compiler';

class StaticPugCompiler extends StaticHtmlCompiler {
  processFilesForTarget(files) {
    files.forEach((file) => {
      const getContentsAsString = file.getContentsAsString;

      file.getContentsAsString = function () {
        return pug.render(
          getContentsAsString.call(this),
          { doctype: 'html' }
        );
      };
    });

    return super.processFilesForTarget(files);
  }
}

Plugin.registerCompiler({
  extensions: ['pug'],
}, () => new StaticPugCompiler());
