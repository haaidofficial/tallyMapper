const axios = require("axios");
const ERPReportApi = require("../models/erpReportApiModel");



const addTallyReportApi = async (apiId) => {
    try {

        const isExistingApiId = await ERPReportApi.findById(apiId);

        if (isExistingApiId) {
            return { success: false, message: 'Api endpoint already exists' }
        }

        const newApiId = new ERPReportApi({ apiId });
        await newApiId.save();

        return { success: true, message: 'New Api endpoint successfully' }


    } catch (error) {
        throw new Error(error.message);
    }
}

const fetchTallyData = async (apiEndpoint, method, reqHeaders = [], reqBody = {}) => {
    try {
        const config = {
            method,
            url: apiEndpoint
        };

        // Process headers if provided
        if (Array.isArray(reqHeaders) && reqHeaders.length > 0) {
            config.headers = reqHeaders.reduce((acc, { key, value }) => {
                if (key && value) acc[key] = value;
                return acc;
            }, {});
        }

        // Include body only if it's not empty and method is not GET
        if (method.toUpperCase() !== 'GET' && reqBody && Object.keys(reqBody).length > 0) {
            config.data = reqBody;
        }

        console.log(config, 'API Request Config');

        const response = await axios(config);
        return response?.data || null;
    } catch (error) {
        throw new Error(error.message);
    }
}



module.exports = {
    addTallyReportApi,
    fetchTallyData
};