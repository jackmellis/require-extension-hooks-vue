# require-extension-hooks-vue
Simple parser for vue files  

Using require-extension-hooks you can load *.vue* files in node, extremely helpful for browserless unit testing.

## Installation  
`npm install require-extension-hooks require-extension-hooks-vue --save-dev`  

## Usage  
```javascript
const hooks = require('require-extension-hooks');
hooks('vue').plugin('vue');

let component = require('./components/app.vue');
```

*rehv* will convert `<template>` blocks into render functions for you.

You can load external templates and scripts:
```html
<template src="./tpl.html"/>
<script src="./script.js"/>
```

You can also transpile templates in other languages:
```html
<template lang="pug">...</template>
```
Just install the relevant library as you would for `vue-loader`:
```
npm install pug --save-dev
```
and *rehv* will pick it up.

For scripts in other languages:
```html
<script lang="ts">...</script>
```
You will need to register a hook for that extension name:
```javascript
hooks('ts').push(function({content}){
/* transpile your script code here */
});
```
*There will likely be additional hook libraries for script languages available soon*

## Custom Blocks
If you have custom blocks in your `.vue` files, you can parse then using `require-extension-hooks`.
Blocks are available by hooking to the file type `vue-block-(block name)`. The hook should return
JavaScript code, in a string, which will be appended to the compiled `.vue` file.

A helper named `COMPONENT_OPTIONS` is available in on the plugin export to allow you to modify
the exported component options object from the `.vue` file.

For example, for a `<json></json>` block to have its data available via `this.json` in the
component, you could use a [mixin](https://vuejs.org/v2/guide/mixins.html):

```javascript
const { COMPONENT_OPTIONS } = require('require-extension-hooks-vue');
hooks('vue-block-json').push(({ content }) =>
    `${COMPONENT_OPTIONS}.mixins = (${COMPONENT_OPTIONS}.mixins || []).concat({
        data: () => ({
            json: ${JSON.parse(content)}
        })
    });`
);
```

## Register
You can automatically register the vue hook using the register file:
```js
require('require-extension-hooks-vue/register');
```
Which means you can register the module from cli tools:
```
mocha --require require-extension-hooks-vue/register
```

## Configuration
Set configuration options using the `configure` method:
```js
const plugin = require('require-extension-hooks-vue');
plugin.configure({ transpileTemplates: false });
```

### transpileTemplates
`true`  
whether or not to automatically transpile templates that have a `lang` attribute

### sourceMaps
`true`  
whether or not to set up source map support. This utilises the `source-map-support` library.
