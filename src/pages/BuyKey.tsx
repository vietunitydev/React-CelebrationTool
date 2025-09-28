import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Function to generate a random key (simulating a unique key)
const generateKey = (): string => {
    return 'KEY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

const BuyKey: React.FC = () => {
    const [key, setKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePayment = () => {
        setIsLoading(true);
        // Simulate payment processing with a delay
        setTimeout(() => {
            const newKey = generateKey();
            setKey(newKey);
            setIsLoading(false);
            alert('Payment successful! Your key is displayed below.');
        }, 1500);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Buy a Project Key</h1>
            <p className="mb-4 text-gray-600">
                Scan the QR code below to make a payment. After successful payment, you will receive a unique key to save your project.
            </p>

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Payment QR Code</h2>
                <img
                    src="https://via.placeholder.com/200x200.png?text=QR+Code"
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto border rounded-lg shadow"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                    Scan this QR code with your payment app to proceed.
                </p>
            </div>

            <div className="mb-6">
                <button
                    onClick={handlePayment}
                    disabled={isLoading || key !== null}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : key ? 'Payment Completed' : 'Confirm Payment'}
                </button>
            </div>

            {key && (
                <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                    <h2 className="text-lg font-semibold text-green-800 mb-2">Your Project Key</h2>
                    <p className="text-green-700 font-mono text-center text-lg">{key}</p>
                    <p className="text-sm text-green-600 mt-2">
                        Save this key to use when creating your project. You can return to the{' '}
                        <span
                            onClick={() => navigate('/create-project')}
                            className="text-blue-500 hover:underline cursor-pointer"
                        >
              Create Project
            </span>{' '}
                        page to use it.
                    </p>
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={() => navigate('/')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default BuyKey;