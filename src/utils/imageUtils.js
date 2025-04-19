import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { trackImageLoadTime } from './performance';

// Image placeholder component with blur effect
export const LazyImage = ({ src, alt, className, width, height, ...props }) => {
  const handleLoad = () => {
    // Track image load time for performance monitoring
    const loadTime = performance.now();
    trackImageLoadTime(src, loadTime);
  };

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect="blur"
      className={className}
      width={width}
      height={height}
      onLoad={handleLoad}
      {...props}
    />
  );
};

// Generate responsive image srcset
export const generateSrcSet = (imageUrl, sizes = [320, 640, 960, 1280]) => {
  return sizes
    .map(size => `${imageUrl}?w=${size} ${size}w`)
    .join(', ');
};

// Generate responsive image sizes attribute
export const generateSizes = (defaultSize = '100vw') => {
  return `(max-width: 320px) 320px, 
          (max-width: 640px) 640px, 
          (max-width: 960px) 960px, 
          ${defaultSize}`;
};

// Image optimization options
export const getImageOptimizationOptions = (quality = 80) => {
  return {
    quality,
    format: 'webp',
    progressive: true,
    optimizeScans: true,
    mozjpeg: true,
    pngquant: {
      quality: [0.65, 0.9],
      speed: 4
    },
    gifsicle: {
      interlaced: false
    }
  };
};

// Preload critical images
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Check if browser supports WebP
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

// Get optimal image format based on browser support
export const getOptimalImageFormat = (imageUrl) => {
  if (supportsWebP()) {
    return imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  return imageUrl;
};

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