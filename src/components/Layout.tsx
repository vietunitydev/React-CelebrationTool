import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img src="/logo.svg" alt="V-Learn Logo" className="h-10 w-10" />
                            <span className="ml-2 text-xl font-bold text-gray-900">V-Learn</span>
                        </Link>
                    </div>
                    <div>
                        {user ? (
                            <div className="flex items-center">
                                <span className="mr-4 text-gray-700">Xin chào, {user.username}</span>
                                <button
                                    onClick={logout}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Sidebar and Main Content */}
            <div className="flex flex-1">
                {user && (
                    <aside className="w-64 bg-gray-100">
                        <nav className="px-4 py-6">
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/"
                                        className={`flex items-center px-4 py-3 rounded-lg ${
                                            location.pathname === '/' ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        Trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/vocab-test"
                                        className={`flex items-center px-4 py-3 rounded-lg ${
                                            location.pathname.includes('/vocab-test') ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                        </svg>
                                        Kiểm tra từ mới
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/offline-study"
                                        className={`flex items-center px-4 py-3 rounded-lg ${
                                            location.pathname === '/offline-study' ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                        Khóa học offline
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/settings"
                                        className={`flex items-center px-4 py-3 rounded-lg ${
                                            location.pathname === '/settings' ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        Cài đặt
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                )}

                <main className="flex-1 bg-gray-50">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;