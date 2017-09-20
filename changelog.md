# Change Log

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
