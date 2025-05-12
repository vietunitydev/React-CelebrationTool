import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjects, updateProject } from '../utils/storage';
import { parseCSV } from '../utils/csvParser';
import { Project, Lesson, Word } from '../types';

const WordList: React.FC = () => {
    const { projectId, lessonId } = useParams<{ projectId: string; lessonId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [words, setWords] = useState<Word[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingWordId, setEditingWordId] = useState<string | null>(null);

    // New word form state
    const [original, setOriginal] = useState('');
    const [type, setType] = useState('');
    const [meaning, setMeaning] = useState('');

    // File upload ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!projectId || !lessonId) return;

        const projects = getProjects();
        const foundProject = projects.find(p => p.id === projectId);

        if (foundProject) {
            setProject(foundProject);

            const foundLesson = foundProject.lessons.find(l => l.id === lessonId);
            if (foundLesson) {
                setLesson(foundLesson);
                setWords(foundLesson.words);
            } else {
                navigate(`/vocab-test/project/${projectId}`);
            }
        } else {
            navigate('/vocab-test');
        }
    }, [projectId, lessonId, navigate]);

    const handleAddWord = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId || !lessonId || !project || !lesson) return;

        if (original.trim() && meaning.trim()) {
            const newWord: Word = {
                id: crypto.randomUUID(),
                original: original.trim(),
                type: type.trim(),
                meaning: meaning.trim()
            };

            const updatedWords = [...words, newWord];
            updateWords(updatedWords);

            // Reset form
            setOriginal('');
            setType('');
            setMeaning('');
            setShowAddForm(false);
        }
    };
    const handleEditWord = (word: Word) => {
        setEditingWordId(word.id);
        setOriginal(word.original);
        setType(word.type);
        setMeaning(word.meaning);
    };

    const handleSaveEdit = () => {
        if (!editingWordId || !original.trim() || !meaning.trim()) return;

        const updatedWords = words.map(word =>
            word.id === editingWordId
                ? { ...word, original: original.trim(), type: type.trim(), meaning: meaning.trim() }
                : word
        );

        updateWords(updatedWords);

        // Reset form
        setEditingWordId(null);
        setOriginal('');
        setType('');
        setMeaning('');
    };

    const handleCancelEdit = () => {
        setEditingWordId(null);
        setOriginal('');
        setType('');
        setMeaning('');
    };

    const handleDeleteWord = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa từ này?')) {
            const updatedWords = words.filter(word => word.id !== id);
            updateWords(updatedWords);
        }
    };

    const updateWords = (newWords: Word[]) => {
        if (!project || !lesson) return;

        const updatedLesson = { ...lesson, words: newWords };
        const updatedLessons = project.lessons.map(l =>
            l.id === updatedLesson.id ? updatedLesson : l
        );

        const updatedProject = { ...project, lessons: updatedLessons };
        updateProject(updatedProject);

        setProject(updatedProject);
        setLesson(updatedLesson);
        setWords(newWords);
    };
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const parsedWords = await parseCSV(file);
            if (parsedWords.length > 0) {
                // Add unique IDs to imported words
                const wordsWithIds = parsedWords.map(word => ({
                    ...word,
                    id: crypto.randomUUID()
                }));

                updateWords([...words, ...wordsWithIds]);
            }
        } catch (error) {
            console.error('Error parsing CSV:', error);
            alert('Lỗi khi đọc file CSV. Vui lòng kiểm tra định dạng file.');
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleShuffleWords = () => {
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        updateWords(shuffled);
    };

    const startLesson = () => {
        if (words.length === 0) {
            alert('Bài học chưa có từ vựng nào. Vui lòng thêm từ vựng trước khi bắt đầu.');
            return;
        }

        navigate(`/vocab-test/project/${projectId}/lesson/${lessonId}/game`);
    };

    if (!project || !lesson) {
        return <div className="text-center py-12">Đang tải...</div>;
    }
    return (
        <div>
            <div className="mb-6">
                <Link
                    to={`/vocab-test/project/${projectId}`}
                    className="inline-flex items-center text-orange-500 hover:text-orange-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Quay lại danh sách bài học
                </Link>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{project.name} - {lesson.name}</h1>
                    <p className="text-gray-600 mt-1">Danh sách từ vựng: {words.length} từ</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={startLesson}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center"
                        disabled={words.length === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Bắt đầu
                    </button>
                    <button
                        onClick={handleShuffleWords}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
                        disabled={words.length < 2}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M17.707 3.293a1 1 0 010 1.414L7.414 14H10a1 1 0 110 2H5a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l10.293-10.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Trộn ngẫu nhiên
                    </button>
                </div>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Thêm từ mới
                    </button>
                )}

                <label className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md flex items-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Import CSV
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                    />
                </label>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddWord} className="mb-6 bg-white p-4 rounded-md shadow">
                    <h2 className="text-lg font-medium text-gray-900 mb-3">Thêm từ mới</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label htmlFor="original" className="block text-sm font-medium text-gray-700 mb-1">Từ gốc</label>
                            <input
                                type="text"
                                id="original"
                                value={original}
                                onChange={(e) => setOriginal(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Loại từ</label>
                            <input
                                type="text"
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-1">Nghĩa</label>
                            <input
                                type="text"
                                id="meaning"
                                value={meaning}
                                onChange={(e) => setMeaning(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded-md"
                        >
                            Lưu
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded-md"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            )}
            {words.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-md shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Chưa có từ vựng nào</h3>
                    <p className="mt-1 text-sm text-gray-500">Hãy thêm từ vựng hoặc import từ file CSV để bắt đầu.</p>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                        >
                            Thêm từ mới
                        </button>
                        <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 cursor-pointer">
                            Import CSV
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Từ gốc
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại từ
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nghĩa
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {words.map((word, index) => (
                            <tr key={word.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {index + 1}
                                </td>
                                {editingWordId === word.id ? (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={original}
                                                onChange={(e) => setOriginal(e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                                                required
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={meaning}
                                                onChange={(e) => setMeaning(e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                                                required
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Hủy
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {word.original}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {word.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {word.meaning}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditWord(word)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWord(word.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WordList;