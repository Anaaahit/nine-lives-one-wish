// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // These "Rules of React" checks assume the React Compiler's purity model,
    // which conflicts with react-native-reanimated's shared-value mutation API
    // (`x.value = ...` outside render is the documented, correct way to update
    // it) and with the classic Animated.Value ref pattern used in the cutscene
    // player. This project doesn't use the React Compiler.
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
