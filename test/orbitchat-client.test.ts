import assert from "node:assert/strict";
import test from "node:test";
import type { OrbitChatClient } from "@orbitchat/sdk";
import { createOrbitMessageService } from "../src/integrations/orbitchat-client.js";

type CreateMessageInput = Parameters<
  OrbitChatClient["messages"]["create"]
>[0];

function createHarness(): {
  readonly sent: CreateMessageInput[];
  readonly service: ReturnType<typeof createOrbitMessageService>;
} {
  const sent: CreateMessageInput[] = [];
  const client: OrbitChatClient = {
    messages: {
      async create(input) {
        sent.push(input);
        return {
          id: "message-123",
          createdAt: "2026-07-28T00:00:00.000Z"
        };
      }
    }
  };

  return {
    sent,
    service: createOrbitMessageService(client)
  };
}

test("maps the application request and response", async () => {
  const { sent, service } = createHarness();

  const result = await service.sendOrbitMessage({
    roomId: "support",
    body: "Customer needs help",
    notify: true
  });

  assert.deepEqual(sent, [
    {
      channelId: "support",
      content: "Customer needs help",
      notification: { enabled: true }
    }
  ]);
  assert.deepEqual(result, {
    id: "message-123",
    createdAt: "2026-07-28T00:00:00.000Z"
  });
});

test("preserves an explicit false notification value", async () => {
  const { sent, service } = createHarness();

  await service.sendOrbitMessage({
    roomId: "digest",
    body: "Daily digest",
    notify: false
  });

  assert.equal(sent[0]?.notification?.enabled, false);
});

test("omits notification when its application value is omitted", async () => {
  const { sent, service } = createHarness();

  await service.sendOrbitMessage({
    roomId: "digest",
    body: "Daily digest"
  });

  assert.equal(Object.hasOwn(sent[0] ?? {}, "notification"), false);
});

test("rejects empty application input before calling the SDK transport", async () => {
  const { sent, service } = createHarness();

  await assert.rejects(
    service.sendOrbitMessage({
      roomId: " ",
      body: "Message"
    }),
    /roomId must be a non-empty string/
  );
  assert.equal(sent.length, 0);
});
