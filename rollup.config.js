const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const pkg = require("./package.json");
const resolve = require("rollup-plugin-node-resolve");

module.exports = {
    input: "src/index.js",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: "inline",
        },
        {
            file: pkg.module,
            format: "es",
            sourcemap: "inline",
        },
    ],
    plugins: [
        babel({
            exclude: "node_modules/**",
            presets: [
                [
                    "@babel/preset-env",
                    { targets: { node: 8 }, forceAllTransforms: true, modules: false },
                ],
                "@babel/preset-react",
                "@babel/preset-flow",
            ],
            plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-class-properties",
            ],
        }),
        resolve(),
        commonjs({
            include: "node_modules/**",
        }),
    ],
    external: ["react"],
};
