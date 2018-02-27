const cons = require('consolidate');
const lang = process.argv[2];
const content = process.argv[3];

if (!cons[lang]) {
  throw new Error(`Template language "${lang}" can't be compiled by Consolidate.js`);
}

cons[lang]
  .render(content, {})
  .then((result) => {
    process.stdout.write(result);
  }, (err) => { throw err; });
