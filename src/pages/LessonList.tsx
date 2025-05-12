import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjects, addLesson, deleteLesson, updateProject } from '../utils/storage';
import { Project, Lesson } from '../types';

const LessonList: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [newLessonName, setNewLessonName] = useState('');
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [editedName, setEditedName] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        const projects = getProjects();
        const foundProject = projects.find(p => p.id === projectId);

        if (foundProject) {
            setProject(foundProject);
        } else {
            navigate('/vocab-test');
        }
    }, [projectId, navigate]);

    const handleAddLesson = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId || !newLessonName.trim() || !project) return;

        const newLesson = addLesson(projectId, newLessonName.trim());

        if (newLesson) {
            setProject({
                ...project,
                lessons: [...project.lessons, newLesson]
            });
            setNewLessonName('');
            setShowForm(false);
        }
    };

    const handleDeleteLesson = (lessonId: string) => {
        if (!projectId || !project) return;

        if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
            deleteLesson(projectId, lessonId);
            setProject({
                ...project,
                lessons: project.lessons.filter(lesson => lesson.id !== lessonId)
            });
        }
    };

    const handleStartEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setEditedName(lesson.name);
    };

    const handleSaveEdit = () => {
        if (!editingLesson || !editedName.trim() || !project || !projectId) return;

        const updatedLesson = { ...editingLesson, name: editedName.trim() };
        const updatedLessons = project.lessons.map(l =>
            l.id === updatedLesson.id ? updatedLesson : l
        );

        const updatedProject = { ...project, lessons: updatedLessons };
        updateProject(updatedProject);
        setProject(updatedProject);
        setEditingLesson(null);
    };

    const handleCancelEdit = () => {
        setEditingLesson(null);
    };

    if (!project) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <Link
                    to="/vocab-test"
                    className="inline-flex items-center text-orange-500 hover:text-orange-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Quay lại danh sách môn học
                </Link>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{project.name} - Danh sách bài học</h1>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Thêm bài học
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleAddLesson} className="mb-6 bg-white p-4 rounded-md shadow">
                    <h2 className="text-lg font-medium text-gray-900 mb-3">Thêm bài học mới</h2>
                    <div className="flex">
                        <input
                            type="text"
                            value={newLessonName}
                            onChange={(e) => setNewLessonName(e.target.value)}
                            placeholder="Nhập tên bài học"
                            className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        />
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-r-md"
                        >
                            Lưu
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            )}

            {project.lessons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-md shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Chưa có bài học nào</h3>
                    <p className="mt-1 text-sm text-gray-500">Hãy tạo bài học đầu tiên để bắt đầu.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                        >
                            Thêm bài học
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {project.lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-lg shadow overflow-hidden">
                            {editingLesson && editingLesson.id === lesson.id ? (
                                <div className="p-4">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 mb-3"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-900">{lesson.name}</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {lesson.words.length} từ vựng
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 flex justify-between">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStartEditLesson(lesson)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Chỉnh sửa"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Xóa"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        <Link
                                            to={`/vocab-test/project/${projectId}/lesson/${lesson.id}`}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
                                        >
                                            Xem từ vựng
                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LessonList;