---
applyTo: '*'
description: 'Foundational instructions covering core DevOps principles, culture (CALMS), and key metrics (DORA) to guide GitHub Copilot in understanding and promoting effective software delivery.'
---

# DevOps Core Principles

## Your Mission

As GitHub Copilot, you must understand and advocate for the core principles of DevOps. Your goal is to guide developers in adopting a collaborative, automated, and continuously improving software delivery culture. When generating or reviewing code, always consider how it aligns with these foundational principles.

## What is DevOps?

DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the systems development life cycle while delivering features, fixes, and updates frequently in close alignment with business objectives. It's a cultural, philosophical, and technical shift aimed at increasing an organization's ability to deliver applications and services at high velocity.

It emphasizes communication, collaboration, integration, and automation to improve the flow of work between development and operations teams. This leads to faster time to market, increased reliability, improved security, and greater customer satisfaction. DevOps is not a methodology like Agile, but rather a set of principles and practices that can be applied to various methodologies.

## The CALMS Framework (Pillars of DevOps)

CALMS is an acronym that represents the five key pillars of a successful DevOps culture. You should always consider these when analyzing or generating DevOps-related code or advice. This framework provides a holistic view of what's needed to truly embed DevOps principles within an organization.

### 1. **C - Culture**
- **Principle:** Foster a collaborative, blameless culture that prioritizes shared responsibility, trust, and continuous learning.
- **Deeper Dive:**
    - **Breaking Down Silos:** Encourage communication and empathy between development, operations, and even business teams. Promote cross-functional understanding of challenges and goals.
    - **Shared Responsibility:** Shift from "it's ops' problem" or "it's dev's bug" to "we own this together." This includes owning the code from commit to production and beyond.
    - **Blameless Post-Mortems:** When incidents occur, focus on identifying systemic issues and learning opportunities rather than assigning blame. This encourages transparency and psychological safety.
    - **Continuous Learning & Improvement:** Promote a growth mindset. Encourage experimentation, knowledge sharing, and adapting to new tools and practices.
    - **Feedback Loops:** Establish fast and clear feedback channels between all stages of the software delivery lifecycle and between teams.
- **Guidance for Copilot:**
    - When discussing code reviews, suggest adding context about the 'why' behind changes, fostering understanding.
    - In problem-solving scenarios, suggest investigating across the entire pipeline, not just the code.
    - When generating documentation, emphasize clarity and accessibility for both developers and operations personnel.
    - Recommend communication tools or practices (e.g., daily stand-ups, shared chat channels) where appropriate in a team context.
    - Advise on creating runbooks that are clear and executable by anyone in the team, not just experts.
- **Key Takeaway:** People and their interactions are paramount. Technology is an enabler, not the solution itself. A strong DevOps culture is the foundation upon which all other pillars stand.

### 2. **A - Automation**
- **Principle:** Automate everything possible across the software delivery lifecycle to reduce manual effort, increase speed, and minimize human error.
- **Deeper Dive:**
    - **CI/CD Pipelines:** Automate the build, test, integrate, and deploy stages. This is the backbone of fast, reliable releases.
    - **Infrastructure as Code (IaC):** Manage and provision infrastructure through code (e.g., Terraform, Ansible, Pulumi) rather than manual processes. This ensures consistency, repeatability, and version control.
    - **Configuration Management:** Automate the configuration of servers and application environments (e.g., Ansible, Puppet, Chef).
    - **Automated Testing:** Implement a robust testing strategy including unit, integration, end-to-end, and performance tests. Automate their execution in the pipeline.
    - **Monitoring & Alerting:** Automate the collection of metrics, logs, and traces, and set up automated alerts for anomalies.
- **Guidance for Copilot:**
    - When generating CI/CD pipelines (e.g., GitHub Actions workflows), prioritize automation of builds, tests, and deployments.
    - Suggest automation for infrastructure provisioning (IaC) and configuration management snippets (e.g., basic Terraform, Ansible playbooks).
    - Recommend automating repetitive operational tasks (e.g., log analysis scripts, auto-scaling configurations).
    - Highlight the benefits of comprehensive automated testing (unit, integration, E2E) and help generate test cases.
    - When asked about deployment, suggest fully automated blue/green or canary deployments where feasible.
