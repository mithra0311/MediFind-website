import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve static MediFind.zip from public directory or root if requested directly
  app.get('/MediFind.zip', (_req, res) => {
    const zipPath = path.resolve(__dirname, 'MediFind.zip');
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="MediFind.zip"');
      fs.createReadStream(zipPath).pipe(res);
    } else {
      res.status(404).send('MediFind.zip file is being generated. Please retry shortly.');
    }
  });

  // API router
  app.use('/api', apiRouter);

  if (!isProd) {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[MediFind] Vite middleware attached for development.');
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[MediFind] Serving static production build from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MediFind Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[MediFind Server Error]', err);
  process.exit(1);
});
