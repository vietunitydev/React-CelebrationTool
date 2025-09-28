import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, adminKey } from '../firebase';
import { uploadImage, uploadAudio } from '../cloudinary';
import { ProjectData } from "@/types/types.ts";

const CreateProject: React.FC = () => {
    const [title, setTitle] = useState('');
    const [texts, setTexts] = useState<string[]>([]);
    const [newText, setNewText] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [music, setMusic] = useState<File | null>(null);
    const [theme, setTheme] = useState('valentine');
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
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
            } else {
                alert('Maximum 10 images allowed.');
            }
        }
    };

    const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                alert('Music file size should be less than 10MB.');
                return;
            }
            setMusic(file);
        }
    };

    const handlePreview = async () => {
        if (!title.trim() || texts.length === 0 || images.length < 5) {
            alert('Please provide a title, at least one text, and 5-10 images.');
            return;
        }

        setIsLoading(true);
        setUploadProgress('Preparing preview...');

        try {
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
            alert('Error preparing preview. Please try again.');
            console.error('Preview error:', error);
        } finally {
            setIsLoading(false);
            setUploadProgress('');
        }
    };

    const handleSave = async () => {
        if (!title.trim() || texts.length === 0 || images.length < 5) {
            alert('Please provide a title, at least one text, and 5-10 images.');
            return;
        }

        if (!key.trim()) {
            alert('Please provide a key to save the project.');
            return;
        }

        setIsLoading(true);
        try {
            setUploadProgress('Uploading images...');
            const imageUrls: string[] = [];

            for (let i = 0; i < images.length; i++) {
                setUploadProgress(`Uploading image ${i + 1}/${images.length}...`);
                try {
                    const url = await uploadImage(images[i]);
                    imageUrls.push(url);
                } catch (error) {
                    console.error(`Error uploading image ${i + 1}:`, error);
                    alert(`Failed to upload image ${i + 1}. Please try again.`);
                    return;
                }
            }

            let musicUrl = '';
            if (music) {
                setUploadProgress('Uploading music...');
                try {
                    musicUrl = await uploadAudio(music);
                } catch (error) {
                    console.error('Error uploading music:', error);
                    alert('Failed to upload music. Please try again.');
                    return;
                }
            }

            setUploadProgress('Saving project data...');
            const docRef = await addDoc(collection(db, 'projects'), {
                title,
                texts,
                imageUrls,
                musicUrl,
                theme,
                key,
                createdAt: new Date().toISOString(),
            });

            setUploadProgress('');
            alert(`Project saved successfully! Access at /project/${docRef.id}`);
            navigate(`/project/${docRef.id}`);
        } catch (error) {
            alert('Error saving project. Please try again.');
            console.error('Error saving project:', error);
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

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Project</h1>

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
                    />
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
                            placeholder="Add a love message"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleAddText}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Add
                        </button>
                    </div>

                    {texts.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {texts.map((text, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span className="text-gray-700">{text}</span>
                                    <button
                                        onClick={() => removeText(i)}
                                        className="text-red-500 hover:text-red-700 text-sm"
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
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={isLoading}
                    />
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-gray-600">{images.length} images selected</p>
                        {images.length > 0 && (
                            <button
                                onClick={() => setImages([])}
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
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                                        disabled={isLoading}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Background Music (.mp3, max 10MB):</label>
                    <input
                        type="file"
                        accept="audio/mp3,audio/mpeg"
                        onChange={handleMusicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        disabled={isLoading}
                    />
                    {music && (
                        <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                            <span className="text-green-700 text-sm">{music.name}</span>
                            <button
                                onClick={() => setMusic(null)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                disabled={isLoading}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Key (required for saving):</label>
                    <input
                        type="text"
                        placeholder="Enter key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        onClick={handlePreview}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        disabled={isLoading || !title.trim() || texts.length === 0 || images.length < 5}
                    >
                        {isLoading ? 'Loading...' : 'Preview'}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        disabled={isLoading || !title.trim() || texts.length === 0 || images.length < 5 || !key.trim()}
                    >
                        {isLoading ? 'Saving...' : 'Save Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;