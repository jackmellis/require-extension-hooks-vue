# Change Log

## 2.0.0
- Use @vue/component-compiler-utils - this offers more consistent behaviour, as well as fixing issues with functional components [#32](https://github.com/jackmellis/require-extension-hooks-vue/pull/32)
- ^ Potentially reverses the scriptless behaviour introduced in v1.1.0

## 1.1.0
- Components without a `<script>` are now imported and treated as functional components [#29](https://github.com/jackmellis/require-extension-hooks-vue/issues/29)
- Support for custom code blocks [#31](https://github.com/jackmellis/require-extension-hooks-vue/pull/31)

## 1.0.1
- Don't mutate the defualt config object [#28](https://github.com/jackmellis/require-extension-hooks-vue/pull/28)

## 1.0.0
- Register - lets you register this hook by simply requiring a file i.e. `mocha --require require-extension-hooks-vue/register`
- Source Map support for error stack traces

## 0.4.2
- Non-self-closing external script tags (i.e. `<script src="foo"></script>`) failed to load

## 0.4.1
- Support for css modules [18](https://github.com/jackmellis/require-extension-hooks-vue/issues/18)

## 0.4.0
- Added a configuration option to transpile non-html templates (true by default). This allows you to disable the default behaviour in favour of adding custom hooks. `hooks('vue').plugin('vue', { transpileTemplates : false }); hooks('pug').push(...)` [15](https://github.com/jackmellis/require-extension-hooks-vue/issues/15)
- Support for alternate script languages (i.e. where `<script lang="ts">`). When lang is set, it will look for a hook with the same extension.

## 0.3.0
- Automatically parse templates based on their lang attribute [11](https://github.com/jackmellis/require-extension-hooks-vue/issues/11)
- Load templates and scripts from external sources [9](https://github.com/jackmellis/require-extension-hooks-vue/issues/9)
- Used vue-template-compiler's parseComponent method instead of manually extracting file content [7](https://github.com/jackmellis/require-extension-hooks-vue/issues/7)

## 0.2.2
- Added ability to require vue components that export using `export default Vue.extend({})`

## 0.2.1
- Separated render function from the export function to avoid semi-colon issues.
