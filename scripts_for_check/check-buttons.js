#!/usr/bin/env node
// Simple scanner to find <button> tags missing onClick (excluding submit)
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const exts = ['.js', '.jsx', '.ts', '.tsx'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat && stat.isDirectory()) {
      if (file === 'node_modules' || file.startsWith('.')) continue;
      results = results.concat(walk(fp));
    } else {
      if (exts.includes(path.extname(fp))) results.push(fp);
    }
  }
  return results;
}

if (!fs.existsSync(root)) {
  console.error('src directory not found:', root);
  process.exit(1);
}

const files = walk(root);
const report = [];

files.forEach(fp => {
  const content = fs.readFileSync(fp, 'utf8');
  const regex = /<button\b([\s\S]*?)>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const tag = '<button' + match[1] + '>';
    const hasOnClick = /onClick\s*=\s*[{\"]/.test(tag);
    const isSubmit = /type\s*=\s*['\"]?submit['\"]?/.test(tag);
    const start = match.index;
    const line = content.substring(0, start).split('\n').length;
    if (!hasOnClick && !isSubmit) {
      report.push({ file: path.relative(process.cwd(), fp), line, tag: tag.replace(/\s+/g, ' ').trim() });
    }
  }
});

const outPath = path.join(process.cwd(), 'button-report.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (report.length === 0) {
  console.log('✅ No <button> tags missing onClick (excluding submit) found.');
} else {
  console.log(`⚠️ Found ${report.length} button(s) missing onClick (excluding submit).`);
  console.log(`Report written to ${outPath}`);
  report.forEach(r => console.log(`${r.file}:${r.line} -> ${r.tag}`));
}
