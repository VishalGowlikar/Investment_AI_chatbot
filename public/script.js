function addRow() {
  const table = document.getElementById("portfolioTable");
  const row = table.insertRow();
  for (let i = 0; i < 3; i++) {
    const cell = row.insertCell();
    const input = document.createElement("input");
    cell.appendChild(input);
  }
}

function getPortfolio() {
  const rows = document.querySelectorAll(
    "#portfolioTable tr:not(:first-child)"
  );
  return Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("input");
    return {
      symbol: cells[0].value.toUpperCase(),
      quantity: parseFloat(cells[1].value),
      buyPrice: parseFloat(cells[2].value),
    };
  });
}

function sendMessage() {
  const message = document.getElementById("message").value;
  const portfolio = getPortfolio();
  const preferences = {
    risk: document.getElementById("risk").value,
    interests: document
      .getElementById("interests")
      .value.split(",")
      .map((x) => x.trim()),
  };

  if (!message) return;

  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<div class="msg user">You: ${message}</div>`;

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, portfolio, userPreferences: preferences }),
  })
    .then((res) => res.json())
    .then((data) => {
      const parsedBotMessage = simpleMarkdownToHTML(data.reply);
      chatbox.innerHTML += `<div class="msg bot">Bot:<br>${parsedBotMessage}</div>`;
      chatbox.scrollTop = chatbox.scrollHeight;
      document.getElementById("message").value = "";
    });
}

function simpleMarkdownToHTML(markdown) {
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>")
    .replace(/\*(.*?)\*/gim, "<i>$1</i>")
    .replace(/\n/g, "<br>");
}
