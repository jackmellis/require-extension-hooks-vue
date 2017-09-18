const compiler = require('vue-template-compiler');
const transpile = require('vue-template-es2015-compiler');
const { spawnSync } = require('child_process');
const { join, dirname } = require('path');
const { readFileSync } = require('fs');
const exportsTarget = '((module.exports.default || module.exports).options || module.exports.default || module.exports)';
const defaultConfig = {
  transpileTemplates: true
};
let globalConfig = defaultConfig;

module.exports = function ({ content, filename, hook }) {

  function retrieveContent(config) {
    if (config.content) {
      return config.content;
    } else if (config.attrs.src) {
      let fullPath = join(dirname(filename), config.attrs.src);
      return readFileSync(fullPath, 'utf8');
    } else {
      return '';
    }
  }

  function retrieveAndTranspileContent(config, noTranspileLangs, transpileSpecial) {
    let content = retrieveContent(config)

    let lang = config.attrs.lang
    if (lang) {
      lang = lang.toLowerCase()
    }

    if (lang) {
      content = transpileSpecial != null
        ? transpileSpecial(content, lang)
        : hook(lang, content);
    }
    return content
  }

  function getScriptPart(script) {
    if (!script) {
      throw new Error('Unable to read ' + filename + ': could not find a valid <script> tag');
    }
    return retrieveAndTranspileContent(script, ['js', 'javascript']);
  }

  function getCompiledTemplate(template) {

    function transpileTemplateSpecial(content, lang) {
      const result = spawnSync(
        process.execPath,
        [
          join(__dirname, './renderTemplate.js'),
          lang,
          content
        ],
        { encoding: 'utf-8' });

      if (result.stderr) {
        throw new Error(result.stderr);
      }
      return result.stdout;
    }

    // If there is a template then compile to render functions
    // This avoids the need for a runtime compilation
    // ES2015 template compiler to support es2015 features
    let compiledTemplate = '';
    if (template) {
      let templatePart = retrieveAndTranspileContent(template, ['html'],
        globalConfig.transpileTemplates ? transpileTemplateSpecial : null);

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
    return compiledTemplate
  }

  const { template, script } = compiler.parseComponent(content, { pad: 'line' });
  let scriptPart = getScriptPart(script);
  let compliledTemplate = getCompiledTemplate(template)

  const result = `${scriptPart}\n${compliledTemplate}`;
  return { content: result };
};

module.exports.configure = function (config) {
  globalConfig = Object.assign({}, defaultConfig, config);
};
