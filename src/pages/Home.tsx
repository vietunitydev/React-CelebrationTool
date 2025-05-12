import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Chào mừng đến với V-Learn</h1>

            <div className="bg-white shadow overflow-hidden rounded-lg max-w-4xl mx-auto">
                <div className="px-4 py-5 sm:p-6">
                    <div className="text-center">
                        <p className="mt-1 max-w-2xl text-lg text-gray-700 mx-auto mb-6">
                            V-Learn là một nền tảng học ngôn ngữ đơn giản và hiệu quả.
                        </p>

                        {user ? (
                            <div className="mt-6">
                                <Link
                                    to="/vocab-test"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Bắt đầu kiểm tra từ vựng
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Đăng nhập để bắt đầu
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tính năng chính</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900">Kiểm tra từ vựng</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Nhập từ tương ứng với nghĩa được hiển thị để kiểm tra kiến thức của bạn.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900">Quản lý bài học</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Tạo và quản lý các môn học, bài học, và danh sách từ vựng của riêng bạn.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900">Thống kê học tập</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Theo dõi tiến trình học tập của bạn với các thống kê chi tiết sau mỗi bài kiểm tra.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;