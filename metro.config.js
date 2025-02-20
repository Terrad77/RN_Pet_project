// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// module.exports = config;
module.exports = withNativeWind(config, { input: "./global.css" });

// ---- ESM синтаксис ------ //
// import { getDefaultConfig } from "expo/metro-config";
// import { withNativeWind } from "nativewind/metro";

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = await getDefaultConfig(__dirname);

// export default withNativeWind(config, { input: "./global.css" });
