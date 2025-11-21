# GitHub Copilot Coding Agent Configuration for Lawli

Complete configuration for GitHub Copilot Coding Agents for the Lawli legal AI platform.

## Quick Start

### 1. Enable Copilot Coding Agent

1. Navigate to **Repository Settings** → **Copilot** → **Coding Agent**
2. Enable **"Coding Agent"**
3. Ensure **"Firewall"** is **disabled** (for MCP server access)

### 2. Configure MCP Servers

1. Go to **Repository Settings** → **Copilot** → **MCP Servers**
2. Click **"Add MCP Server Configuration"**
3. Paste the contents of `.github/copilot/mcp-config.yml`
4. Click **"Save"**

> **Important**: MCP configuration must be done via the GitHub UI. See [`MCP_SETUP.md`](./MCP_SETUP.md) for detailed instructions.

### 3. Select Custom Agents

In **Repository Settings** → **Copilot** → **Custom Agents**, enable:

- `test-specialist` - Test coverage and quality assurance
- `eviction-domain-expert` - Texas eviction procedural guidance
- `implementation-planner` - Technical planning and architecture
- `security-reviewer` - Security and dependency review

## Configuration Files

### Core Configuration

- **`mcp-config.yml`** - MCP server definitions (Context7, Tavily, Azure, etc.)
- **`agent-environment.yml`** - Environment setup, dependencies, and context
- **`custom-agents.yml`** - Custom agent metadata and capabilities
- **`firewall.yml`** - Network access rules (firewall disabled for MCP)

### Custom Agents

Located in `.github/agents/`:

- **`test-specialist.agent.md`** - Testing specialist
- **`eviction-domain-expert.agent.md`** - Texas eviction procedures
- **`implementation-planner.agent.md`** - Architecture and planning
- **`security-reviewer.agent.md`** - Security reviews

### Documentation

- **`MCP_SETUP.md`** - Complete MCP server setup guide with API keys and troubleshooting
- **`README.md`** - This file

## MCP Servers

Lawli uses 7 MCP servers to extend Copilot capabilities:

| Server             | Capability            | Use Cases                                   |
| ------------------ | --------------------- | ------------------------------------------- |
| **context7**       | Library documentation | Find up-to-date framework docs and examples |
| **tavily-mcp**     | Web search            | Research legal statutes and case law        |
| **azure-mcp**      | Azure management      | Query and manage Azure resources            |
| **firecrawl-mcp**  | Web scraping          | Extract content from legal websites         |
| **postman-mcp**    | API testing           | Test and document API endpoints             |
| **playwright-mcp** | Browser automation    | Generate and run E2E tests                  |
| **github-mcp**     | GitHub API            | Automate GitHub operations                  |

**See [`MCP_SETUP.md`](./MCP_SETUP.md) for complete setup instructions, API keys, and usage examples.**

## Custom Agents Overview

### Test Specialist (`test-specialist`)

**Focus**: Test coverage, quality, and reliability

**Capabilities**:

- Audit existing tests and identify gaps
- Generate unit, integration, and Playwright E2E tests
- Ensure tests are deterministic, isolated, and fast
- Use project conventions (pnpm, turbo, `.build/reports`)

**Usage**:

```
@test-specialist Review test coverage for the eviction agent and suggest improvements
```

### Eviction Domain Expert (`eviction-domain-expert`)

**Focus**: Texas eviction procedural guidance (NO legal advice)

**Capabilities**:

- Translate user intent into procedural checklists
- Identify required documents and notice periods
- Reference Texas Property Code statutes
- Flag missing data and request clarification

**Usage**:

```
@eviction-domain-expert Create a checklist for a 3-day notice to vacate in Texas
```

### Implementation Planner (`implementation-planner`)

**Focus**: Technical planning and architecture

**Capabilities**:

- Decompose features into sequenced tasks
- Design data flows and interfaces
- Identify risk areas and mitigation strategies
- Define test strategies and coverage goals

**Usage**:

```
@implementation-planner Create a technical plan for adding contract review functionality
```

### Security Reviewer (`security-reviewer`)

**Focus**: Security posture and dependency risk

**Capabilities**:

- Review dependency manifests for vulnerabilities
- Audit container hardening (Dockerfiles)
- Check secrets and environment variable patterns
- Identify OWASP and supply chain risks

**Usage**:

```
@security-reviewer Review the API Dockerfile for security issues
```

## Environment Configuration

The agent environment is configured in `agent-environment.yml` and includes:

### Pre-Session Setup

- Node.js 22.x and pnpm 10.12.1 installation
- Python 3.11 dependency setup
- Monorepo workspace verification

### Environment Variables

- Azure OpenAI endpoints and deployments
- Azure AI Search configuration
- PostgreSQL connection details
- Application context (base URL, environment)

### Focus Directories

- `apps/api/src` - Backend API code
- `apps/web/src` - Frontend web code
- `apps/api/src/agents` - AI agent implementations
- `apps/api/src/services` - Shared services

### Ignored Patterns

- `**/__pycache__/**` - Python bytecode
- `**/node_modules/**` - Node dependencies
- `**/dist/**` - Build artifacts
- `**/*.log` - Log files

## Workflows

### Pre-Session Setup Workflow

`.github/workflows/copilot-setup-steps.yml` runs before each agent session to:

1. Install Node.js and pnpm
2. Set up Python environment
3. Install project dependencies
4. Verify monorepo structure

### Agent Testing

Use `.github/copilot/agent-tests.yml` for testing custom agents:

```bash
# Run agent validation tests
gh copilot test --agent test-specialist
```

## Security Considerations

### API Keys and Secrets

- **Never commit API keys** to version control
- **Rotate keys quarterly** for production credentials
- **Use environment-specific keys** for development vs. production
- **Monitor usage** through GitHub audit logs

### Network Access

- **Firewall disabled** to allow MCP server communication
- **Restricted to MCP endpoints** via configuration
- **Audit logs enabled** for all MCP tool usage

### Compliance

- **TRAIGA compliance**: No discriminatory outputs, transparency in AI-generated content
- **UPL guardrails**: No legal advice, procedural focus only
- **Audit logging**: All interactions logged via compliance service

## Troubleshooting

### MCP Servers Not Loading

1. Verify configuration was saved in GitHub UI
2. Check that firewall is disabled
3. Restart Copilot agent session
4. Review GitHub Codespaces logs

### Custom Agent Not Available

1. Verify agent markdown files exist in `.github/agents/`
2. Check YAML frontmatter syntax
3. Ensure agent is enabled in repository settings

### Environment Setup Fails

1. Check `.github/workflows/copilot-setup-steps.yml` logs
2. Verify pnpm and Python versions
3. Test dependency installation locally

## References

### GitHub Documentation

- [Customize Agent Environment](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)
- [Create Custom Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Test Custom Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/test-custom-agents)
- [Extend with MCP](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp)

### Project Documentation

- [`MCP_SETUP.md`](./MCP_SETUP.md) - Complete MCP configuration guide
- [`AGENTS.md`](/AGENTS.md) - Lawli AI agent architecture
- [`TESTING.md`](/TESTING.md) - Testing strategy and conventions

---

_Last Updated: November 19, 2025_
