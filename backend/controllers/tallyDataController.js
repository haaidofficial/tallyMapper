const Enterprise = require("../models/enterpriseModel");
const { fetchTallyData } = require("../services/tallyServices");
const { removeCharactersFromData } = require("../services/parseData");
const { excelData } = require("../services/excelFile");

const getTransformedTallyData = async (req, res) => {
    try {
        const { apiId, enterpriseId } = req.params;
        const body = req.body;

        const enterprise = await Enterprise.findById(enterpriseId).populate('apiConfigurations.apiId').exec();
        if (!enterprise) {
            return res.status(400).json({ success: false, message: 'Enterprise not found' });
        }

        const apiConfig = enterprise?.apiConfigurations?.find(apiConfig => apiConfig?.apiId?._id?.toString() === apiId?.toString());

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
            const parsedData = await removeCharactersFromData(response, targetKeys);
            if (parsedData?.JsonDataTable) {
                if (req.query?.type && req.query?.type === 'excel') {
                    const excelFile = excelData(parsedData?.JsonDataTable, apiConfig?.apiName);
                    res.setHeader('Content-Disposition', `attachment; filename=data.xlsx`);
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    return res.status(200).end(excelFile);
                }
                else {
                    return res.status(200).json({ JsonDataTable: parsedData?.JsonDataTable });
                }
            }
            else {
                return res.status(200).json({ data: parsedData ? parsedData : null });
            }

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