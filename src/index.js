const {
  join,
  dirname,
} = require('path');
const {
  readFileSync,
} = require('fs');
const {
  spawnSync,
} = require('child_process');
const {
  parse,
  compileTemplate,
} = require('@vue/component-compiler-utils');
const compiler = require('vue-template-compiler');
const postcss = require('postcss');
const postcssModules = require('postcss-modules-sync').default;

const COMPONENT_OPTIONS = '((module.exports.default || module.exports).options || module.exports.default || module.exports)';

const defaultConfig = {
  transpileTemplates: true,
  sourceMaps: true,
};

let globalConfig = Object.assign({}, defaultConfig);

let sourceMapSupport = false;

function retrieveContent(
  filename,
  config
) {
  if (config.attrs.src) {
    const fullPath = join(dirname(filename), config.attrs.src);
    return readFileSync(fullPath, 'utf8');
  } else if (config.content) {
    return config.content;
  }

  return '';
}

function retrieveAndTranspileContent(
  filename,
  config,
  hook,
  noTranspileLangs,
  transpileSpecial
) {
  const content = retrieveContent(filename, config);
  const lang = (config.attrs.lang || '').toLowerCase();

  if (lang && noTranspileLangs.includes(lang) === false) {
    if (transpileSpecial == null) {
      return hook(lang, content);
    } else {
      return transpileSpecial(content, lang);
    }
  }

  return content;
}

function getScriptPart(
  filename,
  hook,
  script
) {
  if (!script) {
    return '';
  }
  return retrieveAndTranspileContent(
    filename,
    script,
    hook,
    [ 'js', 'javascript' ]
  );
}

function transpileTemplateSpecial(
  content,
  lang
) {
  const result = spawnSync(
    process.execPath,
    [
      join(__dirname, './renderTemplate.js'),
      lang,
      content,
    ],
    {
      encoding: 'utf-8',
    }
  );

  if (result.stderr) {
    throw new Error(result.stderr);
  }

  return result.stdout;
}

function getCompiledTemplate(
  filename,
  hook,
  template
) {
  if (!template) {
    return '';
  }

  const content = retrieveAndTranspileContent(
    filename,
    template,
    hook,
    [ 'html' ],
    globalConfig.transpileTemplates && transpileTemplateSpecial
  );

  const isFunctional = template.attrs.functional;

  const compiled = compileTemplate({
    source: content,
    filename,
    compiler,
    compilerOptions: { preserveWhitespace: false },
    isFunctional
  });

  return [
    compiled.code,
    `;${COMPONENT_OPTIONS}.render=render;`,
    `${COMPONENT_OPTIONS}.staticRenderFns=staticRenderFns;`,
    `${COMPONENT_OPTIONS}._compiled = true;`,
    isFunctional ? `${COMPONENT_OPTIONS}.functional = true;` : ''
  ].join('\n');
}

function getCssModuleComputedProps(
  filename,
  hook,
  styles
) {
  if (!styles) {
    return '';
  }

  const computedProps = styles
    .filter((style) => style.module !== undefined && style.module !== false)
    .map((style) => {
      const moduleName = (typeof style.module) === 'string' ? style.module : '$style';
      const content = retrieveAndTranspileContent(
        filename,
        style,
        hook,
        [ 'css' ]
      );

      let cssClasses;
      postcss(postcssModules(
        {
          generateScopedName: moduleName + '-[local]',
          getJSON: json => { cssClasses = json; }
        })).process(content).css;
      const cssClassesStr = JSON.stringify(cssClasses);

      return `${COMPONENT_OPTIONS}.computed.${moduleName} = function(){ return ${cssClassesStr}; };`;
    });

  if (!computedProps.length) {
    return '';
  }

  return `${COMPONENT_OPTIONS}.computed = ${COMPONENT_OPTIONS}.computed || {}; ${computedProps.join(' ')}`;
}

function processCustomBlocks (
  filename,
  hook,
  customBlocks
) {
  if (!customBlocks) {
    return '';
  }
  return customBlocks.map(customBlock => {
    try {
      return hook('vue-block-' + customBlock.type, customBlock.content);
    } catch (err) {
      return '';
    }
  }).join('\n');
}

module.exports = ({ content, filename, hook }) => {
  const {
    template,
    script,
    styles,
    customBlocks,
  } = parse({
    source: content,
    filename,
    compiler
  });

  if (globalConfig.sourceMaps && sourceMapSupport === false) {
    require('source-map-support').install({
      hookRequired: true,
    });
    sourceMapSupport = true;
  }

  const scriptPart = getScriptPart(
    filename,
    hook,
    script
  );

  const compiledTemplate = getCompiledTemplate(
    filename,
    hook,
    template
  );

  const cssModulesComputedProps = getCssModuleComputedProps(
    filename,
    hook,
    styles
  );

  const processedCustomBlocks = processCustomBlocks(
    filename,
    hook,
    customBlocks
  );

  const result = [
    scriptPart,
    compiledTemplate,
    cssModulesComputedProps,
    processedCustomBlocks,
  ].join('\n');

  return { content: result };
};

module.exports.configure = (config) => {
  globalConfig = Object.assign({}, defaultConfig, globalConfig, config);
};

module.exports.COMPONENT_OPTIONS = COMPONENT_OPTIONS;
