import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectData } from "@/types/types.ts";
import {sampleProjects} from "@/assets/sampleProjects.ts";

const Template: React.FC = () => {
    const navigate = useNavigate();

    const handlePreview = (project: ProjectData) => {
        navigate('/preview', { state: project });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Project Templates</h1>
            <p className="mb-4 text-gray-600">Choose a template to preview:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleProjects.map((project, index) => (
                    <div
                        key={index}
                        className="p-4 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handlePreview(project)}
                    >
                        <h2 className="text-lg font-semibold text-gray-800">{project.title || 'Untitled'}</h2>
                        <p className="text-sm text-gray-600">Theme: {project.theme}</p>
                        <p className="text-sm text-gray-600">Messages: {project.texts.length}</p>
                        <p className="text-sm text-gray-600">Images: {project.imageUrls.length}</p>
                        {project.musicUrl && (
                            <p className="text-sm text-gray-600">Music: Included</p>
                        )}
                        <button
                            className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg transition-colors"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the card click from triggering
                                handlePreview(project);
                            }}
                        >
                            Preview
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Template;