import { createServer, Server } from 'http';
import MainApp from './src/app';
import { config } from './src/config/general.config';

const coreApp = MainApp.getInstance();
coreApp.start().then((app) => {
  // Server
  const options = config.serverOptions;
  const httpServer: Server = createServer(app);

  httpServer.listen(options.port, '0.0.0.0', () => {
    const message = [
      `[Node.js behind proxy] Listening on port ${options.port} 📥.`,
      `Swagger UI Unavailable`,
    ].join('\n');
    // eslint-disable-next-line no-console
    console.log(message);
  });

  httpServer.timeout = 60 * 60 * 1000; // 60 minutes
});
