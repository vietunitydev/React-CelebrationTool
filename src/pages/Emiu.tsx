import React, { useState, useEffect } from 'react';

interface FallingItem {
    id: number;
    type: 'heart' | 'text' | 'image';
    content: string;
    x: number;
    y: number;
    speed: number;
    rotation: number;
    rotationSpeed: number;
    size: number;
}

const FallingHeartsWebsite: React.FC = () => {
    const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);

    // Các câu tình cảm như trong ảnh
    const loveMessages = [
        "You make my heart smile",
        "Love ya! 💖",
        "Thank you for being my sunshine",
        "Yêu em nhìuuuu ! 💖",
        "Chúc em 1/6 luôn vui tươi",
        "I love you 💖",
        "You make my heart smile",
        "Love ya! 💖",
        "I love you so much! 💖",
        "My love for you",
    ];

    // Ảnh giống như trong ảnh gốc (dùng placeholder tương tự)
    const images = [
        "1.JPG",
        "2.JPG",
        "3.JPG",
        "6.PNG",
        "5.jpg",

    ];

    const createFallingItem = (): FallingItem => {
        // Tỷ lệ: chữ rất nhiều, ít tim và ảnh
        const rand = Math.random();
        let type: 'heart' | 'text' | 'image';

        if (rand < 0.73) {
            type = 'text';
        } else if (rand < 0.82) {
            type = 'heart';
        } else {
            type = 'image';
        }

        let content = '';
        if (type === 'heart') {
            const hearts = ['💖', '💕', '❤️', '💗', '💓'];
            content = hearts[Math.floor(Math.random() * hearts.length)];
        } else if (type === 'text') {
            content = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        } else {
            content = images[Math.floor(Math.random() * images.length)];
        }

        return {
            id: Date.now() + Math.random(),
            type,
            content,
            x: Math.random() * (window.innerWidth - 200),
            y: -150,
            speed: 2 + Math.random() * 3, // Tốc độ nhanh hơn: 2-5px/frame
            rotation: 0,
            rotationSpeed: type === 'heart' ? (Math.random() - 0.5) * 4 : 0, // Chỉ tim mới xoay
            size: type === 'image' ? 1.2 + Math.random() * 0.8 : 1 // Ảnh có size từ 1.2 đến 2.0 (to hơn)
        };
    };

    useEffect(() => {
        // Tạo items rơi nhanh hơn
        const interval = setInterval(() => {
            setFallingItems(prev => [...prev, createFallingItem()]);
        }, 250); // Giảm từ 800ms xuống 400ms

        // Animation loop với tốc độ cao hơn
        const animate = () => {
            setFallingItems(prev =>
                prev
                    .map(item => ({
                        ...item,
                        y: item.y + item.speed,
                        rotation: item.rotation + item.rotationSpeed
                    }))
                    .filter(item => item.y < window.innerHeight + 200)
            );
        };

        const animationFrame = setInterval(animate, 12); // Giảm từ 16ms xuống 12ms

        return () => {
            clearInterval(interval);
            clearInterval(animationFrame);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black overflow-hidden relative">
            {/* Background audio */}
            <audio autoPlay loop className="hidden">
                <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
            </audio>

            {/* Falling items */}
            <div className="absolute inset-0 pointer-events-none">
                {fallingItems.map(item => (
                    <div
                        key={item.id}
                        className="absolute transition-none"
                        style={{
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                            transform: item.type === 'heart' ? `rotate(${item.rotation}deg)` : 'none'
                        }}
                    >
                        {item.type === 'heart' && (
                            <span className="text-2xl md:text-3xl inline-block" style={{ color: 'rgba(255, 105, 180, 0.8)' }}>
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
                                    filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.7))'
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
                                    boxShadow: '0 8px 32px rgba(255, 105, 180, 0.3)'
                                }}
                            >
                                <img
                                    src={item.content}
                                    alt="Love"
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: 'brightness(1.1) contrast(1.1) saturate(1.2)'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Scattered hearts decoration giống như trong ảnh */}
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

            {/* Date stamp như trong ảnh gốc */}
            <div className="absolute bottom-4 left-4 text-xs" style={{ color: 'rgba(255, 105, 180, 0.4)' }}>
                5/08/2024
            </div>

            {/* Các đốm sáng nhỏ giống như trong ảnh */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full animate-pulse"
                        style={{
                            backgroundColor: 'rgba(255, 105, 180, 0.3)',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default FallingHeartsWebsite;