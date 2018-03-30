const { execSync } = require('child_process');
let lastTags = execSync('git tag | head -n 20').toString().split('\n').map( a => a.split('.').map( n => +n+100000 ).join('.') ).sort()
.map( a => a.split('.').map( n => +n-100000 ).join('.') ).reverse();

lastTags[lastTags.length - 1] = execSync('git rev-list --max-parents=0 HEAD').toString()
let changelog = {}

console.log('# VSCode Warpscript Extension')

for (let i = 0; i < lastTags.length - 1; i++) {
  let cmd = 'git log ' + lastTags[i + 1].replace('\n', '') +
    '..' +
    lastTags[i].replace('\n', '') +
    ' --format="> +  %s %N (*by [%cN](mailto:%ce) | [view commit](https://github.com/Giwi/VSCode-WarpScriptLangage/commit/%H)*)"'
  let commits = execSync(cmd).toString().split('\n')
  changelog[lastTags[i]] = commits
}
lastTags.reverse().slice(1).reverse().forEach(tag => {
  console.log('## ' + tag)
  changelog[tag].forEach(c => {
    console.log(c)
  })
})
