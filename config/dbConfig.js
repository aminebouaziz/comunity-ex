const arangojs = require("arangojs")

const arangoUrl = ["http://34.76.68.22:8529"];

const db = new arangojs.Database({
    url: arangoUrl
});

db.useBasicAuth("root", "d++ll@pp2019");

const masterDB = new arangojs.Database({
    url: arangoUrl
});

masterDB.useBasicAuth("root", "d++ll@pp2019");
masterDB.useDatabase("_system");


module.exports = {
    db,
    masterDB
}