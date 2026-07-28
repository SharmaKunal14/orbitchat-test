# Orbit test

A small TypeScript customer application that uses the synthetic
`@orbitchat/sdk` version `1.0.0`. It is suitable as an additional repository
for exercising the Migration API's OrbitChat v1-to-v2 workflow.

The OrbitChat package is intentionally local because the SDK described by the
Migration API scenario is synthetic and is not published to npm. The local
package implements the documented v1 `messages.send` contract.

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

