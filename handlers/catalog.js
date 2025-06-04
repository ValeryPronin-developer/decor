const { Markup } = require('telegraf');
const catalog = require('../data/catalog.json');
const fs = require('fs');
const path = require('path');

const userCatalogMessages = new Map();

function getCatalogKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('🕯 Подсвечники', 'candles')],
        [Markup.button.callback('💡 Люстра', 'chandelier')],
        [Markup.button.callback('📏 Стойка', 'stand')],
        [Markup.button.callback('💡+📏 Комплект', 'combo')]
    ]);
}

function formatProductCaption(item) {
    const sizeText = item.size ? `\nРазмеры: ${item.size}` : '';
    return `${item.title}\nСтоимость аренды за шт: ${item.price}${sizeText}\nКоличество: ${item.quantity}`;
}

async function handleCatalog(ctx) {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;

    const oldMessages = userCatalogMessages.get(userId);
    if (oldMessages) {
        for (const msgId of oldMessages) {
            try {
                await ctx.telegram.deleteMessage(chatId, msgId);
            } catch (err) {

            }
        }
    }

    const userMessageId = ctx.message?.message_id || ctx.callbackQuery?.message?.message_id;

    const botMessage = await ctx.reply('Выберите категорию:', getCatalogKeyboard());

    userCatalogMessages.set(userId, [userMessageId, botMessage.message_id].filter(Boolean));
}

async function handleProduct(ctx, productKey) {
    const item = catalog[productKey];
    if (!item) return ctx.reply('Товар не найден.');

    try {
        await ctx.answerCbQuery();

        const caption = formatProductCaption(item);
        const imagePath = path.resolve(__dirname, '..', item.image);

        await ctx.editMessageMedia(
            {
                type: 'photo',
                media: { source: fs.createReadStream(imagePath) },
                caption,
                parse_mode: 'HTML',
            },
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Назад к каталогу', callback_data: 'back_to_catalog' }]
                    ]
                }
            }
        );
    } catch (error) {
        console.error('Ошибка при показе товара:', error);
        await ctx.reply('Произошла ошибка при загрузке товара. Попробуйте позже.');
    }
}

async function handleBackToCatalog(ctx) {
    try {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();

        const message = await ctx.reply('Выберите категорию:', getCatalogKeyboard());

        userCatalogMessages.set(ctx.from.id, [message.message_id]);
    } catch (error) {
        console.error('Ошибка при возврате к каталогу:', error);
    }
}

module.exports = {
    handleCatalog,
    handleProduct,
    handleBackToCatalog
};
