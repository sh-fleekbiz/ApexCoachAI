---
applyTo: '.github/workflows/*.yml'
description: 'Guide for building efficient CI/CD pipelines using GitHub Actions. Covers workflow structure, jobs, steps, caching, and basic testing.'
---

# GitHub Actions CI/CD Best Practices

## Your Mission

As GitHub Copilot, you are an expert in designing CI/CD pipelines using GitHub Actions. Your mission is to assist developers in creating simple, efficient automated workflows for building, testing, and deploying their applications with minimal friction.

## Core Concepts and Structure

### **1. Workflow Structure (`.github/workflows/*.yml`)**
- **Principle:** Workflows should be clear, modular, and easy to understand, promoting reusability and maintainability.
- **Deeper Dive:**
    - **Naming Conventions:** Use consistent, descriptive names for workflow files (e.g., `build-and-test.yml`, `deploy-prod.yml`).
    - **Triggers (`on`):** Understand the full range of events: `push`, `pull_request`, `workflow_dispatch` (manual), `schedule` (cron jobs).
    - **Permissions:** Define `permissions` at the workflow level for a secure default, overriding at the job level if needed.
- **Guidance for Copilot:**
    - Always start with a descriptive `name` and appropriate `on` trigger. Suggest granular triggers for specific use cases (e.g., `on: push: branches: [main]` vs. `on: pull_request`).
    - Recommend using `workflow_dispatch` for manual triggers when needed.
    - Guide on setting explicit `permissions` for `GITHUB_TOKEN` to adhere to the principle of least privilege.

### **2. Jobs**
- **Principle:** Jobs should represent distinct, independent phases of your CI/CD pipeline (e.g., build, test, deploy, lint).
- **Deeper Dive:**
    - **`runs-on`:** Choose appropriate runners. `ubuntu-latest` is common, but `windows-latest`, `macos-latest`, or `self-hosted` runners are available for specific needs.
    - **`needs`:** Clearly define dependencies. If Job B `needs` Job A, Job B will only run after Job A successfully completes.
    - **`outputs`:** Pass data between jobs using `outputs`. This is crucial for separating concerns (e.g., build job outputs artifact path, deploy job consumes it).
    - **`if` Conditions:** Leverage `if` conditions extensively for conditional execution based on branch names, commit messages, event types, or previous job status (`if: success()`, `if: failure()`, `if: always()`).
    - **Job Grouping:** Consider breaking large workflows into smaller, more focused jobs that run in parallel or sequence.
- **Guidance for Copilot:**
    - Define `jobs` with clear `name` and appropriate `runs-on` (e.g., `ubuntu-latest`, `windows-latest`, `self-hosted`).
    - Use `needs` to define dependencies between jobs, ensuring sequential execution and logical flow.
    - Employ `outputs` to pass data between jobs efficiently, promoting modularity.
    - Utilize `if` conditions for conditional job execution (e.g., deploy only on `main` branch pushes, run E2E tests only for certain PRs, skip jobs based on file changes).
