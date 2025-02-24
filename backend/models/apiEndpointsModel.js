const mongoose = require("mongoose");

const ApiEndpointSchema = new mongoose.Schema({
    api: { type: String, required: true },
    method: { type: String, required: true }
});

const ApiEndpoint = mongoose.model("ApiEndpoints", ApiEndpointSchema);
module.exports = ApiEndpoint;
