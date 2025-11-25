# Playwright MCP API Examples for Apex Coach AI

> **BDD-Style Prompts for AI API Validation using `playwright-mcp`**
>
> These examples demonstrate how to use the [Playwright MCP Server](https://github.com/executeautomation/playwright-mcp-server) for API testing and validation.

## Overview

While the Playwright MCP Server is primarily designed for browser automation, it also provides HTTP methods (`playwright_get`, `playwright_post`, `playwright_put`, `playwright_delete`, `playwright_patch`) that can be used for direct API testing.

---

## Prerequisites

- Backend running at `http://127.0.0.1:3000` (Fastify)
- MCP Server: `@executeautomation/playwright-mcp-server`

---

## Authentication API (AUTH)

### AUTH-API-01: Demo Login Endpoint

```gherkin
Feature: Demo Login API
  As a developer
  I want to test the demo login endpoint
  So that I can verify authentication works correctly

  Scenario: POST demo login with admin role
    Given the backend is running
    When I POST to /auth/demo-login with role "admin"
    Then I should receive a 200 status
    And the response should contain user object with role "ADMIN"
```

**MCP Prompt:**

```
Use playwright_post to call http://127.0.0.1:3000/auth/demo-login with body {"demoRole":"admin"}.
Verify the response contains "user" with "role": "ADMIN".
```

**Expected Response:**

```json
{
  "user": {
    "id": 1,
    "email": "demo.admin@apexcoachai.com",
    "name": "Alex Morgan",
    "role": "ADMIN",
    "isDemo": true,
    "demoRole": "admin"
  }
}
```

---

### AUTH-API-02: Get Current User

```gherkin
Scenario: GET current user after login
  Given I am authenticated
  When I GET /auth/me
  Then I should receive the current user object
```

**MCP Prompt:**

```
First POST to http://127.0.0.1:3000/auth/demo-login with {"demoRole":"admin"}.
Then GET http://127.0.0.1:3000/auth/me.
Verify the response contains user information.
```

**Note:** Requires cookie/session handling which may need browser context.

---

### AUTH-API-03: Logout Endpoint

```gherkin
Scenario: POST logout
  Given I am authenticated
  When I POST to /auth/logout
  Then my session should be cleared
```

**MCP Prompt:**

```
POST to http://127.0.0.1:3000/auth/logout.
Verify the response indicates successful logout.
```

---

## Chat API (CHAT)

### CHAT-API-01: Send Chat Message

```gherkin
Feature: Chat API
  As a developer
  I want to test the chat endpoint
  So that I can verify AI responses work

  Scenario: POST chat message
    Given I am authenticated
    When I POST to /chat with a message
    Then I should receive an AI response
```

**MCP Prompt:**

```
POST to http://127.0.0.1:3000/chat with body:
{
  "message": "Help me with time management",
  "conversationId": null,
  "personalityId": 1
}
Verify the response contains an AI-generated message.
```

**Note:** Requires authentication cookie from previous login.

---

### CHAT-API-02: Get Chat History

```gherkin
Scenario: GET chat history
  Given I am authenticated
  And I have previous conversations
  When I GET /chat/history
  Then I should receive a list of conversations
```

**MCP Prompt:**

```
GET http://127.0.0.1:3000/chat/history.
Verify the response is an array of conversation objects.
```

---

## Admin API (ADMIN)

### ADMIN-API-01: Get All Users

```gherkin
Feature: Admin Users API
  As an admin
  I want to retrieve all users
  So that I can manage platform users

  Scenario: GET all users as admin
    Given I am authenticated as admin
    When I GET /admin/users
    Then I should receive a list of users
```

**MCP Prompt:**

```
First authenticate as admin via demo login.
GET http://127.0.0.1:3000/admin/users.
Verify the response contains user records.
```

---

### ADMIN-API-02: Get Meta Prompts

```gherkin
Scenario: GET meta prompts
  Given I am authenticated
  When I GET /meta-prompts
  Then I should receive coaching personalities
```

**MCP Prompt:**

```
GET http://127.0.0.1:3000/meta-prompts.
Verify the response contains personality definitions with system prompts.
```

---

### ADMIN-API-03: Get Analytics

```gherkin
Scenario: GET analytics data
  Given I am authenticated as admin
  When I GET /admin/analytics?period=7days
  Then I should receive analytics snapshot
```

**MCP Prompt:**

```
GET http://127.0.0.1:3000/admin/analytics?period=7days.
Verify the response contains analytics data.
```

---

## Content/Library API (LIB)

### LIB-API-01: Get Documents

```gherkin
Feature: Content Library API
  As a user
  I want to retrieve library documents
  So that I can browse available content

  Scenario: GET all documents
    Given I am authenticated
    When I GET /documents
    Then I should receive a list of documents with status
```

**MCP Prompt:**

```
GET http://127.0.0.1:3000/documents.
Verify the response is an array with document objects containing status field.
```

---

### LIB-API-02: Get Programs

```gherkin
Scenario: GET programs
  Given I am authenticated
  When I GET /programs
  Then I should receive available coaching programs
```

**MCP Prompt:**

```
GET http://127.0.0.1:3000/programs.
Verify the response contains program objects.
```

---

## Health Check API

### HEALTH-API-01: Backend Health

```gherkin
Feature: Health Check
  As a developer
  I want to verify the backend is running

  Scenario: GET health endpoint
    When I GET /health
    Then I should receive status "ok"
```

**MCP Prompt:**

```
GET http://127.0.0.1:3000/health.
Verify the response contains {"status":"ok"} or similar health indicator.
```

---

## Response Validation with MCP

### Using playwright_expect_response and playwright_assert_response

For scenarios where you need to validate API responses during browser interactions:

```
Start waiting for response with playwright_expect_response:
  - id: "login-response"
  - url: "**/auth/demo-login"

Perform the login action in the browser.

Assert the response with playwright_assert_response:
  - id: "login-response"
  - value: '"role":"ADMIN"'
```

---

## API Endpoints Reference

| Endpoint           | Method | Auth Required | Admin Only | Description         |
| ------------------ | ------ | ------------- | ---------- | ------------------- |
| `/auth/demo-login` | POST   | No            | No         | Demo authentication |
| `/auth/me`         | GET    | Yes           | No         | Get current user    |
| `/auth/logout`     | POST   | Yes           | No         | End session         |
| `/chat`            | POST   | Yes           | No         | Send chat message   |
| `/chat/history`    | GET    | Yes           | No         | Get conversations   |
| `/meta-prompts`    | GET    | Yes           | No         | Get personalities   |
| `/documents`       | GET    | Yes           | No         | List documents      |
| `/programs`        | GET    | Yes           | No         | List programs       |
| `/admin/users`     | GET    | Yes           | Yes        | List all users      |
| `/admin/analytics` | GET    | Yes           | Yes        | Get analytics       |
| `/health`          | GET    | No            | No         | Health check        |

---

## Notes

1. **Authentication**: Most endpoints require JWT token in HTTP-only cookie
2. **CORS**: API allows requests from `localhost:5173` (frontend)
3. **Role Checking**: Admin endpoints validate user role server-side
4. **Response Format**: All responses are JSON

---

## Troubleshooting

### 401 Unauthorized

- Ensure you've logged in first via `/auth/demo-login`
- Check that cookies are being sent with requests

### 403 Forbidden

- Verify you're using an admin account for admin-only endpoints
- Check that your session hasn't expired

### 500 Internal Server Error

- Check backend logs for detailed error messages
- Verify environment variables are set (especially Azure AI credentials)

### Connection Refused

- Ensure backend is running on port 3000
- Check that `.env` file exists with required variables

---

## Related Files

- Web Examples: [`docs/mcp-web-examples.md`](./mcp-web-examples.md)
- Test Plan: [`tests/PLAYWRIGHT_TEST_PLAN.md`](../tests/PLAYWRIGHT_TEST_PLAN.md)
- API Routes: [`apps/backend/search/src/routes/`](../apps/backend/search/src/routes/)
