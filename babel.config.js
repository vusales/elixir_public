module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["@babel/plugin-transform-flow-strip-types"],
    [require("@babel/plugin-proposal-decorators").default,{"legacy": true}],
    ["@babel/plugin-proposal-class-properties", { "loose": true}],

    
    "react-native-reanimated/plugin",
  ]
};
