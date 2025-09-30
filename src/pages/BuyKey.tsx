import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../utils/paymentService';


const BuyKey: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string>('10k');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const navigate = useNavigate();

    const plans = [
        { value: '10k', label: '10,000 VND - 1 lượt', price: '10,000 VND', uses: '1 lượt' },
        { value: '30k', label: '30,000 VND - 5 lượt', price: '30,000 VND', uses: '5 lượt' },
        { value: '50k', label: '50,000 VND - 10 lượt', price: '50,000 VND', uses: '10 lượt' }
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
        <div className="p-8 max-w-3xl mx-auto min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Mua Key Dự Án</h1>

            {/* Instructions Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Bảng Giá</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-orange-500 text-white">
                            <th className="border border-orange-600 px-4 py-3 text-left">Gói</th>
                            <th className="border border-orange-600 px-4 py-3 text-left">Giá</th>
                            <th className="border border-orange-600 px-4 py-3 text-left">Số lượt</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="bg-white hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3">Gói Cơ Bản</td>
                            <td className="border border-gray-300 px-4 py-3 font-semibold">10,000 VND</td>
                            <td className="border border-gray-300 px-4 py-3">1 lượt</td>
                        </tr>
                        <tr className="bg-white hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3">Gói Tiêu Chuẩn</td>
                            <td className="border border-gray-300 px-4 py-3 font-semibold">30,000 VND</td>
                            <td className="border border-gray-300 px-4 py-3">5 lượt</td>
                        </tr>
                        <tr className="bg-white hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3">Gói Cao Cấp</td>
                            <td className="border border-gray-300 px-4 py-3 font-semibold">50,000 VND</td>
                            <td className="border border-gray-300 px-4 py-3">10 lượt</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Plan Selection */}
            {!paymentData && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Chọn Gói Thanh Toán</h2>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Chọn gói:
                        </label>
                        <select
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            {plans.map((plan) => (
                                <option key={plan.value} value={plan.value}>
                                    {plan.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Chi tiết gói đã chọn:</h3>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Giá:</span>
                            <span className="text-xl font-bold text-orange-600">
                                {plans.find(p => p.value === selectedPlan)?.price}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">Số lượt sử dụng:</span>
                            <span className="font-semibold text-gray-800">
                                {plans.find(p => p.value === selectedPlan)?.uses}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Tạo Thanh Toán'}
                    </button>
                </div>
            )}

            {/* Payment Information */}
            {paymentData && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">
                        Thông Tin Thanh Toán
                    </h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Mã đơn hàng:</span>
                            <span className="font-mono font-semibold text-gray-800">
                                {paymentData.orderId}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Gói:</span>
                            <span className="font-semibold text-gray-800">
                                {paymentData.plan}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="text-xl font-bold text-orange-600">
                                {paymentData.amount.toLocaleString('vi-VN')} VND
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleVNPayRedirect}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-colors font-semibold text-lg shadow-lg"
                    >
                        Thanh Toán Bằng VNPay
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
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Quay Về Trang Chủ
                </button>
            </div>
        </div>
    );
};

export default BuyKey;