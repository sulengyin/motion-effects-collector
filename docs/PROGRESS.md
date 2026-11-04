# 进度 · PROGRESS

## 2026-11-04 · 页面自身的动效层（视觉打磨）

**目标**：页面外壳不能只是"静态陈列 24 个会动的卡片"，自身的节奏也要立住。

**动的东西**
- 背景：三团径向光缓慢漂移（26s，`alternate`），替代原来静止的固定渐变。仅此一处持续动画，避免抢卡片注意力。
- 首屏编排：顶栏下滑 8px 淡入 → 分类逐条左移入场（26ms 间隔）→ 卡片按行错峰上升（32ms 间隔，最多 9 档）→ 底部投喂区延后 120ms 进入。
- 卡片：鼠标位置驱动的柔光（`--mx/--my` + radial-gradient，rAF 节流）、悬停抬升 4px、点阵背景随悬停位移 7px、"调参 ↗"右移。
- 分类：悬停右移 2px，选中点弹入。
- 弹窗：遮罩淡入 + 面板 0.46s 减速入场，右侧内容与参数滑杆分 5 档错峰；关闭改为 170ms 淡出后再 `hidden`（原来瞬间消失）。
- 细节：顶栏滚动后加重阴影；切换主题时 480ms 颜色过渡；数量变化时数字轻弹。

**约束**
- 所有页面动画统一用 `--e-out: cubic-bezier(.22,1,.36,1)`，卡片悬停 420ms、入场 600ms，节奏一致。
- 新动画统一 `ui-` 前缀，避免与 24 个效果里已有的 `spin` / `fade-up` / `rise` 撞名（`spin` 已重命名为 `ui-mark-spin`）。
- 入场动画用 `animation-fill-mode: backwards`（不是 `forwards`），结束后自动归还 `transform`，否则 `:hover` 抬升会失效——这是个容易踩的坑。
- 「暂停动效」现在同时冻结背景光场；`prefers-reduced-motion` 下所有页面动画关闭、悬停位移取消。

## 2026-11-04 · 新增单文件版（分享用）

**问题**：`index.html` 用 `<script src="effects.js">` 取数据，单独发 HTML 给对方会得到空页面。

**方案**：`tools/build-standalone.js` 把数据内联成 `dist/motion-lexicon.html`（86KB，零外部引用）。

**坑**：`effects.js` 里含有展示给用户的代码片段，其中 5 处 `</script>` 会在内联时被 HTML 解析器当成脚本结束标签，直接截断整个数据块。构建脚本统一转义为 `<\/script`（JS 字符串里等价），运行时还原正确。

**校验**：产物含 2 个内联脚本块，分别 `new Function()` 语法通过；vm 中加载数据块得到 24 条效果；无 `<script src=` / `<link href=`；转义后字符串值仍为 `</script>`。

## 2026-11-04 · 发布到 GitHub

- 仓库：https://github.com/sulengyin/motion-effects-collector （Public，默认分支 `main`）
- 首次推送：`55157d3` — 8 个文件（`index.html` / `effects.js` / `README.md` / `.gitignore` / `docs/` ×3 / `inbox/`）
- `inbox/` 保留目录占位，视频、截图等原始素材不入库，避免仓库随时间膨胀
- Pages 尚未开启：Settings → Pages → Source 选 `Deploy from a branch` → `main` / `/ (root)` → Save，之后地址为 https://sulengyin.github.io/motion-effects-collector/

## 2026-11-04 · 修复：卡片完全不动

**现象**：用户反馈"看不到动态效果"。

**根因**：`fx.css` 从未被写入页面。`mountInto()` 只把 `fx.stage` 塞进 `.stage`，但没有任何地方把各效果的 CSS 注入 `<head>`——所有卡片只有裸 HTML，没有定位、没有 `@keyframes`，因此完全静止。

