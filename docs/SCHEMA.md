# 效果数据规范（SCHEMA）

`effects.js` 中每条效果的唯一契约。新增效果必须满足以下字段，缺一不可，否则不会正确渲染。

```js
{
  id: 'edge-glow',            // 唯一，kebab-case，同时是 DOM 定位键
  name: '边缘流光',            // 中文标准名（用户会直接说这个词）
  en: 'Edge Glow Sweep',      // 英文标准名（写进代码注释、给 AI 用）
  cat: 'light',               // 必须是 CATEGORIES 里的 id
  def: '一句话定义……',         // 说清"看起来是什么 + 用在哪"
  keywords: ['边缘流光', '流光边框', 'edge glow', 'border sweep'],
                              // 同义词 + 英文 + 口语说法；搜索和 AI 识别都靠它
  params: [                   // 0~4 个，必须映射到 CSS 变量
    { k: '--eg-dur', l: '流动周期', min: 1, max: 8, step: 0.1, v: 4, u: 's' }
  ],
  stage: '<div class="eg-wrap">…</div>',  // 预览 HTML，只用该类效果自己的类名
  css: `…`,                   // 该效果的 CSS，keyframes 名字必须带前缀且全局唯一
  code: `…`,                  // 用户真正会复制走的精简代码（HTML+CSS，可含 <script>）
  usage: '适用场景',           // 一两句
  note: '实现要点 / 常见坑',     // 写"为什么这样做"，不是复述代码
  variants: ['变体 A', '变体 B'],   // 可选，指向未来可扩展的方向
  mount: function (el) {      // 可选，需要指针/点击交互时写
    // 操作 el 内部节点，可读 getComputedStyle(el) 上的 CSS 变量
    return function () { /* 清理监听器与定时器 */ };
  }
}
```

## 硬性约束

1. **类名隔离**：每个效果的类名带两字母前缀（`eg-` / `sp-` / `gl-` …），不得使用通用名。
2. **keyframes 唯一**：名称带前缀（`eg-spin`），全局只注入一次，重名会互相覆盖。
3. **params 必须被 CSS 或 mount 读取**：写了参数却没人用，是假参数。
4. **mount 必须返回清理函数**：切换分类/搜索会重建 DOM，不清理会导致监听器与定时器泄漏（涟漪的自动波纹会越积越多）。
5. **深色画布**：预览一律在 `#0a0c11` 上设计，页面浅色主题不改变画布。
6. **不依赖网络**：不引外部字体、CDN、图片。
7. **动效必须可暂停**：仅靠 CSS `animation` 实现，或 JS 循环里检查 `document.documentElement.dataset.paused`。

## 命名规范

- 中文名用行业通用叫法，不用自创词（"边缘流光"而不是"发光边框动画"）。
- `keywords` 至少覆盖三类：中文别名、英文标准名、口语描述。
- `cat` 选最贴近的视觉来源，不按实现方式归类。

## 归档动作（每次新增后）

1. `effects.js` 追加一条。
2. `docs/GLOSSARY.md` 从「待收录」移到「已收录」，补一行关键词。
3. `docs/PROGRESS.md` 记一条：加了什么、为什么、还有什么没做。
4. 跑一次数据校验（见 PROGRESS 里的命令），确认字段完整、keyframes 不重复。
