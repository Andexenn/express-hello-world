const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');

const PORT = process.env.PORT || 3001;
let serverProc;

function httpGet(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: PORT, path }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ res, body: data }));
    }).on('error', reject);
  });
}

describe('GET / (spawned server)', function() {
  before(function(done) {
    this.timeout(10000);
    // Start the app as a child process
    serverProc = spawn('node', ['app.js'], { stdio: ['ignore', 'inherit', 'inherit'] });

    // Wait until the server responds
    const start = Date.now();
    (function tryPing() {
      httpGet('/').then(() => done()).catch((err) => {
        if (Date.now() - start > 8000) return done(err);
        setTimeout(tryPing, 200);
      });
    })();
  });

  after(function() {
    if (serverProc) {
      serverProc.kill();
    }
  });

  it('responds with 200 and contains greeting', async function() {
    const { res, body } = await httpGet('/');
    assert.strictEqual(res.statusCode, 200);
    assert.ok(body.includes('Hello from 24520623 - Phan Huỳnh Hưng'));
  });

  it('responds with HTML content type', async function() {
    const { res } = await httpGet('/');
    const ct = res.headers['content-type'] || '';
    assert.ok(ct.includes('html'));
  });
});
