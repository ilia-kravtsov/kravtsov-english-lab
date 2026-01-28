import fs from 'fs';
import path from 'path';

const rootDir = path.join(process.cwd(), 'src');
const outputFile = path.join(process.cwd(), 'project_snapshot.txt');
const maxDepth = 10;
const allowedExtensions = ['.ts', '.js', '.tsx'];

function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        return `Ошибка чтения: ${err.message}`;
    }
}

function traverse(dir, depth = 0) {
    if (depth > maxDepth) return '';

    let output = '';
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        if (item.name === 'node_modules' || item.name === '.git') continue;

        const fullPath = path.join(dir, item.name);
        const indent = '  '.repeat(depth);

        if (item.isDirectory()) {
            output += `${indent}[${item.name}]\n`;
            output += traverse(fullPath, depth + 1);
        } else {
            const ext = path.extname(item.name);
            if (!allowedExtensions.includes(ext)) continue;

            output += `${indent}- ${item.name}\n`;
            const content = readFileContent(fullPath);
            const fileIndent = '  '.repeat(depth + 1);
            output += `${fileIndent}=== Содержимое файла ===\n`;
            output += content
                .split('\n')
                .map(line => fileIndent + line)
                .join('\n');
            output += `\n${fileIndent}=== Конец файла ===\n\n`;
        }
    }

    return output;
}

const snapshot = traverse(rootDir);
fs.writeFileSync(outputFile, snapshot, 'utf-8');
console.log(`Готово! Структура и содержимое сохранены в ${outputFile}`);