module.exports = function generatePrompt(
  userMessage,
  chatHistory,
  portfolio,
  preferences,
  trends
) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful and friendly financial advisor chatbot. You can answer questions about investing, portfolio analysis, market trends, and financial planning. Always end your answer by providing a confidence score from 0 to 100 based on the question asked and how accurately you have answered using the provided information and context. After the finacial advise always add a disclaimer that this is not a liscenced financial advise and the user bears all risks for their financial decisions.",
    },
    ...chatHistory,
    {
      role: "user",
      content: `
User Message: ${userMessage}

Portfolio:
${portfolio
  .map(
    (a) =>
      `${a.symbol}: ${a.quantity} units @ $${a.buyPrice}, Current: $${a.currentPrice}, P/L: ${a.profitLossPercent}%`
  )
  .join("\n")}

User Preferences: Risk - ${preferences.risk || "Moderate"}, Interests - ${
        preferences.interests?.join(", ") || "N/A"
      }

Market Trends:
${trends
  .map((t) => `${t.sector}: ${t.trend}, Sentiment: ${t.newsSentiment}`)
  .join("\n")}

Provide a relevant and clear response.
      `.trim(),
    },
  ];
  return messages;
};
