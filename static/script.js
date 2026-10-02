document.addEventListener("DOMContentLoaded", () => {
  const botStatus = document.getElementById("bot-status");
  const assistantForm = document.getElementById("assistant-form");
  const assistantInput = document.getElementById("assistant-input");
  const chatLog = document.getElementById("chat-log");
  const discordForm = document.getElementById("discord-form");
  const discordMessageInput = document.getElementById("discord-message");

  async function updateBotStatus() {
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      botStatus.textContent = data.bot === "online" ? "Online" : "Offline";
      botStatus.style.color = data.bot === "online" ? "#34d399" : "#f87171";
    } catch (error) {
      botStatus.textContent = "Unknown";
      botStatus.style.color = "#fbbf24";
    }
  }

  function appendMessage(role, text) {
    const div = document.createElement("div");
    div.className = `message ${role}`;
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  assistantForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = assistantInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    assistantInput.value = "";

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (response.ok) {
        appendMessage("bot", data.response);
      } else {
        appendMessage("bot", data.error || "Something went wrong.");
      }
    } catch (error) {
      appendMessage("bot", "Unable to reach the assistant service.");
    }
  });

  discordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = discordMessageInput.value.trim();
    if (!message) return;

    try {
      const response = await fetch("/api/discord/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Message sent to Discord successfully.");
      } else {
        alert(data.error || "The message could not be sent.");
      }
    } catch (error) {
      alert("Discord sending failed.");
    }

    discordMessageInput.value = "";
  });

  updateBotStatus();
  setInterval(updateBotStatus, 10000);
});
