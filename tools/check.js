#!/usr/bin/env node
/* 提交前校验：数据契约 + 样式完整性 + 页面引用 + 计数一致，并重建单文件版。
   用法：node tools/check.js  （失败退出码 1） */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const errors = [];
const notes = [];
const read = function (p) { return fs.readFileSync(path.join(root, p), 'utf8'); };

/* ---- 1. 数据文件语法与载入 ---- */
const src = read('effects.js');
try { new Function(src); } catch (e) { errors.push('effects.js 语法错误：' + e.message); }

const sandbox = { window: {}, document: { documentElement: { dataset: {} } } };
vm.createContext(sandbox);
try { vm.runInContext(src, sandbox); } catch (e) { errors.push('effects.js 执行失败：' + e.message); }

const EFFECTS = sandbox.window.EFFECTS || [];
const CATEGORIES = sandbox.window.CATEGORIES || [];
if (!EFFECTS.length) errors.push('EFFECTS 为空');
if (!CATEGORIES.length) errors.push('CATEGORIES 为空');

/* ---- 2. 字段与样式契约 ---- */
const REQUIRED = ['id', 'name', 'en', 'cat', 'def', 'keywords', 'params', 'stage', 'css', 'code', 'usage', 'note'];
const ids = new Set();
const cats = new Set(CATEGORIES.map(function (c) { return c.id; }));
const kfs = [];

EFFECTS.forEach(function (f) {
  REQUIRED.forEach(function (k) { if (!f[k]) errors.push(f.id + ' 缺少字段 ' + k); });
  if (ids.has(f.id)) errors.push('重复 id：' + f.id);
  ids.add(f.id);
  if (!cats.has(f.cat)) errors.push(f.id + ' 分类不存在：' + f.cat);
  if (!Array.isArray(f.variants)) errors.push(f.id + ' 缺少 variants');

  (f.params || []).forEach(function (p) {
    if (!p.k || !p.l) errors.push(f.id + ' 参数缺 k/l');
    if (p.min >= p.max) errors.push(f.id + ' 参数区间无效：' + p.k);
    if (f.css.indexOf('var(' + p.k) < 0) notes.push(f.id + ' ' + p.k + ' 由 JS 读取（CSS 未引用）');
  });

  const ob = (f.css.match(/{/g) || []).length;
  const cb = (f.css.match(/}/g) || []).length;
  if (ob !== cb) errors.push(f.id + ' CSS 花括号不平衡 ' + ob + '/' + cb);

  const cls = [...new Set([...f.stage.matchAll(/class="([^"]+)"/g)].flatMap(function (m) { return m[1].split(/\s+/); }))];
  cls.forEach(function (c) {
    if (f.css.indexOf('.' + c) < 0) errors.push(f.id + ' stage 类名无样式：.' + c);
  });

  (f.css.match(/@keyframes\s+([A-Za-z0-9_-]+)/g) || []).forEach(function (x) { kfs.push(x.split(/\s+/)[1]); });
});

const dupKf = [...new Set(kfs.filter(function (v, i) { return kfs.indexOf(v) !== i; }))];
if (dupKf.length) errors.push('重复 keyframes：' + dupKf.join('、'));

/* ---- 3. 页面：脚本语法与 DOM 引用 ---- */
const html = read('index.html');
[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(function (m, i) {
  try { new Function(m[1]); } catch (e) { errors.push('index.html 内联脚本 #' + i + ' 语法错误：' + e.message); }
});
const domIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map(function (m) { return m[1]; }));
/* 运行时创建的节点（如注入 <style id="fx-styles">）也要算作已存在 */
[...html.matchAll(/\bid\s*=\s*['"]([^'"]+)['"]/g)].forEach(function (m) { domIds.add(m[1]); });
[...html.matchAll(/getElementById\('([^']+)'\)/g)].forEach(function (m) {
  if (!domIds.has(m[1])) errors.push('index.html 引用了不存在的 id：' + m[1]);
});

/* ---- 4. 计数一致 ---- */
const readme = read('README.md');
const claim = readme.match(/\*\*(\d+) 个效果/);
if (claim && Number(claim[1]) !== EFFECTS.length) {
  errors.push('README 写的是 ' + claim[1] + ' 个效果，实际 ' + EFFECTS.length);
}
const gl = read('docs/GLOSSARY.md');
const glClaim = gl.match(/## 已收录（(\d+)）/);
if (glClaim && Number(glClaim[1]) !== EFFECTS.length) {
  errors.push('GLOSSARY 写的是 ' + glClaim[1] + ' 条，实际 ' + EFFECTS.length);
}

/* ---- 5. 重建单文件版 ---- */
if (!errors.length) {
  try {
    execFileSync(process.execPath, [path.join(root, 'tools/build-standalone.js')], { stdio: 'pipe' });
  } catch (e) {
    errors.push('构建 dist 失败：' + (e.stdout ? e.stdout.toString().trim() : e.message));
  }
}

/* ---- 输出 ---- */
if (notes.length) console.log('提示（不阻断）：\n  ' + notes.join('\n  '));
if (errors.length) {
  console.error('✗ 校验未通过，共 ' + errors.length + ' 项：\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log('✓ 校验通过：' + EFFECTS.length + ' 条效果 / ' + CATEGORIES.length + ' 个分类 / '
  + kfs.length + ' 个关键帧 · dist 已重建');
