export const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const Endpoints = {
    SignUp: '/api/auth/signup',
    Login: '/api/auth/login',
    AddEnterprise: '/api/addEnterprise',
    GetEnterprises: '/api/getEnterprises',
    DeleteEnterprise: '/api/deleteEnterprise/',
    UpdateEnterprise: '/api/updateEnterprise/',
    AddApiEndpoints: '/api/addApiEndpoints/',
    AddApiEndpointsList: '/api/addApiEndpointsList',
    GetEnterpriseApiEndpoints: '/api/getEnterpriseApiEndpoints/',
    GetAllApiEndpoints: '/api/getAllApiEndpoints',
    DeleteEnterpriseApiEndpoint: '/api/deleteEnterpriseApiEndpoint/',
    UpdateEnterpriseApiEndpointConfig: '/api/updateEnterpriseApiEndpointHeaders/',
    UpdateApiEndpoints: '/api/updateApiEndpoints',
    DeleteApiEndpoint: '/api/deleteApiEndpoint/',
    ReportGetterUrl: '/api/getTallyData/',
}