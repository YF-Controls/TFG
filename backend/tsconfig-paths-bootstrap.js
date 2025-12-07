const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");

const baseUrl = "./"; // Should be the same as in tsconfig.json
tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});
