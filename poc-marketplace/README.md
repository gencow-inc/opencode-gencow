# GENCOW POC & Education Marketplace

A small Codex plugin marketplace for POC demonstrations and education. It includes two GENCOW services:

- **새벽 한 시 (One AM)** — create and manage characters owned by the connected user. Chat conversations take place in the app.
- **느린 메모 (Slow Memo)** — draft and manage blog posts and images. Publishing happens only when explicitly requested.

## Add to Codex Desktop

1. Open **Plugins** / **Plugins Directory** in Codex Desktop.
2. Choose **Add marketplace** or **Add from GitHub**.
3. Enter gencow-inc/opencode-gencow.
4. Select **GENCOW POC & Education**, then install either or both plugins.
5. Complete OAuth sign-in when prompted.

CLI alternative:

    codex plugin marketplace add gencow-inc/opencode-gencow

## Included services

| Plugin | MCP endpoint |
| --- | --- |
| 새벽 한 시 | https://1am.gencow.link/api/mcp |
| 느린 메모 | https://blog.gencow.link/api/mcp |

The plugins use OAuth; no access token or client secret is stored in this repository. Each connected service applies its own account permissions. The One AM plugin is limited to the connected user's characters. The Slow Memo plugin defaults to drafts and requires an explicit request to publish.
