const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      buffer: require.resolve('@craftzdog/react-native-buffer'),
    },
    resolveRequest: (context, realModuleName, platform) => {
      if (realModuleName.startsWith('@/')) {
        return {
          filePath: path.resolve(__dirname, 'src', realModuleName.slice(2)),
          type: 'sourceFile',
        }
      }
      return context.resolveRequest(context, realModuleName, platform)
    },
  },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
