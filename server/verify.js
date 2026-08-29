'use strict';
const fs = require('fs');
const path = require('path');
const registry = require('./service-registry');

function countProductionLines() {
  const root = path.join(__dirname, 'modules');
  let count = 0;
  for (const name of fs.readdirSync(root)) {
    if (!name.endsWith('.js')) continue;
    count += fs.readFileSync(path.join(root, name), 'utf8').split(/\r?\n/).filter(Boolean).length;
  }
  return count;
}

function verify() {
  const services = registry.listServices();
  const lines = countProductionLines();
  const result = {
    services: services.length,
    moduleProductionLines: lines,
    registryHealthy: services.every(name => registry.createService(name).health().healthy)
  };
  if (!result.registryHealthy || result.services < 100 || result.moduleProductionLines < 50000) {
    throw new Error(`Verification failed: ${JSON.stringify(result)}`);
  }
  return result;
}

if (require.main === module) console.log(JSON.stringify(verify(), null, 2));
module.exports = { countProductionLines, verify };
