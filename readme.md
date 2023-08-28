# vite-plugin-tscheck

a vite plugin for verifying typescript syntax

# usage

## 1. Install
```bash
npm i vite-plugin-tscheck
```

## 2. Use Plugin
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { tsCheck } from 'vite-plugin-tscheck';

// Verify only during build
export default defineConfig({
  plugins: [
    tsCheck({
      check: process.env.NODE_ENV === 'production',
    }),
  ],
});
```

## 3. Options
- `cwd: string`; current work directory default is `process.cwd()`
- `include: FilterPattern`; refer to https://www.npmjs.com/package/@rollup/pluginutils include and exclude, default is `['*.ts+(|x)', '**/*.ts+(|x)']`
- `exclude: FilterPattern`; refer to https://www.npmjs.com/package/@rollup/pluginutils include and exclude, default is `['node_modules']`
- `check: boolean`; Plugins are only verified when true, default is `true`
