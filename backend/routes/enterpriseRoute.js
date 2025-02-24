const express = require('express');
const { validateAddEnterprise, validateEnterpriseId, validateUpdateEnterprise, validateAddApiEndpoints, validateApiEndpointsList, validateUpdateEnterpriseApiEndpointHeaders, validateEnterpriseIdOptional, validateUpdateApiEndpoints, validateApiEndpointId, validateGetTransformedTallyData } = require('../utils/validators');
const { addEnterprise, getEnterprises, deleteEnterprise, updateEnterpriseDetail, addApiEndpoints, getEnterpriseApiEndpoints, deleteEnterpriseApiEndpoint, updateEnterpriseApiEndpointHeaders, addApiEndpointsList, getAllApiEndpoints, updateApiEndpoints, deleteApiEndpoint } = require('../controllers/enterpriseController');
const { getTransformedTallyData } = require('../controllers/tallyDataController');
const validationErrorHandler = require('../middlewares/validationErrorHandler');
const router = express.Router();

router.post("/addEnterprise", validateAddEnterprise, validationErrorHandler, addEnterprise);
router.get("/getEnterprises", getEnterprises);
router.delete("/deleteEnterprise/:id", validateEnterpriseId, validationErrorHandler, deleteEnterprise);
router.put("/updateEnterprise/:id", validateUpdateEnterprise, validationErrorHandler, updateEnterpriseDetail);
router.post("/addApiEndpoints/:enterpriseId", validateAddApiEndpoints, validationErrorHandler, addApiEndpoints);
router.post("/addApiEndpointsList", validateApiEndpointsList, validationErrorHandler, addApiEndpointsList);
router.get("/getEnterpriseApiEndpoints/:enterpriseId", validateEnterpriseId, validationErrorHandler, getEnterpriseApiEndpoints);
router.post("/deleteEnterpriseApiEndpoint/:enterpriseId", validateEnterpriseId, validationErrorHandler, deleteEnterpriseApiEndpoint);
router.post("/updateEnterpriseApiEndpointHeaders/:enterpriseId", validateUpdateEnterpriseApiEndpointHeaders, validationErrorHandler, updateEnterpriseApiEndpointHeaders);
router.get("/getAllApiEndpoints/:enterpriseId?", validateEnterpriseIdOptional, validationErrorHandler, getAllApiEndpoints);
router.put("/updateApiEndpoints", validateUpdateApiEndpoints, validationErrorHandler, updateApiEndpoints);
router.delete("/deleteApiEndpoint/:apiId", validateApiEndpointId, validationErrorHandler, deleteApiEndpoint);
router.post("/getTallyData/:apiId/:enterpriseId", validateGetTransformedTallyData, validationErrorHandler, getTransformedTallyData);

module.exports = router;
