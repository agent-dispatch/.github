# AgentDispatch

<p align="center">
  <img src="./assets/org-banner.svg" alt="AgentDispatch cloud subagent dispatch banner">
</p>

> Spawn cloud subagents from any MCP-capable lead agent.

AgentDispatch is the provider-neutral control plane for long-running agent work. A lead agent calls one MCP tool, gets a durable task handle back, and can keep interacting with the spawned cloud subagent through A2A, MCP, AG-UI, or HTTP metadata when the runtime supports it.

## Why It Exists

Local agents are great planners. Long-running work needs different execution properties:

- cloud isolation for expensive, slow, or stateful tasks
- durable status, logs, artifacts, cancellation, and cleanup
- named account profiles instead of raw cloud credentials in prompts
- provider portability across AWS, GCP, Azure, Kubernetes, and local runtimes
- native follow-up with the cloud subagent after spawn

## V1

V1 targets **AWS Bedrock AgentCore Runtime** with a cloud-neutral contract:

```text
provider + capability + task_type + target.mode
```

That means new providers become adapter packages, not new tool names every agent needs to learn.

## Start Here

| Repo | What to read |
| --- | --- |
| [`mcp-server`](https://github.com/agent-dispatch/mcp-server) | MCP tool surface: spawn, preflight, status, logs, results, cancel. |
| [`core`](https://github.com/agent-dispatch/core) | Provider-neutral runtime model and adapter contract. |
| [`adapter-aws-agentcore`](https://github.com/agent-dispatch/adapter-aws-agentcore) | AWS AgentCore Runtime implementation. |
| [`worker-agentcore`](https://github.com/agent-dispatch/worker-agentcore) | Reference cloud-side worker with HTTP and A2A endpoints. |
| [`cli`](https://github.com/agent-dispatch/cli) | Config bootstrap, diagnostics, task dispatch, polling, and A2A follow-up. |
| [`docs`](https://github.com/agent-dispatch/docs) | Architecture, quickstart, adapter guide, and launch checklist. |

## Quickstart

```bash
npm install -g @agent-dispatch/cli

agentdispatch init \
  --region us-west-2 \
  --runtime-arn arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-runtime \
  --protocol a2a

agentdispatch doctor
```

Then connect your lead agent to `@agent-dispatch/mcp-server` and ask it to call `spawn_cloud_agent` for work that should run outside the local session.

## The Pitch

AgentDispatch makes cloud delegation feel like a normal agent tool call, while preserving the production properties teams need: account boundaries, durable handles, normalized events, cleanup, artifacts, and a path to multiple clouds.
