const compiler = require('vue-template-compiler');
const transpile = require('vue-template-es2015-compiler');

module.exports = function ({ content, filename, sourceMap }) {
  // No <script> - either already done, or not a proper vue file
  if (content.indexOf('<script>') < 0) {
    return content;
  }

  const startOfScript = content.indexOf('<script>') + 8;
  const endOfScript = content.lastIndexOf('</script>');
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
    compiledTemplate = `\n`
      + transpile(`(module.exports.default || module.exports).render=${renderFn};`)
      + '\n'
      + transpile(`(module.exports.default || module.exports).staticRenderFns = [${staticRenderFns}];`)
      + `\n(module.exports.default || module.exports).render._withStripped = true;`;
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
      },
    });
  }

  return { content: result, sourceMap };
};
