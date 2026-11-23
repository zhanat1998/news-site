// The repo is "type": "commonjs" (Next). Tests and the pure helpers in src/lib are ESM
// TypeScript, so load every project .ts file as an ES module under node:test.
import { registerHooks } from 'node:module';

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.ts') && !url.includes('/node_modules/')) {
      return nextLoad(url, { ...context, format: 'module-typescript' });
    }
    return nextLoad(url, context);
  },
});
