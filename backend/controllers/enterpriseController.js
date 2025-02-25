const { validationResult, header } = require("express-validator");
const Enterprise = require("../models/enterpriseModel");
const ApiEndpoint = require("../models/apiEndpointsModel");
const { default: mongoose } = require("mongoose");
const { addTallyReportApi } = require("../services/tallyServices");

// Controller to handle adding an enterprise
const addEnterprise = async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Destructure the body from the request
        const { name, apiEndpoints = [], email, contact } = req.body;

        // Create a new enterprise document
        const newEnterprise = new Enterprise({
            name,
            apiEndpoints,
            email,
            contact,
        });

        // Save the new enterprise to the database
        await newEnterprise.save();

        // Send the success response
        res.status(201).json({
            message: "Enterprise added successfully",
            enterprise: newEnterprise,
        });
    } catch (error) {
        // Handle error and send response
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Controller to get the list of enterprises
const getEnterprises = async (req, res) => {
    try {
        const enterprises = await Enterprise.find();
        res.status(200).json({
            success: true,
            count: enterprises.length,
            data: enterprises,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching enterprises" });
    }
};


const deleteEnterprise = async (req, res) => {
    try {
        const { enterpriseId } = req.params;

        // Check if enterprise exists
        const enterprise = await Enterprise.findById(enterpriseId);
        if (!enterprise) {
            return res.status(404).json({ success: false, message: "Enterprise not found" });
        }

        // Delete the enterprise
        await Enterprise.findByIdAndDelete(enterpriseId);

        res.json({ success: true, message: "Enterprise deleted successfully" });
    } catch (error) {
        console.error("Error deleting enterprise:", error);
        res.status(500).json({ success: false, message: "Server error, unable to delete enterprise" });
    }
};

// Update enterprise name by ID
const updateEnterpriseDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body; // The new name sent in the request body

        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        // Find the enterprise by ID and update the name
        const updatedEnterprise = await Enterprise.findByIdAndUpdate(
            id,
            { name },
            { new: true } // Return the updated document
        );

        if (!updatedEnterprise) {
            return res.status(404).json({ success: false, message: "Enterprise not found" });
        }

        res.json({
            success: true,
            message: "Enterprise name updated successfully",
            data: updatedEnterprise,
        });
    } catch (error) {
        console.error("Error updating enterprise:", error);
        res.status(500).json({ success: false, message: "Server error, unable to update enterprise" });
    }
};

const addApiEndpoints = async (req, res) => {

    try {
        const { enterpriseId } = req.params;
        const { apiEndpoints } = req.body; // Expecting an array of { name, url }

        if (!Array.isArray(apiEndpoints) || apiEndpoints.length === 0) {
            return res.status(400).json({ success: false, message: "API Endpoints are required" });
        }

        const enterprise = await Enterprise.findById(enterpriseId);

        if (!enterprise) {

            return res.status(400).json({ success: false, message: "Enterprise not found" });
        }

        const newAddedApiEndpoints = [];

        for (const apiEndpoint of apiEndpoints) {

            // check if api exists already
            const existingApi = await ApiEndpoint.findOne({ api: apiEndpoint?.url });
            let newApi = null;
            if (!existingApi) {
                // if new api then add it to db
                newApi = new ApiEndpoint({ api: apiEndpoint?.url });
                await newApi.save();
                console.log(newApi, 'newApi')
            }


            // check if api is already linked with the enterprise
            const isApiAlreadyLinked = enterprise.apiConfigurations?.some(apiConfig => apiConfig?.apiId?.toString() === existingApi?._id?.toString());
            console.log(isApiAlreadyLinked, 'isApiLinked');


            // if api is not linked then link it
            if (!isApiAlreadyLinked) {

                enterprise?.apiConfigurations?.push({
                    apiId: existingApi?._id || newApi?._id, // existing api id or newly added api id
                    apiName: apiEndpoint?.name,
                    headers: apiEndpoint?.headers || null,
                    apiKey: apiEndpoint?.apiKey || null
                });

                newAddedApiEndpoints.push(apiEndpoint);
                console.log('api not linked', newAddedApiEndpoints)

            }

        }

        if (newAddedApiEndpoints?.length === 0) {
            return res.status(400).json({ success: false, message: 'All api endpoints already exists' });
        }

        await enterprise.save();

        res.json({ success: true, message: 'Api Endpoints added successfully', data: newAddedApiEndpoints });
    } catch (error) {
        console.error("Error adding API endpoints:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

const addApiEndpointsList = async (req, res) => {

    try {
        const { apiEndpoints } = req.body; // Expecting an array of { name, url }

        if (!Array.isArray(apiEndpoints) || apiEndpoints.length === 0) {
            return res.status(400).json({ success: false, message: "API Endpoints are required" });
        }

        const newAddedApiEndpoints = [];
        const existingApiEndpoints = [];

        for (const apiEndpoint of apiEndpoints) {

            // check if api exists already
            const existingApi = await ApiEndpoint.findOne({ api: apiEndpoint?.api });
            let newApi = null;
            if (!existingApi) {
                // if new api then add it to db
                newAddedApiEndpoints.push(apiEndpoint);
                newApi = new ApiEndpoint({ api: apiEndpoint?.api, method: apiEndpoint?.method });
                await newApi.save();
                await addTallyReportApi(newApi?._id);
                console.log(newApi, 'newApi')
            }
            else {
                existingApiEndpoints.push(apiEndpoint);
            }

        }

        if (newAddedApiEndpoints?.length === 0) {
            return res.status(400).json({ success: false, message: 'All api endpoints already exists' });
        }
        else if (existingApiEndpoints?.length > 0) {
            return res.status(400).json({ success: false, message: 'Some api endpoints already exists', existingApiEndpoints });
        }

        res.json({ success: true, message: 'Api Endpoints added successfully', data: newAddedApiEndpoints });
    } catch (error) {
        console.error("Error adding API endpoints:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

const getEnterpriseApiEndpoints = async (req, res) => {

    try {
        const { enterpriseId } = req.params;

        const enterprise = await Enterprise.findById(enterpriseId).populate('apiConfigurations.apiId').exec();

        if (!enterprise) {
            return res.status(400).json({ success: false, message: 'Enterprise not found' });
        }

        const data = {
            enterpriseName: enterprise?.name,
            enterpriseId: enterprise?._id
        }

        const apiEndpoints = enterprise?.apiConfigurations?.map(apiConfig => ({
            apiId: apiConfig?.apiId?._id,
            apiName: apiConfig?.apiName,
            url: apiConfig?.apiId?.api,
            method: apiConfig?.apiId?.method,
            headers: apiConfig?.headers
        }));

        data.apiEndpoints = apiEndpoints;


        console.log(enterprise, 'enterprise');

        return res.status(200).json({ status: 200, data })
    } catch (error) {
        console.error("Error fetching API endpoints:", error);
        res.status(500).json({ success: false, message: 'Server error, unable to fetch API endpoints' })
    }

}

const getAllApiEndpoints = async (req, res) => {

    try {

        const { enterpriseId } = req.params;

        const apiEndpoints = await ApiEndpoint.find();
        let attachedApis = [];
        if (enterpriseId) {
            const enterprise = await Enterprise.findById(enterpriseId);
            attachedApis = enterprise.apiConfigurations?.map(apiConfig => apiConfig.apiId)
        }

        const data = {
            apiEndpoints,
            attachedApis
        }


        return res.status(200).json({ status: 200, data })
    } catch (error) {
        console.error("Error fetching API endpoints:", error);
        res.status(500).json({ success: false, message: 'Server error, unable to fetch API endpoints' })
    }

}

const deleteEnterpriseApiEndpoint = async (req, res) => {
    try {
        const { enterpriseId } = req.params;
        const { apiId } = req.body;

        console.log(req.body, 'sshafjsfjjsfjs')

        const enterprise = await Enterprise.findById(enterpriseId);

        if (!enterpriseId || !apiId) {
            return res.status(400).json({ success: false, message: 'Api Id and Enterprise Id required' });
        }

        if (!enterprise) {
            return res.status(400).json({ success: false, message: 'Enterprise not found' });
        }

        enterprise.apiConfigurations = enterprise.apiConfigurations?.filter(apiConfig => apiConfig?.apiId?.toString() !== apiId?.toString());
        await enterprise.save();

        return res.status(200).json({ success: true, message: 'Api endpoint deleted successfully' })

    } catch (error) {

    }
}

const updateEnterpriseApiEndpointHeaders = async (req, res) => {
    try {

        const { enterpriseId } = req.params;
        const { apiId, apiName, headers } = req.body;

        const updateQuery = {};

        if (apiName) {
            updateQuery.$set = { "apiConfigurations.$.apiName": apiName }
        }


        if (Array.isArray(headers)) {
            if (headers?.length > 0) {
                updateQuery.$set["apiConfigurations.$.headers"] = headers;
            } else {
                updateQuery.$unset = { "apiConfigurations.$.headers": null };
            }
        }

        const updatedEnterprise = await Enterprise.findOneAndUpdate(
            { _id: enterpriseId, "apiConfigurations.apiId": apiId },
            updateQuery,
            { new: true }
        );

        if (!updatedEnterprise) {
            return res.status(404).json({ success: false, message: 'Enterprise or API Endpoint not found' });
        }

        return res.status(200).json({ success: true, message: 'API Endpoint headers updated successfully' });


    } catch (error) {
        console.error("Error updating enterprise api endpoint headers:", error);
        res.status(500).json({ success: false, message: "Error updating enterprise api endpoint headers" });
    }

}

const updateApiEndpoints = async (req, res) => {
    try {

        const { apiEndpoints } = req.body;

        if (!apiEndpoints || !Array.isArray(apiEndpoints)) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }

        const updatePromises = apiEndpoints.map(apiEndpoint => {
            return ApiEndpoint.findByIdAndUpdate(apiEndpoint?.id, { api: apiEndpoint?.api, method: apiEndpoint?.method }, { new: true });
        });

        const updatedApiEndpoints = await Promise.all(updatePromises);

        res.status(200).json({ success: true, message: 'API endpoints updated', updatedApiEndpoints });


    } catch (error) {
        console.error("Error updating api endpoint:", error);
        res.status(500).json({ success: false, message: "Error updating api endpoints" });
    }
}

const deleteApiEndpoint = async (req, res) => {
    try {
        const { apiId } = req.params;
        const apiDeleted = await ApiEndpoint.findByIdAndDelete(apiId);

        if (!apiDeleted) {
            return res.status(404).json({ success: false, message: 'Api endpoint not found' });
        }

        await Enterprise.updateMany(
            { 'apiConfigurations.apiId': apiId },
            { $pull: { apiConfigurations: { apiId } } }
        );

        res.status(200).json({ success: true, message: 'Api endpoint deleted successfully', data: apiDeleted })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting api endpoint' })
    }
}

module.exports = {
    addEnterprise,
    getEnterprises,
    deleteEnterprise,
    updateEnterpriseDetail,
    addApiEndpoints,
    addApiEndpointsList,
    getEnterpriseApiEndpoints,
    deleteEnterpriseApiEndpoint,
    updateEnterpriseApiEndpointHeaders,
    getAllApiEndpoints,
    updateApiEndpoints,
    deleteApiEndpoint
};
