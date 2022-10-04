const fs = require('fs-extra');
const path = require('path');

fs.emptyDirSync('assets');
fs.mkdirSync(path.join('assets', '@senx'));
fs.copySync(path.join('node_modules', '@senx', 'warpview'), path.join('assets', '@senx', 'warpview'));
fs.copySync(path.join('node_modules', '@senx', 'discovery-widgets'), path.join('assets', '@senx', 'discovery-widgets'));
fs.copySync(path.join('node_modules', 'spectre.css'), path.join('assets', 'spectre.css'));
fs.copySync(path.join('src', 'webviews', 'themes.css'), path.join('assets', 'themes.css'));