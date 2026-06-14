# LX Music Mobile - 项目架构学习指南

## 项目简介

洛雪音乐助手 (LX Music) 移动端，基于 **React Native 0.73** + **TypeScript** 构建的音乐播放器，支持 Android 和 iOS。

- **React**: 18.2.0
- **React Native**: 0.73.11
- **导航方案**: react-native-navigation (Wix) v7.39.2
- **许可证**: Apache-2.0
- **作者**: lyswhut

## 项目目录结构

```
src/
├── app.ts              ← 启动入口，初始化顺序的核心
├── core/               ← 业务逻辑层（播放、搜索、同步等）
├── store/              ← 状态管理（自定义事件驱动，非 Redux）
├── screens/            ← 页面组件（Home、PlayDetail、SonglistDetail）
├── components/         ← 共享 UI 组件
├── event/              ← 自定义事件系统（状态变更通知机制）
├── navigation/         ← Wix react-native-navigation 配置
├── config/             ← 配置、默认设置、全局数据
├── plugins/            ← 播放器服务、存储、歌词、同步
├── utils/              ← 工具函数、musicSdk（各平台音乐源）
├── theme/              ← 主题系统
├── lang/               ← 国际化（zh-cn/zh-tw/en-us）
└── types/              ← TypeScript 类型定义
```

其他顶层目录：

| 目录 | 用途 |
|---|---|
| `android/` | Android 原生工程（Gradle） |
| `ios/` | iOS 原生工程（Xcode） |
| `publish/` | 发布脚本和版本元数据 |
| `.github/` | CI/CD 工作流（release、beta-pack、build-test） |

## 核心架构特点

### 1. 自定义状态管理

没有使用 Redux、MobX 等第三方库，而是自研了一套事件驱动的状态管理方案。每个 store 模块由三个文件组成：

- **`state.ts`** — 普通可变状态对象（单例）
- **`action.ts`** — 修改状态并触发事件的函数
- **`hook.ts`** — 订阅事件变更的 React Hooks

### 2. 事件系统

四个全局事件总线挂在 `global` 对象上：

| 事件总线 | 用途 |
|---|---|
| `global.state_event` | 状态变更通知 |
| `global.app_event` | 应用级事件 |
| `global.list_event` | 歌单相关事件 |
| `global.dislike_event` | 不喜欢列表事件 |

事件基类位于 `src/event/Event.ts`，提供 `on()`、`off()`、`emit()` 方法，使用 `setImmediate` 实现异步分发。

### 3. Wix Navigation（原生导航）

使用 `react-native-navigation` 而非 React Navigation，所有页面通过 `Navigation.registerComponent()` 注册，并包裹 `ThemeProvider`。

页面列表：

| 页面名 | 组件 | 用途 |
|---|---|---|
| `lxm.HomeScreen` | `Home` | 主页（含标签页） |
| `lxm.PlayDetailScreen` | `PlayDetail` | 播放详情页 |
| `lxm.SonglistDetailScreen` | `SonglistDetail` | 歌单详情页 |
| `lxm.CommentScreen` | `Comment` | 评论页 |
| `lxm.VersionModal` | `VersionModal` | 版本更新弹窗 |
| `lxm.PactModal` | `PactModal` | 协议弹窗 |
| `lxm.SyncModeModal` | `SyncModeModal` | 同步模式选择弹窗 |

### 4. 多音乐源

`src/utils/musicSdk/` 下实现了多个中国音乐平台的对接：

- `bd` — 百度音乐
- `kg` — 酷狗音乐
- `kw` — 酷我音乐
- `mg` — 咪咕音乐
- `tx` — QQ 音乐
- `wy` — 网易云音乐
- `xm` — 虾米音乐

### 5. 路径别名

`@/` 映射到 `./src/`，在 `babel.config.js` 和 `tsconfig.json` 中均有配置。

## 推荐学习路径

### 阶段 1：启动流程

**目标**：理解应用是怎么启动的，初始化了哪些模块。

**阅读顺序**：

1. `index.js` — 入口文件，加载 polyfill 后引入 `src/app.ts`
2. `src/app.ts` — 启动序列：错误处理 → 全局数据 → 导航初始化 → 核心初始化 → 推送首页
3. `src/core/init/index.ts` — 核心初始化流程：
   - `initSetting()` — 加载设置
   - `initTheme()` — 初始化主题
   - `initI18n()` — 初始化国际化
   - `initUserApi()` — 初始化用户 API
   - `setApiSource()` — 配置音乐源
   - `registerPlaybackService()` — 注册播放服务
   - `initPlayer()` — 初始化播放器
   - `dataInit()` — 初始化数据（歌单等）
   - `initCommonState()` — 初始化通用状态
   - `initSync()` — 初始化同步（异步，非阻塞）

