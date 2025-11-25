# Playwright MCP Web Examples for Apex Coach AI

> **BDD-Style Prompts for AI Test Validation using `playwright-mcp`**
>
> These examples demonstrate how to use the [Playwright MCP Server](https://github.com/executeautomation/playwright-mcp-server) for live browser validation of Apex Coach AI web scenarios.

## Overview

The Playwright MCP Server enables AI agents to control a real browser for E2E testing. This document provides reusable, BDD-style prompts organized by feature area.

---

## Prerequisites

- Frontend running at `http://localhost:5173` (Vite dev server)
- Backend running at `http://127.0.0.1:3000` (Fastify)
- MCP Server: `@executeautomation/playwright-mcp-server`

---

## Authentication Scenarios (AUTH)

### AUTH-01: Demo Login with Admin Role

```gherkin
Feature: Demo Login
  As a user
  I want to log in with demo credentials
  So that I can access the platform features

  Scenario: Admin demo login
    Given I navigate to the login page
    When I click the "Admin" demo role button
    Then I should be logged in as "Alex Morgan"
    And I should see the chat interface
    And I should have admin access
```

**MCP Prompt:**

```
Navigate to http://localhost:5173/#/login and take a screenshot.
Click the button with text "Admin" to login as demo admin.
Verify the page shows "Alex Morgan" after login.
Navigate to /#/admin and verify the admin panel loads with tabs: People, Programs, Knowledge Base.
```

**MCP Tools Used:**

1. `playwright_navigate` - Open login page
2. `playwright_screenshot` - Capture initial state
3. `playwright_click` - Click Admin button (`button:has-text("Admin")`)
4. `playwright_get_visible_text` - Verify login success
5. `playwright_navigate` - Go to admin panel

---

### AUTH-02: Demo Login with Coach Role

```gherkin
Scenario: Coach demo login
  Given I navigate to the login page
  When I click the "Coach" demo role button
  Then I should be logged in as "Tim Johnson"
  And I should see the chat interface
  But I should NOT have admin access
```

**MCP Prompt:**

```
Navigate to http://localhost:5173/#/login.
Click the button with text "Coach".
Verify the page shows "Tim Johnson" after login.
Try to navigate to /#/admin.
Verify the user is redirected away from admin (should see chat interface, not admin panel).
```

---

### AUTH-03: Demo Login with Client Role

```gherkin
Scenario: Client demo login
  Given I navigate to the login page
  When I click the "Client" demo role button
  Then I should be logged in as "Sarah Thompson"
  And I should see the chat interface
  But I should NOT have admin access
```

**MCP Prompt:**

```
Navigate to http://localhost:5173/#/login.
Click the button with text "Client".
Verify the page shows "Sarah Thompson" after login.
```

---

### AUTH-04: Logout

```gherkin
Scenario: User logout
  Given I am logged in
  When I click the "Logout" button
  Then I should be redirected to the login page
  And I should see the demo role selection buttons
```

**MCP Prompt:**

```
After login, click the text "Logout".
Verify the page shows the login form with "Coach", "Client", "Admin" buttons.
```

---

## Admin Panel Scenarios (ADMIN)

### ADMIN-01: Access Admin Dashboard

```gherkin
Feature: Admin Panel Access
  As an admin user
  I want to access the admin panel
  So that I can manage platform settings

  Scenario: Admin can access dashboard
    Given I am logged in as Admin
    When I navigate to /#/admin
    Then I should see the admin panel
    And I should see tabs: People, Programs, Knowledge Base, Meta Prompts, Analytics, White Label, Action Logs
```

**MCP Prompt:**

```
Login as Admin using the demo login.
Navigate to http://localhost:5173/#/admin.
Verify the page contains: "Admin", "People", "Programs", "Knowledge Base", "Meta Prompts", "Analytics".
Take a screenshot named "admin-dashboard".
```

**Key Selectors:**

- Admin tab: `text=Admin`
- People tab: `text=People`
- Knowledge Base tab: `text=Knowledge Base`

---

### ADMIN-02: Non-Admin Cannot Access Admin Panel

```gherkin
Scenario: Coach cannot access admin panel
  Given I am logged in as Coach
  When I navigate to /#/admin
  Then I should be redirected to the home page
  And I should NOT see the admin panel
```

**MCP Prompt:**

```
Login as Coach using the demo login button.
Navigate to http://localhost:5173/#/admin.
Verify the page does NOT contain "People" tab or admin navigation.
Verify the page shows the chat interface instead.
```

---

### ADMIN-03: View People Management

```gherkin
Scenario: Admin views people management
  Given I am logged in as Admin
  And I am on the admin panel
  When I click the "People" tab
  Then I should see the Members and Invitations sub-tabs
  And I should see a table with columns: Name, Email, Role, Created At
```

**MCP Prompt:**

```
Login as Admin.
Navigate to /#/admin.
Click on the "People" tab.
Verify the page contains "Members", "Invitations".
Verify the page contains table headers: "Name", "Email", "Role".
Take a screenshot named "admin-people".
```

---

### ADMIN-05: View Knowledge Base

```gherkin
Scenario: Admin views knowledge base
  Given I am logged in as Admin
  When I navigate to the Knowledge Base tab
  Then I should see the document upload interface
  And I should see supported document types
```

**MCP Prompt:**

```
Login as Admin.
Navigate to /#/admin.
Click on "Knowledge Base" tab.
Verify the page mentions "PDF Documents", "Word Files", "Text Files".
Take a screenshot named "admin-knowledge-base".
```

---

## Content Library Scenarios (LIB)

### LIB-01: View Content Library

```gherkin
Feature: Content Library
  As a user
  I want to browse the content library
  So that I can see available coaching materials

  Scenario: View empty library
    Given I am logged in
    When I click on "📚 Library" in the sidebar
    Then I should see the library page
    And I should see filter options
```

**MCP Prompt:**

```
Login as Admin.
Click on the text "📚 Library" in the sidebar.
Verify the page contains "Content Library".
Verify the page shows filter options: "All Status", "Indexed", "Processing", "Pending", "Failed".
Take a screenshot named "library-page".
```

**Key Selectors:**

- Library link: `text=📚 Library`
- Status filter: `text=All Status`

---

## Chat Scenarios (CHAT)

### CHAT-01: Send Message

```gherkin
Feature: AI Chat
  As a user
  I want to chat with the AI coach
  So that I can receive coaching guidance

  Scenario: Send a coaching question
    Given I am logged in
    And I am on the chat page
    When I type "Help me with time management" in the chat input
    And I click the send button
    Then the message should appear in the chat history
    And I should receive an AI response
```

**MCP Prompt:**

```
Login as any demo role.
Verify the chat interface is visible with input field.
Fill the input [data-testid="question-input"] with "Hello, I need coaching advice".
Click the send button [data-testid="submit-question-button"].
Wait for the AI response to appear.
Take a screenshot named "chat-conversation".
```

**Key Selectors:**

- Chat input: `[data-testid="question-input"]`
- Send button: `[data-testid="submit-question-button"]`
- New chat button: `button:has-text("+ New Chat")`

---

### CHAT-02: Use Quick Action Buttons

```gherkin
Scenario: Use quick action for goal setting
  Given I am logged in
  And I am on a new chat
  When I click "Help me set and achieve a goal"
  Then a pre-filled message should be sent
  And I should receive coaching guidance on goal setting
```

**MCP Prompt:**

```
Login and go to home page.
Click the button with text "Help me set and achieve a goal".
Verify the chat interface updates with a goal-setting conversation.
```

---

## Utility Prompts

### Take Full Page Screenshot

```
Navigate to {URL}.
Take a full-page screenshot saved to h:\Repos\sh-fleekbiz\ApexCoachAI\tests\reports\screenshots with name "{scenario-name}".
```

### Check for Console Errors

```
After performing actions, retrieve console logs filtering for "error" type.
Report any errors found.
```

### Verify Element Visibility

```
Navigate to {URL}.
Get the visible HTML content with selector "{CSS_SELECTOR}".
Verify the element exists and contains expected attributes.
```

---

## Common CSS Selectors Reference

| Element             | Selector                                 |
| ------------------- | ---------------------------------------- |
| Login Admin Button  | `button:has-text("Admin")`               |
| Login Coach Button  | `button:has-text("Coach")`               |
| Login Client Button | `button:has-text("Client")`              |
| Chat Input          | `[data-testid="question-input"]`         |
| Send Button         | `[data-testid="submit-question-button"]` |
| New Chat Button     | `button:has-text("+ New Chat")`          |
| Library Link        | `text=📚 Library`                        |
| Logout Link         | `text=Logout`                            |
| Admin Panel Tab     | `text=Admin`                             |
| People Tab          | `text=People`                            |
| Knowledge Base Tab  | `text=Knowledge Base`                    |

---

## Notes

1. **HashRouter**: The app uses HashRouter, so all routes are prefixed with `/#/` (e.g., `http://localhost:5173/#/admin`)
2. **Demo Login**: Uses HTTP-only cookies for JWT authentication
3. **Role-Based Access**: Admin/Owner can access `/admin`, other roles are redirected
4. **Case Sensitivity**: Backend returns roles in UPPERCASE (e.g., "ADMIN"), frontend handles case-insensitively

---

## Related Files

- Test Plan: [`tests/PLAYWRIGHT_TEST_PLAN.md`](../tests/PLAYWRIGHT_TEST_PLAN.md)
- E2E Tests: [`tests/e2e/`](../tests/e2e/)
- API Examples: [`docs/mcp-api-examples.md`](./mcp-api-examples.md)
