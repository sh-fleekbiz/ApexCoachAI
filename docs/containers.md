## Containerized Local Development

This document outlines how to run the Apex Coach AI monorepo services via Docker Compose for a consistent local environment.

### Services

- `search` (packages/search) – search API service.
- `indexer` (packages/indexer) – indexing service feeding search.
- `webapp` (packages/webapp) – front-end application (Vite).
- `chat-component` (packages/chat-component) – standalone UI component preview.

### Prerequisites

- Docker Desktop 4.28+ (BuildKit enabled by default)
- Node.js 22 (only if you also want to run outside containers)
- pnpm v10 (optional outside containers)

### Quick Start

```bash
docker compose up --build
```

Access:

- Webapp: http://localhost:5173
- Chat Component: http://localhost:5174
- Search API: http://localhost:3000
- Indexer API: http://localhost:3001

### Hot Reload and Volumes

Each service mounts the repository root into `/workspace`. Changes to source files trigger the underlying dev server rebuild (Vite / tsx). If a service requires dependencies not installed yet, rebuild its image:

```bash
docker compose build search
```

### Production Images

The provided Dockerfiles are multi-stage. For a production build/publish of the webapp only:

```bash
docker build -f packages/webapp/Dockerfile -t apexcoach-ai-webapp:prod .
```

### Updating Dependencies

Rebuild images to pick up lockfile changes:

```bash
docker compose build --no-cache
```

### Environment Variables

Add required runtime configuration inside `.env.local` (not committed) and pass through with Compose overrides as needed.

### Next Improvements

- Add healthcheck directives for API services.
- Introduce a lightweight reverse proxy (e.g. Traefik) for unified hostnames.
- Optional debug stage with Node.js inspector ports.

### Removing Redundant Code Strategy

Before deleting artifacts, list them and confirm they are not referenced by scripts/workflows. Deletions should be limited to stale logs, example data not used in tests, replaced workflows (already done), and unused config samples.

---

Maintained by the Apex Coach AI team.
