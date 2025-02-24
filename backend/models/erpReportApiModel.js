const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    apiId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiEndpoints' },
});

const ERPReportApi = mongoose.model('ERPReportDataApi', schema);

module.exports = ERPReportApi;
