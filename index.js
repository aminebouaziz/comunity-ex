const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express")

const swagger = require("./swagger.json")
const communityAPI = require("./api/community")

const app = express();

app.use(bodyParser.json());// for parsing application/json

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

//swagger documentation endpoints
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swagger));

//all garments endpoints
app.use(communityAPI);

// Expose Express API as a single Cloud Function:
exports.community = app;