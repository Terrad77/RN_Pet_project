// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from "expo/metro-config";
import { withNativeWind } from "nativewind/metro";

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// module.exports = config;
export default withNativeWind(config, { input: "./global.css" });
