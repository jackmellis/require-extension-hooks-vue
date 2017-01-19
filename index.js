module.exports = function ({content, filename, sourceMap}) {
  // No <script> or <template> - either already done, or not a proper vue file
  if (content.indexOf('<script>') < 0 && content.indexOf('<template>') < 0){
    return content;
  }

  let scriptPart = content.substring(content.indexOf('<script>')+8, content.indexOf('</script>'));
  let templatePart = content.substring(content.indexOf('<template>')+10, content.indexOf('</template>'));

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
