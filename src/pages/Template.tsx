import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectData } from "@/types/types.ts";
import { sampleProjects } from "@/assets/sampleProjects.ts";

const Template: React.FC = () => {
    const navigate = useNavigate();

    const handlePreview = (project: ProjectData) => {
        navigate('/preview', { state: project });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

            <div className="relative z-10 p-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                        Mẫu Dự Án
                    </span>
                </h1>
                <p className="mb-8 text-gray-700 text-center text-lg">
                    Chọn một mẫu để xem trước và sử dụng
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleProjects.map((project, index) => (
                        <div
                            key={index}
                            className="group bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
                            onClick={() => handlePreview(project)}
                        >
                            {/* Card Header with gradient */}
                            <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

                            <div className="p-5">
                                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                                    {project.title || 'Không có tiêu đề'}
                                </h2>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-6">🎨</span>
                                        <span className="font-medium">Chủ đề:</span>
                                        <span className="ml-2 capitalize">{project.theme}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-6">💬</span>
                                        <span className="font-medium">Lời nhắn:</span>
                                        <span className="ml-2">{project.texts.length}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-6">🖼️</span>
                                        <span className="font-medium">Hình ảnh:</span>
                                        <span className="ml-2">{project.imageUrls.length}</span>
                                    </div>
                                    {project.musicUrl && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="w-6">🎵</span>
                                            <span className="font-medium">Nhạc nền:</span>
                                            <span className="ml-2 text-green-600">Có</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg transition-all font-semibold shadow-md group-hover:shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreview(project);
                                    }}
                                >
                                    Xem Trước
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-6 py-3 rounded-lg transition-all shadow-md font-medium"
                    >
                        ← Quay Về Trang Chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Template;