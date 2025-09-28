import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../utils/projectService';
import { ProjectData } from "@/types/types.ts";

const CreateProject: React.FC = () => {
    const [title, setTitle] = useState('');
    const [texts, setTexts] = useState<string[]>([]);
    const [newText, setNewText] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [music, setMusic] = useState<File | null>(null);
    const [theme, setTheme] = useState('valentine');
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleAddText = () => {
        if (newText.trim()) {
            setTexts([...texts, newText.trim()]);
            setNewText('');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (files.length + images.length <= 10) {
                setImages([...images, ...files]);
                setError(''); // Clear any previous errors
            } else {
                setError('Maximum 10 images allowed.');
            }
        }
    };

    const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                setError('Music file size should be less than 10MB.');
                return;
            }
            setMusic(file);
            setError('');
        }
    };

    const validateForm = () => {
        const validation = projectService.validateProjectData(
            { title, texts, theme },
            images
        );

        if (!validation.isValid) {
            setError(validation.errors.join('. '));
            return false;
        }

        if (!apiKey.trim()) {
            setError('API key is required to save the project.');
            return false;
        }

        return true;
    };

    const handlePreview = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setUploadProgress('Preparing preview...');
        setError('');

        try {
            // Create object URLs for preview
            const imageUrls: string[] = images.map(image => URL.createObjectURL(image));
            const musicUrl = music ? URL.createObjectURL(music) : '';

            const data: ProjectData = {
                title,
                texts,
                imageUrls,
                musicUrl,
                theme,
            };

            navigate('/preview', { state: data });
        } catch (error) {
            setError('Error preparing preview. Please try again.');
            console.error('Preview error:', error);
        } finally {
            setIsLoading(false);
            setUploadProgress('');
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            setUploadProgress('Validating project data...');

            // Prepare project data
            const projectData = {
                title: title.trim(),
                theme,
                texts
                // Remove musicUrl since we're passing the file directly
            };

            // If there's music, we could upload it separately or let the backend handle it
            // For now, let's let the backend handle everything
            setUploadProgress('Uploading project...');

            const response = await projectService.createProject(
                apiKey,
                projectData,
                images,
                music // Pass music file
            );

            setUploadProgress('Project saved successfully!');

            // Show success message
            alert(`Project created successfully! Project ID: ${response.project._id}`);

            // Navigate to projects list or project detail
            navigate('/projects', {
                state: {
                    message: 'Project created successfully!',
                    projectId: response.project._id
                }
            });

        } catch (error: any) {
            console.error('Error saving project:', error);
            setError(error.message || 'Failed to save project. Please try again.');
        } finally {
            setIsLoading(false);
            setUploadProgress('');
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeText = (index: number) => {
        setTexts(texts.filter((_, i) => i !== index));
    };

    const clearAllImages = () => {
        setImages([]);
    };

    const removeMusic = () => {
        setMusic(null);
    };

    const getTotalFileSize = () => {
        const allFiles = music ? [...images, music] : images;
        return projectService.calculateTotalFileSize(allFiles);
    };

    const getFormattedFileSize = () => {
        return projectService.formatFileSize(getTotalFileSize());
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Project</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {isLoading && uploadProgress && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                    <p className="text-blue-800">{uploadProgress}</p>
                    <div className="mt-2 bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Project Title:</label>
                    <input
                        type="text"
                        placeholder="Enter project title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                        maxLength={100}
                    />
                    <p className="text-sm text-gray-500 mt-1">{title.length}/100 characters</p>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Theme:</label>
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    >
                        <option value="valentine">Valentine</option>
                        <option value="birthday">Birthday</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Add Messages:</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Add a message"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                            maxLength={200}
                        />
                        <button
                            onClick={handleAddText}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
                            disabled={isLoading || !newText.trim()}
                        >
                            Add
                        </button>
                    </div>

                    {texts.length > 0 && (
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">{texts.length} messages added</p>
                            {texts.map((text, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span className="text-gray-700 flex-1 mr-2">{text}</span>
                                    <button
                                        onClick={() => removeText(i)}
                                        className="text-red-500 hover:text-red-700 text-sm flex-shrink-0"
                                        disabled={isLoading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Images (5-10 required):</label>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={isLoading}
                    />
                    <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <p>{images.length} images selected (5-10 required)</p>
                            {images.length > 0 && (
                                <p>Images size: {getFormattedFileSize()}</p>
                            )}
                        </div>
                        {images.length > 0 && (
                            <button
                                onClick={clearAllImages}
                                className="text-red-500 hover:text-red-700 text-sm"
                                disabled={isLoading}
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {images.length > 0 && (
                        <div className="mt-2 grid grid-cols-5 gap-2">
                            {images.map((image, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${i}`}
                                        className="w-full h-20 object-cover rounded border"
                                    />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 flex items-center justify-center"
                                        disabled={isLoading}
                                        title="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Background Music (optional, .mp3, max 10MB):</label>
                    <input
                        type="file"
                        accept="audio/mp3,audio/mpeg"
                        onChange={handleMusicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        disabled={isLoading}
                    />
                    {music && (
                        <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                            <div className="text-green-700 text-sm">
                                <p>{music.name}</p>
                                <p>Size: {projectService.formatFileSize(music.size)}</p>
                            </div>
                            <button
                                onClick={removeMusic}
                                className="text-red-500 hover:text-red-700 text-sm"
                                disabled={isLoading}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">API Key (required):</label>
                    <input
                        type="password"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        This key will be used to authenticate your request. Admin key required for creating projects.
                    </p>
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        onClick={handlePreview}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        disabled={isLoading || !title.trim() || texts.length === 0 || images.length < 5}
                    >
                        {isLoading && uploadProgress.includes('preview') ? 'Loading...' : 'Preview'}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        disabled={isLoading || !title.trim() || texts.length === 0 || images.length < 5 || !apiKey.trim()}
                    >
                        {isLoading && !uploadProgress.includes('preview') ? 'Saving...' : 'Save Project'}
                    </button>
                </div>

                {/* Display requirements */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Requirements:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li className={title.trim() ? 'text-green-600' : ''}>
                            ✓ Project title {title.trim() ? '✅' : '❌'}
                        </li>
                        <li className={texts.length > 0 ? 'text-green-600' : ''}>
                            ✓ At least 1 message {texts.length > 0 ? '✅' : '❌'} ({texts.length})
                        </li>
                        <li className={images.length >= 5 ? 'text-green-600' : ''}>
                            ✓ 5-10 images {images.length >= 5 && images.length <= 10 ? '✅' : '❌'} ({images.length})
                        </li>
                        <li className={apiKey.trim() ? 'text-green-600' : ''}>
                            ✓ API key {apiKey.trim() ? '✅' : '❌'}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;