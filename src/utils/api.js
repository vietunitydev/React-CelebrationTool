// utils/api.js

// API Base URL - thay đổi theo server của bạn
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4999/api';

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