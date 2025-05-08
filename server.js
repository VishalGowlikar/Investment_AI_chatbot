const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const marketTrends = require("./services/marketTrends");
const portfolioEngine = require("./services/portfolioEngine");
const generatePrompt = require("./services/promptBuilder");
const axios = require("axios");

const app = express();
const PORT = 3000;
const OPENAI_API_KEY = "YOUR OPEN AI API KEY";
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

let chatHistory = [];

app.post("/chat", async (req, res) => {
  const { message, portfolio = [], userPreferences = {} } = req.body;

  try {
    let enrichedPortfolio = [];
    if (portfolio.length > 0) {
      enrichedPortfolio = await portfolioEngine.analyze(portfolio);
    }

    const trends = await marketTrends.getTrends();
    const prompt = generatePrompt(
      message,
      chatHistory,
      enrichedPortfolio,
      userPreferences,
      trends
    );

    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: prompt,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botMessage = openaiResponse.data.choices[0].message.content;

    chatHistory.push({ role: "user", content: message });
    chatHistory.push({ role: "assistant", content: botMessage });

    res.json({ reply: botMessage });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error processing your request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
