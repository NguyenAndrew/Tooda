import { spawn } from 'child_process';
import { mkdirSync, copyFileSync, openSync, closeSync } from 'fs';

mkdirSync('public', { recursive: true });
copyFileSync('node_modules/mermaid/dist/mermaid.min.js', 'public/mermaid.min.js');

const logFile = openSync('dev-detach.log', 'a');
const cmd = process.platform === 'win32' ? 'astro.cmd' : 'astro';
const child = spawn(cmd, ['dev'], {
  detached: true,
  stdio: ['ignore', logFile, logFile],
});
closeSync(logFile);

child.on('error', (err) => {
  console.error(`Failed to start dev server: ${err.message}`);
  process.exit(1);
});
child.unref();

console.log(`Dev server started in background (PID: ${child.pid}). Logs: dev-detach.log`);
