import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {ProjectData} from "@/types/types.ts";

const CreateProject: React.FC = () => {
    const [title, setTitle] = useState('');
    const [texts, setTexts] = useState<string[]>([]);
    const [newText, setNewText] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [music, setMusic] = useState<File | null>(null);
    const [theme, setTheme] = useState('valentine');
    const [isLoading, setIsLoading] = useState(false);
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
            setMusic(e.target.files[0]);
        }
    };

    const handlePreview = async () => {
        if (!title.trim() || texts.length === 0 || images.length < 5) {
            alert('Please provide a title, at least one text, and 5-10 images.');
            return;
        }

        setIsLoading(true);
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
        }
    };

    const handleSave = async () => {
        if (!title.trim() || texts.length === 0 || images.length < 5) {
            alert('Please provide a title, at least one text, and 5-10 images.');
            return;
        }

        setIsLoading(true);
        try {
            const imageUrls: string[] = [];
            for (const image of images) {
                const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                const url = await getDownloadURL(imageRef);
                imageUrls.push(url);
            }

            let musicUrl = '';
            if (music) {
                const musicRef = ref(storage, `music/${Date.now()}_${music.name}`);
                await uploadBytes(musicRef, music);
                musicUrl = await getDownloadURL(musicRef);
            }

            const docRef = await addDoc(collection(db, 'projects'), {
                title,
                texts,
                imageUrls,
                musicUrl,
                theme,
                createdAt: new Date().toISOString(),
            });

            alert(`Project saved! Access at /project/${docRef.id}`);
            navigate(`/project/${docRef.id}`);
        } catch (error) {
            alert('Error saving project. Please try again.');
            console.error('Error saving project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Project</h1>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Project Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                >
                    <option value="valentine">Valentine</option>
                    <option value="birthday">Birthday</option>
                    <option value="custom">Custom</option>
                </select>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Add text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleAddText}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        Add
                    </button>
                </div>
                <ul className="list-disc pl-5">
                    {texts.map((text, i) => (
                        <li key={i} className="text-gray-700">{text}</li>
                    ))}
                </ul>
                <div>
                    <label className="block text-gray-700 mb-1">Images (5-10):</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded-lg"
                        disabled={isLoading}
                    />
                    <p className="text-sm text-gray-600 mt-1">{images.length} images selected</p>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Music (.mp3):</label>
                    <input
                        type="file"
                        accept="audio/mp3"
                        onChange={handleMusicChange}
                        className="w-full p-2 border rounded-lg"
                        disabled={isLoading}
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handlePreview}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Preview'}
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;