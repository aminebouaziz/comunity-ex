const { db } = require("../config/dbConfig")
const { filterWithPanels_LC } = require("./helperColors");
const { getLastInfo } = require("./helperDB");
const { getMasterDB } = require("./helperGender");
const { httpPostSingle, httpPostMultiple } = require("./helperHTTP");

async function insertGarment(db, layer, garment) {

    const collection = db.collection(layer);

    let meta = await collection.save(garment, { returnNew: true, overwrite: true });

    const masterDB = getMasterDB(garment.sex)

    //get all docs from collections linked to garment collection
    let uplink, downlink, thirdlink = null;
    switch (collection.name) {

        case "single_piece":
            uplink = "overtop";
            downlink = "shoes";
            break;
        case "overtop":
            downlink = "top";
            break;
        case "top":
            uplink = "overtop";
            downlink = "bottom";
            break;
        case "bottom":
            uplink = "top";
            downlink = "shoes";
            break;
        case "shoes":
            uplink = "bottom";
            downlink = "accessories";
            thirdlink = "bags";
            break;
        case "accessories":
            uplink = "shoes";
            break;
        case "bags":
            uplink = "shoes";
            break;
        default:
            break;
    }

    //get edges between each garment taken from linked collections and new garment
    let affinity = db.edgeCollection("affinity");

    //create new edges
    if (uplink != null) {

        let docs = await getAllGarmentsInLayer(db, uplink, garment);

        for (const doc of docs) {
            //the edge of the master graph between the new garment id and one of the garments present in the linked collection in the slave db
            const cursor = await masterDB.query(`
            FOR aff IN affinity
            FILTER (aff._from == @from AND aff._to == @to)
            RETURN aff`,
                { "from": uplink + "/" + doc.type, "to": garment.layer + "/" + garment.type });

            let result = [];

            while (cursor.hasNext()) {
                const val = await cursor.next();
                delete val._key;
                result.push(val);
            }

            //create in affinity collection an edge which has the same properties as in master graph
            try {

                if (result.length > 0) {
                    let aff = result[0];
                    aff._from = doc._id;
                    aff._to = meta._id;
                    let edgeMeta = await affinity.save(aff, true);
                    //console.log("created link with garment " + doc.type);
                }

            } catch (err) {
                console.log(err);
            }
        }
    }

    if (downlink != null) {

        let docs = await getAllGarmentsInLayer(db, downlink);

        for (const doc of docs) {
            //the edge of the master graph between the new garment id and one of the garments present in the linked collection in the slave db
            const cursor = await masterDB.query(`
            FOR aff IN affinity
            FILTER (aff._from == @from AND aff._to == @to)
            RETURN aff`,
                { "from": garment.layer + "/" + garment.type, "to": downlink + "/" + doc.type });

            let result = [];

            while (cursor.hasNext()) {
                const val = await cursor.next();
                delete val._key;
                result.push(val);
            }

            //create in affinity collection an edge which has the same properties as in master graph
            try {

                if (result.length > 0) {
                    let aff = result[0];
                    aff._from = meta._id;
                    aff._to = doc._id;
                    let edgeMeta = await affinity.save(aff, true);
                    //console.log("created link with garment " + doc.type);
                }

            } catch (err) {
                console.log(err);
            }
        }
    }

    if (thirdlink != null) {

        let docs = await getAllGarmentsInLayer(db, thirdlink);

        for (const doc of docs) {
            //the edge of the master graph between the new garment id and one of the garments present in the linked collection in the slave db
            const cursor = await masterDB.query(`
            FOR aff IN affinity
            FILTER (aff._from == @from AND aff._to == @to)
            RETURN aff`,
                { "from": garment.layer + "/" + garment.type, "to": thirdlink + "/" + doc.type }); //query params from and to

            let result = [];

            while (cursor.hasNext()) {
                const val = await cursor.next();
                delete val._key;
                result.push(val);
            }

            //create in affinity collection an edge which has the same properties as in master graph
            try {

                if (result.length > 0) {
                    let aff = result[0];
                    aff._from = meta._id;
                    aff._to = doc._id;
                    let edgeMeta = await affinity.save(aff, true);
                    //console.log("created link with garment " + doc.type);
                }

            } catch (err) {
                console.log(err);
            }
        }
    }

    return meta.new;
}

