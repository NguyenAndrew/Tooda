import { mkdirSync, copyFileSync } from 'fs';

mkdirSync('public', { recursive: true });
copyFileSync('node_modules/mermaid/dist/mermaid.min.js', 'public/mermaid.min.js');
