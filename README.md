# Orbit test

A small TypeScript customer application that uses the synthetic
`@orbitchat/sdk` version `2.0.0`. It is suitable as an additional repository
for exercising the Migration API's OrbitChat v1-to-v2 workflow.

The application pins the published `@orbitchat/sdk` package to exactly
`2.0.0`. The published v2 package defines the `OrbitChatClient` contract; this
project injects a client implementation at its application boundary and uses
an in-memory implementation for the executable demo and tests.

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

## Relevant v2 usage

- `src/integrations/orbitchat-client.ts` wraps `messages.create` and maps the
  v2 `id` and `createdAt` response fields into an application-owned return
  contract.
- `src/features/escalations/create-escalation.ts` calls `messages.create`
  directly and reads `id`.
- Tests cover explicit `true`, explicit `false`, and omitted notification
  values.

The wrapper deliberately keeps its application-owned `roomId`, `body`, and
`notify` input fields and return contract so the SDK migration does not change
downstream callers. Explicit notification booleans are mapped to
`notification.enabled`. When `notify` is undefined, the `notification`
property is omitted entirely. Delivery behavior in that omitted case depends
on the target OrbitChat account policy and must not be assumed equivalent to
the v1 default.