### 阶段 2：事件系统

**目标**：理解整个状态管理的基石。

**阅读顺序**：

1. `src/event/Event.ts` — 基础 EventEmitter 类，理解 `on/off/emit` 机制
2. `src/event/stateEvent.ts` — 类型化的 StateEvent，了解有哪些状态变更事件
3. `src/event/appEvent.ts` — 应用级事件
4. `src/event/listEvent.ts` — 歌单事件
5. `src/event/dislikeEvent.ts` — 不喜欢列表事件

### 阶段 3：Store 模式

**目标**：理解 state/action/hook 三件套的工作方式。

**建议从 `src/store/player/` 开始**（播放器状态最直观）：

1. `state.ts` — 看有哪些状态字段（播放状态、音乐信息、进度、音量等）
2. `action.ts` — 看怎么修改状态并触发事件
3. `hook.ts` — 看 React 组件怎么订阅状态变更

理解一个模块后，其他模块（`list/`、`search/`、`setting/`、`theme/` 等）都是同样的套路。

**Store 模块一览**：

| 模块 | 用途 |
|---|---|
| `common/` | 字体大小、状态栏高度、组件 ID 等 |
| `player/` | 播放状态、音乐信息、进度、音量 |
| `list/` | 所有歌单（默认、收藏、临时、用户歌单） |
| `search/` | 搜索状态 |
| `setting/` | 应用设置 |
| `theme/` | 主题状态（含 React Context） |
| `leaderboard/` | 排行榜状态 |
| `songlist/` | 歌单广场状态 |
| `sync/` | 同步状态 |
| `version/` | 版本信息、下载进度 |
| `dislikeList/` | 不喜欢列表 |
| `hotSearch/` | 热搜状态 |
| `userApi/` | 用户 API 状态 |

### 阶段 4：页面结构

**目标**：看主页面怎么组合组件、怎么消费 store。

**阅读顺序**：

1. `src/screens/Home/index.tsx` — 主页入口
2. `src/screens/Home/Vertical.tsx` / `Horizontal.tsx` — 竖屏/横屏布局
3. `src/screens/Home/Header.tsx` — 顶部导航栏
4. `src/screens/Home/Vertical/DrawerNav.tsx` — 抽屉导航
5. `src/navigation/registerScreens.tsx` — 页面注册流程

Home 页面包含 5 个标签页：搜索、歌单广场、排行榜、我的列表、设置。

### 阶段 5：播放核心

**目标**：理解音乐播放的实际逻辑。

**阅读顺序**：

1. `src/core/player/` — 播放器业务逻辑
2. `src/plugins/trackPlayer.ts` — 播放器服务（基于 react-native-track-player）
3. `src/plugins/lyric.ts` — 歌词处理
4. `src/store/player/` — 播放器状态管理

### 阶段 6：音乐源

**目标**：理解搜索、获取歌曲 URL 等平台对接逻辑。

**阅读顺序**：

1. `src/utils/musicSdk/api-source.js` — API 源管理
2. `src/utils/musicSdk/wy/` — 以网易云为例，看一个平台的完整实现
3. 其他平台按需阅读

## 关键依赖

| 依赖 | 用途 |
|---|---|
| `react-native-navigation` | Wix 原生导航 |
| `react-native-track-player` | 音乐播放（作者 fork） |
| `react-native-pager-view` | 可滑动页面视图 |
| `react-native-fs` | 文件系统访问 |
| `@react-native-async-storage/async-storage` | 持久化键值存储 |
| `lrc-file-parser` | LRC 歌词解析 |
| `pako` | zlib 压缩/解压 |
| `react-native-vector-icons` | 图标库 |

## 常用命令

```bash
npm run dev          # Android 开发构建
npm run ios          # iOS 开发构建
npm run start        # 启动 Metro 打包器
npm run pack:android # Android Release 构建
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
npm run build:theme  # 生成主题文件
```

## 路径别名

```typescript
// tsconfig.json & babel.config.js
"@/*" → "./src/*"

// 示例
import { init } from '@/core/init'  // → src/core/init
```
