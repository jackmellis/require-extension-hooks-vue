# require-extension-hooks-vue
Simple parser for vue files  

Using require-extension-hooks you can load *.vue* files in node, extremely helpful for browserless unit testing.

## Installation  
`npm install require-extension-hooks require-extension-hooks-vue --save-dev`  

## Usage  
```javascript
const hooks = require('require-extension-hooks');
hooks('vue').plugin('vue').push();

let component = require('./components/app.vue');
component.template // '<div>...</div>'
```