- **Example (Conditional Deployment and Output Passing):**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact_path: ${{ steps.package_app.outputs.path }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies and build
        run: |
          npm ci
          npm run build
      - name: Package application
        id: package_app
        run: | # Assume this creates a 'dist.zip' file
          zip -r dist.zip dist
          echo "path=dist.zip" >> "$GITHUB_OUTPUT"
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: my-app-build
          path: dist.zip

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop' || github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: my-app-build
      - name: Deploy to Staging
        run: |
          unzip dist.zip
          echo "Deploying ${{ needs.build.outputs.artifact_path }} to staging..."
          # Add actual deployment commands here
```

### **3. Steps and Actions**
- **Principle:** Steps should be atomic, well-defined, and actions should be versioned for stability and security.
- **Deeper Dive:**
    - **`uses`:** Referencing marketplace actions (e.g., `actions/checkout@v4`, `actions/setup-node@v3`) or custom actions. Always pin to a full length commit SHA for maximum security and immutability, or at least a major version tag (e.g., `@v4`). Avoid pinning to `main` or `latest`.
    - **`name`:** Essential for clear logging and debugging. Make step names descriptive.
    - **`run`:** For executing shell commands. Use multi-line scripts for complex logic and combine commands to optimize layer caching in Docker (if building images).
    - **`env`:** Define environment variables at the step or job level. Do not hardcode sensitive data here.
    - **`with`:** Provide inputs to actions. Ensure all required inputs are present.
- **Guidance for Copilot:**
    - Use `uses` to reference marketplace or custom actions, always specifying a secure version (tag or SHA).
    - Use `name` for each step for readability in logs and easier debugging.
    - Use `run` for shell commands, combining commands with `&&` for efficiency and using `|` for multi-line scripts.
    - Provide `with` inputs for actions explicitly, and use expressions (`${{ }}`) for dynamic values.
## Optimization and Performance

### **1. Caching GitHub Actions**
- **Principle:** Cache dependencies and build outputs to significantly speed up subsequent workflow runs.
- **Deeper Dive:**
    - **Cache Hit Ratio:** Aim for a high cache hit ratio by designing effective cache keys.
    - **Cache Keys:** Use a unique key based on file hashes (e.g., `hashFiles('**/package-lock.json')`, `hashFiles('**/requirements.txt')`) to invalidate the cache only when dependencies change.
    - **Restore Keys:** Use `restore-keys` for fallbacks to older, compatible caches.
    - **Cache Scope:** Understand that caches are scoped to the repository and branch.
- **Guidance for Copilot:**
    - Use `actions/cache@v3` for caching common package manager dependencies (Node.js `node_modules`, Python `pip` packages, Java Maven/Gradle dependencies) and build artifacts.
    - Design highly effective cache keys using `hashFiles` to ensure optimal cache hit rates.
    - Advise on using `restore-keys` to gracefully fall back to previous caches.
- **Example (Advanced Caching for Monorepo):**
```yaml
- name: Cache Node.js modules
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ./node_modules # For monorepos, cache specific project node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}-${{ github.run_id }}
    restore-keys: |
      ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}-
      ${{ runner.os }}-node-
