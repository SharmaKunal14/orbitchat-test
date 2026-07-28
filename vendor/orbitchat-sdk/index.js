export const version = "1.0.0";

function requireNonEmptyString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string`);
  }

  return value;
}

function parseSendResult(value) {
  if (typeof value !== "object" || value === null) {
    throw new TypeError("OrbitChat returned an invalid message result");
  }

  const { message_id: messageId, created_at: createdAt } = value;

  return Object.freeze({
    message_id: requireNonEmptyString(messageId, "message_id"),
    created_at: requireNonEmptyString(createdAt, "created_at")
  });
}

export function createOrbitChatClient(options) {
  if (
    typeof options !== "object" ||
    options === null ||
    typeof options.transport?.send !== "function"
  ) {
    throw new TypeError("transport.send must be a function");
  }

  return Object.freeze({
    messages: Object.freeze({
      async send(input) {
        if (typeof input !== "object" || input === null) {
          throw new TypeError("message input must be an object");
        }

        requireNonEmptyString(input.room, "room");
        requireNonEmptyString(input.text, "text");

        if (input.notify !== undefined && typeof input.notify !== "boolean") {
          throw new TypeError("notify must be a boolean when provided");
        }

        return parseSendResult(await options.transport.send(input));
      }
    })
  });
}

