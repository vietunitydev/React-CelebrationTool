import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Personalized Animation Website</h1>
            <div className="flex space-x-4">
                <Link to="/create-project">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">Create New Project</button>
                </Link>
                <Link to="/admin">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">Admin Panel</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;