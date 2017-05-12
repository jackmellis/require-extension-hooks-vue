const compiler = require('vue-template-compiler');
const transpile = require('vue-template-es2015-compiler');
const parse5 = require('parse5');
const consolidate = require('consolidate');
const spawnSync = require('child_process').spawnSync;
const pathJoin = require('path').join;

const exportsTarget = '((module.exports.default || module.exports).options || module.exports.default || module.exports)';

module.exports = function ({ content, filename, sourceMap }) {
  const documentFragment = parse5.parseFragment(content, {locationInfo: true});
  const scriptFrag = documentFragment.childNodes.find(node => node.tagName === 'script');

  if(!scriptFrag) {
    throw new Error('Unable to read ' + filename + ': could not find a valid <script> tag');
  }
  const startOfScript = scriptFrag.__location.startTag.endOffset;
  const endOfScript = scriptFrag.__location.endTag.startOffset;
  let scriptPart = content.substring(startOfScript, endOfScript);

  let whitespaces = /^[\n\r]/;
  while (scriptPart.match(whitespaces)) {
    scriptPart = scriptPart.replace(whitespaces, '');
  }
  whitespaces = /[\n\r]$/;
  while (scriptPart.match(whitespaces)) {
    scriptPart = scriptPart.replace(whitespaces, '');
  }

  // If there is a template then compile to render functions
  // This avoids the need for a runtime compilation
  // ES2015 template compiler to support es2015 features
  let compiledTemplate = '';
  const templateFrag = documentFragment.childNodes.find(node => node.tagName === 'template');
  if (templateFrag) {
    const startOfTemplate = templateFrag.__location.startTag.endOffset;
    const endOfTemplate = templateFrag.__location.endTag.startOffset;
    let templatePart = content.substring(startOfTemplate, endOfTemplate);

    const templateAttrLang = templateFrag.attrs.find(attr => attr.name === 'lang');
    if(templateAttrLang && templateAttrLang.value.toLowerCase() !== 'html') {
      const renderedResult = spawnSync(
        process.execPath,
        [
          pathJoin(__dirname, './renderTemplate.js'),
          templateAttrLang.value,
          templatePart
        ],
        {encoding: 'utf-8'});
      if(renderedResult.stderr) {
        throw new Error(renderedResult.stderr);
      }
      templatePart = renderedResult.stdout;
    }

    const compiled = compiler.compile(templatePart, { preserveWhitespace: false });
    const renderFn = `function(){${compiled.render}}`;
    const staticRenderFns = (compiled.staticRenderFns || [])
      .map(fn => `function(){${fn}}`)
      .join(',');
    compiledTemplate = `\n;`
      + transpile(`${exportsTarget}.render=${renderFn};`)
      + '\n'
      + transpile(`${exportsTarget}.staticRenderFns = [${staticRenderFns}];`)
      + `\n${exportsTarget}.render._withStripped = true;`;
  }
  const result = `${scriptPart}${compiledTemplate}`;

  const startOfScriptPart = content.indexOf(scriptPart);
  const lineNumberOfScriptPart = content.substr(0, startOfScriptPart).split('\n').length;
  const numLines = scriptPart.split('\n').length;

  for (let x = 0; x < numLines; x++) {
    sourceMap.addMapping({
      source: filename,
      original: {
        line: lineNumberOfScriptPart + x,
        column: 0,
      },
      generated: {
        line: x + 1,
        column: 0,
      }
    });
  }

  return { content: result, sourceMap };
};
