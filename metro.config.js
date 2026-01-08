const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// --- SVG Transformer setup ---
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// --- Zustand / CommonJS fix ---
config.resolver.unstable_enablePackageExports = true;

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force Zustand to use its CJS entry
  if (moduleName === "zustand" || moduleName.startsWith("zustand/")) {
    return {
      type: "sourceFile",
      filePath: require.resolve(moduleName),
    };
  }

  // Fall back to default Metro resolver if available
  if (typeof originalResolveRequest === "function") {
    return originalResolveRequest(context, moduleName, platform);
  }

  // As last resort, use the context default resolver
  if (typeof context.resolveRequest === "function") {
    return context.resolveRequest(context, moduleName, platform);
  }

  // This should almost never happen; Metro will error otherwise
  throw new Error(
    `Cannot resolve module ${moduleName} for platform ${platform}`
  );
};

module.exports = config;
