export const convertImageToBase64 = (imagePath) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const base64String = canvas.toDataURL('image/jpeg');
            resolve(base64String);
        };
        img.onerror = (error) => {
            reject(error);
        };
        img.src = imagePath;
    });
}; 