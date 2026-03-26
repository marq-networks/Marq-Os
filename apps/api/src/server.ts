import { createApp } from './app';

const app = createApp();

const port = Number(process.env.PORT ?? 5174);
const host = process.env.HOST ?? '127.0.0.1';

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://${host}:${port}/v1`);
});

