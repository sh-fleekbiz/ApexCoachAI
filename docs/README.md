---
page_type: application
languages:
  - javascript
  - typescript
  - nodejs
  - bicep
products:
  - azure
  - ai-services
  - azure-openai
urlFragment: apex-coach-ai
name: Apex Coach AI - AI-Powered Coaching Platform
description: Transform proprietary content into interactive AI coaching experts. Built for content-focused SMBs, coaches, and consultancies.
---

# Apex Coach AI - AI-Powered Coaching & Development Platform

For full documentation, see the main [README.md](../README.md) in the repository root.

## Quick Links

- **Live Demo**: https://apexcoach.shtrial.com
- **Main Documentation**: [../README.md](../README.md)
- **Architecture**: [architecture-overview.md](architecture-overview.md)
- **Roadmap**: [roadmap.md](roadmap.md)
- **Testing**: [../TESTING.md](../TESTING.md)
- **Deployment**: [../DEPLOYMENT.md](../DEPLOYMENT.md)

## What is Apex Coach AI?

Apex Coach AI enables coaches, consultants, and training companies to turn their video libraries and training materials into an intelligent, 24/7 AI coaching assistant. Your content becomes an interactive expert that serves clients with your voice, your authority, and your methodology.

[![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=brightgreen&logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=sh-fleekbiz/ApexCoachAI&machine=standardLinux32gb&devcontainer_path=.devcontainer%2Fdevcontainer.json&location=WestUs2)
[![Open in Remote - Containers](https://img.shields.io/static/v1?style=for-the-badge&label=Remote%20-%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/sh-fleekbiz/ApexCoachAI)

## Key Features

- **Content Processing**: Upload videos, PDFs, and documents with automatic transcription
- **Speaker Attribution**: AI cites specific coaches and timestamps
- **Program Management**: Role-based access for multi-tenant deployment
- **Citation Linking**: Verifiable sources with timestamp navigation
- **Advanced RAG**: Powered by Azure OpenAI and Azure AI Search

## Architecture

Apex Coach AI consists of three main components:

- **Frontend**: React web application (Azure Static Web Apps)
- **Search Service**: Fastify backend with RAG capabilities (Azure Container Apps)
- **Indexer Service**: Content processing and indexing pipeline (Azure Container Apps)

![Architecture Diagram](app-architecture.drawio.png)

See [architecture-overview.md](architecture-overview.md) for detailed technical documentation.

## Quick Start

```bash
# Clone repository
git clone https://github.com/sh-fleekbiz/ApexCoachAI
cd ApexCoachAI

# Deploy to Azure
azd auth login
azd up

# Index your content
./scripts/index-data.sh
```

For detailed deployment instructions, see the [main README](../README.md#quick-start).

## Documentation

This `docs/` folder contains:

- **[architecture-overview.md](architecture-overview.md)** - System architecture and components
- **[roadmap.md](roadmap.md)** - Planned features and development priorities
- **[containers.md](containers.md)** - Container deployment details
- **[low-cost.md](low-cost.md)** - Cost optimization strategies
- **[remaining-implementation.md](remaining-implementation.md)** - Feature implementation tracking

## Support

- **Documentation**: See files in this folder and [main README](../README.md)
- **Issues**: [GitHub Issues](https://github.com/sh-fleekbiz/ApexCoachAI/issues)
- **Community**: [Azure AI Discord](https://aka.ms/foundry/discord)

---

**Built for coaches, consultants, and content creators who want to scale their expertise without sacrificing quality.**
