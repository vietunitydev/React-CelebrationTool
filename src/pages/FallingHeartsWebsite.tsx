import React, { useState, useEffect, useRef } from 'react';
import {FallingItem, ProjectData} from "@/types/types.ts";

const MAX_ITEMS = 50;

const FallingHeartsWebsite: React.FC<{ projectData?: ProjectData }> = ({ projectData }) => {
    const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);
    const animationFrameRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const itemsRef = useRef<FallingItem[]>([]);

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
    }, []);

    return (
        <div className="min-h-screen bg-black overflow-hidden relative">
            <audio id="backgroundAudio" loop className="hidden">
                <source src={projectData?.musicUrl || "/eyes.mp3"} type="audio/mpeg" />
            </audio>
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
                <div className="fixed top-4 left-4 z-50 text-red-500 bg-white/80 p-2 rounded-lg">
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
                                className="text-sm md:text-base font-light tracking-wide"
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
                                        // Remove broken image from falling items
                                        itemsRef.current = itemsRef.current.filter(i => i.id !== item.id);
                                        setFallingItems([...itemsRef.current]);
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
            <div className="absolute bottom-4 left-4 text-xs" style={{ color: 'rgba(255, 105, 180, 0.4)' }}>
                02/02/2025
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