**Agents Command**
- Command: `/agents`
- Purpose: List available agent roles and how to use them.
- Filters: `--category=<name>`, `--search=<term>`, `--show=paths`
- Examples: `/agents`, `/agents --category=github`, `/agents --search=coordinator`, `/agents --show=paths`

**How It Works**
- Scans `.claude/agents/**` for agent profiles.
- Returns a categorized list with quick role descriptions.
- Use filters to narrow down by domain or keyword.

**Quick Usage**
- Delegate: “Use PR Manager to prepare a release PR.”
- Swarm: “Run Mesh Coordinator for multi-agent planning.”
- Review: “Invoke Code Review Swarm on the last changeset.”

**Roles**
- Core: Planner, Coder, Researcher, Reviewer, Tester
- GitHub: PR Manager, Issue Tracker, Repo Architect, Release Manager, Sync Coordinator, Workflow Automation, Code Review Swarm, Swarm PR, Swarm Issue, Multi‑Repo Swarm, GitHub Modes, Project Board Sync
- Swarm: Adaptive Coordinator, Mesh Coordinator, Hierarchical Coordinator
- Hive‑Mind: Consensus Builder, Swarm Memory Manager, Collective Intelligence Coordinator
- SPARC: Specification, Pseudocode, Architecture, Refinement
- Consensus: Byzantine Coordinator, Raft Manager, Quorum Manager, CRDT Synchronizer, Performance Benchmarker, Security Manager, Gossip Coordinator
- Optimization: Resource Allocator, Load Balancer, Topology Optimizer, Performance Monitor, Benchmark Suite
- Testing: TDD London Swarm (unit), Production Validator (validation)
- Development: Dev Backend API
- DevOps: CI/CD GitHub
- Documentation: API OpenAPI Docs
- Analysis: Code Quality Analyzer
- Specialized: Mobile (React Native)
- Data: ML Model
- Templates: Orchestrator Task, Memory Coordinator, SPARC Coordinator, Implementer SPARC Coder, Performance Analyzer, Migration Plan, Automation Smart Agent, GitHub PR Manager template, Coordinator Swarm Init

**Paths (use with `--show=paths`)**
- Core: `.claude/agents/core/*.md`
- GitHub: `.claude/agents/github/*.md`
- Swarm: `.claude/agents/swarm/*.md`
- Hive‑Mind: `.claude/agents/hive-mind/*.md`
- SPARC: `.claude/agents/sparc/*.md`
- Consensus: `.claude/agents/consensus/*.md`
- Optimization: `.claude/agents/optimization/*.md`
- Testing: `.claude/agents/testing/**.md`
- Development: `.claude/agents/development/**.md`
- DevOps: `.claude/agents/devops/**.md`
- Documentation: `.claude/agents/documentation/**.md`
- Analysis: `.claude/agents/analysis/**.md`
- Specialized: `.claude/agents/specialized/**.md`
- Data: `.claude/agents/data/**.md`
- Templates: `.claude/agents/templates/*.md`

**Notes**
- These roles come from the adopted profiles under `.claude/agents`.
- Use natural requests (e.g., “Use Release Manager to cut v0.3.0”).
