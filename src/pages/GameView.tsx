import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjects } from '../utils/storage';
import { Project, Lesson, Word, GameResult } from '../types';

const GameView: React.FC = () => {
    const { projectId, lessonId } = useParams<{ projectId: string; lessonId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [words, setWords] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [results, setResults] = useState<{ [key: string]: boolean }>({});
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Focus input on mount and when changing words
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentIndex]);
    const checkAnswer = () => {
        if (!words[currentIndex]) return;

        const currentWord = words[currentIndex];
        const normalizedInput = userInput.trim().toLowerCase();
        const normalizedOriginal = currentWord.original.trim().toLowerCase();

        const correct = normalizedInput === normalizedOriginal;
        setIsCorrect(correct);

        // Save result
        setResults(prev => ({
            ...prev,
            [currentWord.id]: correct
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
        setIsCorrect(null);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (isCorrect === null) {
                checkAnswer();
            } else {
                goToNextWord();
            }
        }
    };

    const goToPreviousWord = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setUserInput('');
            setIsCorrect(null);
        }
    };

    const goToNextWord = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserInput('');
            setIsCorrect(null);
        }
    };

    const finishGame = () => {
        if (!projectId || !lessonId) return;

        // Calculate results
        const correctWords: Word[] = [];
        const incorrectWords: Word[] = [];

        words.forEach(word => {
            if (results[word.id]) {
                correctWords.push(word);
            } else {
                incorrectWords.push(word);
            }
        });

        const gameResult: GameResult = {
            correctWords,
            incorrectWords,
            accuracy: correctWords.length / words.length
        };

        // Navigate to results page with state
        navigate(`/vocab-test/project/${projectId}/lesson/${lessonId}/results`, {
            state: { gameResult }
        });
    };

    if (!project || !lesson || words.length === 0) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    const currentWord = words[currentIndex];
    const progress = ((currentIndex + 1) / words.length) * 100;
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{project.name} - {lesson.name}</h1>
                <p className="text-gray-600 mt-1">
                    Từ {currentIndex + 1}/{words.length}
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="h-2 bg-gray-200">
                    <div
                        className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-6">
                    <div className="mb-8 text-center">
                        <p className="text-gray-500 mb-2">Nghĩa:</p>
                        <h2 className="text-2xl font-bold text-gray-900">{currentWord.meaning}</h2>
                        {currentWord.type && (
                            <p className="text-gray-500 mt-2 italic">({currentWord.type})</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">Nhập từ:</label>
                        <input
                            ref={inputRef}
                            type="text"
                            id="answer"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            className={`w-full rounded-md border-2 py-3 px-4 text-lg focus:outline-none ${
                                isCorrect === null
                                    ? 'border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50'
                                    : isCorrect
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-red-500 bg-red-50 text-red-700'
                            }`}
                            placeholder="Nhập từ tương ứng..."
                            disabled={isCorrect !== null}
                        />

                        {isCorrect !== null && (
                            <div className="mt-2">
                                {isCorrect ? (
                                    <p className="text-green-600">Chính xác!</p>
                                ) : (
                                    <p className="text-red-600">
                                        Sai rồi! Đáp án đúng: <span className="font-semibold">{currentWord.original}</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={goToPreviousWord}
                            disabled={currentIndex === 0}
                            className={`flex items-center ${
                                currentIndex === 0
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-orange-500 hover:text-orange-600'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Trước
                        </button>

                        {isCorrect === null ? (
                            <button
                                onClick={checkAnswer}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                            >
                                Kiểm tra
                            </button>
                        ) : currentIndex < words.length - 1 ? (
                            <button
                                onClick={goToNextWord}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                            >
                                Tiếp theo
                            </button>
                        ) : (
                            <button
                                onClick={finishGame}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                            >
                                Kết thúc
                            </button>
                        )}

                        <button
                            onClick={goToNextWord}
                            disabled={currentIndex === words.length - 1}
                            className={`flex items-center ${
                                currentIndex === words.length - 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-orange-500 hover:text-orange-600'
                            }`}
                        >
                            Sau
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={finishGame}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                >
                    Kết thúc bài học
                </button>
            </div>
        </div>
    );
};

export default GameView;