"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const path_1 = __importDefault(require("path"));
exports.default = (0, vite_1.defineConfig)({
    build: {
        lib: {
            entry: path_1.default.resolve(__dirname, 'src/extension.ts'),
            formats: ['cjs'],
            fileName: () => 'extension.js',
        },
        outDir: 'dist',
        rollupOptions: {
            external: ['vscode'],
        },
        sourcemap: true,
        minify: false,
    },
});
//# sourceMappingURL=vite.config.js.map