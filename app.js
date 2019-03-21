const TelegramBot = require('node-telegram-bot-api');
const request = require('request'); // С помощью request Будем делать запросы к API банка

// replace the value below with the Telegram token you receive from @BotFather
const token = '742532888:AAGiRT7RFB-QHgtOJZJh4BBeETsdRGGqU6I';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/curse/, (msg, match) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Какая валюта вас интересует?', {
    reply_markup: { // Клавиатура
      inline_keyboard: [ 
        [
          {
            text: '€ EUR',
            callback_data: 'EUR'
          },
          {
            text: '$ USD',
            callback_data: 'USD'
          },
          {
            text: '₽ RUB',
            callback_data: 'RUB'
          },
          {
            text: '₿ BTC',
            callback_data: 'BTC'
          },
        ]
      ]
    }
  });
});

bot.on('callback_query', query => {
  // console.log(query);
  const id = query.message.chat.id;
  request('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11', function (error, response, body) { 
    const data =  JSON.parse(body);
    const result = data.filter(item => item.ccy === query.data)[0];
    const flag = {
      'EUR': '🇪🇺',
      'USD': '🇺🇸',
      'RUB': '🇷🇺',
      'UAH': '🇺🇦',
      'BTC': '₿',
    }
    let md = `
      *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
      Buy: _${result.buy}_
      Sale: _${result.sale}_
    `;
    bot.sendMessage(id, md, {parse_mode: 'Markdown'});
   })
});