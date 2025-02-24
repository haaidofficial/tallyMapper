const { validationResult, header } = require("express-validator");
const Enterprise = require("../models/enterpriseModel");
const ApiEndpoint = require("../models/apiEndpointsModel");
const { default: mongoose } = require("mongoose");
const { fetchTallyData } = require("../services/tallyServices");
const { removeCharactersFromData } = require("../services/parseData");


const getTransformedTallyData = async (req, res) => {
    try {
        const { apiId, enterpriseId } = req.params;
        const body = req.body;

        const enterprise = await Enterprise.findById(enterpriseId).populate('apiConfigurations.apiId').exec();


        if (!enterprise) {
            return res.status(400).json({ success: false, message: 'Enterprise not found' });
        }

        const apiConfig = enterprise?.apiConfigurations?.find(apiConfig => apiConfig?.apiId?._id?.toString() === apiId?.toString());
        console.log(JSON.stringify(enterprise?.apiConfigurations), 'enterprise');
        if (!apiConfig) {
            return res.status(400).json({ success: false, message: 'Api Endpoint not found', data: apiConfig });
        }

        const url = apiConfig?.apiId?.api;
        const method = apiConfig?.apiId?.method;
        const reportDataApiHeaders = apiConfig?.headers;

        let targetKeys = ["JsonDataTable"];
        if (body?.target) {
            const targetArr = body?.target;
            if (Array.isArray(targetArr)) {
                if (targetArr?.length > 0) {
                    targetKeys = [];
                    targetArr.forEach(target => {
                        targetKeys.push(target.trim());
                    })
                }
            }

        }

        const response = await fetchTallyData(url, method, reportDataApiHeaders, body);

        if (response) {

            const parsedData = removeCharactersFromData(response, targetKeys)

            return res.status(200).json({ success: true, data: parsedData ? parsedData : null });

            // return res.status(200).json({ success: true, data: response });
        }
        res.status(400).json({ success: false, message: 'Unable to fetch data' });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: 'Unable to fetch api' })
    }
}


module.exports = {
    getTransformedTallyData,
};