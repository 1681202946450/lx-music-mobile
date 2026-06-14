根据对项目架构的深入分析，以下是从零学习这个项目的推荐阅读路线：

---

## 推荐阅读路线

### 第一阶段：理解启动流程（从入口到渲染）

按顺序阅读这些文件，理解 App 从 Android 启动到界面渲染的全过程：

1. **[index.js](file:///Users/wzy/demo/github/lx-music-mobile/index.js)** — JS 入口，导入 shim 和 app.ts
2. **[src/app.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/app.ts)** — 应用主逻辑，调用初始化和导航设置
3. **[src/navigation/registerScreens.tsx](file:///Users/wzy/demo/github/lx-music-mobile/src/navigation/registerScreens.tsx)** — 注册所有屏幕组件
4. **[src/navigation/index.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/navigation/index.ts)** — 导航初始化，设置默认选项
5. **[src/core/init/index.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/core/init/index.ts)** — 核心初始化流程（设置→主题→语言→播放器→数据→推入主屏幕）

### 第二阶段：理解事件系统（组件间通信的基石）

6. **[src/event/Event.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/event/Event.ts)** — 基础发布/订阅事件类
7. **[src/event/appEvent.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/event/appEvent.ts)** — 应用级事件（播放、暂停、歌词更新等）

### 第三阶段：理解核心业务层

8. **[src/core/common.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/core/common.ts)** — 通用工具（退出、语言、字体等）
9. **[src/core/music/index.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/core/music/index.ts)** — 音乐数据统一接口（在线/下载/本地三种来源）
10. **[src/core/player/player.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/core/player/player.ts)** — 播放器核心（播放、暂停、切歌、获取URL/图片/歌词）
11. **[src/core/list.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/core/list.ts)** — 列表管理（增删改查、移动）
12. **[src/core/search/search.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/core/search/search.ts)** — 搜索模块

### 第四阶段：理解播放器插件（桥接层）

13. **[src/plugins/player/index.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/plugins/player/index.ts)** — 对 `react-native-track-player` 的封装，是核心播放逻辑与原生播放器的桥梁

### 第五阶段：理解 UI 层

14. **[src/screens/Home/index.tsx](file:///Users/wzy/demo/github/lx-music-mobile/src/screens/Home/index.tsx)** — 主屏幕，根据设置选择竖屏/横屏布局
15. **[src/screens/Home/Vertical/index.tsx](file:///Users/wzy/demo/github/lx-music-mobile/src/screens/Home/Vertical/index.tsx)** — 竖屏布局
16. **[src/components/player/PlayerBar/index.tsx](file:///Users/wzy/demo/github/lx-music-mobile/src/components/player/PlayerBar/index.tsx)** — 底部播放条组件
17. **[src/navigation/navigation.ts](file:///Users/wzy/demo/github/lx-music-mobile/src/navigation/navigation.ts)** — 导航工具函数（push 各屏幕）

---

## 架构总览

```
Android 原生层 (MainActivity → MainApplication)
    ↓ 加载 JS Bundle
index.js → src/app.ts
    ↓ 注册屏幕 + 初始化
navigation/ (屏幕注册) + core/init/ (业务初始化)
    ↓ 事件驱动
Event ← appEvent ←→ core/ (player, music, list, search)
    ↓                    ↑
UI 层 (screens/)    plugins/ (桥接原生播放器)
```

核心设计思路：**事件驱动**。`Event` 发布/订阅是整个应用的通信骨架，UI 层监听事件更新状态，业务层触发事件通知变化。建议从启动流程开始，顺着初始化链路往下看，就能逐步理解整个项目。
