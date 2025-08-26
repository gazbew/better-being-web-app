**Adopted Agents Profiles**
- Source: `/home/gareth-bew/Public/projects/AGENTS`
- Imported to: `/.claude/agents` and `/.claude/commands`
- Categories: core, github, swarm, hive-mind, sparc, consensus, optimization, templates; plus coordination, analysis, monitoring, automation, memory, training, workflows commands.

**What’s Included**
- Agents: Markdown profiles under `/.claude/agents/**` with role definitions and workflows.
- Commands: Task and workflow helpers under `/.claude/commands/**` (e.g., swarm init, PR management, performance reports).

**How To Use**
- Claude Code: Reference agents from `/.claude/agents/**` when delegating specialized tasks.
- Commands: Trigger docs under `/.claude/commands/**` as slash-command playbooks in sessions.
- Existing agent: `/.claude/agents/design-systems-architect.md` remains; new profiles are additive.

**Notes**
- Structure aligns with the repo’s `.claude` conventions already in use.
- No runtime changes were required; this is a documentation/profile adoption.
