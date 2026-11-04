# 动效术语表 · GLOSSARY

这份表是「AI 能听懂」的底座：只要说出左列任一个词，就应直接对应到一个实现，不需要再解释"它长什么样"。

## 已收录（24）

| 中文标准名 | 英文标准名 | 分类 | 常用触发词 | 一句话 |
|---|---|---|---|---|
| 边缘流光 | Edge Glow Sweep | 光效 | 流光边框 / 跑马灯边框 / edge glow | 锥形渐变沿描边循环扫过 + 外发光 |
| 聚光跟随 | Cursor Spotlight | 光效 | 聚光灯 / 光斑跟随 / 手电筒 / spotlight | 径向光斑跟随指针局部提亮 |
| 扫光 | Shine Sweep | 光效 | 高光扫过 / 反光 / shine / glare | 斜向高光带周期掠过表面 |
| 呼吸光 | Breathing Glow | 光效 | 光晕呼吸 / 脉冲光 / pulse glow | 光晕按呼吸节奏增强减弱 |
| 玻璃拟态 | Glassmorphism | 材质 | 毛玻璃 / 磨砂玻璃 / backdrop blur | 半透明面板 + 背景模糊 + 1px 亮边 |
| 噪点颗粒 | Film Grain | 材质 | 胶片颗粒 / 噪点纹理 / grain / noise | 高频噪点叠在渐变上，去色带增质感 |
| 液态金属 | Liquid Metal | 材质 | 水银 / 铬 / chrome / metallic | 灰阶锥形渐变旋转出流动金属高光 |
| 极光流体 | Aurora Flow | 环境 | 流体渐变 / 光雾 / mesh gradient | 模糊色团在暗底漂移，screen 叠成光雾 |
| 粒子场 | Particle Field | 环境 | 星尘 / 漂浮光点 / particles | 微光点上浮明灭，制造空间深度 |
| 3D 倾斜 | 3D Tilt | 形变 | 3D 卡片 / 视差倾斜 / hover tilt | 卡片跟指针小角度旋转，内层 translateZ |
| 磁吸按钮 | Magnetic Button | 形变 | 吸附跟随 / magnet hover | 指针靠近时按钮位移，离开回弹 |
| 挤压拉伸 | Squash & Stretch | 形变 | 挤压 / 拉伸 / squash | 运动时拉长、撞击时压扁，伪造重量 |
| 交错入场 | Stagger In | 运动 | 错峰入场 / 依次出现 / stagger | 同组元素按序上浮淡入 |
| 弹簧回弹 | Spring Bounce | 运动 | 弹性 / Q 弹 / bounce | 越过目标点再回弹，配合挤压 |
| 视差滚动 | Parallax Scroll | 运动 | 层移 / 滚动视差 / parallax | 前后景按不同速率随滚动位移 |
| 打字机 | Typewriter | 文字 | 打字效果 / 逐字打印 / typing | 按字符逐格显示 + 闪烁光标 |
| 逐字浮现 | Character Reveal | 文字 | 文字上浮 / 遮罩揭示 / mask reveal | 每字从遮罩下方升起并去模糊 |
| 数字滚动 | Count Up | 文字 | 数字跳动 / 计数动画 / count up | 数值从 0 递增，末段减速停住 |
| 遮罩擦除 | Mask Wipe | 转场 | 擦除转场 / 推屏 / clip-path | 新画面以 clip-path 从一侧推开旧画面 |
| 缩放推进 | Zoom Push | 转场 | 推近 / 镜头推进 / zoom transition | 旧页放大淡出，新页从近处缩小落位 |
| 圆形扩散 | Circle Reveal | 转场 | 圆形揭示 / circular reveal | 圆形遮罩从触发点扩张铺满 |
| 涟漪 | Ripple | 交互反馈 | 水波纹 / 点击扩散 / click wave | 点击点扩散渐隐圆环 |
| 按压下沉 | Press Down | 交互反馈 | 按下 / 按钮反馈 / tactile | 按下时下移、硬阴影收紧 |
| 骨架屏微光 | Shimmer | 交互反馈 | 加载占位 / 流光占位 / skeleton | 占位灰块上一道高光匀速掠过 |

## 待收录

**光效**：霓虹脉冲 · 体积光 · 光晕溢出（bloom）· 描边高亮 · 星光闪烁
**材质**：金属拉丝 · 拟物浮雕（neumorphism）· 纸张质感 · 玻璃折射（refraction）
**形变**：果冻形变（jelly）· 液态融合（gooey）· 卡片翻转（flip）· 折叠展开 · 形状变形（morph）· 弹性跟随
**运动**：缓动曲线对比（easing）· 滚动驱动（scroll-driven）· 惯性滚动 · 跟随延迟（lag）· 呼吸缩放 · 拖拽回弹（drag snap）
**文字**：描边绘制（svg stroke）· 拆字散落 · 文字遮罩图（text clip image）· 逐词浮现 · 文字挤压
**转场**：共享元素（shared element）· 斜切擦除 · 故障转场（glitch）· 液体过渡
**交互反馈**：悬停浮起（hover lift）· 鼠标拖尾 · 进度描边 · 长按充能
**环境**：噪波流动（noise flow）· 网格线动画 · 星空 · 光斑扫过 · 景深虚化

> 新增词条时，先判断它是"一种新效果"还是"已有效果的参数变体"。变体写进 `variants`，不要新建一条。
