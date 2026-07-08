const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/College/Project/Legacy OS/frontend/app/dashboard');
files.push('c:/College/Project/Legacy OS/frontend/components/LegacyOSDashboard.jsx');

let replacedFiles = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let changed = false;
  for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('Memories') && lines[i].includes('/dashboard/search')) {
      lines[i] = lines[i].replace(/\/dashboard\/search/g, '/dashboard/memories');
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log('Updated', file);
    replacedFiles++;
  }
});
console.log('Total files updated:', replacedFiles);
