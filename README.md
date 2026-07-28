# Orbit test

A small TypeScript customer application that uses the synthetic
`@orbitchat/sdk` version `1.0.0`. It is suitable as an additional repository
for exercising the Migration API's OrbitChat v1-to-v2 workflow.

The application pins the published `@orbitchat/sdk` package to exactly
`1.0.0`, making it a deterministic v1-to-v2 migration candidate. The published
v1 package defines the `OrbitChatClient` contract; this project injects a
client implementation at its application boundary and uses an in-memory
implementation for the executable demo and tests.

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Run

```bash
npm ci
npm run typecheck
npm test
npm start
```

The demo uses an in-memory transport. It makes no network calls and requires no
credentials.

## Relevant v1 usage

- `src/integrations/orbitchat-client.ts` wraps `messages.send`.
- `src/features/escalations/create-escalation.ts` calls `messages.send`
  directly and reads `message_id`.
- Tests cover explicit `true`, explicit `false`, and omitted notification
  values.

The wrapper deliberately keeps an application-owned return contract so an SDK
migration can change its implementation without changing downstream callers.
