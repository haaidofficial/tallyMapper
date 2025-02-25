const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const validateAddEnterprise = [
    body("name")
        .trim()
        .escape()
        .notEmpty().withMessage("Enterprise name is required")
        .isLength({ min: 3 }).withMessage("Enterprise name must be at least 3 characters long"),

    body("apiEndpoints")
        .isArray().withMessage("API Endpoints should be an array")
        .optional()
        .custom((value) => {
            if (value.length > 0 && !value.every((api) => typeof api === "string")) {
                throw new Error("All API endpoints must be strings");
            }
            return true;
        }),

    body("email")
        .optional()
        .isEmail().withMessage("Email must be valid")
        .normalizeEmail(),

    body("contact")
        .optional()
        .isMobilePhone().withMessage("Contact must be a valid phone number"),
];


const validateAddApiEndpoints = [
    param("enterpriseId").isMongoId().withMessage("Invalid enterprise ID"),
    body("apiEndpoints")
        .isArray({ min: 1 })
        .withMessage("API Endpoints should be an array with at least one entry"),
    body("apiEndpoints.*.name").notEmpty().withMessage("API name is required"),
    body("apiEndpoints.*.url").isURL().withMessage("Valid API URL is required"),
];

const validateEnterpriseId = [
    param("enterpriseId").isMongoId().withMessage("Invalid enterprise ID"),
];

const validateEnterpriseIdOptional = [
    param("enterpriseId").isMongoId().optional().withMessage("Invalid enterprise ID"),
];

const validateApiEndpointId = [
    param("apiId").isMongoId().withMessage("Invalid API ID"),
];

const validateUpdateEnterprise = [
    param("id").isMongoId().withMessage("Invalid enterprise ID"),
    body("name").notEmpty().withMessage("Enterprise name is required"),
];

const validateApiEndpointsList = [
    body("apiEndpoints")
        .isArray({ min: 1 })
        .withMessage("API Endpoints should be a non-empty array"),

    body("apiEndpoints.*.api")
        .isString()
        .notEmpty()
        .withMessage("Each API Endpoint must have a valid API URL"),

    body("apiEndpoints.*.method")
        .isString()
        .notEmpty()
        .withMessage("Each API Endpoint must have a valid HTTP method")
        .isIn(["get", "post", "put", "delete", "patch"])
        .withMessage("Invalid HTTP method. Allowed: GET, POST, PUT, DELETE, PATCH"),
];

const validateUpdateApiEndpoints = [
    body("apiEndpoints").isArray({ min: 1 }).withMessage("At least one API endpoint is required"),
    body("apiEndpoints.*.id").isMongoId().withMessage("Invalid API ID"),
    body("apiEndpoints.*.api").isURL().withMessage("Valid API URL is required"),
    body("apiEndpoints.*.method").isIn(["get", "post", "put", "delete"]).withMessage("Invalid HTTP method"),
];

const validateDeleteEnterpriseApiEndpoint = [
    param("enterpriseId").isMongoId().withMessage("Invalid enterprise ID"),
    body("apiId").isMongoId().withMessage("Invalid API ID"),
];


const validateUpdateEnterpriseApiEndpointHeaders = [
    // Validate enterpriseId (must be a valid MongoDB ObjectId)
    param("enterpriseId")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid enterpriseId"),

    // Validate apiId (required and must be a non-empty string)
    body("apiId")
        .isString()
        .notEmpty()
        .withMessage("API ID is required and must be a valid string"),

    // Validate apiName (optional but must be a non-empty string if provided)
    body("apiName")
        .optional()
        .isString()
        .notEmpty()
        .withMessage("API Name must be a non-empty string if provided"),

    // Validate headers (optional but must be an array if provided)
    body("headers")
        .optional({ nullable: true })
        .isArray()
        .withMessage("Headers must be an array"),

    // Ensure headers array contains only objects
    body("headers.*")
        .optional()
        .isObject()
        .withMessage("Each header must be an object"),
];


const validateGetTransformedTallyData = [
    // Validate enterpriseId (must be a valid MongoDB ObjectId)
    param("enterpriseId")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid enterpriseId"),

    // Validate apiId (must be a valid MongoDB ObjectId)
    param("apiId")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid apiId"),

    // Validate body (optional but must be an object if provided)
    body()
        .optional()
        .isObject()
        .withMessage("Request body must be an object"),
];

module.exports = {
    validateAddEnterprise,
    validateAddApiEndpoints,
    validateEnterpriseId,
    validateApiEndpointId,
    validateUpdateEnterprise,
    validateUpdateApiEndpoints,
    validateDeleteEnterpriseApiEndpoint,
    validateApiEndpointsList,
    validateUpdateEnterpriseApiEndpointHeaders,
    validateEnterpriseIdOptional,
    validateGetTransformedTallyData
}