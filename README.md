# Apex Coach AI – The Unified AI Platform for Structured, Multimedia Coaching Programs

Transform your proprietary content into an interactive AI coaching expert. Built for content-focused SMBs, coaches, and consultancies.

**Live Demo**: https://apexcoach.shtrial.com

---

## 🎯 What is Apex Coach AI?

Apex Coach AI is a professional AI-powered platform for structured coaching and development, designed for enterprises and high-value programs. It uses **Retrieval Augmented Generation (RAG)** and **Azure AI Services** to deliver secure, persistent, and highly personalized guidance.

The platform's core value is scaling high-quality coaching through a customizable **Personality System (Meta-Prompts)** and the ability to index complex proprietary multimedia content, including tagged video transcripts and documents, tailored for enterprise programs.

Apex Coach AI enables coaches, consultants, and training companies to turn their video libraries and training materials into an intelligent, 24/7 AI coaching assistant. Your content becomes an interactive expert that serves clients with your voice, your authority, and your methodology.

**Technology Stack:** Node.js/Fastify, React/TypeScript, SQLite, Azure OpenAI, Azure AI Search.

### Why Apex Coach AI?

- **📚 Your Content, Your Expert**: Upload videos, courses, and documents - Apex Coach AI converts them into an AI that speaks with your authority
- **🎓 Speaker-Aware Responses**: AI cites specific coaches, timestamps, and sources for credibility and trust
- **🎨 Personalized Coaching Styles**: Multiple AI personalities adapt to different client needs
- **🔐 Program-Based Access**: Organize content into programs and control who sees what
- **✅ Verifiable Citations**: Every response links back to source material with exact timestamps

---

## 👥 Who is Apex Coach AI For?

### Business Coaches & Consultants
Scale your 1-on-1 coaching without sacrificing personalization. Your AI assistant handles routine questions while you focus on high-value interactions.

### Training Companies
Turn your course library into an interactive learning assistant. Students get instant answers backed by your actual training content.

### Startup Founders
Provide consistent onboarding and development for growing teams. New hires learn from your accumulated knowledge base.

### Professional Services
Deliver client support backed by your proprietary methodologies. Maintain quality at scale.

---

## ✨ Key Features

### 1. Unified Coaching Experience

- **Multi-Chat & Persistence**: Secure, multi-user chat history is stored in an embedded SQLite database, allowing users to save and resume conversations.
- **AI Personality System**: Customizable Meta-Prompts allow users to select from specialized coaching personas that govern the AI's tone and approach.
- **Multi-Role RBAC**: Built-in Role-Based Access Control (`Owner`, `Admin`, `Coach`, `User`) protects sensitive data and controls feature access.

### 2. Advanced Multimedia RAG

- **Intelligent Content Indexer**: Designed for robust ingestion of documents, and extendable for automatic transcription and indexing of videos/audio.
- **Authority-Aware RAG**: Logic for identifying and tagging content with **Speaker Metadata** (e.g., Coach vs. Student) to improve citation authority and relevance.
- **Citation-Linked Playback**: Frontend designed to link RAG citations directly to the timestamp in the source video for seamless learning.
- **Content Processing**: Upload videos, PDFs, documents, and training materials with automatic transcription and indexing
- **Speaker Identification**: Automatic speaker identification and attribution with timestamp-linked citations

### 3. Enterprise Structure & Management

- **Program Management**: Administrative interface for creating and assigning users/coaches to structured development programs.
- **Admin Console**: Dedicated UI for managing users, roles, meta-prompts, and tracking knowledge base status and usage analytics.
- **Business Management**: Program management for organizing content, role-based access control for clients/teams, multi-tenant B2B architecture, and usage analytics and engagement tracking

### 4. Technical Foundation

- **Powered by Azure OpenAI and Azure AI Search**: Advanced RAG (Retrieval Augmented Generation) architecture
- **Enterprise-grade security and scalability**: Context-aware responses from your content library
- **Real-time chat interface**: Multiple coaching personalities and styles with session persistence across devices
- **Mobile-responsive design**: Access your AI coach from any device

---

## 🚀 Quick Start

### Prerequisites

