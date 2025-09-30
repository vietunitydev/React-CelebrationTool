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
                setError('');
            } else {
                setError('Tối đa 10 hình ảnh.');
            }
        }
    };

    const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                setError('Kích thước file nhạc phải nhỏ hơn 10MB.');
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
            setError('API key là bắt buộc để lưu dự án.');
            return false;
        }

        return true;
    };

    const handlePreview = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setUploadProgress('Đang chuẩn bị xem trước...');
        setError('');

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
            setError('Lỗi khi chuẩn bị xem trước. Vui lòng thử lại.');
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
            setUploadProgress('Đang xác thực dữ liệu...');

            const projectData = {
                title: title.trim(),
                theme,
                texts
            };

            setUploadProgress('Đang tải lên dự án...');

            const response = await projectService.createProject(
                apiKey,
                projectData,
                images,
                music
            );

            setUploadProgress('Lưu dự án thành công!');

            alert(`Tạo dự án thành công! ID: ${response.project._id}`);

            navigate('/projects', {
                state: {
                    message: 'Tạo dự án thành công!',
                    projectId: response.project._id
                }
            });

        } catch (error: any) {
            console.error('Error saving project:', error);
            setError(error.message || 'Không thể lưu dự án. Vui lòng thử lại.');
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

            <div className="relative z-10 p-8 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Tạo Website Mới
                    </span>
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100/90 backdrop-blur-sm border border-red-300 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {isLoading && uploadProgress && (
                    <div className="mb-4 p-3 bg-blue-100/90 backdrop-blur-sm border border-blue-300 rounded-lg">
                        <p className="text-blue-800">{uploadProgress}</p>
                        <div className="mt-2 bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                )}

                <div className="space-y-4 bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-gray-700 font-medium">Tên web:</label>
                            <span className={`text-sm ${title.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                                {title.trim() ? '✅' : '❌'}
                            </span>
                        </div>
                        <input
                            type="text"
                            placeholder="Nhập tên"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                            maxLength={100}
                        />
                        <p className="text-sm text-gray-500 mt-1">{title.length}/100 ký tự</p>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Chủ đề:</label>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                        >
                            <option value="valentine">Valentine</option>
                            <option value="birthday">Sinh nhật</option>
                            <option value="custom">Tùy chỉnh</option>
                        </select>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-gray-700 font-medium">Thêm lời nhắn:</label>
                            <span className={`text-sm ${texts.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                {texts.length > 0 ? '✅' : '❌'} ({texts.length})
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Thêm lời nhắn"
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
                                Thêm
                            </button>
                        </div>

                        {texts.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {texts.map((text, i) => (
                                    <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-gray-700 flex-1 mr-2">{text}</span>
                                        <button
                                            onClick={() => removeText(i)}
                                            className="text-red-500 hover:text-red-700 text-sm flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-gray-700 font-medium">Hình ảnh (5-10 ảnh):</label>
                            <span className={`text-sm ${images.length >= 5 && images.length <= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                                {images.length >= 5 && images.length <= 10 ? '✅' : '❌'} ({images.length}/10)
                            </span>
                        </div>
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
                                {images.length > 0 && (
                                    <p>Kích thước: {getFormattedFileSize()}</p>
                                )}
                            </div>
                            {images.length > 0 && (
                                <button
                                    onClick={clearAllImages}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    disabled={isLoading}
                                >
                                    Xóa tất cả
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
                                            title="Xóa ảnh"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Nhạc nền (tùy chọn, .mp3, tối đa 10MB):</label>
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
                                    <p>Kích thước: {projectService.formatFileSize(music.size)}</p>
                                </div>
                                <button
                                    onClick={removeMusic}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    disabled={isLoading}
                                >
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-gray-700 font-medium">Key (bắt buộc):</label>
                            <span className={`text-sm ${apiKey.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                                {apiKey.trim() ? '✅' : '❌'}
                            </span>
                        </div>
                        <input
                            type="password"
                            placeholder="Nhập key của bạn"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
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
                            {isLoading && uploadProgress.includes('xem trước') ? 'Đang tải...' : 'Xem trước'}
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            disabled={isLoading || !title.trim() || texts.length === 0 || images.length < 5 || !apiKey.trim()}
                        >
                            {isLoading && !uploadProgress.includes('xem trước') ? 'Đang lưu...' : 'Lưu dự án'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;