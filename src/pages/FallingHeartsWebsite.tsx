import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import projectService from '../utils/projectService';
import { FallingItem, ProjectData } from "@/types/types.ts";

const MAX_ITEMS = 50;
const POOL_SIZE = 100;
const CREATE_INTERVAL = 250;
const PRELOAD_IMAGES = true;

// Object pool for recycling falling items
class ItemPool {
    private pool: FallingItem[] = [];
    private activeItems: Set<number> = new Set();

    constructor(size: number) {
        for (let i = 0; i < size; i++) {
            this.pool.push(this.createNewItem());
        }
    }

    private createNewItem(): FallingItem {
        return {
            id: Math.random(),
            type: 'heart',
            content: '',
            x: 0,
            y: -150,
            targetY: -150,
            speed: 0,
            rotation: 0,
            rotationSpeed: 0,
            size: 1,
            lastFrameTime: 0,
        };
    }

    acquire(type: 'heart' | 'text' | 'image', content: string, currentTime: number): FallingItem {
        let item = this.pool.pop();
        if (!item) {
            item = this.createNewItem();
        }

        item.id = Date.now() + Math.random();
        item.type = type;
        item.content = content;
        item.x = Math.random() * (window.innerWidth - 200);
        item.y = -150;
        item.targetY = -150;
        item.speed = 2 + Math.random() * 3;
        item.rotation = 0;
        item.rotationSpeed = type === 'heart' ? (Math.random() - 0.5) * 4 : 0;
        item.size = type === 'image' ? 0.9 + Math.random() * 0.8 : 1;
        item.lastFrameTime = currentTime;

        this.activeItems.add(item.id);
        return item;
    }

    release(item: FallingItem): void {
        this.activeItems.delete(item.id);
        if (this.pool.length < POOL_SIZE) {
            this.pool.push(item);
        }
    }

    releaseAll(items: FallingItem[]): void {
        items.forEach(item => this.release(item));
    }
}

const FallingHeartsWebsite: React.FC = () => {
    const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remainingUses, setRemainingUses] = useState<number | null>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const animationFrameRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const itemsRef = useRef<FallingItem[]>([]);
    const poolRef = useRef<ItemPool>(new ItemPool(POOL_SIZE));
    const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
    const { id } = useParams<{ id: string }>();

    const loveMessages = useMemo(() =>
            projectData?.texts || [
                "You make my heart smile",
                "Love ya! 💖",
                "Thank you for being my sunshine",
                "Yêu em nhìuuuu ! 💖",
                "Chúc em luôn vui tươi",
                "I love you 💖",
            ], [projectData?.texts]
    );

    const images = useMemo(() =>
            projectData?.imageUrls || [
                "1.jpeg",
                "2.jpeg",
                "3.jpeg",
                "4.jpeg",
                "5.jpeg",
            ], [projectData?.imageUrls]
    );

    // Preload images for better performance
    useEffect(() => {
        if (!PRELOAD_IMAGES || images.length === 0) {
            setImagesLoaded(true);
            return;
        }

        let loadedCount = 0;
        const totalImages = images.length;

        images.forEach((src) => {
            if (imageCache.current.has(src)) {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setImagesLoaded(true);
                }
                return;
            }

            const img = new Image();
            img.onload = () => {
                imageCache.current.set(src, img);
                loadedCount++;
                if (loadedCount === totalImages) {
                    setImagesLoaded(true);
                }
            };
            img.onerror = () => {
                console.warn(`Failed to preload image: ${src}`);
                loadedCount++;
                if (loadedCount === totalImages) {
                    setImagesLoaded(true);
                }
            };
            img.src = src;
        });
    }, [images]);

    // Fetch project data
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) {
                setError('No project ID provided.');
                setLoading(false);
                return;
            }

            try {
                const response = await projectService.getProject(id);

                if (response.project) {
                    const transformedProject: ProjectData = {
                        id: response.project._id || response.project.id,
                        title: response.project.title,
                        theme: response.project.theme,
                        texts: response.project.texts || [],
                        imageUrls: response.project.imageUrls || [],
                        musicUrl: response.project.musicUrl || null,
                    };

                    setProjectData(transformedProject);

                    if (response.remainingUses !== undefined) {
                        setRemainingUses(response.remainingUses);
                    }
                } else {
                    setError('Project data not found in response.');
                }
            } catch (err: any) {
                console.error('Error fetching project:', err);
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

    const handleStartAudio = useCallback(() => {
        const audio = document.getElementById('backgroundAudio') as HTMLAudioElement;
        if (audio) {
            audio.play()
                .then(() => setAudioPlaying(true))
                .catch(err => {
                    setAudioError('Failed to play audio. Please try again.');
                    console.error('Audio play failed:', err);
                });
        }
    }, []);

    const createFallingItem = useCallback((): FallingItem => {
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
        return poolRef.current.acquire(type, content, currentTime);
    }, [loveMessages, images]);

    const animate = useCallback((currentTime: number) => {
        const deltaTime = currentTime - lastTimeRef.current;
        const normalizedDelta = deltaTime / 16.67;

        const itemsToRelease: FallingItem[] = [];

        itemsRef.current = itemsRef.current
            .map(item => {
                const timeDiff = currentTime - item.lastFrameTime;
                const smoothFactor = Math.min(timeDiff / 16.67, 1);

                item.targetY += item.speed * normalizedDelta;
                const newY = item.y + (item.targetY - item.y) * smoothFactor * 0.8;

                if (newY >= window.innerHeight + 200) {
                    itemsToRelease.push(item);
                    return null;
                }

                return {
                    ...item,
                    y: newY,
                    rotation: item.rotation + (item.rotationSpeed * normalizedDelta),
                    lastFrameTime: currentTime,
                };
            })
            .filter((item): item is FallingItem => item !== null);

        // Release items back to pool
        itemsToRelease.forEach(item => poolRef.current.release(item));

        setFallingItems([...itemsRef.current]);
        lastTimeRef.current = currentTime;
        animationFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        if (loading || error || !imagesLoaded) return;

        const createItemInterval = setInterval(() => {
            if (itemsRef.current.length < MAX_ITEMS) {
                const newItem = createFallingItem();
                itemsRef.current = [...itemsRef.current, newItem];
            }
        }, CREATE_INTERVAL);

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            clearInterval(createItemInterval);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            // Release all items back to pool on cleanup
            poolRef.current.releaseAll(itemsRef.current);
            itemsRef.current = [];
        };
    }, [loading, error, imagesLoaded, createFallingItem, animate]);

    if (loading || !imagesLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">
                        {loading ? 'Loading project...' : 'Loading images...'}
                    </p>
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
            <audio id="backgroundAudio" loop className="hidden" preload="auto">
                <source src={projectData?.musicUrl || "/eyes.mp3"} type="audio/mpeg" />
            </audio>

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
            </div>

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
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

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
        </div>
    );
};

export default FallingHeartsWebsite;