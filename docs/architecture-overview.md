# Architecture Overview

## High-Level Summary

This application is a ChatGPT + Enterprise Data solution implementing the Retrieval Augmented Generation (RAG) pattern using Azure OpenAI and Azure AI Search. The system allows users to chat with enterprise data through a web interface.

## Application Structure

### Frontend Stack

**Framework**: React 18 with TypeScript
**Build Tool**: Vite
**Routing**: React Router v6 (Hash Router)
**UI Components**: Fluent UI React
**Chat Component**: Custom Lit web component (`chat-component` package)

**Main Entry Point**: `apps/frontend/src/index.tsx`

- Sets up the React Router with hash-based routing
- Defines routes for Chat (`/`), Q&A (`/qa`), and 404 pages

**Layout**: `apps/frontend/src/pages/layout/Layout.tsx`

- Provides the main app shell with sidebar navigation
- Contains sections for Chats, Library, and Settings
- Displays Apex Coach AI branding with logo

**Chat Page**: `apps/frontend/src/pages/chat/Chat.tsx`

- Main conversational UI using the `<chat-component>` web component
- Contains settings panel for configuring RAG behavior
- Manages state for retrieval options, streaming, semantic search, etc.

**API Client**: `apps/frontend/src/api/`

- `index.ts`: Exports API base URL from environment variable
- `models.ts`: Defines TypeScript types for Approaches, RetrievalMode, RequestOverrides

### Backend Stack

**Framework**: Fastify (Node.js)
**Language**: TypeScript
**Main Server**: `apps/backend/search/src/app.ts`

**Entry Point**: `apps/backend/search/src/app.ts`

- Uses Fastify's auto-loading for plugins and routes
- Loads plugins from `apps/backend/search/src/plugins/`
- Loads routes from `apps/backend/search/src/routes/`

**Main Routes**: `apps/backend/search/src/routes/root.ts`

- `POST /chat`: Chat endpoint with conversation history
- `POST /ask`: Single-question Q&A endpoint
- `GET /content/:path`: Retrieves content from Azure Blob Storage
- Both chat and ask support streaming responses via `application/x-ndjson`

**Plugins**:

- `azure.ts`: Azure service clients (Search, OpenAI, Blob Storage)
- `config.ts`: Configuration from environment variables
- `openai.ts`: OpenAI service wrapper
- `approaches.ts`: Registers RAG approach implementations
- `schemas.ts`: JSON schema definitions for request/response validation

### Current RAG Flow

#### RAG Implementation Location

**Approaches Directory**: `apps/backend/search/src/lib/approaches/`

The application implements multiple RAG strategies:

1. **Chat Read-Retrieve-Read** (`chat-read-retrieve-read.ts`) - Default for chat
2. **Ask Retrieve-Then-Read** (`ask-retrieve-then-read.ts`) - Default for Q&A

#### Chat Read-Retrieve-Read Flow (Main RAG Strategy)

**File**: `apps/backend/search/src/lib/approaches/chat-read-retrieve-read.ts`

**Step 1: Query Generation**

- Takes conversation history and latest user message
- Uses OpenAI ChatGPT to generate an optimized search query
- Falls back to raw user input if generation fails
- System prompt: `QUERY_PROMPT_TEMPLATE` with few-shot examples

**Step 2: Document Retrieval** (in `approach-base.ts`)

- Calls `searchDocuments()` method
- Uses Azure AI Search to find relevant documents
- Supports multiple retrieval modes:
  - **Hybrid**: Combines text and vector search
  - **Text**: Keyword-based search only
  - **Vectors**: Semantic search with embeddings
- Can use semantic ranker for better relevance
- Returns top N documents (configurable, default: 3)

**Step 3: Context-Aware Response Generation**

- Constructs messages with:
  - System message with instructions
  - Conversation history
  - Retrieved document content as "Sources"
- Calls OpenAI ChatGPT with full context
- Optional: Generates follow-up questions
- Supports streaming or non-streaming responses

**Data Flow Diagram**:

```
User Message
    ↓
[Step 1: OpenAI Chat] → Optimized Search Query
    ↓
[Step 2: Azure AI Search] → Relevant Documents (with embeddings if vector mode)
    ↓
[Step 3: OpenAI Chat + Context] → Final Answer with Citations
    ↓
Frontend Display
```

#### Azure OpenAI Integration

**Location**: `apps/backend/search/src/plugins/openai.ts`

- Creates OpenAI client using Azure OpenAI endpoint
- Manages both chat and embedding models
- Chat Model: `gpt-4o-mini` (default)
- Embedding Model: `text-embedding-ada-002` (default)
- Uses Azure credentials from environment

