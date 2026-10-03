---
title: "herdr: a terminal multiplexer that knows what your agents are doing"
pubDate: 2026-10-03
tags: [llm, agents, workflow]
draft: false
---
Once you run more than two coding agents at a time, the hard part isn't the agents. It's knowing which one is waiting on you. [herdr](https://herdr.dev) fixes that. It's tmux-style workspaces, tabs and panes in a single binary, plus a sidebar that shows every agent's state: **working**, **blocked** (waiting for an approval or an answer), **done** or **idle**.

## Getting started

```sh
curl -fsSL https://herdr.dev/install.sh | sh
herdr                          # launch, or attach to the running session
herdr --session fuzzing        # a separate named session per project
herdr --remote my-vps          # same thing, on a machine over SSH
```

The server keeps running in the background. Close the laptop and the agents keep going. After a restart, herdr brings back the layout. Run Claude Code, Codex, omp, Pi, opencode and a dozen others in panes, and herdr detects them automatically. Optional integrations let an agent report its state to herdr directly:

```sh
herdr integration install claude
herdr integration install omp
```

## How people use it

Reviews describe it as a home base for a fleet of agents:
- run the whole thing on a VPS with `herdr --remote` so work survives device changes,
- run different agents side by side on one repo. `herdr worktree create` gives each one its own git worktree.

The interesting part is that the CLI is also an API that agents can drive. An agent inside herdr can split a pane, start another agent, prompt it and block until it finishes:

```sh
herdr pane split --current --direction right --no-focus
herdr agent start reviewer --kind claude --pane w1:p2
herdr agent prompt reviewer "Re-check the crash in ./crashes/id-0007" --wait
herdr agent read reviewer
```

## How I use it for security work

My config is small:
- **One named session per research project.** Each has its own workspaces, so a fuzzing campaign and a tooling repo never share a screen.
- **`resume_agents_on_restore = true`.** Long agent sessions come back after a reboot, which matters for long-running campaigns.
- **Sidebar rows that show each Claude agent's state next to its workspace and tab.** With three or four agents going, the **blocked** icon tells me which one is waiting for an approval.
- **A popup shell** for quick one-off commands without breaking the layout.
- **`ctrl+a` as the prefix.**

Where it fits next: I already keep crash triage in a separate context that hasn't seen the fuzzing campaign, so it can't just agree with the agent that ran it. `herdr agent prompt … --wait` is a clean way to wire that up. One pane runs the campaign. A second agent, started fresh, gets only the crash and the binary and has to reach its own verdict.

One caveat: herdr doesn't sandbox anything. If an agent runs something destructive in a pane, herdr won't stop it, so the usual rules about what an agent may touch still apply.
