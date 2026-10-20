import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

// Build the public empty form only. No browser drafts or user files are available
// in this build process; effects (storage writes and counters) never run here.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
});
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const markup = renderToStaticMarkup(createElement(App));
  const file = new URL('../dist/index.html', import.meta.url);
  const html = await readFile(file, 'utf8');
  const start = html.indexOf('<div id="root">');
  const end = html.indexOf('<section class="tool-guide-content"', start);
  if (start < 0 || end < 0) throw new Error('Missing app or public guide boundary');
  // Prevent input into the static form until the client restores its local draft.
  await writeFile(file, html.slice(0, start) + `<div id="root" inert>${markup}</div>\n` + html.slice(end));
} finally {
  await server.close();
}
