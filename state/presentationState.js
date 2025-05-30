const state = new Map();

function get(userId) {
    return state.get(userId);
}

function set(userId, messageId) {
    state.set(userId, messageId);
}

module.exports = { get, set };