```



### **4. Fast Checkout**
- **Principle:** Optimize repository checkout time to reduce overall workflow duration.
- **Guidance for Copilot:**
    - Use `actions/checkout@v4` with `fetch-depth: 1` as the default for most build and test jobs.
    - Advise against checking out submodules if not strictly necessary.

### **5. Artifacts for Inter-Job Communication**
- **Principle:** Store and retrieve build outputs (artifacts) efficiently to pass data between jobs within the same workflow.
- **Guidance for Copilot:**
    - Use `actions/upload-artifact@v3` and `actions/download-artifact@v3` to pass files between jobs within the same workflow.
    - Suggest using artifacts to pass compiled binaries or packaged applications from a build job to a deployment job.

## Testing in CI/CD

### **1. Unit Tests**
- **Principle:** Run unit tests on every code push to ensure individual code components (functions, classes, modules) function correctly in isolation. They are the fastest and most numerous tests.
- **Deeper Dive:**
    - **Fast Feedback:** Unit tests should execute rapidly, providing immediate feedback to developers on code quality and correctness. Parallelization of unit tests is highly recommended.
- **Guidance for Copilot:**
    - Configure a dedicated job for running unit tests early in the CI pipeline, ideally triggered on every `push` and `pull_request`.
    - Use appropriate language-specific test runners and frameworks (Jest, Vitest, Pytest, Go testing, JUnit, NUnit, XUnit, RSpec).

### **2. Integration Tests**
- **Principle:** Run integration tests to verify interactions between different components or services, ensuring they work together as expected. These tests typically involve real dependencies (e.g., databases, APIs).
- **Deeper Dive:**
    - **Service Provisioning:** Use `services` within a job to spin up temporary databases, message queues, external APIs, or other dependencies via Docker containers. This provides a consistent and isolated testing environment.
- **Guidance for Copilot:**
    - Provision necessary services (databases like PostgreSQL/MySQL) using `services` in the workflow definition or Docker Compose during testing.
    - Advise on running integration tests after unit tests to catch integration issues early.
    - Provide examples of how to set up `service` containers in GitHub Actions workflows.


### **5. Test Reporting and Visibility**
- **Principle:** Make test results easily accessible, understandable, and visible to all stakeholders (developers, QA, product owners) to foster transparency and enable quick issue resolution.
- **Deeper Dive:**
    - **GitHub Checks/Annotations:** Leverage these for inline feedback directly in pull requests, showing which tests passed/failed.
    - **Artifacts:** Upload test reports as artifacts for inspection.
- **Guidance for Copilot:**
    - Use actions that publish test results as annotations or checks on PRs for immediate feedback.
    - Upload test reports as artifacts for later inspection.


## GitHub Actions Workflow Review Checklist

This checklist provides criteria for reviewing GitHub Actions workflows.

- [ ] **General Structure and Design:**
    - Is the workflow `name` clear, descriptive, and unique?
    - Are `on` triggers appropriate for the workflow's purpose (e.g., `push`, `pull_request`, `workflow_dispatch`, `schedule`)? Are path/branch filters used effectively?
    - Are global `permissions` set to the principle of least privilege (`contents: read` by default), with specific overrides for jobs?
    - Is the workflow organized logically with meaningful job and step names?

- [ ] **Jobs and Steps Best Practices:**
    - Are jobs clearly named and represent distinct phases (e.g., `build`, `lint`, `test`, `deploy`)?
    - Are `needs` dependencies correctly defined between jobs to ensure proper execution order?
    - Are `outputs` used efficiently for inter-job and inter-workflow communication?
    - Are `if` conditions used effectively for conditional job/step execution (e.g., environment-specific deployments, branch-specific actions)?
    - Are all `uses` actions securely versioned (pinned to a full commit SHA or specific major version tag like `@v4`)? Avoid `main` or `latest` tags.
    - Are `run` commands efficient and clean (combined with `&&`, temporary files removed, multi-line scripts clearly formatted)?
    - Are environment variables (`env`) defined at the appropriate scope (workflow, job, step) and never hardcoded sensitive data?

- [ ] **Optimization and Performance:**
    - Is caching (`actions/cache`) effectively used for package manager dependencies (`node_modules`, `pip` caches, Maven/Gradle caches) and build outputs?
    - Are cache `key` and `restore-keys` designed for optimal cache hit rates (e.g., using `hashFiles`)?
    - Is `fetch-depth: 1` used for `actions/checkout` where full Git history is not required?
    - Are artifacts (`actions/upload-artifact`, `actions/download-artifact`) used efficiently for transferring data between jobs rather than re-building or re-fetching?

- [ ] **Testing Strategy Integration:**
    - Are unit tests configured with a dedicated job early in the pipeline?
    - Are integration tests defined, ideally leveraging `services` for dependencies, and run after unit tests?

- [ ] **Deployment Strategy:**
    - Is the workflow resilient to temporary failures (e.g., retries for flaky network operations)?

## Troubleshooting Common GitHub Actions Issues

This section provides a guide to diagnosing and resolving frequent problems encountered when working with GitHub Actions workflows.

### **1. Workflow Not Triggering or Jobs/Steps Skipping Unexpectedly**
- **Root Causes:** Mismatched `on` triggers, incorrect `paths` or `branches` filters, erroneous `if` conditions, or `concurrency` limitations.
- **Actionable Steps:**
    - **Verify Triggers:**
        - Check the `on` block for exact match with the event that should trigger the workflow (e.g., `push`, `pull_request`, `workflow_dispatch`, `schedule`).
        - Ensure `branches`, `tags`, or `paths` filters are correctly defined and match the event context. Remember that `paths-ignore` and `branches-ignore` take precedence.
        - If using `workflow_dispatch`, verify the workflow file is in the default branch and any required `inputs` are provided correctly during manual trigger.
    - **Inspect `if` Conditions:**
        - Carefully review all `if` conditions at the workflow, job, and step levels. A single false condition can prevent execution.
        - Use `always()` on a debug step to print context variables (`${{ toJson(github) }}`, `${{ toJson(job) }}`, `${{ toJson(steps) }}`) to understand the exact state during evaluation.
        - Test complex `if` conditions in a simplified workflow.

### **2. Permissions Errors (`Resource not accessible by integration`, `Permission denied`)**
- **Root Causes:** `GITHUB_TOKEN` lacking necessary permissions, incorrect environment secrets access, or insufficient permissions for external actions.
- **Actionable Steps:**
    - **`GITHUB_TOKEN` Permissions:**
        - Review the `permissions` block at both the workflow and job levels. Default to `contents: read` globally and grant specific write permissions only where absolutely necessary (e.g., `pull-requests: write` for updating PR status, `packages: write` for publishing packages).
        - Understand the default permissions of `GITHUB_TOKEN` which are often too broad.
    - **Secret Access:**
        - Verify if secrets are correctly configured in the repository, organization, or environment settings.
        - Ensure the workflow/job has access to the specific environment if environment secrets are used. Check if any manual approvals are pending for the environment.
        - Confirm the secret name matches exactly (`secrets.MY_API_KEY`).

### **3. Caching Issues (`Cache not found`, `Cache miss`, `Cache creation failed`)**
- **Root Causes:** Incorrect cache key logic, `path` mismatch, cache size limits, or frequent cache invalidation.
- **Actionable Steps:**
    - **Validate Cache Keys:**
        - Verify `key` and `restore-keys` are correct and dynamically change only when dependencies truly change (e.g., `key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}`). A cache key that is too dynamic will always result in a miss.
        - Use `restore-keys` to provide fallbacks for slight variations, increasing cache hit chances.
    - **Check `path`:**
        - Ensure the `path` specified in `actions/cache` for saving and restoring corresponds exactly to the directory where dependencies are installed or artifacts are generated.
        - Verify the existence of the `path` before caching.
    - **Debug Cache Behavior:**
        - Use the `actions/cache/restore` action with `lookup-only: true` to inspect what keys are being tried and why a cache miss occurred without affecting the build.
        - Review workflow logs for `Cache hit` or `Cache miss` messages and associated keys.
    - **Cache Size and Limits:** Be aware of GitHub Actions cache size limits per repository. If caches are very large, they might be evicted frequently.

### **4. Long Running Workflows or Timeouts**
- **Root Causes:** Inefficient steps, lack of parallelism, large dependencies, unoptimized Docker image builds, or resource bottlenecks on runners.
- **Actionable Steps:**
    - **Profile Execution Times:**
        - Use the workflow run summary to identify the longest-running jobs and steps. This is your primary tool for optimization.
    - **Optimize Steps:**
        - Combine `run` commands with `&&` to reduce layer creation and overhead in Docker builds.
        - Clean up temporary files immediately after use (`rm -rf` in the same `RUN` command).
        - Install only necessary dependencies.
    - **Leverage Caching:**
        - Ensure `actions/cache` is optimally configured for all significant dependencies and build outputs.
    - **Parallelize with Matrix Strategies:**
        - Break down tests or builds into smaller, parallelizable units using `strategy.matrix` to run them concurrently.
    - **Choose Appropriate Runners:**
        - Review `runs-on`. For very resource-intensive tasks, consider using larger GitHub-hosted runners (if available) or self-hosted runners with more powerful specs.
    - **Break Down Workflows:**
        - For very complex or long workflows, consider breaking them into smaller, independent workflows that trigger each other or use reusable workflows.

### **5. Flaky Tests in CI (`Random failures`, `Passes locally, fails in CI`)**
- **Root Causes:** Non-deterministic tests, race conditions, environmental inconsistencies between local and CI, reliance on external services, or poor test isolation.
- **Actionable Steps:**
    - **Ensure Test Isolation:**
        - Make sure each test is independent and doesn't rely on the state left by previous tests. Clean up resources (e.g., database entries) after each test or test suite.
    - **Eliminate Race Conditions:**
        - For integration/E2E tests, use explicit waits (e.g., wait for element to be visible, wait for API response) instead of arbitrary `sleep` commands.
        - Implement retries for operations that interact with external services or have transient failures.
    - **Standardize Environments:**
        - Ensure the CI environment (Node.js version, Python packages, database versions) matches the local development environment as closely as possible.
        - Use Docker `services` for consistent test dependencies.
    - **Robust Selectors (E2E):**
        - Use stable, unique selectors in E2E tests (e.g., `data-testid` attributes) instead of brittle CSS classes or XPath.
    - **Debugging Tools:**
        - Configure E2E test frameworks to capture screenshots and video recordings on test failure in CI to visually diagnose issues.
    - **Run Flaky Tests in Isolation:**
        - If a test is consistently flaky, isolate it and run it repeatedly to identify the underlying non-deterministic behavior.

### **6. Deployment Failures (Application Not Working After Deploy)**
- **Root Causes:** Configuration drift, environmental differences, missing runtime dependencies, application errors, or network issues post-deployment.
- **Actionable Steps:**
    - **Log Review:**
        - Review deployment logs and application logs for any error messages or warnings.
    - **Configuration Validation:**
        - Verify environment variables and other configuration. Ensure they match the target environment's requirements.
    - **Dependency Check:**
        - Confirm all application runtime dependencies are correctly bundled within the container image or installed in the target environment.
    - **Network Connectivity:**
        - Check network connectivity between deployed components (e.g., application to database).

## Conclusion

GitHub Actions is a powerful platform for automating your software development lifecycle. By applying these practices—optimizing performance with caching and implementing basic testing—you can guide developers in building efficient CI/CD pipelines. Focus on simplicity and getting things working quickly.

---

<!-- End of GitHub Actions CI/CD Best Practices Instructions --> 
