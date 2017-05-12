// const spawnSync = require('child_process').spawnSync;

const cons = require('consolidate');

if(!cons[process.argv[2]]) {
  throw new Error('Template language "'+ process.argv[2] + '" can\'t be compiled by Consolidate.js.');
}

cons[process.argv[2]].render(process.argv[3], {}).then(function (result) {
  process.stdout.write(result);
}, function (err) {
  throw err;
});