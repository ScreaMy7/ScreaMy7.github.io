---
title: "herdr + omp: my terminal setup for agent-driven security work"
pubDate: 2026-10-03
tags: [llm, agents, workflow, fuzzing]
draft: false
---
Two tools do most of my agent work now. [omp](https://omp.sh) (oh my pi, a fork of Mario Zechner's [Pi](https://github.com/badlogic/pi-mono)) is the coding agent. [herdr](https://herdr.dev) is the terminal it lives in. They solve different halves of the same problem: omp decides **which model** does each piece of work, and herdr shows me **which agent** is waiting on me.

## Setup

```sh
curl -fsSL https://omp.sh/install | sh
curl -fsSL https://herdr.dev/install.sh | sh
herdr integration install omp      # omp reports its state to herdr directly
herdr --session fuzzing            # one named session per project
```

Then run `omp` in a pane. herdr detects it automatically and marks it in the sidebar as **working**, **blocked** (waiting for an approval or an answer), **done** or **idle**. herdr also detects Claude Code, Codex, Pi and others, so mixing agents across panes is fine. Its server keeps running when you close the laptop, and a restart brings back the layout.

## Who does what

The split I've settled on:

- **omp handles parallelism *inside* a task.** Its `task` tool fans work out to subagents and collects structured results back. I don't need to watch those workers, only their output.
- **herdr handles parallelism *across* tasks.** Each project gets its own session, and long-lived agents get their own panes. That way I can glance at the sidebar, see the one that's **blocked**, and answer it.

omp is the main agent in that setup. In my herdr logs, omp started in a pane about three times as often as Claude Code. Claude Code still has a pane for some jobs, and `skills.customDirectories` in omp's `config.yml` points at my Claude Code skills, so both agents share one copy.

## Routing models by job

omp's `modelRoles` decides which model does what, and custom agents in `~/.omp/agent/agents/*.md` pick a role in their frontmatter. Mine:

| Work | Model |
|---|---|
| recon, file discovery, scouting a codebase | GLM 5.3 Flash |
| bulk mechanical edits | DeepSeek Flash |
| coding and security review | Claude Sonnet |
| planning, validation, crash triage | Claude Opus |
| screenshots and app captures | a vision model |

An appended system prompt makes the main agent an orchestrator. It does trivial work itself and sends independent pieces out as one parallel batch. Anything security-critical goes to the Opus reviewer before the agent relies on it.

My fuzzing pipeline uses the same routing:
- an open model writes the easy harnesses, and the hard ones escalate to Opus,
- a cheap model babysits the fuzzer and is told to run tools only, never to judge crashes,
- triage gets Opus, because a wrong verdict ships a false CVE.

## Next: agents checking agents

herdr's CLI is also an API that agents can drive, and `omp` is one of the agent kinds it can start. I already keep crash triage in a separate context that hasn't seen the campaign. herdr makes that a two-command handoff:

```sh
herdr agent start judge --kind omp --pane w1:p2
herdr agent prompt judge "Triage ./crashes/id-0007 against ./target.so" --wait
```

One caveat: herdr doesn't sandbox anything. Whatever an agent may run in a pane, it can run.
