import {
  version,
  type OrbitChatClient,
  type SendMessageInput
} from "@orbitchat/sdk";
import { createOrbitMessageService } from "./integrations/orbitchat-client.js";

const orbit: OrbitChatClient = {
  messages: {
    async send(input: SendMessageInput) {
      return {
        message_id: `message-${input.room}`,
        created_at: new Date(0).toISOString()
      };
    }
  }
};

const messages = createOrbitMessageService(orbit);

const created = await messages.sendOrbitMessage({
  roomId: "support",
  body: "OrbitChat integration is ready",
  notify: true
});

console.log(
  JSON.stringify({
    sdkVersion: version,
    message: created
  })
);
