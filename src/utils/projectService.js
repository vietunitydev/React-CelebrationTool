// services/projectService.js
import { get, post, del, createAuthHeaders } from '../utils/api.js';

/**
 * Project Service - Handle all project-related API calls
 */
class ProjectService {
    /**
     * Get all projects
     * @param {string} apiKey - User API key
     * @returns {Promise} - Projects data with remaining uses info
     */
    async getProjects(apiKey) {
        try {
            const headers = createAuthHeaders(apiKey);
            const response = await get('/projects', headers);
            return response;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw new Error(`Failed to fetch projects: ${error.message}`);
        }
    }

    /**
     * Create a new project
     * @param {string} apiKey - Admin API key
     * @param {Object} projectData - Project data
     * @param {string} projectData.title - Project title
     * @param {string} projectData.theme - Project theme
     * @param {string} projectData.musicUrl - Music URL (optional)
     * @param {Array<string>} projectData.texts - Array of text messages
     * @param {Array<File>} images - Array of image files
     * @returns {Promise} - Created project data
     */
    async createProject(apiKey, projectData, images) {
        try {
            const formData = new FormData();

            // Add project data
            formData.append('title', projectData.title);
            formData.append('theme', projectData.theme);

            if (projectData.musicUrl) {
                formData.append('musicUrl', projectData.musicUrl);
            }

            // Add texts as JSON string
            formData.append('texts', JSON.stringify(projectData.texts));

            // Add images
            if (images && images.length > 0) {
                images.forEach((image, index) => {
                    formData.append('images', image);
                });
            }

            const headers = createAuthHeaders(apiKey);
            const response = await post('/projects', formData, headers);
            return response;
        } catch (error) {
            console.error('Error creating project:', error);
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }

    /**
     * Delete a project
     * @param {string} apiKey - Admin API key
     * @param {string} projectId - Project ID to delete
     * @returns {Promise} - Delete confirmation
     */
    async deleteProject(apiKey, projectId) {
        try {
            const headers = createAuthHeaders(apiKey);
            const response = await del(`/projects/${projectId}`, headers);
            return response;
        } catch (error) {
            console.error('Error deleting project:', error);
            throw new Error(`Failed to delete project: ${error.message}`);
        }
    }

    /**
     * Upload music file to get URL (if needed separately)
     * @param {File} musicFile - Music file to upload
     * @param {string} apiKey - API key
     * @returns {Promise<string>} - Uploaded music URL
     */
    async uploadMusic(musicFile, apiKey) {
        try {
            const formData = new FormData();
            formData.append('music', musicFile);

            const headers = createAuthHeaders(apiKey);
            const response = await post('/upload/music', formData, headers);
            return response.musicUrl;
        } catch (error) {
            console.error('Error uploading music:', error);
            throw new Error(`Failed to upload music: ${error.message}`);
        }
    }

    /**
     * Validate project data before submission
     * @param {Object} projectData - Project data to validate
     * @param {Array<File>} images - Image files
     * @returns {Object} - Validation result
     */
    validateProjectData(projectData, images) {
        const errors = [];

        if (!projectData.title || !projectData.title.trim()) {
            errors.push('Project title is required');
        }

        if (!projectData.texts || projectData.texts.length === 0) {
            errors.push('At least one text message is required');
        }

        if (!images || images.length < 5) {
            errors.push('At least 5 images are required');
        }

        if (images && images.length > 10) {
            errors.push('Maximum 10 images allowed');
        }

        // Validate image file types
        if (images && images.length > 0) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            const invalidImages = images.filter(img => !allowedTypes.includes(img.type));

            if (invalidImages.length > 0) {
                errors.push('Only JPG, PNG, GIF, and WebP images are allowed');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Calculate total file size
     * @param {Array<File>} files - Array of files
     * @returns {number} - Total size in bytes
     */
    calculateTotalFileSize(files) {
        return files.reduce((total, file) => total + file.size, 0);
    }

    /**
     * Format file size for display
     * @param {number} bytes - Size in bytes
     * @returns {string} - Formatted size string
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Create and export singleton instance
const projectService = new ProjectService();
export default projectService;