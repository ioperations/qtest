"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
exports.default = (0, vite_1.defineConfig)({
    root: path_1.default.resolve(__dirname, 'src/webview'),
    base: '',
    plugins: [(0, plugin_react_1.default)()],
    build: {
        outDir: path_1.default.resolve(__dirname, 'dist/webview'),
        emptyOutDir: true,
        rollupOptions: {
            input: path_1.default.resolve(__dirname, 'src/webview/index.tsx'),
            output: {
                entryFileNames: 'index.js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: (info) => {
                    if (info.name?.endsWith('.css'))
                        return 'index.css';
                    return 'assets/[name]-[hash][extname]';
                },
            },
        },
    },
});
//# sourceMappingURL=vite.webview.config.js.map