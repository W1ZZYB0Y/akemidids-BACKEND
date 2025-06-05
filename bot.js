const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('7667727878:AAG_3OqsxrxjZKVhjxgOfXsvQxEOX7NPu_E', { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Welcome! Tap below to play 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎮 Play Jaws Game",
            web_app: {
              url: "https://your-vercel-app.vercel.app"
            }
          }
        ]
      ]
    }
  });
});

