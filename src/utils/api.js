// utils/api.js

// API Base URL - thay đổi theo server của bạn
const API_BASE_URL = 'http://localhost:4999/api';

/**
 * Generic API call function
 * @param {string} endpoint - API endpoint (e.g., '/projects', '/keys/status')
 * @param {object} options - Request options
 * @returns {Promise} - API response data
 */
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const response = await fetch(url, config);

        // Handle different response types
        let data;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(data.message || data || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('Network error - Please check your internet connection or server status');
        }
        throw error;
    }
};

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {object} headers - Additional headers
 * @returns {Promise} - API response
 */
const get = (endpoint, headers = {}) => {
    return apiCall(endpoint, {
        method: 'GET',
        headers,
    });
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {object|FormData} body - Request body
 * @param {object} headers - Additional headers
 * @returns {Promise} - API response
 */
const post = (endpoint, body = null, headers = {}) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    };

    if (body) {
        if (body instanceof FormData) {
            delete options.headers['Content-Type'];
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
        }
    }

    return apiCall(endpoint, options);
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {object|FormData} body - Request body
 * @param {object} headers - Additional headers
 * @returns {Promise} - API response
 */
const put = (endpoint, body = null, headers = {}) => {
    const options = {
        method: 'PUT',
        headers,
    };

    if (body) {
        if (body instanceof FormData) {
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
        }
    }

    return apiCall(endpoint, options);
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @param {object} headers - Additional headers
 * @returns {Promise} - API response
 */
const del = (endpoint, headers = {}) => {
    return apiCall(endpoint, {
        method: 'DELETE',
        headers,
    });
};

/**
 * Helper function to create headers with API key
 * @param {string} apiKey - API key
 * @param {object} additionalHeaders - Additional headers
 * @returns {object} - Headers object
 */
const createAuthHeaders = (apiKey, additionalHeaders = {}) => {
    return {
        'x-api-key': apiKey,
        ...additionalHeaders,
    };
};

/**
 * Helper function to handle API errors
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
const handleApiError = (error) => {
    if (error.message.includes('Network error')) {
        return 'Network connection failed. Please check your internet connection.';
    }

    if (error.message.includes('401')) {
        return 'Invalid or missing API key. Please check your credentials.';
    }

    if (error.message.includes('403')) {
        return 'Access denied. You may not have permission to perform this action.';
    }

    if (error.message.includes('404')) {
        return 'Requested resource not found.';
    }

    if (error.message.includes('500')) {
        return 'Server error. Please try again later.';
    }

    return error.message || 'An unexpected error occurred.';
};

/**
 * Helper function to check if response is successful
 * @param {Response} response - Fetch response object
 * @returns {boolean} - True if response is ok
 */
const isResponseOk = (response) => {
    return response.ok && response.status >= 200 && response.status < 300;
};

/**
 * Helper function to get API base URL
 * @returns {string} - API base URL
 */
const getApiBaseUrl = () => {
    return API_BASE_URL;
};

/**
 * Helper function to format API endpoint
 * @param {string} endpoint - Raw endpoint
 * @returns {string} - Formatted endpoint
 */
const formatEndpoint = (endpoint) => {
    // Ensure endpoint starts with /
    if (!endpoint.startsWith('/')) {
        endpoint = '/' + endpoint;
    }
    return endpoint;
};

// Export all functions
export {
    apiCall,
    get,
    post,
    put,
    del,
    createAuthHeaders,
    handleApiError,
    isResponseOk,
    getApiBaseUrl,
    formatEndpoint
};