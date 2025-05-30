const catalogState = new Map();

function setCatalogState(userId, data) {
    catalogState.set(userId, data);
}

function getCatalogState(userId) {
    return catalogState.get(userId);
}

function clearCatalogState(userId) {
    catalogState.delete(userId);
}

module.exports = {
    setCatalogState,
    getCatalogState,
    clearCatalogState,
};
