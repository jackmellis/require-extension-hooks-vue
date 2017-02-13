module.exports = function ({content, filename, sourceMap}) {
  // No <script> or <template> - either already done, or not a proper vue file
  if (content.indexOf('<script>') < 0 && content.indexOf('<template>') < 0){
    return content;
  }

  let startOfScript = content.indexOf('<script>') + 8;
  let endOfScript = content.lastIndexOf('</script>');

  let startOfTemplate = content.indexOf('<template>') + 10;
  let endOfTemplate = content.lastIndexOf('</template>');

  let scriptPart = content.substring(startOfScript, endOfScript);
  let templatePart = content.substring(startOfTemplate, endOfTemplate);

  let whitespaces = /^[\n\r]/;
  while (scriptPart.match(whitespaces)){
    scriptPart = scriptPart.replace(whitespaces, '');
  }
  whitespaces = /[\n\r]$/;
  while (scriptPart.match(whitespaces)){
    scriptPart = scriptPart.replace(whitespaces, '');
  }

  let result = scriptPart + ';\n(module.exports.default || module.exports).template = `' + templatePart + '`;';

  const startOfScriptPart = content.indexOf(scriptPart);
  const lineNumberOfScriptPart = content.substr(0, startOfScriptPart).split('\n').length;
  const numLines = scriptPart.split('\n').length;

  for (var x = 0; x < numLines; x++){
    sourceMap.addMapping({
      source : filename,
      original : {
        line : lineNumberOfScriptPart + x,
        column : 0
      },
      generated : {
        line : x + 1,
        column : 0
      }
    });
  }

  return { content : result, sourceMap };
};
