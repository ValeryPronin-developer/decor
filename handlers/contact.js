const { getContactMessages, setContactMessages } = require('../state/contactState');

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

    const botMessage = await ctx.reply(
        'Нажмите на кнопку ниже, чтобы связаться с администратором:',
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Связаться',
                            url: 'https://t.me/jbssnva?text=Здравствуйте!',
                        },
                    ],
                ],
            },
        }
    );

    const newMessageIds = [];
    if (userMessageId) newMessageIds.push(userMessageId);
    if (botMessage.message_id) newMessageIds.push(botMessage.message_id);
    setContactMessages(userId, newMessageIds);
}

module.exports = { handleContact };
