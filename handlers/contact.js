const { getContactMessages, setContactMessages, clearContactMessages } = require('../state/contactState');

async function handleContact(ctx) {
    const userId = ctx.from.id;

    const previousMessages = getContactMessages(userId);
    for (const messageId of previousMessages) {
        try {
            await ctx.deleteMessage(messageId);
        } catch (error) {
            console.error('Не удалось удалить сообщение:', error.message);
        }
    }

    const userMessageId = ctx.message?.message_id;
    const botMessage = await ctx.reply('Свяжитесь с администратором: @jbssnva');

    const newMessageIds = [];
    if (userMessageId) newMessageIds.push(userMessageId);
    if (botMessage.message_id) newMessageIds.push(botMessage.message_id);
    setContactMessages(userId, newMessageIds);
}

module.exports = { handleContact };
