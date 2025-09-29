import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import projectService from '../utils/projectService';
import { FallingItem, ProjectData } from "@/types/types.ts";

const MAX_ITEMS = 50;

const FallingHeartsWebsite: React.FC = () => {
    const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remainingUses, setRemainingUses] = useState<number | null>(null);
    const animationFrameRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const itemsRef = useRef<FallingItem[]>([]);
    const { id } = useParams<{ id: string }>();

    // Default data in case fetching fails or for initial setup
    const loveMessages = projectData?.texts || [
        "You make my heart smile",
        "Love ya! 💖",
        "Thank you for being my sunshine",
        "Yêu em nhìuuuu ! 💖",
        "Chúc em luôn vui tươi",
        "I love you 💖",
    ];

    const images = projectData?.imageUrls || [
        "1.jpeg",
        "2.jpeg",
        "3.jpeg",
        "4.jpeg",
        "5.jpeg",
    ];

    // Fetch project data from API using the direct endpoint
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) {
                setError('No project ID provided.');
                setLoading(false);
                return;
            }

            try {
                // Get API key from localStorage or environment
                // const apiKey = localStorage.getItem('apiKey') || import.meta.env.REACT_APP_API_KEY;

                // if (!apiKey) {
                //     setError('API key not found. Please provide an API key.');
                //     setLoading(false);
                //     return;
                // }

                // Validate project ID format
                // if (!projectService.validateProjectId(id)) {
                //     setError('Invalid project ID format.');
                //     setLoading(false);
                //     return;
                // }

                // Fetch the specific project directly
                const response = await projectService.getProject(id);

                if (response.project) {
                    // Transform the data to match your ProjectData interface
                    const transformedProject: ProjectData = {
                        id: response.project._id || response.project.id,
                        title: response.project.title,
                        theme: response.project.theme,
                        texts: response.project.texts || [],
                        imageUrls: response.project.imageUrls || [],
                        musicUrl: response.project.musicUrl || null,
                        // createdAt: response.project.createdAt,
                        // updatedAt: response.project.updatedAt,
                        // viewCount: response.project.viewCount,
                        // isPublic: response.project.isPublic,
                        // isFeatured: response.project.isFeatured
                    };

                    setProjectData(transformedProject);

                    // Set remaining uses if available
                    if (response.remainingUses !== undefined) {
                        setRemainingUses(response.remainingUses);
                    }
                } else {
                    setError('Project data not found in response.');
                }
            } catch (err: any) {
                console.error('Error fetching project:', err);

                // Handle different error types with user-friendly messages
                let errorMessage = 'Failed to load project data.';

                if (err.message.includes('Project not found')) {
                    errorMessage = 'Project not found. It may have been deleted or the link is incorrect.';
                } else if (err.message.includes('private')) {
                    errorMessage = 'This project is private and cannot be viewed.';
                } else if (err.message.includes('No remaining uses')) {
                    errorMessage = 'You have no remaining uses on your API key. Please contact admin to renew.';
                } else if (err.message.includes('Invalid API key')) {
                    errorMessage = 'Invalid API key. Please check your credentials.';
                } else if (err.message.includes('Access denied')) {
                    errorMessage = 'Access denied. You may not have permission to view this project.';
                } else if (err.message.includes('Network error')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                } else if (err.message.includes('Invalid project ID format')) {
                    errorMessage = 'Invalid project ID format. Please check the link.';
                } else {
                    errorMessage = err.message || errorMessage;
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id]);

    const handleStartAudio = () => {
        const audio = document.getElementById('backgroundAudio') as HTMLAudioElement;
        if (audio) {
            audio.play()
                .then(() => setAudioPlaying(true))
                .catch(err => {
                    setAudioError('Failed to play audio. Please try again.');
                    console.error('Audio play failed:', err);
                });
        }
    };

    const createFallingItem = (): FallingItem => {
        const rand = Math.random();
        let type: 'heart' | 'text' | 'image' = rand < 0.73 ? 'text' : rand < 0.86 ? 'heart' : 'image';

        let content = '';
        if (type === 'heart') {
            const hearts = ['💖', '💕', '❤️', '💗', '💓'];
            content = hearts[Math.floor(Math.random() * hearts.length)];
        } else if (type === 'text') {
            content = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        } else {
            content = images[Math.floor(Math.random() * images.length)];
        }

        const currentTime = performance.now();
        return {
            id: Date.now() + Math.random(),
            type,
            content,
            x: Math.random() * (window.innerWidth - 200),
            y: -150,
            targetY: -150,
            speed: 2 + Math.random() * 3,
            rotation: 0,
            rotationSpeed: type === 'heart' ? (Math.random() - 0.5) * 4 : 0,
            size: type === 'image' ? 0.9 + Math.random() * 0.8 : 1,
            lastFrameTime: currentTime,
        };
    };

    const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTimeRef.current;
        const normalizedDelta = deltaTime / 16.67;

        itemsRef.current = itemsRef.current
            .map(item => {
                const timeDiff = currentTime - item.lastFrameTime;
                const smoothFactor = Math.min(timeDiff / 16.67, 1);

                item.targetY += item.speed * normalizedDelta;
                const newY = item.y + (item.targetY - item.y) * smoothFactor * 0.8;

                return {
                    ...item,
                    y: newY,
                    rotation: item.rotation + (item.rotationSpeed * normalizedDelta),
                    lastFrameTime: currentTime,
                };
            })
            .filter(item => item.y < window.innerHeight + 200);

        setFallingItems([...itemsRef.current]);
        lastTimeRef.current = currentTime;
        animationFrameRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (loading || error) return;

        const createItemInterval = setInterval(() => {
            if (itemsRef.current.length < MAX_ITEMS) {
                const newItem = createFallingItem();
                itemsRef.current = [...itemsRef.current, newItem];
            }
        }, 250);

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            clearInterval(createItemInterval);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [loading, error, projectData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading project...</p>
                    <p className="text-pink-400 text-sm mt-2">Project ID: {id}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center max-w-md mx-4">
                    <div className="text-red-500 text-6xl mb-4">💔</div>
                    <h2 className="text-white text-xl mb-2">Oops! Something went wrong</h2>
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors mr-2"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black overflow-hidden relative">
            <audio id="backgroundAudio" loop className="hidden">
                <source src={projectData?.musicUrl || "/eyes.mp3"} type="audio/mpeg" />
            </audio>

            {/* Project info header */}
            <div className="absolute top-4 left-4 z-40 max-w-md">
                {projectData?.title && (
                    <h1 className="text-pink-400/80 text-lg font-light tracking-wide mb-1">
                        {projectData.title}
                    </h1>
                )}
                {projectData?.theme && (
                    <p className="text-pink-300/60 text-sm">
                        Theme: {projectData.theme}
                    </p>
                )}
                {/*{projectData?.viewCount !== undefined && (*/}
                {/*    <p className="text-pink-300/40 text-xs mt-1">*/}
                {/*        Views: {projectData.viewCount}*/}
                {/*    </p>*/}
                {/*)}*/}
            </div>

            {/* Remaining uses indicator */}
            {remainingUses !== null && (
                <div className="absolute top-4 right-20 z-40">
                    <div className="bg-pink-500/20 backdrop-blur-sm border border-pink-300/30 rounded-lg px-3 py-1">
                        <p className="text-pink-300 text-xs">
                            Remaining uses: {remainingUses}
                        </p>
                    </div>
                </div>
            )}

            {!audioPlaying && (
                <div className="fixed top-4 right-4 z-50">
                    <button
                        onClick={handleStartAudio}
                        className="bg-pink-500/80 hover:bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-pink-300/50 transition-all duration-300 flex items-center gap-2"
                    >
                        🎵 Play Music
                    </button>
                </div>
            )}

            {audioError && (
                <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 text-red-500 bg-white/80 p-2 rounded-lg">
                    {audioError}
                </div>
            )}

            <div className="absolute inset-0 pointer-events-none">
                {fallingItems.map(item => (
                    <div
                        key={item.id}
                        className="absolute"
                        style={{
                            left: `${item.x}px`,
                            transform: `translateY(${item.y}px) ${item.type === 'heart' ? `rotate(${item.rotation}deg)` : ''}`,
                            transition: 'transform 0.016s linear',
                            willChange: 'transform',
                        }}
                    >
                        {item.type === 'heart' && (
                            <span
                                className="text-2xl md:text-3xl inline-block"
                                style={{
                                    color: 'rgba(255, 105, 180, 0.8)',
                                    filter: 'drop-shadow(0 0 8px rgba(255, 105, 180, 0.6))',
                                }}
                            >
                                {item.content}
                            </span>
                        )}
                        {item.type === 'text' && (
                            <div
                                className="text-sm md:text-base font-light tracking-wide max-w-xs"
                                style={{
                                    color: 'rgba(255, 105, 180, 0.9)',
                                    textShadow: '0 0 20px rgba(255, 105, 180, 0.8), 0 0 30px rgba(255, 105, 180, 0.6), 0 0 40px rgba(255, 105, 180, 0.4)',
                                    fontFamily: 'Arial, sans-serif',
                                    filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.7))',
                                }}
                            >
                                {item.content}
                            </div>
                        )}
                        {item.type === 'image' && (
                            <div
                                className="rounded-lg overflow-hidden shadow-xl"
                                style={{
                                    width: `${100 * item.size}px`,
                                    height: `${120 * item.size}px`,
                                    boxShadow: '0 8px 32px rgba(255, 105, 180, 0.3)',
                                }}
                            >
                                <img
                                    src={item.content}
                                    alt="Love"
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
                                    }}
                                    onError={() => {
                                        console.log('Image failed to load:', item.content);
                                        // Remove failed image from animation
                                        itemsRef.current = itemsRef.current.filter(i => i.id !== item.id);
                                        setFallingItems([...itemsRef.current]);
                                    }}
                                    onLoad={() => {
                                        console.log('Image loaded successfully:', item.content);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Static decorative hearts */}
            <div className="absolute top-10 left-16">
                <span style={{ color: 'rgba(255, 105, 180, 0.6)' }} className="text-lg">💖</span>
            </div>
            <div className="absolute top-32 right-20">
                <span style={{ color: 'rgba(255, 105, 180, 0.5)' }} className="text-sm">💕</span>
            </div>
            <div className="absolute bottom-40 left-8">
                <span style={{ color: 'rgba(255, 105, 180, 0.7)' }} className="text-base">❤️</span>
            </div>
            <div className="absolute top-60 left-1/3">
                <span style={{ color: 'rgba(255, 105, 180, 0.4)' }} className="text-xs">💗</span>
            </div>
            <div className="absolute bottom-60 right-16">
                <span style={{ color: 'rgba(255, 105, 180, 0.6)' }} className="text-lg">💖</span>
            </div>
            <div className="absolute top-80 right-1/3">
                <span style={{ color: 'rgba(255, 105, 180, 0.5)' }} className="text-sm">💕</span>
            </div>

            {/* Footer info */}
            {/*<div className="absolute bottom-4 left-4 text-xs space-y-1">*/}
            {/*    <div style={{ color: 'rgba(255, 105, 180, 0.4)' }}>*/}
            {/*        {projectData?.createdAt ? new Date(projectData.createdAt).toLocaleDateString() : '02/02/2025'}*/}
            {/*    </div>*/}
            {/*    {projectData?.id && (*/}
            {/*        <div style={{ color: 'rgba(255, 105, 180, 0.3)' }} className="font-mono">*/}
            {/*            ID: {projectData.id.slice(-8)}*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}

            {/* Sparkles background effect */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full animate-pulse"
                        style={{
                            backgroundColor: 'rgba(255, 105, 180, 0.3)',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Success message for admin features */}
            {/*{projectData?.isFeatured && (*/}
            {/*    <div className="absolute top-20 right-4 z-40">*/}
            {/*        <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-300/30 rounded-lg px-3 py-1">*/}
            {/*            <p className="text-yellow-300 text-xs flex items-center gap-1">*/}
            {/*                ⭐ Featured*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default FallingHeartsWebsite;