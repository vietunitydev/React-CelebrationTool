import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FallingHeartsWebsite from './FallingHeartsWebsite';
import {ProjectData} from "@/types/types.ts";

const Preview: React.FC = () => {
    const location = useLocation();
    const data: ProjectData | undefined = location.state;
    const navigate = useNavigate();

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-500">No preview data available.</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <FallingHeartsWebsite projectData={data} />
            <div className="fixed bottom-4 left-4 right-4 flex justify-between">
                <button
                    onClick={() => navigate('/create-project')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Back to Edit
                </button>
                <button
                    onClick={() => navigate('/create-project', { state: data })}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Save Project
                </button>
            </div>
        </div>
    );
};

export default Preview;