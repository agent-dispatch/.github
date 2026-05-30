# Contributing to AgentDispatch

AgentDispatch is split across several small repositories. Pick the repo closest to the change:

- `core` — provider-neutral types, policy, routing, runtime service, and adapter contracts.
- `mcp-server` — agent-facing MCP tools and bootstrap.
- `adapter-aws-agentcore` — AWS Bedrock AgentCore provider implementation.
- `worker-agentcore` — cloud-side worker contract and reference runtime.
- `cli` — config bootstrap, diagnostics, task submission, and A2A follow-up.
- `sdk-js` — TypeScript client and MCP transport helpers.
- `store-sqlite` — local durable task, log, event, and artifact store.
- `adapter-template` — starting point for new providers.
- `docs`, `website`, `.github` — launch, docs, website, and organization defaults.

## Local Verification

For package-local changes, run the package commands:

```bash
npm test
npm run typecheck
npm run build
```

For cross-package changes from the local multi-repo workspace:

```bash
npm --prefix agentdispatch-docs run verify:local-e2e
```

That gate runs package tests, typechecks, builds, package-consumption smoke tests, a packaged MCP `spawn_cloud_agent` smoke, CLI `init`/`doctor`, MCP `--check`, website validation, and org-profile asset checks.

## Live AWS Checks

Live AWS AgentCore verification is opt-in because it touches external account state and can cost money:

```bash
AGENTDISPATCH_CONFIG=/absolute/path/agentdispatch.config.json \
npm --prefix agentdispatch-docs run verify:aws-live
```

To submit a real cloud task after preflight:

```bash
AGENTDISPATCH_CONFIG=/absolute/path/agentdispatch.config.json \
AGENTDISPATCH_LIVE_DISPATCH=1 \
npm --prefix agentdispatch-docs run verify:aws-live
```

Do not claim live AWS dispatch has been verified unless you ran a live check with real credentials and a real AgentCore runtime ARN.

## Adapter Contributions

New cloud providers should implement the `BackendAdapter` contract. Keep provider-specific fields inside adapter config, `target.details`, or `providerRefs`; do not add provider-specific MCP tools unless the core provider model truly cannot express the use case.

The stable routing key is:

```text
provider + capability + task_type + target.mode
```

Framework integrations such as LangChain, LangGraph, CrewAI, Strands, or custom agent loops belong inside worker-side framework adapters, not cloud backend adapters.

## Pull Requests

Keep PRs focused. Include:

- what changed
- which package or repo owns the change
- verification commands and results
- whether live cloud state was touched
- any compatibility impact on the MCP contract or adapter contract
