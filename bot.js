require('dotenv').config();
const { Telegraf } = require('telegraf');

const { handleCatalog, handleProduct, handleBackToCatalog } = require('./handlers/catalog');
const handleStart = require('./handlers/start');
const { handlePresentation } = require('./handlers/presentation');
const { handleContact } = require('./handlers/contact');

const bot = new Telegraf(process.env.BOT_TOKEN);

function registerCommands(bot) {
    bot.start(handleStart);

    bot.hears('📂 Презентация', handlePresentation);
    bot.hears('📦 Каталог', handleCatalog);
    bot.hears('📞 Связь с нами', handleContact);

    const productActions = ['candles', 'chandelier', 'stand', 'combo'];
    productActions.forEach(action => {
        bot.action(action, ctx => handleProduct(ctx, action));
    });

    bot.action('back_to_catalog', handleBackToCatalog);
}

registerCommands(bot);

bot.launch()
    .then(() => console.log('Бот запущен'))
    .catch(err => console.error('Ошибка запуска бота:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
