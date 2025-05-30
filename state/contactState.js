const contactMessages = new Map(); // userId => [messageId1, messageId2]

function setContactMessages(userId, messages) {
    contactMessages.set(userId, messages);
}

function getContactMessages(userId) {
    return contactMessages.get(userId) || [];
}

function clearContactMessages(userId) {
    contactMessages.delete(userId);
}

module.exports = {
    setContactMessages,
    getContactMessages,
    clearContactMessages
};
