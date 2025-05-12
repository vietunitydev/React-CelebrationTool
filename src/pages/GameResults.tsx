import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getProjects } from '../utils/storage';
import { Project, Lesson, GameResult } from '../types';

const GameResults: React.FC = () => {
    const { projectId, lessonId } = useParams<{ projectId: string; lessonId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [project, setProject] = React.useState<Project | null>(null);
    const [lesson, setLesson] = React.useState<Lesson | null>(null);

    // Get game result from location state
    const gameResult = location.state?.gameResult as GameResult | undefined;

    useEffect(() => {
        if (!projectId || !lessonId) return;

        const projects = getProjects();
        const foundProject = projects.find(p => p.id === projectId);

        if (foundProject) {
            setProject(foundProject);

            const foundLesson = foundProject.lessons.find(l => l.id === lessonId);
            if (foundLesson) {
                setLesson(foundLesson);
            } else {
                navigate(`/vocab-test/project/${projectId}`);
            }
        } else {
            navigate('/vocab-test');
        }
    }, [projectId, lessonId, navigate]);

    useEffect(() => {
        // If no game result is available, redirect back to lesson
        if (!gameResult && lessonId && projectId) {
            navigate(`/vocab-test/project/${projectId}/lesson/${lessonId}`);
        }
    }, [gameResult, lessonId, projectId, navigate]);

    const restartGame = () => {
        if (projectId && lessonId) {
            navigate(`/vocab-test/project/${projectId}/lesson/${lessonId}/game`);
        }
    };

    const goToLessonList = () => {
        if (projectId) {
            navigate(`/vocab-test/project/${projectId}`);
        }
    };

    if (!project || !lesson || !gameResult) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    const totalWords = gameResult.correctWords.length + gameResult.incorrectWords.length;
    const accuracyPercentage = Math.round(gameResult.accuracy * 100);
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Kết quả bài học</h1>
                <p className="text-gray-600 mt-1">
                    {project.name} - {lesson.name}
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="p-6">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="3"
                                    strokeDasharray="100, 100"
                                />
                                <path
                                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={accuracyPercentage >= 70 ? "#10B981" : accuracyPercentage >= 40 ? "#F59E0B" : "#EF4444"}
                                    strokeWidth="3"
                                    strokeDasharray={`${accuracyPercentage}, 100`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{accuracyPercentage}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-500 text-sm">Tổng số từ</p>
                            <p className="text-2xl font-bold text-gray-900">{totalWords}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-green-600 text-sm">Đúng</p>
                            <p className="text-2xl font-bold text-green-600">{gameResult.correctWords.length}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-red-600 text-sm">Sai</p>
                            <p className="text-2xl font-bold text-red-600">{gameResult.incorrectWords.length}</p>
                        </div>
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mb-3">Chi tiết từ vựng</h2>
                    <table className="min-w-full divide-y divide-gray-200 mb-6">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Từ gốc
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại từ
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nghĩa
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kết quả
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {[...gameResult.correctWords, ...gameResult.incorrectWords]
                            .sort((a, b) => a.original.localeCompare(b.original))
                            .map((word, index) => {
                                const isCorrect = gameResult.correctWords.some(w => w.id === word.id);
                                return (
                                    <tr key={word.id}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-sm font-medium ${isCorrect ? 'text-gray-900' : 'text-red-600'}`}>
                                            {word.original}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {word.type}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {word.meaning}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {isCorrect ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Đúng
                          </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Sai
                          </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={restartGame}
                            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                        >
                            Bắt đầu lại
                        </button>
                        <button
                            onClick={goToLessonList}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                        >
                            Quay về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameResults;