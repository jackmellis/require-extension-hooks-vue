const compiler = require('vue-template-compiler');
const transpile = require('vue-template-es2015-compiler');

const exportsTarget = '((module.exports.default || module.exports).options || module.exports.default || module.exports)';

module.exports = function ({ content, filename, sourceMap }) {
  const startOfScript = content.indexOf('<script>') + 8;
  const endOfScript = content.lastIndexOf('</script>');
  if (startOfScript < 8 || endOfScript < 0 || endOfScript < startOfScript){
    throw new Error('Unable to read ' + filename + ': could not find a valid <script> tag');
  }
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
  const startOfTemplate = content.indexOf('<template>');
  const endOfTemplate = content.lastIndexOf('</template>');
  if (startOfTemplate >= 0 && endOfTemplate >= 0) {
    const templatePart = content.substring(startOfTemplate + 10, endOfTemplate);
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
