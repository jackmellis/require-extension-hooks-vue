# Change Log

## 0.3.0
- Automatically parse templates based on their lang attribute [11](https://github.com/jackmellis/require-extension-hooks-vue/issues/11)
- Load templates and scripts from external sources [9](https://github.com/jackmellis/require-extension-hooks-vue/issues/9)
- Used vue-template-compiler's parseComponent method instead of manually extracting file content [7](https://github.com/jackmellis/require-extension-hooks-vue/issues/7)

## 0.2.2
- Added ability to require vue components that export using `export default Vue.extend({})`

## 0.2.1
- Separated render function from the export function to avoid semi-colon issues.
