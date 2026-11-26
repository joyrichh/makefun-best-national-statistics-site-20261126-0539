import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./app/', import.meta.url));
const args = process.argv.slice(2);
const portArgument = args.indexOf('--port');
const requestedPort = portArgument < 0 ? 8080 : Number(args[portArgument + 1]);
const port = Number.isInteger(requestedPort) && requestedPort > 0 && requestedPort < 65536 ? requestedPort : 8080;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Permintaan tidak valid');
    return;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = resolve(root, '.' + pathname);
  if (!file.startsWith(resolve(root) + sep)) {
    response.writeHead(403).end('Akses ditolak');
    return;
  }
  try {
    const stats = statSync(file);
    if (!stats.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'content-type': types[extname(file)] ?? 'application/octet-stream',
      'content-length': stats.size,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Berkas tidak ditemukan');
  }
}).listen(port, '127.0.0.1', () => console.log(`NusaData siap di http://localhost:${port}`))
  .on('error', (error) => {
    console.error(`Server tidak dapat membuka port ${port}: ${error.message}`);
    process.exitCode = 1;
  });
