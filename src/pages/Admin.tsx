import React, { useEffect, useState } from 'react';
import { ProjectData } from "@/types/types.ts";

interface Project extends ProjectData {
    id: string;
    createdAt: string;
}

const Admin: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputAdminKey, setInputAdminKey] = useState('');

    const fetchProjects = async () => {
        setLoading(true);
        try {

            // setProjects(projectList);
        } catch (error) {
            console.error('Error fetching projects:', error);
            alert('Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!inputAdminKey.trim()) {
            alert('Please enter the admin key to delete a project.');
            return;
        }



        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                // await

                alert('Project deleted successfully.');
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project.');
            }
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Panel</h1>
            <div className="mb-6">
                <label className="block text-gray-700 mb-1 font-medium">Admin Key:</label>
                <input
                    type="password"
                    placeholder="Enter admin key"
                    value={inputAdminKey}
                    onChange={(e) => setInputAdminKey(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <p className="mb-4">Total Projects: {projects.length}</p>
            {loading ? (
                <p>Loading projects...</p>
            ) : projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <div className="space-y-4">
                    {projects.map(project => (
                        <div key={project.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">{project.title || 'Untitled'}</h2>
                                <p className="text-sm text-gray-600">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">Theme: {project.theme}</p>
                            </div>
                            <div className="flex space-x-2">
                                <a
                                    href={`/project/${project.id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
                                >
                                    View
                                </a>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                                    disabled={!inputAdminKey.trim()}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Admin;