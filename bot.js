bot.onText(/\/start(?:\s+(.*))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ref = match[1]; // this is the referral id if present
  
  // Register user
  try {
    const res = await axios.post('https://akemidids-backend.onrender.com/api/users/register', {
      telegramId: chatId,
      username: msg.chat.username || `user${chatId}`,
      ip: '' // optional IP
    }, {
      params: { ref } // pass ref in query string
    });

    bot.sendMessage(chatId, "Welcome! Tap below to play 👇", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎮 Play Jaws Game", web_app: { url: "https://t.me/JawsGameBot/Jaws" } }]
        ]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, "Error registering you. Please try again.");
    console.error('Error registering user:', error.message);
  }
});
