require('dotenv').config();
const { Telegraf } = require('telegraf');

const handleStart = require('./handlers/start');
const { handleCatalog, handleProduct, handleBackToCatalog } = require('./handlers/catalog');
const { handlePresentation } = require('./handlers/presentation');
const { handleContact } = require('./handlers/contact');

const bot = new Telegraf(process.env.BOT_TOKEN);

function registerCommands(bot) {
    bot.start(handleStart);

    bot.hears('📦 Каталог', handleCatalog);
    bot.hears('📂 Презентация', handlePresentation);
    bot.hears('📞 Связь с нами', handleContact);

    const productActions = ['candles', 'chandelier', 'stand', 'combo'];
    productActions.forEach(action => {
        bot.action(action, ctx => handleProduct(ctx, action));
    });

    bot.action('back_to_catalog', handleBackToCatalog);

    bot.on('message', async (ctx) => {
        const allowedTexts = ['📦 Каталог', '📂 Презентация', '📞 Связь с нами'];
        if (!allowedTexts.includes(ctx.message.text)) {
            try {
                await ctx.deleteMessage();
            } catch (err) {
                console.error('Ошибка удаления сообщения:', err.message);
            }
        }
    });
}

registerCommands(bot);

bot.launch()
    .then(() => console.log('Бот запущен'))
    .catch(err => console.error('Ошибка запуска бота:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
