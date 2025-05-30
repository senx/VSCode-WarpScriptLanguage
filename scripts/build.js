const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


async function copyAssets() {
  console.log('Copy assets');
  fs.emptyDirSync('assets');
  fs.mkdirSync(path.join('assets', '@senx'));
  fs.copySync(path.join('node_modules', '@senx', 'warpview'), path.join('assets', '@senx', 'warpview'));
  fs.copySync(path.join('node_modules', '@senx', 'discovery-widgets'), path.join('assets', '@senx', 'discovery-widgets'));
  fs.copySync(path.join('node_modules', '@senx', 'discovery-plugin-form'), path.join('assets', '@senx', 'discovery-plugin-form'));
  fs.copySync(path.join('node_modules', '@senx', 'discovery-themes', 'dist', 'index.css'), path.join('assets', 'themes.css'));
  fs.copySync(path.join('node_modules', 'spectre.css'), path.join('assets', 'spectre.css'));
  fs.copySync(path.join('node_modules', 'spectre.css', 'dist', 'spectre.min.css'), path.join('out', 'static', 'spectre.css'));
  console.log('Copy assets done');
}


async function compileAssets() {
  console.log('Compile assets');
  await exec("npm run static");
  console.log('Compile assets done');
}
compileAssets();
copyAssets();

