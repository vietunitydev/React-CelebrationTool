// Cấu hình Cloudinary cho Vite
const cloudinaryConfig = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

// Hàm upload ảnh
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset || 'your_upload_preset');

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Upload failed');
        }

        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Hàm upload audio
export const uploadAudio = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset || 'your_upload_preset');
    formData.append('resource_type', 'auto'); // Cho phép upload nhiều loại file

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Upload failed');
        }

        return data.secure_url;
    } catch (error) {
        console.error('Error uploading audio:', error);
        throw error;
    }
};

// Hàm xóa file từ Cloudinary (cần backend API)
export const deleteFile = async (publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<boolean> => {
    try {
        // Cần tạo API endpoint trên backend để xóa file vì cần API secret
        const response = await fetch('/api/cloudinary/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicId, resourceType }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

// Hàm helper để tạo URL với transformations
export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number): string => {
    let transformations = 'f_auto,q_auto';

    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;

    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformations}/${publicId}`;
};

export default cloudinaryConfig;