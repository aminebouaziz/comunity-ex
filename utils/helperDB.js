const arangojs = require("arangojs");
const aql = arangojs.aql;

async function getLastInfo(db) {

    var lastestDoc = null;

    const cursor = await db.query(`
        FOR doc IN @@info_extensions 
        SORT doc.timestamp DESC 
        LIMIT 1 
        RETURN doc`
        , { "@info_extensions": "info_extensions" }
    );

    if (cursor.hasNext) {
        lastestDoc = await cursor.next();
    }

    return lastestDoc;
}

module.exports = {
    getLastInfo
}