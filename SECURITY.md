# Security Policy

AgentDispatch is an MCP-facing control plane for cloud-agent dispatch. Please do not open public issues for suspected vulnerabilities.

## Reporting

Report security issues through GitHub private vulnerability reporting when available, or contact the maintainers privately before publishing details.

Include:

- affected package or repository
- vulnerable version or commit
- reproduction steps
- expected impact
- whether cloud credentials, provider refs, task logs, artifacts, or MCP payloads are exposed

## Security Boundaries

AgentDispatch is designed around these boundaries:

- MCP tool calls reference named account profiles; raw cloud credentials should not be passed in tool payloads.
- Provider SDKs and provider-specific credential chains stay inside adapter packages.
- Provider-specific references are persisted for audit and cleanup, but must not include secrets.
- Live cloud checks and task dispatch can touch external provider state and should remain explicit.

## Supported Versions

Until the project reaches a stable 1.0 release, security fixes target the latest published package versions.
