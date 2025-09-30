import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

            {/* Content wrapper with higher z-index */}
            <div className="relative z-10 flex flex-col flex-grow">
                <nav className="bg-white/80 backdrop-blur-md shadow-md p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        {/*<img*/}
                        {/*    src="https://via.placeholder.com/150x50?text=Logo"*/}
                        {/*    alt="Logo"*/}
                        {/*    className="h-10"*/}
                        {/*/>*/}
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AnimateStudio
                        </span>
                    </div>
                    <div className="flex space-x-4">
                        <Link to="/create-project">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                                Tạo website của bạn
                            </button>
                        </Link>
                        <Link to="/template">
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                                Xem mẫu
                            </button>
                        </Link>
                        <Link to="/buykey">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                                Mua Key
                            </button>
                        </Link>
                    </div>
                </nav>

                <div className="flex flex-col items-center justify-center flex-grow px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Chào mừng đến với Website của AnimateStudio
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 text-center max-w-2xl">
                        Tạo nên những website animation tuyệt đẹp một cách dễ dàng. Hãy bắt đầu ngay hôm nay!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;