import { Navigation } from 'react-native-navigation'

// 标记 App 是否已经启动完成，解决回调注册时 App 可能已启动的时序问题
let launched = false
// 存储所有在 App 启动前注册的回调
const handlers: Array<() => void> = []

/**
 * 监听 App 启动事件（只需调用一次）
 * App 启动完成时，将 launched 标记为 true，并异步执行所有已注册的回调
 */
export const listenLaunchEvent = () => {
  Navigation.events().registerAppLaunchedListener(() => {
    // console.log('Register app launched listener', launched)
    launched = true
    setImmediate(() => {
      for (const handler of handlers) handler()
    })
  })
}

/**
 * 注册在 App 启动完成后执行的回调
 * - App 还没启动：回调暂存到 handlers 数组，等 listenLaunchEvent 触发后统一执行
 * - App 已经启动：直接异步执行回调，确保不丢失
 */
export const onAppLaunched = (handler: () => void) => {
  handlers.push(handler)
  if (launched) {
    setImmediate(() => {
      handler()
    })
  }
}
