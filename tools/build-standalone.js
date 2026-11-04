#!/usr/bin/env node
/* 把 index.html + effects.js 打成单文件 HTML，便于直接发送给别人。
 * 用法：node tools/build-standalone.js
 * 产物：dist/motion-lexicon.html
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const dataPath = path.join(root, 'effects.js');
const outDir = path.join(root, 'dist');
const outPath = path.join(outDir, 'motion-lexicon.html');

let html = fs.readFileSync(htmlPath, 'utf8');
let data = fs.readFileSync(dataPath, 'utf8');

// effects.js 里有被展示给用户的代码片段，里面含有 </script>。
// 内联进 HTML 前必须转义，否则浏览器会在此处提前结束脚本。
const rawClosers = (data.match(/<\/script/gi) || []).length;
data = data.replace(/<\/script/gi, '<\\/script');

const tag = '<script src="effects.js"></script>';
if (html.indexOf(tag) === -1) {
  console.error('未找到 <script src="effects.js"></script>，index.html 结构可能已变');
  process.exit(1);
}

html = html.replace(tag, '<script>\n' + data + '\n</script>');

// 单文件版不应再有任何外部引用
if (/<script[^>]+src=/i.test(html) || /<link[^>]+href=/i.test(html)) {
  console.error('产物仍含外部引用，请检查 index.html');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');

const closers = (html.match(/<\/script>/gi) || []).length;
console.log('已生成 ' + path.relative(root, outPath));
console.log('  体积 ' + (Buffer.byteLength(html) / 1024).toFixed(1) + 'KB');
console.log('  转义 </script> ' + rawClosers + ' 处');
console.log('  真实 script 闭合标签 ' + closers + ' 个（应为 2）');
