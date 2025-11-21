#!/usr/bin/env pwsh
# Validate GitHub Copilot Coding Agent Configuration
# Tests configuration files, custom agents, and MCP setup

$ErrorActionPreference = "Stop"
$passed = 0
$failed = 0

function Test-Check {
  param(
    [string]$Name,
    [scriptblock]$Check
  )

  Write-Host "Testing: " -NoNewline
  Write-Host $Name -ForegroundColor Cyan

  try {
    $result = & $Check
    if ($result) {
      Write-Host "  ✓ PASS" -ForegroundColor Green
      $script:passed++
    }
    else {
      Write-Host "  ✗ FAIL" -ForegroundColor Red
      $script:failed++
    }
  }
  catch {
    Write-Host "  ✗ ERROR: $_" -ForegroundColor Red
    $script:failed++
  }
  Write-Host ""
}

Write-Host "`n=== GitHub Copilot Coding Agent Configuration Validation ===" -ForegroundColor Yellow
Write-Host ""

# Test 1: MCP Configuration File
Test-Check "MCP config file exists" {
  Test-Path ".github/copilot/mcp-config.yml"
}

Test-Check "MCP config is valid YAML" {
  $content = Get-Content ".github/copilot/mcp-config.yml" -Raw
  # Basic YAML structure check (PowerShell doesn't have native YAML parser)
  return $content -match "mcpServers:" -and $content -match "type:"
}

Test-Check "MCP config has all 7 required servers" {
  $content = Get-Content ".github/copilot/mcp-config.yml" -Raw
  $servers = @("context7", "tavily-mcp", "azure-mcp", "firecrawl-mcp", "postman-mcp", "playwright-mcp", "github-mcp")
  $allPresent = $true
  foreach ($server in $servers) {
    if ($content -notmatch $server) {
      Write-Host "    Missing server: $server" -ForegroundColor Yellow
      $allPresent = $false
    }
  }
  return $allPresent
}

# Test 2: Agent Environment Configuration
Test-Check "Agent environment file exists" {
  Test-Path ".github/copilot/agent-environment.yml"
}

Test-Check "Agent environment has setup steps" {
  $content = Get-Content ".github/copilot/agent-environment.yml" -Raw
  return $content -match "setup:" -and $content -match "run:"
}

Test-Check "Agent environment has required tools" {
  $content = Get-Content ".github/copilot/agent-environment.yml" -Raw
  $tools = @("python", "node", "pnpm")
  $allPresent = $true
  foreach ($tool in $tools) {
    if ($content -notmatch $tool) {
      Write-Host "    Missing tool: $tool" -ForegroundColor Yellow
      $allPresent = $false
    }
  }
  return $allPresent
}

# Test 3: Custom Agents
Test-Check "Custom agents directory exists" {
  Test-Path ".github/agents"
}

Test-Check "All 4 custom agents exist" {
  $agents = @(
    ".github/agents/test-specialist.agent.md",
    ".github/agents/eviction-domain-expert.agent.md",
    ".github/agents/implementation-planner.agent.md",
    ".github/agents/security-reviewer.agent.md"
  )
  $allExist = $true
  foreach ($agent in $agents) {
    if (-not (Test-Path $agent)) {
      Write-Host "    Missing agent: $agent" -ForegroundColor Yellow
      $allExist = $false
    }
  }
  return $allExist
}

Test-Check "All agents have valid YAML frontmatter" {
  $agents = Get-ChildItem ".github/agents/*.agent.md"
  $allValid = $true
  foreach ($agent in $agents) {
    $lines = Get-Content $agent.FullName
    # Check first line is YAML delimiter
    if ($lines[0] -notmatch '^---$') {
      Write-Host "    Missing YAML start delimiter: $($agent.Name)" -ForegroundColor Yellow
      $allValid = $false
      continue
    }
    # Check for closing YAML delimiter
    $yamlEnd = $false
    for ($i = 1; $i -lt $lines.Count; $i++) {
      if ($lines[$i] -match '^---$') {
        $yamlEnd = $true
        break
      }
    }
    if (-not $yamlEnd) {
      Write-Host "    Missing YAML end delimiter: $($agent.Name)" -ForegroundColor Yellow
      $allValid = $false
      continue
    }
    # Check for required fields
    $content = Get-Content $agent.FullName -Raw
    if ($content -notmatch "name:\s*\S+") {
      Write-Host "    Missing name field: $($agent.Name)" -ForegroundColor Yellow
      $allValid = $false
    }
    if ($content -notmatch "description:\s*\S+") {
      Write-Host "    Missing description field: $($agent.Name)" -ForegroundColor Yellow
      $allValid = $false
    }
  }
  return $allValid
}

# Test 4: Documentation
Test-Check "MCP setup documentation exists" {
  Test-Path ".github/copilot/MCP_SETUP.md"
}

Test-Check "MCP setup doc has API key references" {
  $content = Get-Content ".github/copilot/MCP_SETUP.md" -Raw
  return $content -match "API Key" -and $content -match "CONTEXT7_API_KEY"
}

Test-Check "README has complete setup instructions" {
  $content = Get-Content ".github/copilot/README.md" -Raw
  return $content -match "Quick Start" -and $content -match "MCP Servers" -and $content -match "Custom Agents"
}

# Test 5: Workflow Configuration
Test-Check "Pre-session setup workflow exists" {
  Test-Path ".github/workflows/copilot-setup-steps.yml"
}

Test-Check "Setup workflow has pnpm installation" {
  $content = Get-Content ".github/workflows/copilot-setup-steps.yml" -Raw
  return $content -match "pnpm"
}

# Test 6: Consistency Checks
Test-Check "Agent names match between config and files" {
  $agentFiles = Get-ChildItem ".github/agents/*.agent.md"
  $allMatch = $true
  foreach ($agentFile in $agentFiles) {
    $content = Get-Content $agentFile.FullName -Raw
    $baseName = $agentFile.BaseName -replace "\.agent$", ""
    if ($content -notmatch "name:\s*$baseName") {
      Write-Host "    Name mismatch: $($agentFile.Name)" -ForegroundColor Yellow
      $allMatch = $false
    }
  }
  return $allMatch
}

Test-Check "Focus directories exist in monorepo" {
  $dirs = @("apps/api/src", "apps/web/src", "apps/api/src/agents", "apps/api/src/services")
  $allExist = $true
  foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
      Write-Host "    Missing directory: $dir" -ForegroundColor Yellow
      $allExist = $false
    }
  }
  return $allExist
}

# Summary
Write-Host "=== Summary ===" -ForegroundColor Yellow
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
  Write-Host "✓ All checks passed! GitHub Copilot Coding Agent is properly configured." -ForegroundColor Green
  Write-Host ""
  Write-Host "Next Steps:" -ForegroundColor Cyan
  Write-Host "1. Go to Repository Settings → Copilot → MCP Servers"
  Write-Host "2. Paste the contents of .github/copilot/mcp-config.yml"
  Write-Host "3. Enable custom agents in Repository Settings → Copilot → Custom Agents"
  Write-Host "4. Ensure firewall is disabled for MCP server access"
  Write-Host ""
  exit 0
}
else {
  Write-Host "✗ Some checks failed. Review the errors above and fix the configuration." -ForegroundColor Red
  Write-Host ""
  exit 1
}
