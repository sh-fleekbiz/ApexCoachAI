# AGENTS.md - Apex Coach AI

AI coding agent guide for Apex Coach AI, an AI-powered coaching and development platform that transforms proprietary content into interactive AI coaching experts.

## Project Overview

**Application**: AI-Powered Coaching & Development Platform
**URL**: https://apexcoach.shtrial.com
**Stack**: Monorepo with React webapp + Fastify search backend + Azure OpenAI/Azure AI Search
**Target Market**: Content-focused SMBs, coaches, consultants, and training companies

## Business Context

Apex Coach AI is a consumer-to-business (C2B) solution that enables:

- **Coaches & Consultants**: Scale 1-on-1 coaching without sacrificing personalization
- **Training Companies**: Turn course libraries into interactive learning assistants
- **Startup Founders**: Provide consistent onboarding for growing teams
- **Professional Services**: Deliver client support backed by proprietary methodologies

**Key Value Proposition**: Turn proprietary videos and training materials into a 24/7 interactive AI expert that speaks with your authority.

## Project Structure

```
ApexCoachAI/
└── packages/
    ├── webapp/       # React coaching UI (talks to search API via VITE_SEARCH_API_URI)
    └── search/       # Fastify RAG backend (Azure OpenAI + Azure AI Search, optional Supabase repos)
```

## Tech Stack

- **Monorepo**: pnpm workspaces with separate webapp + search packages
- **Frontend**: React + TypeScript (packages/webapp)
- **Backend**: Node.js + Fastify (packages/search/src/app.ts)
- **RAG**: Azure OpenAI (default gpt-4o-mini; target gpt-5.1-mini) + Azure AI Search
- **Optional Storage**: Supabase client/repositories for users, chats, messages, prompts (packages/search/src/supabase-\*.ts)

## Build & Test Commands

```bash
pnpm install
pnpm build            # Build all packages
pnpm test             # Run tests
pnpm lint             # Lint all packages
```

## Coding Conventions

- Follow monorepo structure
- Use shared Azure OpenAI resources
- TypeScript strict mode
- Meaningful package names

## Environment Variables

See `.env.example`. Use shared Azure OpenAI configuration.

## PR Guidelines

- Title: `[Apex Coach AI] Description`
- All tests passing
- No TypeScript errors

## MCP Integration

Use Context7 MCP for library documentation and best practices.
