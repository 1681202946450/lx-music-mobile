// @flow
/**
 * react-native-navigation 屏幕注册文件
 *
 * 【为什么要在 App 启动前注册屏幕？】
 * react-native-navigation 的导航是由原生层驱动的，不是 JS 层。
 * 页面切换时，原生层会创建真实的 Activity/ViewController 来承载页面，
 * 所以必须提前告诉原生层"我有哪些屏幕、它们叫什么名字"，
 * 这样跳转时原生层才知道该创建哪个原生容器、加载哪个 JS 组件。
 *
 * 【与 Web/React 的区别】
 * - Web 的 react-router：JS 层自己管路由，替换 DOM 节点即可，不需要提前注册
 * - react-native-navigation：原生层管理路由，创建原生页面，转场动画更流畅，
 *   系统返回键自动生效，但必须提前注册屏幕
 *
 * 【与 react-navigation 的区别】
 * react-navigation 主要在 JS 层管理路由，而 react-native-navigation 走原生路线：
 * - 转场动画更流畅（原生渲染）
 * - 内存管理更好（切走的页面可以被原生层回收）
 * - 更接近原生 App 的体验
 * 代价就是需要提前注册，API 也更复杂
 */

import { Navigation } from 'react-native-navigation'

import {
  Home,
  PlayDetail,
  SonglistDetail,
  Comment,
  // Setting,
} from '@/screens'
import { Provider } from '@/store/Provider'

import {
  HOME_SCREEN,
  PLAY_DETAIL_SCREEN,
  SONGLIST_DETAIL_SCREEN,
  COMMENT_SCREEN,
  VERSION_MODAL,
  PACT_MODAL,
  SYNC_MODE_MODAL,
  // SETTING_SCREEN,
} from './screenNames'
import VersionModal from './components/VersionModal'
import PactModal from './components/PactModal'
import SyncModeModal from './components/SyncModeModal'

function WrappedComponent(Component: any) {
  return function inject(props: Record<string, any>) {
    const EnhancedComponent = () => (
      <Provider>
        <Component
          {...props}
        />
      </Provider>
    )

    return <EnhancedComponent />
  }
}

export default () => {
  Navigation.registerComponent(HOME_SCREEN, () => WrappedComponent(Home))
  Navigation.registerComponent(PLAY_DETAIL_SCREEN, () => WrappedComponent(PlayDetail))
  Navigation.registerComponent(SONGLIST_DETAIL_SCREEN, () => WrappedComponent(SonglistDetail))
  Navigation.registerComponent(COMMENT_SCREEN, () => WrappedComponent(Comment))
  Navigation.registerComponent(VERSION_MODAL, () => WrappedComponent(VersionModal))
  Navigation.registerComponent(PACT_MODAL, () => WrappedComponent(PactModal))
  Navigation.registerComponent(SYNC_MODE_MODAL, () => WrappedComponent(SyncModeModal))
  // Navigation.registerComponent(SETTING_SCREEN, () => WrappedComponent(Setting))

  console.info('All screens have been registered...')
}
