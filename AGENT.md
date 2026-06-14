# CLAUDE.md

## 项目概况

这是一个基于 React Native 0.73 的音乐播放器 App（LX Music 移动版），目前仅支持 Android 平台。项目使用 TypeScript + Redux 架构，适合用来学习 React Native 的完整开发流程。

## 角色定位

用户正在通过这个项目学习 React Native 开发。AI Agent 的角色是**技术导师**：
- 用通俗易懂的语言解释代码的含义和设计意图
- 当用户问到某段代码时，先解释它做了什么，再说明它在 React Native 生命周期中的位置
- 对比 Web 前端（React）与 React Native 的异同，帮助用户建立知识迁移
- 遇到 RN 特有的概念（Native Modules、Bridge、Metro bundler 等）时主动解释

## 命令

### 日常开发
```bash
npm start          # 启动 Metro 开发服务器
npm run dev        # 启动 Metro + 编译运行 Android
npm run ios        # 启动 Metro + 编译运行 iOS（当前不可用）
npm run sc         # 清除缓存启动 Metro
npm run menu       # 在模拟器上打开 RN 开发者菜单
npm run lint       # ESLint 检查
npm run rd         # 启动 React DevTools
```

### APK 构建
```bash
npm run bundle-android        # 打包 JS bundle 到 Android assets
npm run build-test            # 构建测试 bundle
npm run pack:android:debug    # Gradle 编译 debug APK
npm run pack:android          # Gradle 编译 release APK
npm run clear                 # Gradle clean
```

### 本地环境关键变量
```
ANDROID_HOME=~/Library/Android/sdk
ANDROID_SDK_ROOT=~/Library/Android/sdk
```

## 技术栈速览

| 技术 | 用途 |
|------|------|
| React Native 0.73 | 跨平台移动端框架 |
| TypeScript | 类型安全 |
| Redux | 全局状态管理（`src/store/`） |
| react-native-navigation v7 | 多屏导航（非 react-navigation） |
| react-native-track-player | 音频播放 |
| Metro | JS bundler（RN 专用） |
| Gradle | Android 编译系统 |

## 项目结构

```
lx-music-mobile/
├── index.js                 # RN 入口，注册根组件
├── src/
│   ├── app.ts               # 应用初始化：加载字体、监听事件、启动导航
│   ├── navigation/          # 导航配置（react-native-navigation）
│   ├── screens/             # 各个页面/屏幕组件
│   ├── components/          # 可复用 UI 组件
│   ├── store/               # Redux store、action、reducer
│   ├── config/              # 全局常量与配置
│   ├── core/                # 核心业务逻辑
│   ├── utils/               # 工具函数
│   ├── theme/               # 主题/皮肤管理
│   ├── lang/                # 国际化语言包
│   ├── types/               # TypeScript 类型声明
│   ├── event/               # 事件总线程相关
│   ├── resources/           # 资源文件
│   └── plugins/             # 插件系统
├── android/                 # Android 原生工程（Gradle 配置、Java/Kotlin 代码）
├── metro.config.js          # Metro bundler 配置
├── babel.config.js          # Babel 配置（含路径别名 @ → src/）
├── tsconfig.json            # TypeScript 配置
└── DEV_GUIDE.md             # 本机开发环境指南
```

## 架构要点

### 1. 入口与启动流程
- `index.js` → `shim.js`（polyfill）→ `src/app.ts`
- `app.ts` 中异步加载字体大小配置、初始化窗口尺寸工具，然后启动导航
- 使用 `react-native-navigation`（v7），而非更常见的 `@react-navigation/native`

### 2. 路径别名
- `@/` 映射到 `src/`，由 `babel-plugin-module-resolver` 实现
- TypeScript 端在 `tsconfig.json` 的 `paths` 中同步配置

### 3. 原生模块
项目依赖多个自定义原生模块（通过 GitHub 直连而非 npm registry）：
- `react-native-track-player` — 音频播放
- `react-native-file-system` — 文件系统操作
- `react-native-local-media-metadata` — 读取本地媒体元数据
- `react-native-background-timer` — 后台定时器

这些是学习 "JS 调用 Native 方法" 的绝佳范例。

### 4. 状态管理
Redux 模式：action → reducer → store，核心 store 逻辑在 `src/store/` 下，按功能模块拆分为多个 reducer。

## 学习路径建议

用户刚开始学习 React Native。当用户问问题时：
1. **优先关联 React 知识**：用户如果有 React 基础，先对比两者的异同（比如 `View` ≈ `div`，`Text` ≈ `span`，没有 HTML/CSS，用 `StyleSheet.create()` 写样式）
2. **解释原生桥接**：当涉及原生模块调用时，解释 JS Bridge 的工作原理（JS 线程 → 序列化数据 → Native 线程 → 回调返回）
3. **指出调试方法**：主动告知如何 debug — Metro 日志、Flipper/React DevTools、`console.log` 在 Metro 终端输出、`adb logcat` 查看原生日志
4. **区分平台代码**：`.android.ts` / `.ios.ts` 后缀的文件是平台特定代码，Metro 会自动按平台选择

## 给 AI Agent 的回答风格指引

- 解释代码时用「这段代码做了 X，它的原理是 Y，在 RN 中与 Web 的区别是 Z」的三段式结构
- 涉及 RN API 时，说明该 API 对应的原生能力以及调用时机
- 遇到不熟悉的依赖（如 react-native-navigation），先查看官方文档或源码再回答
- 用户没有要求修改代码时，只做解释和分析；用户要求修改时，给出具体方案并说明影响范围
- 每次回答涉及文件时，附带文件路径和行号
