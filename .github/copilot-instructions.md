Always use the Playwright tools built into this project (via `playwright.config.ts`) for browser automation and testing. Never use the Playwright MCP server.

Before using any Playwright browser tools, start the dev server as a detached background process using the bash tool with `mode="async"` and `detach: true`:

```
cd $(git rev-parse --show-toplevel) && npm run dev
```

This ensures the server keeps running after the bash shell completes.
