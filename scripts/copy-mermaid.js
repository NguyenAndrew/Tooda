import { mkdirSync, copyFileSync, cpSync } from 'fs';

mkdirSync('public', { recursive: true });
mkdirSync('public/chunks', { recursive: true });
copyFileSync('node_modules/mermaid/dist/mermaid.min.js', 'public/mermaid.min.js');
copyFileSync(
  'node_modules/@mermaid-js/layout-elk/dist/mermaid-layout-elk.esm.min.mjs',
  'public/mermaid-layout-elk.esm.min.mjs',
);
cpSync(
  'node_modules/@mermaid-js/layout-elk/dist/chunks/mermaid-layout-elk.esm.min',
  'public/chunks/mermaid-layout-elk.esm.min',
  { recursive: true },
);
copyFileSync('node_modules/swagger-ui-dist/swagger-ui.css', 'public/swagger-ui.css');
copyFileSync('node_modules/swagger-ui-dist/swagger-ui-bundle.js', 'public/swagger-ui-bundle.js');
