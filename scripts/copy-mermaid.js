import { mkdirSync, copyFileSync } from 'fs';

mkdirSync('public', { recursive: true });
copyFileSync('node_modules/mermaid/dist/mermaid.min.js', 'public/mermaid.min.js');
copyFileSync('node_modules/swagger-ui-dist/swagger-ui.css', 'public/swagger-ui.css');
copyFileSync('node_modules/swagger-ui-dist/swagger-ui-bundle.js', 'public/swagger-ui-bundle.js');