**修复**
- 新增 `injectStyles()`：启动时把 24 条 `css` 合并注入一个 `<style id="fx-styles">`，`render()` 之前调用（只注入一次）。
- 去掉"系统偏好 `prefers-reduced-motion` 时自动暂停"的逻辑。动效展示站的第一帧必须是动的；需要静止的场景由右上角「暂停动效」手动控制。

**新增校验**
- 每条效果 `stage` 里出现的类名，必须在该效果的 `css` 中有对应规则（本次 24 条全部命中，合并后 16.7KB / 165 条规则）。
- 预览服务 `GET /effects.js` 返回 200，磁盘与线上字节数一致（无缓存问题）。

**教训**：数据驱动渲染里，"数据里有 css 字段"不等于"样式已生效"。这类缺陷编译期查不出，必须有一条"类名 ↔ 规则"的机械校验兜底。

## 2026-11-04 · P2 完成（12 → 24）

**新增 12 条**
扫光 · 呼吸光 · 噪点颗粒 · 液态金属 · 挤压拉伸 · 视差滚动 · 数字滚动 · 缩放推进 · 圆形扩散 · 按压下沉 · 骨架屏微光 · 粒子场

**分布**：光效 4 / 材质 3 / 形变 3 / 运动 3 / 文字 3 / 转场 3 / 交互反馈 3 / 环境 2 —— 每类都有可横向对比的样本。

**同期改动**
- 画廊按分类排序（同类连续），不再按录入顺序杂乱排列。
- 粒子场的点阵由 `particleHTML(n)` 确定性生成，避免每次渲染跳位。

**验证记录**
- `node --check` 通过；24 条数据字段完整、id 唯一、分类有效、CSS 花括号平衡。
- 20 个 keyframes 全部唯一，无跨效果命名冲突。
- 三条参数仅由 JS 读取（`--tl-max` / `--mg-strength` / `--cu-dur`），CSS 中不出现 `var()`，属预期。
- **未执行**：浏览器实机截图、滚动视差与粒子在低端机上的帧率（环境无 Chromium）。

**已知限制**
- 视差卡片内部是独立滚动容器，外层滚轮不会带动它，只能在内层滚（卡片自带自动滚动演示）。

## 2026-11-04 · P1 完成

**已交付**
- `index.html`：画廊（12 效果 / 8 分类）、实时预览、关键词搜索（中/英/触发词）、分类筛选、调参弹窗、复制代码、深浅色切换、暂停动效。
- `effects.js`：12 条效果数据，覆盖 8 个分类。
- `docs/SCHEMA.md`、`docs/GLOSSARY.md`（含 40+ 待收录词）、`README.md`。

**验证记录**
- `node --check effects.js` 通过；内联脚本 `new Function()` 解析通过。
- 数据校验脚本：字段完整、id 唯一、分类有效、CSS 花括号平衡、keyframes 9 个全唯一。
- 两条参数（`--tl-max`、`--mg-strength`）由 `mount` 通过 `getComputedStyle` 读取，CSS 中不出现 `var()`，属预期。
- **未执行**：浏览器实机截图与帧率测量（当前环境无 Chromium / 无 GPU 采集），需要你在预览面板确认视觉效果。

**已知限制**
- 交互类效果（聚光、3D 倾斜、磁吸、涟漪）在触屏设备上只能点击，无 hover 过程。
- 涟漪卡片的预览区拦截了点击冒泡，进详情需点右下角「调参 ↗」。

## 下一步

- P2：按 `GLOSSARY.md` 待收录顺序扩到 36 条，每类补齐到 4–5 条。
- P2：加「相似效果对比」——同一张卡里并排两个缓动，用于选型。
- P3：投喂管线跑通 1 次真实输入（你发一句话或视频），把解析结果反向校准 SCHEMA。
- P4：移动端实测、性能（低端机 blur/filter 降级）、可选发布在线链接。

## 校验命令

```bash
node --check effects.js
node -e "const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('effects.js','utf8'),c);console.log(c.window.EFFECTS.length+' effects')"
```
