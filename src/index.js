const compiler = require('vue-template-compiler');
const transpile = require('vue-template-es2015-compiler');
const { spawnSync } = require('child_process');
const { join, dirname } = require('path');
const { readFileSync } = require('fs');
const postcss = require('postcss')
const postcssModules = require('postcss-modules-sync').default
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

    if (lang && !noTranspileLangs.includes(lang)) {
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

    if (!template)
      return ''

    // If there is a template then compile to render functions
    // This avoids the need for a runtime compilation
    // ES2015 template compiler to support es2015 features
    let content = retrieveAndTranspileContent(template, ['html'],
      globalConfig.transpileTemplates ? transpileTemplateSpecial : null);

    const compiled = compiler.compile(content, { preserveWhitespace: false });
    const renderFn = `function(){${compiled.render}}`;
    const staticRenderFns = (compiled.staticRenderFns || [])
      .map(fn => `function(){${fn}}`)
      .join(',');
    return `\n;`
      + transpile(`${exportsTarget}.render=${renderFn};`)
      + '\n'
      + transpile(`${exportsTarget}.staticRenderFns = [${staticRenderFns}];`)
      + `\n${exportsTarget}.render._withStripped = true;`;
  }

  function getCssModuleComputedProps(styles) {
    if (!styles)
      return ''

    let computedProps = []
    for (let i = 0; i < styles.length; i++) {
      const style = styles[i];
      if (style.module !== undefined && style.module !== false) {
        const moduleName = typeof style.module === 'string' ? style.module : '$style';
        const content = retrieveAndTranspileContent(style, ['css']);
        let cssClasses;
        postcss(postcssModules(
          {
            generateScopedName: moduleName + '-[local]',
            getJSON: json => { cssClasses = json; }
          })).process(content).css;
        const cssClassesStr = JSON.stringify(cssClasses)
        computedProps.push(`${exportsTarget}.computed.${moduleName} = function(){ return ${cssClassesStr}; };`)
      }
    }
    return computedProps.length > 0
      ? `${exportsTarget}.computed = ${exportsTarget}.computed || {};` + computedProps.join(' ')
      : ''
  }

  const { template, script, styles } = compiler.parseComponent(content, { pad: 'line' });
  const scriptPart = getScriptPart(script);
  const compliledTemplate = getCompiledTemplate(template)
  const cssModulesComputedProps = getCssModuleComputedProps(styles)

  const result = `${scriptPart}\n${compliledTemplate}\n${cssModulesComputedProps}`;
  return { content: result };
};

module.exports.configure = function (config) {
  globalConfig = Object.assign({}, defaultConfig, config);
};
