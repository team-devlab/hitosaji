// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// zustand など一部ライブラリの ESM ビルドが `import.meta` を含み、Web/Hermes バンドルで
// 非モジュールコンテキスト実行時に SyntaxError になる問題への対応。
// `react-native` 条件を優先して CJS ビルドを解決させることで回避する。
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ["react-native", "require"];

module.exports = config;
