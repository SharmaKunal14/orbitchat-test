import {
  version,
  type OrbitChatClient
} from "@orbitchat/sdk";
import { createOrbitMessageService } from "./integrations/orbitchat-client.js";

const orbit: OrbitChatClient = {
  messages: {
    async create(input) {
      return {
        id: `message-${input.channelId}`,
        createdAt: new Date(0).toISOString()
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