#### Azure AI Search Integration

**Location**: `apps/backend/search/src/plugins/azure.ts` and `approach-base.ts`

**Search Client Setup**:

- Connects to Azure AI Search service
- Uses index specified in environment (`AZURE_SEARCH_INDEX`)
- Supports managed identity authentication

**Search Execution** (`approach-base.ts` → `searchDocuments()`):

- Builds search query with optional filters
- Retrieves embeddings for semantic search (if vector mode)
- Executes search with configurable options:
  - Top K results
  - Semantic ranking
  - Semantic captions
  - Category exclusions
- Extracts content and citations from results

**Document Structure**:

- Each result contains:
  - `content`: Main text content
  - `category`: Document category
  - `sourcepage`: Source file reference
  - `sourcefile`: Original file path

#### Citations Flow

**Citation Data Structure** (in search results):

- Extracted from `sourcepage` and `sourcefile` fields
- Formatted as `[filename]` in the response
- Frontend can reference Azure Blob Storage via `/content/:path` endpoint

**Citation Display**:

- Citations are embedded in the response text
- Data points (sources) are returned in `context.data_points.text`
- Frontend displays citations alongside the answer

## Key Environment Variables

**Backend** (`.env` in search package):

- `AZURE_OPENAI_API_ENDPOINT`: OpenAI service endpoint
- `AZURE_OPENAI_CHATGPT_DEPLOYMENT`: Chat model deployment name
- `AZURE_OPENAI_EMBEDDING_DEPLOYMENT`: Embedding model deployment name
- `AZURE_SEARCH_ENDPOINT`: AI Search service endpoint
- `AZURE_SEARCH_INDEX`: Search index name
- `AZURE_STORAGE_ACCOUNT`: Blob storage account name
- `AZURE_STORAGE_CONTAINER`: Container for documents

**Frontend** (injected at build time):

- `VITE_SEARCH_API_URI`: Backend API base URL

## Data Indexing

**Indexer Service**: `apps/backend/indexer/`

- Separate service for ingesting documents
- Processes documents (markdown, PDF, etc.)
- Generates embeddings and uploads to Azure AI Search
- CLI tool: `npx index-files` for manual indexing

## Deployment Architecture

**Infrastructure as Code**: `infra/` directory with Bicep templates

**Services**:

1. **Azure Static Web Apps**: Hosts the React frontend
2. **Azure Container Apps**: Runs the Fastify search API
3. **Azure Container Apps**: Runs the indexer service
4. **Azure OpenAI**: Provides GPT models
5. **Azure AI Search**: Document index and retrieval
6. **Azure Blob Storage**: Stores source documents

**Deployment Tool**: Azure Developer CLI (`azd`)

- `azd up`: Provisions infrastructure and deploys code
- `azd deploy`: Updates code without reprovisioning

## Persistence

### Database Technology

**SQLite with better-sqlite3**: The application uses SQLite as its persistence layer for simplicity and portability. The database file is stored at `data/app.db` by default (configurable via `DATABASE_PATH` environment variable).

### Database Schema

The application maintains five core tables:

**users**

- `id` (INTEGER PRIMARY KEY): User identifier
- `email` (TEXT UNIQUE): User email address for login
- `password_hash` (TEXT): Bcrypt-hashed password
- `name` (TEXT): Optional user display name
- `created_at` (DATETIME): Account creation timestamp

**chats**

- `id` (INTEGER PRIMARY KEY): Chat identifier
- `user_id` (INTEGER): Foreign key to users table
- `title` (TEXT): Chat title (derived from first message)
- `created_at` (DATETIME): Chat creation timestamp
- `updated_at` (DATETIME): Last activity timestamp

**chat_messages**

- `id` (INTEGER PRIMARY KEY): Message identifier
- `chat_id` (INTEGER): Foreign key to chats table
- `role` (TEXT): Message role (user, assistant, system)
- `content` (TEXT): Message text content
- `citations_json` (TEXT): JSON-serialized citations array
- `created_at` (DATETIME): Message timestamp

**meta_prompts** (Personalities)

- `id` (INTEGER PRIMARY KEY): Personality identifier
- `name` (TEXT): Display name (e.g., "Tim – Inside Out Marriage Coach")
- `prompt_text` (TEXT): System prompt that defines the personality
- `is_default` (BOOLEAN): Whether this is the default personality
- `created_at` (DATETIME): Creation timestamp

**user_settings**

- `user_id` (INTEGER PRIMARY KEY): Foreign key to users table
- `default_personality_id` (INTEGER): User's preferred default personality
- `nickname` (TEXT): Optional user nickname
- `occupation` (TEXT): Optional user occupation

