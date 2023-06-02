const path = require('path');
const fs = require('fs');
const { Engine } = require('../dist/Engine');

const engine = new Engine(process.cwd());

function check(name) {
  const url = path.resolve(__dirname, name);
  function valid() {
    const code = fs.readFileSync(url, 'utf8');
    const start = performance.now();
    const flag = engine.check(url, code);
    console.log('check took', performance.now() - start,'ms', name, flag ? 'success' : 'failed');
  }
  fs.watchFile(url, { persistent: true, interval: 128 }, valid);
  valid();
}

check('a.ts');
check('b.ts');

