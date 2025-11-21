# MCP Server Configuration for GitHub Copilot Coding Agent

This document details the Model Context Protocol (MCP) server configuration for the Lawli repository.

## Overview

MCP servers extend GitHub Copilot Coding Agent with external tools and data sources. Lawli uses 7 MCP servers for enhanced capabilities:

| Server | Purpose | Type | Key Capabilities |
|--------|---------|------|------------------|
| **context7** | Documentation & library context | HTTP | Access to up-to-date library docs and code examples |
| **tavily-mcp** | Web search & research | stdio | Real-time web search for legal research and current information |
| **azure-mcp** | Azure resource management | stdio | Direct Azure resource queries and management |
| **firecrawl-mcp** | Web scraping & content extraction | stdio | Extract and process web content for ingestion |
| **postman-mcp** | API testing & documentation | stdio | API endpoint testing and documentation generation |
| **playwright-mcp** | Browser automation & testing | stdio | E2E test generation and execution |
| **github-mcp** | GitHub API integration | HTTP | Enhanced GitHub operations and workflow automation |

## Configuration File

The MCP configuration is defined in `.github/copilot/mcp-config.yml` and follows GitHub's MCP schema:

```yaml
mcpServers:
  context7:
    url: "https://mcp.context7.com/mcp"
    headers:
      CONTEXT7_API_KEY: "<api_key>"
    type: "http"
    tools: ["*"]
```

## API Keys and Secrets

The following API keys are configured for MCP servers:

### Context7
- **API Key**: `ctx7sk-00145509-788a-4923-a9ca-e5088880f21c`
- **Usage**: Library documentation and code context
- **Rate Limits**: Standard tier

### Tavily
- **API Key**: `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`
- **Usage**: Web search and research
- **Rate Limits**: Developer tier

### Azure MCP
- **Tenant ID**: `71f8de90-0c77-41a1-9592-d1b104c46c24`
- **Client ID**: `f3327c69-6e83-4e9f-a0ec-7aa854d35668`
- **Client Secret**: `<PLACEHOLDER_AZURE_CLIENT_SECRET>`
- **Subscription ID**: `44e77ffe-2c39-4726-b6f0-2c733c7ffe78`
- **Usage**: Azure resource management and queries

### Firecrawl
- **API Key**: `fc-7a3eaed00fd44667b70c9a29ed7403bc`
- **Usage**: Web content extraction and ingestion
- **Rate Limits**: Standard tier

### Postman
- **API Key**: `<PLACEHOLDER_POSTMAN_API_KEY>`
- **Usage**: API testing and documentation
- **Rate Limits**: Free tier

### GitHub MCP
- **Personal Access Token**: `<PLACEHOLDER_GITHUB_TOKEN>`
- **Usage**: GitHub API operations
- **Permissions**: repo, workflow, read:org

### Playwright MCP
- **No authentication required**
- **Usage**: Browser automation and E2E testing
- **Capabilities**: Test generation, execution, debugging

## Setup Instructions

### 1. Configure MCP Servers in GitHub UI

1. Go to **Repository Settings** → **Copilot** → **MCP Servers**
2. Click **"Add MCP Server Configuration"**
3. Paste the entire contents of `.github/copilot/mcp-config.yml`
4. Click **"Save"**

> **Note**: MCP configuration must be done via the GitHub UI. There is no API endpoint for programmatic configuration as of November 2025.

### 2. Verify MCP Server Availability

In a Copilot Coding Agent session, you can verify MCP servers are loaded:

```bash
# The agent will have access to MCP tools automatically
# You can check available tools by asking:
# "What MCP servers are available?"
```

### 3. Test Individual MCP Servers

#### Context7
```bash
# Ask: "Use Context7 to find the latest Next.js documentation for App Router"
```

#### Tavily
```bash
# Ask: "Use Tavily to search for recent Texas eviction law changes"
```

#### Azure MCP
```bash
# Ask: "List all Container Apps in the lawli resource group"
```

#### Firecrawl
```bash
# Ask: "Use Firecrawl to extract content from the Texas Property Code website"
```

#### Postman
```bash
# Ask: "Test the /api/agents/eviction endpoint with a sample payload"
```

#### Playwright
```bash
# Ask: "Generate a Playwright test for the eviction wizard flow"
```

#### GitHub MCP
```bash
# Ask: "Create a new issue for implementing contract review agent"
```

## Usage Patterns

### Legal Research Workflow
1. **Tavily**: Search for recent case law or statute changes
2. **Firecrawl**: Extract and parse official legal documents
3. **Context7**: Reference implementation patterns from legal tech libraries

### Development Workflow
1. **GitHub MCP**: Create issues and manage project boards
2. **Playwright**: Generate and run E2E tests
3. **Postman**: Test API endpoints and generate documentation

### DevOps Workflow
1. **Azure MCP**: Query and manage Azure resources
2. **GitHub MCP**: Trigger workflows and deployments
3. **Context7**: Reference Azure SDK documentation

## Best Practices

### Security
- **Never commit API keys** to version control (this file is documentation only)
- **Rotate keys regularly** (quarterly for production, monthly for sensitive operations)
- **Use least-privilege tokens** for GitHub PAT and Azure credentials
- **Monitor API usage** to detect anomalies or unauthorized access

### Performance
- **Prefer stdio servers** for frequently used tools (faster than HTTP)
- **Rate limit awareness**: Implement backoff for high-frequency operations
- **Cache responses**: Context7 and Tavily results can be cached for recent queries

### Debugging
If an MCP server fails to load:
1. Check API key validity and expiration
2. Verify network connectivity (for HTTP servers)
3. Check Node.js/npx availability (for stdio servers)
4. Review GitHub Codespaces logs for error messages

## Troubleshooting

### MCP Server Not Available
**Symptom**: Copilot agent doesn't recognize MCP tools

**Solutions**:
1. Verify configuration was saved in GitHub UI
2. Restart the Copilot agent session
3. Check that the server type (http/stdio) matches the configuration

### Authentication Errors
**Symptom**: 401/403 errors when using MCP tools

**Solutions**:
1. Verify API keys are current and not expired
2. Check token permissions for GitHub and Azure
3. Rotate and update keys in the configuration

### Performance Issues
**Symptom**: MCP tool calls timeout or hang

**Solutions**:
1. Check rate limits for the specific MCP server
2. Reduce concurrent MCP tool usage
3. Switch from HTTP to stdio if available

## References

- [GitHub Copilot MCP Documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Azure MCP Server](https://github.com/Azure/azure-mcp)
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)
- [Context7 Documentation](https://context7.com/docs)
- [Tavily MCP Documentation](https://tavily.com/mcp)

## Maintenance

### Key Rotation Schedule
- **Quarterly**: Azure credentials, GitHub PAT
- **Monthly**: Third-party API keys (Context7, Tavily, Firecrawl, Postman)
- **As needed**: Immediate rotation if compromise suspected

### Audit Logging
All MCP tool usage is logged by GitHub. Review logs regularly:
1. Go to **Settings** → **Copilot** → **Audit Log**
2. Filter by MCP server name
3. Review for unauthorized or anomalous usage

---

*Last Updated: November 19, 2025*