### Data Access Layer

**Repository Pattern**: The application uses a repository pattern for data access:

- `apps/backend/search/src/db/userRepository.ts`: User CRUD operations
- `apps/backend/search/src/db/chatRepository.ts`: Chat management
- `apps/backend/search/src/db/messageRepository.ts`: Message storage and retrieval
- `apps/backend/search/src/db/metaPromptRepository.ts`: Personality management
- `apps/backend/search/src/db/userSettingsRepository.ts`: User preferences

All repositories are exported from `apps/backend/search/src/db/index.ts` for convenient importing.

### Database Initialization

The database schema is automatically initialized on application startup via the `database` plugin (`packages/search/src/plugins/database.ts`). On first run, it:

1. Creates all tables with appropriate indexes
2. Enables foreign key constraints
3. Seeds a default meta prompt ("Tim – Inside Out Marriage Coach")

## Authentication

### Authentication Flow

**JWT-based Authentication with HTTP-only Cookies**: The application uses JWT tokens stored in HTTP-only cookies for secure session management.

**Key Components**:

- `@fastify/jwt`: JWT token generation and verification
- `@fastify/cookie`: Cookie management
- `bcryptjs`: Password hashing (10 rounds)

**Auth Plugin**: `apps/backend/search/src/plugins/auth.ts`

- Registers JWT and cookie support
- Provides `fastify.authenticate` decorator for protecting routes
- JWT secret configurable via `JWT_SECRET` environment variable

**Auth Routes**: `apps/backend/search/src/routes/auth.ts`

- `POST /auth/signup`: Create new user account
  - Validates email uniqueness
  - Hashes password with bcrypt
  - Returns JWT token in HTTP-only cookie
  - Returns user data (id, email, name)

- `POST /auth/login`: Authenticate existing user
  - Verifies email and password
  - Returns JWT token in HTTP-only cookie
  - Returns user data

- `POST /auth/logout`: End user session
  - Clears authentication cookie

- `GET /auth/me`: Get current authenticated user
  - Protected route requiring valid JWT
  - Returns current user information

**Protected Routes**: The following routes require authentication (use `preHandler: [fastify.authenticate]`):

- All `/api/chat*` endpoints
- All `/chats/*` endpoints
- All `/meta-prompts` endpoints
- All `/me/settings` endpoints

**Token Lifecycle**:

- Tokens expire after 7 days
- Tokens are automatically sent with requests via cookies
- Invalid/expired tokens result in 401 Unauthorized responses

## Current Limitations

- ~~No persistent chat history (stored in browser only)~~ **FIXED**: Chat history now persisted in SQLite database
- ~~No user authentication by default~~ **FIXED**: JWT-based authentication implemented
- ~~No multi-user support~~ **FIXED**: Full multi-user support with user isolation
- No admin interface for content management
- ~~Sample data is for a fictional "Contoso Real Estate" company~~ Rebranded to Apex Coach AI with coaching personalities

## Roles & Permissions

The application now supports a role-based access control (RBAC) system to distinguish between different user types.

**Roles**:

- **admin**: Full administrative access to the system. Can manage users, programs, knowledge base, and view analytics.
- **coach**: Can be assigned to programs and has elevated privileges for managing participants (future feature).
- **user**: Standard user with access to chat and library features.

**Implementation**:

- The `users` table now has a `role` column.
- A `requireRole` middleware in `apps/backend/search/src/plugins/auth.ts` protects routes based on user roles.
- Admin routes under `/api/admin` are protected with `requireRole('admin')`.

## Admin Console

A new admin console has been added at `/admin` to provide administrators with a centralized location for managing the application.

**Features**:

- **People & Invitations**: Manage users, change their roles, and send invitations to new users.
- **Programs & Assignments**: Create and manage programs, and assign coaches and participants to them.
- **Knowledge Base Overview**: View the status of the knowledge base, including total resources, trained documents, and ingestion status.
- **Analytics Snapshot**: View key metrics and usage data for the application.

## Analytics & Events

The application now logs key usage events to a `usage_events` table for analytics purposes.

**Events Logged**:

- `chat_message`: A user or assistant sends a chat message.
- `resource_ingested`: A new resource is successfully ingested into the knowledge base.
- `login`: A user logs in.

**Analytics API**:

- The `/api/admin/analytics` endpoint provides a snapshot of analytics data for a given time range.

## Data Controls

Users now have control over their data through the "Data & Privacy" section in the settings.

**Features**:

- **Export Data**: Users can export their profile, settings, and chat history as a JSON file.
- **Delete All Chats**: Users can delete all of their chat history.
- **Delete Account**: Users can delete their account and all associated data.
