# LX Music Mobile 开发指南

## 环境要求

- Node.js >= 18（当前 v24.3.0）
- JDK 17（当前已安装）
- Android Studio（已安装，含 SDK 36、NDK 30.0.14904198）
- Android SDK 路径：`~/Library/Android/sdk`

## 启动步骤

### 1. 启动 Metro 开发服务器

```bash
cd /Users/wzy/demo/github/lx-music-mobile
npx react-native start
```

### 2. 启动模拟器

打开 Android Studio → Device Manager → 启动 **Pixel_9**（或其他已创建的 AVD）。

或者用命令行：

```bash
~/Library/Android/sdk/emulator/emulator -avd Pixel_9 -no-snapshot-load &
```

### 3. 安装并启动应用

模拟器就绪后：

```bash
# 安装 APK
~/Library/Android/sdk/platform-tools/adb -s emulator-5554 install android/app/build/outputs/apk/debug/lx-music-mobile-v1.8.4-universal.apk

# 启动应用
~/Library/Android/sdk/platform-tools/adb -s emulator-5554 shell am start -n cn.toside.music.mobile/.MainActivity
```

或者一步到位（如果 APK 已经装过）：

```bash
npm run dev
```

## 重新构建 APK

代码修改后需要重新编译：

```bash
export ANDROID_HOME=~/Library/Android/sdk
export ANDROID_SDK_ROOT=~/Library/Android/sdk
cd android && ./gradlew assembleDebug
```

APK 输出在 `android/app/build/outputs/apk/debug/`。

## 常见问题

- **模拟器提示 16 KB 兼容性警告**：不影响使用，是第三方库未适配 Android 15 的 16KB page size，可忽略。
- **Metro 报模块找不到**：先尝试 `npx react-native start --reset-cache` 清除缓存。
- **8081 端口被占用**：`lsof -ti :8081 | xargs kill -9` 杀掉再重启 Metro。
