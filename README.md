# 动效收集器 · Motion Lexicon

> 一句话描述 → 一个可运行、可调参、可复制的动效。

一个**动效术语字典 + 实时演示台 + 可累积的知识库**。核心不是收集素材，而是建立「中文术语 → AI 触发词 → 可运行代码」的三向映射：说出"边缘流光"，就能拿到对应的实现，不需要再解释它长什么样。

当前收录 **42 个效果 / 9 个分类**。

## 快速开始

```bash
git clone git@github.com:sulengyin/motion-effects-collector.git
cd motion-effects-collector
open index.html      # macOS；Windows 双击，Linux 用 xdg-open
```

无需构建、无需联网、无依赖。单个 HTML + 单个数据文件。

支持：关键词搜索（中文名 / 英文名 / 口语别名）、分类筛选、实时调参、一键复制代码、深浅色切换、暂停动效。页面自身也带一层克制的动效（错峰入场、光标柔光、弹窗分层进入），并遵循 `prefers-reduced-motion`。

## 分享给别人

`index.html` 通过 `<script src="effects.js">` 读数据，**单独发这一个文件对方只会看到空页面**。两种正确方式：

1. **发单文件版**（推荐，微信/邮件都能直接传）
   直接用 `dist/motion-lexicon.html`，已把数据内联进去，双击即开。
   数据更新后重新生成：
   ```bash
   node tools/build-standalone.js
   ```
2. **发整个文件夹**（或用 GitHub Pages 链接）
   `index.html` + `effects.js` 放在同一目录即可，`file://` 直接打开也能跑。

## 目录结构

```
.
├── index.html          页面外壳：画廊、搜索、分类、调参弹窗、复制代码
├── effects.js          唯一需要改的数据文件（42 条效果）
├── dist/
│   └── motion-lexicon.html  单文件版：数据已内联，可直接发给别人
├── tools/
│   ├── build-standalone.js  生成单文件版的脚本
│   └── check.js             提交前校验：字段 / 样式 / 引用 / 计数，并重建 dist
├── docs/
│   ├── SCHEMA.md       单条效果的字段规范（新增必须照此写）
│   ├── GLOSSARY.md     术语表：已收录 42 条 + 待收录清单
│   ├── SOURCES.md      采集计划：源分层、采集卡、去重规则、下一批队列
│   ├── PROGRESS.md     进度、验证记录、踩过的坑
│   └── CONVENTIONS.md  分支、提交、结构、敏感信息、协作约定
├── inbox/              投喂原料存放处（视频/截图默认不进仓库）
├── .gitignore
├── LICENSE             MIT
└── README.md
```

## 分类

| 分类 | 数量 | 已收录 |
|---|---|---|
| 光效 Light | 4 | 边缘流光、聚光跟随、扫光、呼吸光 |
| 材质 Material | 3 | 玻璃拟态、噪点颗粒、液态金属 |
| 形变 Transform | 3 | 3D 倾斜、磁吸按钮、挤压拉伸 |
| 运动 Motion | 2 | 交错入场、弹簧回弹 |
| 滚动 Scroll | 6 | 视差滚动、滚动进度、粘性堆叠、横向吸附、滚动缩放、回到顶部 |
| 文字 Text | 3 | 打字机、逐字浮现、数字滚动 |
| 转场 Transition | 9 | 遮罩擦除、缩放推进、圆形扩散、共享元素、卡片展开、横向推入、叠化转场、数字翻滚、轻提示进出 |
| 交互反馈 Feedback | 10 | 涟漪、按压下沉、骨架屏微光、下拉刷新、长按展开、滑动删除、底部弹层、指示器滑动、成功对勾、错误抖动 |
| 环境 Ambient | 2 | 极光流体、粒子场 |

## 新增一个效果

只改 `effects.js`，`index.html` 不用动。在 `EFFECTS` 数组末尾追加一条：

```js
{
  id: 'your-effect',            // 唯一，kebab-case
  name: '中文标准名',            // 用户会直接说的词
  en: 'English Name',
  cat: 'light',                 // 必须是 CATEGORIES 里的 id
  def: '一句话说清"看起来是什么 + 用在哪"',
  keywords: ['中文别名', 'english alias', '口语说法'],
  params: [                     // 映射到 CSS 变量，弹窗里直接出滑杆
    { k: '--yx-dur', l: '周期', min: 1, max: 8, step: 0.1, v: 3, u: 's' }
  ],
  stage: '<div class="yx-box">…</div>',   // 预览 HTML
  css: `.yx-box{ … }`,                    // 只作用于该效果的类名
  code: `…`,                              // 用户真正会复制走的精简代码
  usage: '适用场景',
  note: '实现要点 / 常见坑',
  variants: ['变体 A', '变体 B'],
  mount: function (el) {                  // 可选：指针/点击交互
    return function () { /* 必须清理监听器与定时器 */ };
  }
}
```

细节与硬性约束见 [`docs/SCHEMA.md`](docs/SCHEMA.md)。

## 投喂流程

把一句话、一张截图或一段视频发过来，我会按固定动作处理：

**识别 → 归类 → 中英命名 → 拆参数 → 写实现 → 归档**

归档时会同步更新 `effects.js`、`docs/GLOSSARY.md`、`docs/PROGRESS.md`。不确定叫什么也没关系，描述"它看起来像什么"即可。

## 设计约定

- 预览一律在深色画布 `#0a0c11` 上设计，页面切浅色不改变画布。
- 每个效果的类名、`@keyframes` 都带独立前缀，避免全局污染。
- 动效只用 `transform` / `opacity` / `clip-path`，不触发布局重排。
- 不引外部字体、CDN、图片，断网可用。

## 许可

[MIT](LICENSE)。代码可自由使用、修改、分发，保留版权声明即可。

新增或修改效果前，请先看 [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md)；提交前跑 `node tools/check.js`，它会校验字段、样式、引用与计数，并重建单文件版。
