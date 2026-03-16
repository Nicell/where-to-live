import { readFile, unlink, writeFile } from 'node:fs/promises';

import { defineConfig, type Plugin } from 'vite';
import solid from 'vite-plugin-solid';

interface JsonAssetDefinition {
  outputPath: string;
  sourcePath: string;
}

const base = '/where-to-live/';

const jsonAssets: JsonAssetDefinition[] = [
  {
    outputPath: 'assets/map.json',
    sourcePath: 'src/assets/map.json'
  },
  {
    outputPath: 'assets/search.json',
    sourcePath: 'src/assets/search.json'
  }
];

async function getMinifiedJson(sourcePath: string) {
  const source = await readFile(new URL(sourcePath, new URL('./', import.meta.url)), 'utf8');
  return JSON.stringify(JSON.parse(source));
}

function minifiedJsonAssetsPlugin(): Plugin {
  return {
    name: 'minified-json-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '';

        void (async () => {
          for (const asset of jsonAssets) {
            const assetPath = `${base}${asset.outputPath}`;
            if (pathname === assetPath || pathname === `/${asset.outputPath}`) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(await getMinifiedJson(asset.sourcePath));
              return;
            }
          }

          next();
        })().catch(next);
      });
    },
    async generateBundle() {
      for (const asset of jsonAssets) {
        this.emitFile({
          type: 'asset',
          fileName: asset.outputPath,
          source: await getMinifiedJson(asset.sourcePath)
        });
      }
    }
  };
}

function inlineCssPlugin(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    async writeBundle() {
      const outputRoot = new URL('./www/where-to-live/', import.meta.url);
      const indexPath = new URL('index.html', outputRoot);
      let html = await readFile(indexPath, 'utf8');
      const stylesheetLinks = Array.from(
        html.matchAll(/<link\s+rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g)
      );

      for (const match of stylesheetLinks) {
        const href = match[1];
        const assetFileName = href.startsWith(base) ? href.slice(base.length) : href.replace(/^\//, '');
        const cssPath = new URL(assetFileName, outputRoot);
        const cssSource = await readFile(cssPath, 'utf8');
        html = html.replace(match[0], `<style>${cssSource}</style>`);
        await unlink(cssPath);
      }

      await writeFile(indexPath, html);
    }
  };
}

export default defineConfig({
  base,
  plugins: [solid(), minifiedJsonAssetsPlugin(), inlineCssPlugin()],
  publicDir: 'public',
  build: {
    emptyOutDir: true,
    outDir: 'www/where-to-live',
    sourcemap: true,
    target: 'es2022'
  },
  server: {
    host: true
  }
});
