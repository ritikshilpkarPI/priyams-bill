import axios from "axios";

export const SentMessageToDiscord = async (message) => {
  try {
    const webhook_url = process.env.DISCORD_WEB_HOOK_URL;
    
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
