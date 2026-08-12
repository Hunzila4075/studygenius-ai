const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.ts')) {
            callback(dirPath);
        }
    });
}

walkDir(path.join(__dirname, 'server', 'src'), (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    const updated = content.replace(/from\s+['"](\.\.?\/[^'"]+?)['"]/g, (match, p1) => {
        if (!p1.endsWith('.js') && !p1.endsWith('.json')) {
            return `from '${p1}.js'`;
        }
        return match;
    });

    if (content !== updated) {
        fs.writeFileSync(filePath, updated, 'utf8');
        console.log(`Fixed: ${path.relative(__dirname, filePath)}`);
    }
});
console.log('Done!');