- Azure subscription with Azure OpenAI access ([Request access](https://aka.ms/oaiapply))
- [Azure Developer CLI](https://aka.ms/azure-dev/install)
- [Node.js LTS](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### Azure Account Prerequisites

**IMPORTANT:** In order to deploy and run this application, you'll need:

- **Azure account**. If you're new to Azure, [get an Azure account for free](https://azure.microsoft.com/free) to get free Azure credits to get started.
- **Azure subscription with access enabled for the Azure OpenAI service**. You can request access with [this form](https://aka.ms/oaiapply).
- **Azure account permissions**:
  - Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [Role Based Access Control Administrator](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#role-based-access-control-administrator-preview), [User Access Administrator](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#user-access-administrator), or [Owner](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#owner). If you don't have subscription-level permissions, they must be granted to you with [RBAC](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#role-based-access-control-administrator-preview) for an existing resource group and deploy to that existing group.
  - Your Azure account also needs `Microsoft.Resources/deployments/write` permissions at a subscription level.

### Azure Deployment

#### Cost Estimation

Pricing may vary per region and usage. Exact costs cannot be estimated.
You may try the [Azure pricing calculator](https://azure.com/e/8468fee268374b6fbd32db323deec786) for the resources below.

- Azure Container Apps: Pay-as-you-go tier. Costs based on vCPU and memory used. [Pricing](https://azure.microsoft.com/pricing/details/container-apps/)
- Azure Static Web Apps: Free Tier. [Pricing](https://azure.microsoft.com/pricing/details/app-service/static/)
- Azure OpenAI: Standard tier, ChatGPT and Ada models. Pricing per 1K tokens used, and at least 1K tokens are used per question. [Pricing](https://azure.microsoft.com/pricing/details/search/)
- Azure AI Search: Standard tier, 1 replica, free level of semantic search\*. Pricing per hour.[Pricing](https://azure.microsoft.com/pricing/details/search/) (_The pricing may vary or reflect an outdated tier model. Please visit the linked page for more accurate information_)
- Azure Blob Storage: Standard tier with ZRS (Zone-redundant storage). Pricing per storage and read operations. [Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
- Azure Monitor: Pay-as-you-go tier. Costs based on data ingested. [Pricing](https://azure.microsoft.com/pricing/details/monitor/)

⚠️ To avoid unnecessary costs, remember to take down your app if it's no longer in use,
either by deleting the resource group in the Portal or running `azd down --purge`.

#### Project Setup

There are multiple ways to successfully setup this project.

The easiest way to get started is with GitHub Codespaces that provides preconfigurations to setup all the tools for you. [Read more below](#github-codespaces).
Alternatively you can [set up your local environment](#local-environment) following the instructions below.

##### GitHub Codespaces

You can run this repo virtually by using GitHub Codespaces, which will open a web-based VS Code in your browser:

[![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=brightgreen&logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=sh-fleekbiz/ApexCoachAI&machine=standardLinux32gb&devcontainer_path=.devcontainer%2Fdevcontainer.json&location=WestUs2)

##### VS Code Remote Containers

A similar option to Codespaces is VS Code Remote Containers, that will open the project in your local VS Code instance using the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers):

[![Open in Remote - Containers](https://img.shields.io/static/v1?style=for-the-badge&label=Remote%20-%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/sh-fleekbiz/ApexCoachAI)

##### Local Environment

### Deploy to Azure

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sh-fleekbiz/ApexCoachAI
   cd ApexCoachAI
   ```

2. **Authenticate and deploy:**
   ```bash
   azd auth login
   azd up
   ```

   Select your Azure region when prompted. Deployment takes approximately 15 minutes.

3. **Upload your content:**
   ```bash
   # Add your documents to the data/ folder
   ./scripts/index-data.sh  # or index-data.ps1 on Windows
   ```

4. **Access your platform:**
   The deployment will output your application URL.

---

## 💡 Using Apex Coach AI

### For Coaches & Content Creators

1. **Upload Content**: Add your videos, courses, and training materials to the `data/` folder
2. **Index Content**: Run the indexer script to process and make content searchable
3. **Configure Programs**: Organize content into client-facing programs (coming soon)
4. **Manage Access**: Assign clients to specific programs (coming soon)
5. **Monitor Engagement**: Track how clients interact with your AI coach

### For End Users

1. **Log In**: Access your assigned coaching program
2. **Select Personality**: Choose a coaching style that matches your needs
3. **Ask Questions**: The AI draws from your coach's actual content library
4. **Follow Citations**: Dive deeper into source materials via timestamps
5. **Resume Anytime**: Conversations are saved and accessible across devices

---

## 🏗️ Architecture

Apex Coach AI is built on a modern, scalable architecture:

- **Frontend**: React + TypeScript (Azure Static Web Apps)
- **Backend API**: Node.js + Fastify (Azure Container Apps)
- **AI/ML**: Azure OpenAI (GPT-4o-mini, text-embedding-3-large)
- **Search**: Azure AI Search (vector + semantic search)
- **Storage**: Azure Blob Storage + SQLite for user data
- **Monitoring**: Application Insights

**Architecture Details**: See [`docs/architecture-overview.md`](docs/architecture-overview.md)

---

## 💰 Cost Estimation

Typical monthly costs for a small business (10-50 active users):

| Service | Cost Range | Details |
|---------|------------|---------|
| Azure OpenAI | $50-200 | Based on chat volume |
| Azure AI Search | $250 | Standard tier |
| Container Apps | $30-100 | Based on traffic |
| Static Web Apps | Free | Free tier |
| Storage | $5-20 | Blob + data storage |
| **Total** | **$335-570/month** | |

[Azure Pricing Calculator](https://azure.com/e/8468fee268374b6fbd32db323deec786)

💡 **Cost Optimization**: See [`docs/low-cost.md`](docs/low-cost.md) for strategies to reduce expenses.

⚠️ **Important**: Remember to run `azd down --purge` when no longer using resources to avoid ongoing costs.

---

## 🔒 Security & Authentication

By default, Apex Coach AI is publicly accessible. For production deployment:

### Enable Authentication

1. **Azure Entra ID**: Follow [this tutorial](https://learn.microsoft.com/training/modules/publish-static-web-app-authentication/) to enable SSO
2. **User Restrictions**: Configure [user/group access](https://learn.microsoft.com/entra/identity-platform/howto-restrict-your-app-to-a-set-of-users)
3. **CORS Configuration**: Set allowed origins for alternative frontends

### Additional Security

- Deploy within a Virtual Network for internal-only access
- Enable Azure API Management for API gateway/firewall
- Configure managed identities for service-to-service auth
- Enable Azure Monitor for security audit logs

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

---

## 🛠️ Development

### Running Locally

After deploying to Azure once:

```bash
# Authenticate
azd auth login
az login

# Get environment variables
azd env get-values > .env

# Index your content
./scripts/index-data.sh  # or .ps1 on Windows

# Install dependencies
npm install

# Start development servers
npm start
```

Navigate to http://localhost:5173

### Project Structure

```
ApexCoachAI/
├── packages/
│   ├── webapp/           # React frontend application
│   ├── search/           # Fastify RAG backend service
│   ├── indexer/          # Content processing service
│   ├── chat-component/   # Reusable chat UI component
│   └── shared/           # Shared TypeScript types
├── infra/                # Azure infrastructure as code (Bicep)
├── data/                 # Your content library (add files here)
├── tests/                # E2E and load tests
├── scripts/              # Deployment and indexing scripts
└── docs/                 # Documentation
```

### Deployment Options

**Option 1: Full Deployment**
```bash
azd up
```

**Option 2: Code-Only Deployment**
```bash
azd deploy
```

**Option 3: With Existing Resources**
```bash
azd env set AZURE_OPENAI_SERVICE <your-service>
azd env set AZURE_SEARCH_SERVICE <your-service>
azd up
```

---

## 📚 Documentation

- [Architecture Overview](docs/architecture-overview.md) - System design and components
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [Development Roadmap](docs/roadmap.md) - Planned features and priorities
- [Testing Guide](TESTING.md) - E2E and load testing
- [Contributing Guide](CONTRIBUTING.md) - How to contribute

---

## 🗺️ Roadmap

### Phase 1: Core Application Loop (Q1 2025)
- ✅ Authentication and session persistence
- ✅ Personality selector UI
- ⏳ Guided onboarding flow
- ⏳ Chat history management

### Phase 2: Multimedia Coaching Vault (Q2 2025)
- ⏳ Video transcription pipeline
- ⏳ Speaker-aware RAG with authority levels
- ⏳ Citation-linked library UI with timestamps
- ⏳ Enhanced source verification

### Phase 3: Program Management (Q3 2025)
- ⏳ Admin UI for program creation
- ⏳ Role-based content filtering
- ⏳ Client assignment workflows
- ⏳ Usage analytics dashboard

See [docs/roadmap.md](docs/roadmap.md) for detailed feature descriptions and timelines.

---

## 🤝 Support & Community

### Get Help

- 📖 **Documentation**: Browse the [`docs/`](docs/) folder
- 🐛 **Issues**: Report bugs on [GitHub Issues](https://github.com/sh-fleekbiz/ApexCoachAI/issues)
- 💬 **Community**: Join [Azure AI Discord](https://aka.ms/foundry/discord)
- 📧 **Contact**: Reach out for business inquiries

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built for coaches, consultants, and content creators who want to scale their expertise without sacrificing quality.**
