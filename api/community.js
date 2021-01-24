const express = require("express");
const arangojs = require("arangojs");
const aql = arangojs.aql;

const { asyncMiddleware } = require("../middleware");
const { db } = require("../config/dbConfig");

const router = express.Router();

//GET ENDPOINTS
router.get('/', asyncMiddleware(async (req, res, next) => {

    try {

        var value = 100

        res.json({ code: 200, message: "Runned your first example", value: value });

    } catch (error) {
        console.log(error.stack)
        res.json({ "code": error.code, "error": error.message })
    }

}));

//POST ENDPOINTS
router.post('/', asyncMiddleware(async (req, res, next) => {

    try {

        var body = req.body;

        res.json({ code: 200, message: "Runned your second example", body: body });

    } catch (error) {
        console.log(error.stack)
        res.json({ "code": error.code, "error": error.message })
    }

}));

//PUT ENDPOINTS

//DELETE ENDPOINTS

module.exports = router;