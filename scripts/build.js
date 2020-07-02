const fs = require('fs-extra');
const path = require('path');

fs.emptyDirSync('assets');
fs.mkdirSync(path.join('assets', '@senx'));
fs.copySync(path.join('node_modules', '@senx', 'warpview'), path.join('assets', '@senx', 'warpview'));
fs.copySync(path.join('node_modules', 'spectre.css'), path.join('assets', 'spectre.css'));