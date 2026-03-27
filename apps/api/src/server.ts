import 'dotenv/config';
import { loadConfig, getConfig } from './config';
import { createApp } from './app';

loadConfig();
const app = createApp();
const { port, host } = getConfig();

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://${host}:${port}/v1`);
});

