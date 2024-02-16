const { build } = require("esbuild");
const { copy } = require("esbuild-plugin-copy");

//@ts-check
/** @typedef {import('esbuild').BuildOptions} BuildOptions **/

/** @type BuildOptions */
const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production",
};

// Config for webview source code (to be run in a web-based context)
/** @type BuildOptions */
const webviewConfig = {
  ...baseConfig,
  target: "es2020",
  format: "esm",
  entryPoints: ["./src/static/profile.ts", "./src/static/tracePluginInfo.ts"],
  outdir: "./out/static/",
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./images/*.*"],
        to: ["./out/images"],
      },
    }),
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./src/static/*.css", "./src/static/*.ttf" ],
        to: ["./out/static"],
      },
    }),
  ],
};

// Build script
(async () => {
  try {
    await build(webviewConfig);
    console.log("build complete");
  } catch (err) {
    process.stderr.write(err.stderr);
    process.exit(1);
  }
})();
