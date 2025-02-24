function safeParseJson(data) {
    try {
        return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
        return data; // Return as-is if it's not a valid JSON string
    }
}

function cleanObject(key = '', targetKeys = [], obj) {
    if (typeof obj === 'string') {
        if (targetKeys.includes(key)) {
            return safeParseJson(obj);
        }
        return obj; // Return as-is if the key isn't in targetKeys
    }
    if (Array.isArray(obj)) {
        return obj.map(item => cleanObject(key, targetKeys, item));
    }
    if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([k, value]) => [k, cleanObject(k, targetKeys, value)])
        );
    }
    return obj;
}

const removeCharactersFromData = (rawData, targetKeys = []) => {
    const jsonData = safeParseJson(rawData);
    return cleanObject('', targetKeys, jsonData);
};

module.exports = {
    removeCharactersFromData,
};
