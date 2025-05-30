const path = require('path');
const presentationState = new Map();

async function handlePresentation(ctx) {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;

    const existingData = presentationState.get(userId);

    // Удалить предыдущее сообщение пользователя, если есть
    if (existingData?.userMessageId) {
        try {
            await ctx.telegram.deleteMessage(chatId, existingData.userMessageId);
        } catch (err) {
            console.warn('Не удалось удалить предыдущее сообщение пользователя:', err);
        }
    }

    // Если у пользователя уже была отправлена презентация
    if (existingData?.firstBotMessageId) {
        // Удаляем предыдущее пересланное сообщение, если оно отличалось от первого
        if (existingData.lastForwardedId && existingData.lastForwardedId !== existingData.firstBotMessageId) {
            try {
                await ctx.telegram.deleteMessage(chatId, existingData.lastForwardedId);
            } catch (err) {
                console.warn('Не удалось удалить предыдущее пересланное сообщение:', err);
            }
        }

        // Пересылаем первое сообщение с PDF
        try {
            const forwarded = await ctx.telegram.forwardMessage(chatId, chatId, existingData.firstBotMessageId);

            // Обновляем состояние: новое пересланное сообщение + ID текущего пользовательского сообщения
            presentationState.set(userId, {
                ...existingData,
                lastForwardedId: forwarded.message_id,
                userMessageId: ctx.message?.message_id,
            });

            return;
        } catch (err) {
            console.warn('Не удалось переслать старую презентацию, будем отправлять заново:', err);
            presentationState.delete(userId);
        }
    }

    const loadingMessage = await ctx.reply('⏳ Загружаем файл, пожалуйста подождите...');

    try {
        const sentMessage = await ctx.replyWithDocument({
            source: path.resolve(__dirname, '../files/presentation.pdf'),
            filename: 'Свадебный декор.pdf',
        });

        await ctx.deleteMessage(loadingMessage.message_id);

        presentationState.set(userId, {
            firstBotMessageId: sentMessage.message_id,
            lastForwardedId: null,
            userMessageId: ctx.message?.message_id,
        });
    } catch (err) {
        console.error('Ошибка при отправке презентации:', err);
        await ctx.reply('❌ Ошибка при загрузке файла. Попробуйте позже.');
    }
}

module.exports = { handlePresentation };
