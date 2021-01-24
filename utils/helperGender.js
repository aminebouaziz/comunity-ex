const { masterManDB, masterWomanDB } = require("../config/dbConfig");

function getMasterDB(gender) {
    switch (gender) {
        case 'M':
            return masterManDB
        case 'F':
            return masterWomanDB
        default:
            throw new Error("Unknown gender")
    }
}

module.exports = {
    getMasterDB
}
