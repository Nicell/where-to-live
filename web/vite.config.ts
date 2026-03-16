import { readFile } from 'node:fs/promises';

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

export default defineConfig({
  base,
  plugins: [solid(), minifiedJsonAssetsPlugin()],
  publicDir: 'public',
  build: {
    emptyOutDir: true,
    outDir: 'www/where-to-live',
    target: 'es2022'
  },
  server: {
    host: true
  }
});
