const compiler = require('vue-template-compiler');
const transpile = require('vue-template-es2015-compiler');
const {spawnSync} = require('child_process');
const {join, dirname} = require('path');
const {readFileSync} = require('fs');
const exportsTarget = '((module.exports.default || module.exports).options || module.exports.default || module.exports)';
const defaultConfig = {
  transpileTemplates : true
};
let globalConfig = defaultConfig;

module.exports = function ({ content, filename, hook }) {
  function retrieveContent(config) {
    if (config.content){
      return config.content;
    }else if (config.attrs.src){
      let fullPath = join(dirname(filename), config.attrs.src);
      return readFileSync(fullPath, 'utf8');
    }else{
      return '';
    }
  }

  const {template, script} = compiler.parseComponent(content, {pad : 'line'});

  if(!script) {
    throw new Error('Unable to read ' + filename + ': could not find a valid <script> tag');
  }
  let scriptPart = retrieveContent(script);
  if (script.attrs.lang && !['js', 'javascript'].includes(script.attrs.lang.toLowerCase())){
    scriptPart = hook(script.attrs.lang, scriptPart);
  }

  // If there is a template then compile to render functions
  // This avoids the need for a runtime compilation
  // ES2015 template compiler to support es2015 features
  let compiledTemplate = '';
  if (template) {
    let templatePart = retrieveContent(template);

    let lang = template.attrs.lang;
    if(lang && lang.toLowerCase() !== 'html') {
      if (globalConfig.transpileTemplates){
        const renderedResult = spawnSync(
          process.execPath,
          [
            join(__dirname, './renderTemplate.js'),
            lang,
            templatePart
          ],
          {encoding: 'utf-8'});
        if(renderedResult.stderr) {
          throw new Error(renderedResult.stderr);
        }
        templatePart = renderedResult.stdout;
      }else{
        templatePart = hook(lang, templatePart);
      }
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
  const result = `${scriptPart}\n${compiledTemplate}`;

  return { content: result };
};
module.exports.configure = function (config) {
  globalConfig = Object.assign({}, defaultConfig, config);
};