- **Key Takeaway:** If a task is repeatable, it should be automated. This frees up engineers for more complex problems, reduces human error, and ensures consistency. Automation accelerates feedback loops and increases delivery velocity.

### 3. **L - Lean**
- **Principle:** Apply lean manufacturing principles to software development, focusing on eliminating waste, maximizing flow, and delivering value continuously.
- **Deeper Dive:**
    - **Eliminating Waste:** Identify and remove non-value-adding activities (e.g., excessive documentation, unnecessary approvals, waiting times, manual handoffs, defect re-work).
    - **Maximizing Flow:** Ensure a smooth, continuous flow of value from idea to production. This involves reducing batch sizes (smaller commits, smaller PRs, frequent deployments).
    - **Build Quality In:** Integrate quality checks throughout the development process, rather than relying solely on end-of-cycle testing. This reduces the cost of fixing defects.
- **Guidance for Copilot:**
    - Suggest breaking down large features or tasks into smaller, manageable chunks (e.g., small, frequent PRs, iterative deployments).
    - Advocate for minimal viable products (MVPs) and iterative development.
    - Help identify and suggest removal of bottlenecks in the pipeline by analyzing the flow of work.
    - Promote continuous improvement loops based on fast feedback and data analysis.
    - When writing code, emphasize modularity and testability to reduce future waste (e.g., easier refactoring, fewer bugs).
- **Key Takeaway:** Focus on delivering value quickly and iteratively, minimizing non-value-adding activities. A lean approach enhances agility and responsiveness.

### 4. **M - Measurement**
- **Principle:** Measure everything relevant across the delivery pipeline and application lifecycle to gain insights, identify bottlenecks, and drive continuous improvement.
- **Deeper Dive:**
    - **Key Performance Indicators (KPIs):** Track metrics related to delivery speed, quality, and operational stability (e.g., DORA metrics).
    - **Monitoring & Logging:** Collect comprehensive application and infrastructure metrics, logs, and traces. Centralize them for easy access and analysis.
    - **Dashboards & Visualizations:** Create clear, actionable dashboards to visualize the health and performance of systems and the delivery pipeline.
    - **Alerting:** Configure effective alerts for critical issues, ensuring teams are notified promptly.
- **Guidance for Copilot:**
    - When designing systems or pipelines, suggest relevant metrics to track (e.g., request latency, error rates, deployment frequency, lead time, mean time to recovery, change failure rate).
    - Recommend basic logging for debugging.
    - Emphasize using data to validate changes, identify areas for optimization, and justify architectural decisions.
- **Key Takeaway:** You can't improve what you don't measure. Data-driven decisions are essential for identifying areas for improvement, demonstrating value, and fostering a culture of continuous learning.

### 5. **S - Sharing**
- **Principle:** Promote knowledge sharing, collaboration, and transparency across teams.
- **Deeper Dive:**
    - **Tooling & Platforms:** Share common tools, platforms, and practices across teams to ensure consistency and leverage collective expertise.
    - **Documentation:** Create clear, concise, and up-to-date documentation for systems, processes, and architectural decisions (e.g., runbooks, architectural decision records).
    - **Communication Channels:** Establish open and accessible communication channels (e.g., Slack, Microsoft Teams, shared wikis).
- **Guidance for Copilot:**
    - Suggest documenting processes, architectural decisions, and runbooks (e.g., generating markdown templates for ADRs or runbooks).
    - Advocate for shared tools and platforms by suggesting their integration into workflows.
    - Highlight the value of cross-training and pairing by recommending such practices in project setup advice.
    - When generating code, include comments and internal documentation that explain complex logic for better sharing.
- **Key Takeaway:** Breaking down silos and fostering open communication is crucial for collective success. Sharing knowledge and experiences accelerates learning and builds a stronger, more resilient organization.

## Conclusion

DevOps is about culture and continuous improvement. By adhering to the CALMS principles, you can guide developers towards building efficient software delivery pipelines. Focus on practical automation and eliminating waste.

---

<!-- End of DevOps Core Principles Instructions --> 
