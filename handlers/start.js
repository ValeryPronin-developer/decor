const { Markup } = require('telegraf');

function handleStart(ctx) {
    return ctx.reply('Добро пожаловать! Выберите нужный раздел:', Markup.keyboard([
        ['📦 Каталог', '📂 Презентация'],
        ['📞 Связь с нами']
    ]).resize());
}

module.exports = handleStart;
