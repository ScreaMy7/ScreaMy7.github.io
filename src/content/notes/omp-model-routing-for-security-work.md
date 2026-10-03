---
title: "omp: one coding agent, many models, routed by job"
pubDate: 2026-10-03
tags: [llm, agents, fuzzing, workflow]
draft: false
---
[omp (oh my pi)](https://omp.sh) is a terminal coding agent, a fork of Mario Zechner's [Pi](https://github.com/badlogic/pi-mono). The feature my setup is built on is **model roles**: instead of one model for everything, you route each kind of work to the model that's good and cheap enough for it.

## Getting started

```sh
curl -fsSL https://omp.sh/install | sh     # or: bun install -g @oh-my-pi/pi-coding-agent
omp                                        # interactive TUI in the current repo
omp -p "summarise the auth flow in src/"   # one-shot, prints and exits
omp --from-claude                          # import a Claude Code session
```

Config lives in `~/.omp/agent/`:
- `config.yml` holds `modelRoles` and defaults.
- `models.yml` adds any OpenAI-compatible endpoint.
- `agents/*.md` defines your own subagents. Each one is Markdown with frontmatter for `model` and `tools`.

The main agent hands work to subagents through its `task` tool, runs them in parallel, and gets structured results back. omp also reads the instruction files other tools leave behind, like `AGENTS.md`, so an existing repo works without migration.

## How people use it

Mostly to mix providers. The built-in roles are `default`, `smol` (cheap subagent work), `slow` (deep reasoning) and `plan`, and you can point each at a different provider, local models included. Ollama documents a one-liner for it, `ollama launch omp`, and AIMLAPI has its own setup guide.

## How I use it for security work

My `config.yml` adds custom roles on top of the built-in ones:

| Work | Model |
|---|---|
| recon, file discovery, scouting a codebase | GLM 5.3 Flash |
| bulk mechanical edits, data collection | DeepSeek Flash |
| coding and security review | Claude Sonnet |
| planning, validating results, crash triage | Claude Opus |
| screenshots and app captures | a vision model |

A short appended system prompt (`APPEND_SYSTEM.md`) makes the main agent act as an orchestrator. Trivial tasks it does itself. Anything that splits into independent pieces goes out as one parallel batch. Anything security-critical goes to the Opus reviewer before the agent relies on it. Image inputs always go to the vision agent, because text-only workers can't see pixels.

The fuzzing setup follows the same idea, at a finer grain:
- **Harness author.** An open model writes the easy harnesses, and the hard ones escalate to Opus.
- **Runner.** A cheap model babysits the fuzzer. Its instructions say it runs tools only: it never writes harnesses, judges crashes, or interprets a 0-crash result.
- **Triage.** This gets the strongest model, because a wrong verdict here ships a false CVE.

The point is to spend on judgement, not on watching a progress bar.

Two practical notes:
- `skills.customDirectories` points omp at my existing Claude Code skills, so both agents share one copy.
- In my setup, `autoloadSkills` didn't resolve inside subagents, so my agent prompts point at the skill files by absolute path.
