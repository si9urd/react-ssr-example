import express from 'express';
import { createRsbuild, loadConfig } from '@rsbuild/core';

// Implement SSR rendering function
const serverRender = (serverAPI) => async (_req, res) => {
  // Load SSR bundle
  const indexModule = await serverAPI.environments.ssr.loadBundle('index');
  const markup = await indexModule.render(_req, res);
  const template = await serverAPI.environments.web.getTransformedHtml('index');

  // Insert SSR rendering content into HTML template
  const html = template.replace('<!--app-content-->', markup);

  res.writeHead(200, {
    'Content-Type': 'text/html',
  });
  res.end(html);
};

// Custom server
async function startDevServer() {
  const { content } = await loadConfig({});

  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
  });

  const app = express();

  const rsbuildServer = await rsbuild.createDevServer();

  const serverRenderMiddleware = serverRender(rsbuildServer);

  // SSR rendering when accessing /index.html
  app.get('/', async (req, res, next) => {
    try {
      await serverRenderMiddleware(req, res, next);
    } catch (err) {
      console.error(err)
      next();
    }
  });

  app.use(rsbuildServer.middlewares);

  const httpServer = app.listen(rsbuildServer.port, async () => {
    await rsbuildServer.afterListen();
  });

  rsbuildServer.connectWebSocket({ server: httpServer });
}

startDevServer(process.cwd());