async function insertGarmentWithFilter(db, layer, garment) {

    const collection = db.collection(layer);

    let meta = await collection.save(garment, { returnNew: true, overwrite: true });

    const masterDB = getMasterDB(garment.sex)

    //get all docs from collections linked to garment collection
    let uplink, downlink, thirdlink = null;
    switch (collection.name) {

        case "single_piece":
            uplink = "overtop";
            downlink = "shoes";
            break;
        case "overtop":
            downlink = "top";
            break;
        case "top":
            uplink = "overtop";
            downlink = "bottom";
            break;
        case "bottom":
            uplink = "top";
            downlink = "shoes";
            break;
        case "shoes":
            uplink = "bottom";
            downlink = "accessories";
            thirdlink = "bags";
            break;
        case "accessories":
            uplink = "shoes";
            break;
        case "bags":
            uplink = "shoes";
            break;
        default:
            break;
    }

    //get edges between each garment taken from linked collections and new garment
    let affinity = db.edgeCollection("affinity");

    let linkedDocs = {
        "up": null,
        "down": null,
        "third": null
    }

    //create new edges
    if (uplink != null) {

        let flagUp = true

        let docs = await getAllGarmentsInLayerWithFilterPanels(db, uplink, garment);

        for (const doc of docs) {
            //the edge of the master graph between the new garment id and one of the garments present in the linked collection in the slave db
            const cursor = await masterDB.query(`
            FOR aff IN affinity
            FILTER (aff._from == @from AND aff._to == @to)
            RETURN aff`,
                { "from": uplink + "/" + doc.type, "to": garment.layer + "/" + garment.type });

            let result = [];

            while (cursor.hasNext()) {
                const val = await cursor.next();
                delete val._key;
                result.push(val);
            }

            //create in affinity collection an edge which has the same properties as in master graph
            try {

                if (result.length > 0) {
                    let aff = result[0];
                    aff._from = doc._id;
                    aff._to = meta._id;
                    let edgeMeta = await affinity.save(aff, true);
                    //console.log("created link with garment " + doc.type);

                    if (flagUp) {
                        linkedDocs.up = doc
                        flagUp = false
                    }
                }

            } catch (err) {
                console.log(err);
            }
        }
    }

    if (downlink != null) {

        let flagDown = true

        let docs = await getAllGarmentsInLayerWithFilterPanels(db, downlink, garment);

        for (const doc of docs) {
            //the edge of the master graph between the new garment id and one of the garments present in the linked collection in the slave db
            const cursor = await masterDB.query(`
            FOR aff IN affinity
            FILTER (aff._from == @from AND aff._to == @to)
            RETURN aff`,
                { "from": garment.layer + "/" + garment.type, "to": downlink + "/" + doc.type });

            let result = [];

            while (cursor.hasNext()) {
                const val = await cursor.next();
                delete val._key;
                result.push(val);
            }

            //create in affinity collection an edge which has the same properties as in master graph
            try {

                if (result.length > 0) {
                    let aff = result[0];
                    aff._from = meta._id;
                    aff._to = doc._id;
                    let edgeMeta = await affinity.save(aff, true);
                    //console.log("created link with garment " + doc.type);

                    if (flagDown) {
                        linkedDocs.down = doc
                        flagDown = false
                    }
                }

            } catch (err) {
                console.log(err);
            }
        }
    }

    if (thirdlink != null) {

        let flagThird = true

        let docs = await getAllGarmentsInLayerWithFilterPanels(db, thirdlink, garment);

        for (const doc of docs) {
            //the edge of the master graph between the new garment id and one of the garments present in the linked collection in the slave db
            const cursor = await masterDB.query(`
            FOR aff IN affinity
            FILTER (aff._from == @from AND aff._to == @to)
            RETURN aff`,
                { "from": garment.layer + "/" + garment.type, "to": thirdlink + "/" + doc.type }); //query params from and to

            let result = [];

            while (cursor.hasNext()) {
                const val = await cursor.next();
                delete val._key;
                result.push(val);
            }

            //create in affinity collection an edge which has the same properties as in master graph
            try {

                if (result.length > 0) {
                    let aff = result[0];
                    aff._from = meta._id;
                    aff._to = doc._id;
                    let edgeMeta = await affinity.save(aff, true);
                    //console.log("created link with garment " + doc.type);

                    if (flagThird) {
                        linkedDocs.third = doc
                        flagThird = false
                    }
                }

            } catch (err) {
                console.log(err);
            }
        }
    }

    return [meta.new, linkedDocs];
}

async function getAllGarmentsInLayer(db, layer) {

    const cursor = await db.query(`
        FOR d IN @@collection
        RETURN d`,
        { "@collection": layer });

    let result = [];

    while (cursor.hasNext()) {
        const val = await cursor.next();
        result.push(val);
    }

    return result;
}

async function getAllGarmentsInLayerWithFilterPanels(db, layer, garment) {

    const cursor = await db.query(`
        FOR d IN @@collection
        RETURN d`,
        { "@collection": layer });

    let result = [];

    if (cursor.hasNext()) {
        result = await filterWithPanels_LC(garment, cursor)
    }

    return result;
}

async function insertMixedOutfits(user, garment, linkedDocs) {

    db.useDatabase(user);

    var limit = 2

    var info = await getLastInfo(db)

    if (info != null) {
        limit = info.limit
    }

    //Inserts mixed outfits with only one garment by user
    httpPostSingle(user, limit, garment)

    for (var key in linkedDocs) {

        if (linkedDocs[key] != null) {
            let garments = []
            garments.push(garment)
            garments.push(linkedDocs[key])
            //Inserts fusion outfits with two garments by user
            httpPostMultiple(user, limit, garments)
        }
    }
}

module.exports = {
    insertGarment,
    insertGarmentWithFilter,
    getAllGarmentsInLayer,
    getAllGarmentsInLayerWithFilterPanels,
    insertMixedOutfits
}   