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
