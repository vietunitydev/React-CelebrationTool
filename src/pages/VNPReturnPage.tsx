import { useState, useEffect } from 'react';
import paymentService from '../utils/paymentService';
import {KeyStatus, VNPayParams} from "@/types/types.ts";

const VNPReturnPage = () => {
    const [params, setParams] = useState<VNPayParams>({});
    const [serverResponse, setServerResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [keyStatus, setKeyStatus] = useState<KeyStatus | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [checkError, setCheckError] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paramsObj: VNPayParams = {};

        for (const [key, value] of urlParams.entries()) {
            paramsObj[key] = value;
        }

        setParams(paramsObj);
        sendToServer(paramsObj);
    }, []);

    const sendToServer = async (paramsObj: VNPayParams) => {
        try {
            setIsLoading(true);
            const validParams = Object.fromEntries(
                Object.entries(paramsObj).filter(([, value]) => value !== undefined)
            ) as Record<string, string>;
            const queryString = new URLSearchParams(validParams).toString();
            const response = await paymentService.clientVNPayReturn(queryString);
            setServerResponse(response);
            setError(null);
        } catch (err) {
            console.error('Error sending to server:', err);
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckKeyStatus = async () => {
        try {
            setIsChecking(true);
            setCheckError(null);
            setKeyStatus(null);

            const orderId = params.vnp_TxnRef;
            if (!orderId) {
                setCheckError('Không tìm thấy mã đơn hàng (vnp_TxnRef) để kiểm tra.');
                return;
            }

            const res = await paymentService.checkStatusOder(orderId);
            setKeyStatus(res as KeyStatus);
        } catch (err) {
            console.error('Error checking key status:', err);
            setCheckError(err instanceof Error ? err.message : 'Không thể kiểm tra trạng thái key.');
        } finally {
            setIsChecking(false);
        }
    };

    const getStatusColor = () => {
        if (params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00') {
            return 'green';
        }
        return 'red';
    };

    const getStatusMessage = () => {
        if (params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00') {
            return 'Giao dịch thành công';
        }
        return 'Giao dịch thất bại';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

            <div className="relative z-10 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6">
                        <h1 className="text-4xl font-bold mb-6 text-center">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Kết Quả Thanh Toán VNPay
                            </span>
                        </h1>

                        {/* Status Banner */}
                        <div
                            className={`p-6 rounded-xl mb-6 backdrop-blur-sm ${
                                getStatusColor() === 'green'
                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-500 shadow-lg'
                                    : 'bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-500 shadow-lg'
                            }`}
                        >
                            <h2
                                className={`text-3xl font-bold text-center ${
                                    getStatusColor() === 'green' ? 'text-green-700' : 'text-red-700'
                                }`}
                            >
                                {getStatusColor() === 'green' ? '✅ ' : '❌ '}
                                {getStatusMessage()}
                            </h2>
                        </div>

                        {/* Key Information Highlights */}
                        {params.vnp_Amount && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                    Thông Tin Quan Trọng
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/70 rounded-lg p-4">
                                        <p className="text-sm text-blue-600 mb-1">Số tiền</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {(parseInt(params.vnp_Amount) / 100).toLocaleString('vi-VN')} VND
                                        </p>
                                    </div>
                                    <div className="bg-white/70 rounded-lg p-4">
                                        <p className="text-sm text-blue-600 mb-1">Mã đơn hàng</p>
                                        <p className="text-xl font-bold text-blue-900 font-mono break-all">
                                            {params.vnp_TxnRef}
                                        </p>
                                    </div>
                                    {params.vnp_BankCode && (
                                        <div className="bg-white/70 rounded-lg p-4">
                                            <p className="text-sm text-blue-600 mb-1">Ngân hàng</p>
                                            <p className="text-xl font-bold text-blue-900">
                                                {params.vnp_BankCode}
                                            </p>
                                        </div>
                                    )}
                                    {params.vnp_PayDate && (
                                        <div className="bg-white/70 rounded-lg p-4">
                                            <p className="text-sm text-blue-600 mb-1">Thời gian thanh toán</p>
                                            <p className="text-lg font-bold text-blue-900">
                                                {params.vnp_PayDate}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Server Response */}
                        <div className="bg-gray-50/70 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                Phản Hồi Từ Server
                            </h3>
                            {isLoading && (
                                <div className="text-center py-6">
                                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                                    <p className="mt-3 text-gray-600 font-medium">Đang xử lý...</p>
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                                    <p className="font-bold">Lỗi:</p>
                                    <p>{error}</p>
                                </div>
                            )}
                            {!isLoading && !error && serverResponse && (
                                <div className="bg-white border-2 border-green-500 rounded-lg p-4">
                                    <p className="text-lg text-gray-800">
                                        {typeof serverResponse === 'string'
                                            ? serverResponse
                                            : JSON.stringify(serverResponse, null, 2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Key Status Check Result */}
                    {(isChecking || checkError || keyStatus) && (
                        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                Kết Quả Kiểm Tra Key
                            </h3>

                            {isChecking && (
                                <div className="text-center py-6">
                                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                                    <p className="mt-3 text-gray-600 font-medium">Đang kiểm tra...</p>
                                </div>
                            )}

                            {checkError && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                                    <p className="font-bold">Lỗi:</p>
                                    <p>{checkError}</p>
                                </div>
                            )}

                            {!isChecking && !checkError && keyStatus && (
                                <div
                                    className={`rounded-xl border-2 p-6 ${
                                        keyStatus.status === 'success'
                                            ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50'
                                            : 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50'
                                    }`}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white/70 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Key</p>
                                            <p className="text-lg font-mono break-all font-bold">
                                                {keyStatus.key}
                                            </p>
                                        </div>
                                        <div className="bg-white/70 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Số lần sử dụng</p>
                                            <p className="text-2xl font-bold text-emerald-700">
                                                {keyStatus.uses}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2 bg-white/70 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Thông điệp</p>
                                            <p className="text-lg font-medium">{keyStatus.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => (window.location.href = '/')}
                            className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-8 py-3 rounded-lg transition-all shadow-md font-semibold"
                        >
                            Về Trang Chủ
                        </button>
                        <button
                            onClick={handleCheckKeyStatus}
                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 rounded-lg transition-all shadow-lg font-semibold"
                        >
                            Lấy Key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VNPReturnPage;