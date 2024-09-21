import axios from "axios";

export const SentMessageToDiscord = async (message) => {
  try {
    const webhook_url = "https://discord.com/api/webhooks/1286637818013155328/PYgwWXMHhxxs4dr9l0ZuxaV64YWWBpXFXHxsmrabGZgWOBgGLX2WIZRP21bJpWP1ZKVv";
    
    if (!webhook_url) {
      throw new Error("Discord Webhook URL is missing!");
    }

    const params = {
      username: "Pstore Bill",
      content: message,
    };

    await axios.post(webhook_url, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Message sent to Discord server");
  } catch (error) {
    console.error("Failed to send message to Discord:", error.message || error);
  }
};
