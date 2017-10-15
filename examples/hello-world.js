const TeleBot = require('../');
const bot = new TeleBot('474605425:AAFZbjuJ9wIs3WgAlU6c1vILcW7ss2GyOBw');

// On every text message
bot.on('text', msg => {
    let id = msg.from.id;
    let text = msg.text;
    return bot.sendMessage(id, `You said: ${ text }`);
});

bot.connect();
