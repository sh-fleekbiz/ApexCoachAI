# ApexCoachAI Repository Structure & Governance

**Last Updated**: 2025-11-28  
**Purpose**: Define canonical repository structure and prevent future bloat

## 📁 Canonical Folder Structure

```
apexcoachai/
├── apps/
│   ├── web/                    # Frontend (React/Vite)
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── features/       # Feature-based organization
│   │   │   ├── pages/          # Route components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API clients
│   │   │   ├── contexts/       # React contexts/state
│   │   │   ├── assets/         # Static assets
│   │   │   └── types/          # TypeScript types
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── staticwebapp.config.json
│   └── services/               # Backend services
│       ├── indexer/           # Document indexing service
│       │   ├── src/
│       │   │   ├── routes/     # API routes
│       │   │   ├── services/   # Business logic
│       │   │   ├── lib/        # Utilities
│       │   │   └── plugins/    # Fastify plugins
│       │   ├── package.json
│       │   └── Dockerfile
│       └── search/            # AI search service
│           ├── src/
│           │   ├── routes/     # API routes
│           │   ├── services/   # Business logic
│           │   ├── lib/        # Utilities
│           │   └── plugins/    # Fastify plugins
│           ├── prisma/         # Database schema
│           ├── package.json
│           └── Dockerfile
├── data/                       # Local data/ML working area (gitignored; no large datasets in repo)
├── docs/                       # Essential documentation only
│   └── DEPLOYMENT_GUIDE.md     # Single source of truth for deployment
├── infra/                      # Infrastructure as code
│   ├── azure/                  # Azure-specific infrastructure
│   └── docker/                 # Docker configurations
├── scripts/                    # Build and deployment scripts
├── tests/                      # All test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── package.json                # Root package with simple scripts
├── pnpm-workspace.yaml         # Workspace configuration
├── playwright.config.ts        # E2E test configuration
├── azure.yaml                  # Azure deployment configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # Main project documentation
```

## 🚫 Strict Anti-Patterns (FORBIDDEN)

### Folder Structure Anti-Patterns
- **NEVER** create `archive/`, `old/`, `backup/`, `temp/`, `misc/`, `legacy/` folders
- **NEVER** create `docs/archive/` - delete outdated docs instead
- **NEVER** create nested README.md files that just describe folder purpose
- **NEVER** create `.github/instructions/` - AI prompts belong in external wikis
- **NEVER** create `utils/` or `common/` dumping grounds - use domain-specific folders

### Documentation Anti-Patterns
- **NEVER** create multiple overlapping documentation files
- **NEVER** create `CHANGELOG.md` - use GitHub releases instead
- **NEVER** create `IMPLEMENTATION.md`, `AUDIT_SUMMARY.md`, or historical docs
- **NEVER** create demo guides or example docs in main repo
- **ALWAYS** update existing single-source-of-truth docs instead of creating new ones

### Code Quality Anti-Patterns
- **NEVER** commit commented-out code to production
- **NEVER** commit console.log/print statements in production code
- **NEVER** leave TODO comments older than 2 weeks
- **NEVER** commit experimental/POC/spike code to main repo

### Configuration Anti-Patterns
- **NEVER** create duplicate configuration files (e.g., multiple staticwebapp.config.json)
- **NEVER** create multiple `.env.example` files - use one at root
- **NEVER** commit `.env` files with secrets
- **NEVER** create service-specific READMEs that duplicate deployment info

### Code Anti-Patterns
- **NEVER** commit experimental/POC/spike code to main repo
- **NEVER** add dependencies without justification and audit
- **NEVER** leave unused dependencies in package.json files
- **NEVER** create large data files, model artifacts, or binary dumps in repo
- **NEVER** commit files larger than 500KB without explicit approval
- **ALWAYS** delete at least as much code as you add (prevents accumulation)

## ✅ Required Patterns

### File Naming Conventions
- **Components**: PascalCase (e.g., `PersonalityCard.tsx`)
- **Files**: kebab-case (e.g., `chat-service.ts`)
- **Folders**: kebab-case for features, PascalCase for domains
- **Tests**: `.spec.ts` for unit tests, `.e2e.ts` for end-to-end

### Package Management
- **Use pnpm** for all package management
- **Audit dependencies** before adding new ones
- **Remove unused dependencies** immediately
- **Keep package.json clean** - no dev dependencies in production
- **Use approved dependency whitelist** - new packages require architectural review

### Approved Dependencies (Whitelist)
**Frontend (React/Vite)**:
- UI: `@fluentui/*`, `@react-spring/*`
- Core: `react`, `react-dom`, `react-router-dom`
- Build: `vite`, `typescript`, `@vitejs/*`
- Utils: `marked`, `dompurify`, `rimraf`

**Backend (Fastify/Node)**:
- Core: `fastify`, `@fastify/*`
- Database: `@prisma/*`, `prisma`
- Azure: `@azure/*`, `@supabase/*`
- Auth: `jsonwebtoken`, `bcryptjs`
- Utils: `dotenv`, `commander`

**Development**:
- Testing: `@playwright/test`, `c8`
- Build: `concurrently`, `rimraf`
- Linting: `prettier` (single formatter)

*Any dependency not on this list requires architectural review and justification.*

### Documentation Rules
- **Single source of truth**: One deployment guide, one README
- **Update existing docs** instead of creating new ones
- **Keep docs current** - delete outdated content
- **No historical artifacts** in documentation

## 🔍 Pre-commit Validation

The following checks should be performed before committing:
1. **No forbidden folder names** (`archive/`, `temp/`, `backup/`, `old/`, `misc/`, `legacy/`)
2. **No nested README.md files** except root and service READMEs
3. **No duplicate configuration files**
4. **Dependency audit** - all dependencies must be justified
5. **Documentation check** - new features must update existing docs

## 📋 Definition of Done

Before any PR is considered complete:
1. **Code is production-ready** with proper error handling
2. **Tests are written** and passing
3. **Documentation is updated** in existing single-source-of-truth files
4. **Dependencies are audited** and justified
5. **No experimental code** remains in main repo
6. **Folder structure follows** canonical pattern
7. **No anti-patterns** are introduced

## 🚨 Enforcement

This structure is enforced by:
1. **Code review requirements** - all PRs must validate against this structure
2. **Automated checks** - CI/CD validates forbidden patterns
3. **Agent instructions** - AGENTS.md contains strict rules
4. **Developer onboarding** - all developers must read and follow this guide

**Violations of these rules will result in PR rejection and required cleanup.**
