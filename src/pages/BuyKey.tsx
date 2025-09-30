import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../utils/paymentService';


const BuyKey: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string>('10k');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const navigate = useNavigate();

    const plans = [
        { value: '10k', label: '10,000 VND - 1 lượt', price: '10,000 VND', uses: '1 lượt', amount: 10000 },
        { value: '30k', label: '30,000 VND - 5 lượt', price: '30,000 VND', uses: '5 lượt', amount: 30000 },
        { value: '50k', label: '50,000 VND - 10 lượt', price: '50,000 VND', uses: '10 lượt', amount: 50000 }
    ];

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const response = await paymentService.createPayment(selectedPlan);
            setPaymentData(response);
        } catch (error) {
            alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVNPayRedirect = () => {
        if (paymentData?.vnp_Url) {
            window.open(paymentData.vnp_Url, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

            <div className="relative z-10 p-8 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                        Mua Key
                    </span>
                </h1>

                {/* Pricing Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bảng Giá</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                <th className="border border-orange-600 px-4 py-3 text-left rounded-tl-lg">Gói</th>
                                <th className="border border-orange-600 px-4 py-3 text-left">Giá</th>
                                <th className="border border-orange-600 px-4 py-3 text-left rounded-tr-lg">Số lượt</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="bg-white hover:bg-orange-50 transition-colors">
                                <td className="border border-gray-300 px-4 py-3">Gói 1</td>
                                <td className="border border-gray-300 px-4 py-3 font-semibold text-orange-600">10,000 VND</td>
                                <td className="border border-gray-300 px-4 py-3">1 lượt</td>
                            </tr>
                            <tr className="bg-white hover:bg-orange-50 transition-colors">
                                <td className="border border-gray-300 px-4 py-3">Gói 2</td>
                                <td className="border border-gray-300 px-4 py-3 font-semibold text-orange-600">30,000 VND</td>
                                <td className="border border-gray-300 px-4 py-3">5 lượt</td>
                            </tr>
                            <tr className="bg-white hover:bg-orange-50 transition-colors">
                                <td className="border border-gray-300 px-4 py-3 rounded-bl-lg">Gói 3</td>
                                <td className="border border-gray-300 px-4 py-3 font-semibold text-orange-600">50,000 VND</td>
                                <td className="border border-gray-300 px-4 py-3 rounded-br-lg">10 lượt</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Plan Selection */}
                {!paymentData && (
                    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chọn Gói Thanh Toán</h2>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Chọn gói:
                            </label>
                            <select
                                value={selectedPlan}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                            >
                                {plans.map((plan) => (
                                    <option key={plan.value} value={plan.value}>
                                        {plan.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 mb-6 border border-orange-200">
                            <h3 className="font-semibold text-gray-700 mb-3">Chi tiết gói đã chọn:</h3>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Giá:</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    {plans.find(p => p.value === selectedPlan)?.price}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2 py-2">
                                <span className="text-gray-600">Số lượt sử dụng:</span>
                                <span className="font-semibold text-gray-800">
                                    {plans.find(p => p.value === selectedPlan)?.uses}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Thanh Toán'}
                        </button>
                    </div>
                )}

                {/* Payment Information */}
                {paymentData && (
                    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ✅ Thông Tin Thanh Toán
                            </span>
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                                <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded">
                                    {paymentData.orderId}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-gray-600 font-medium">Gói:</span>
                                <span className="font-semibold text-gray-800">
                                    {paymentData.plan}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-gray-600 font-medium">Số tiền:</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    {paymentData.amount.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleVNPayRedirect}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-lg transition-all font-semibold text-lg shadow-lg"
                        >
                            🏦 Thanh Toán Bằng VNPay
                        </button>

                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch
                        </p>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-6 py-3 rounded-lg transition-all shadow-md font-medium"
                    >
                        ← Quay Về Trang Chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyKey;