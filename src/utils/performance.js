import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Performance metrics tracking
export const trackPerformanceMetrics = async (metricName, value, userId = 'anonymous') => {
    const db = getFirestore();
    const timestamp = new Date();
    
    try {
        await setDoc(doc(db, 'performance_metrics', `${userId}_${timestamp.getTime()}`), {
            metricName,
            value,
            userId,
            timestamp,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
        });
    } catch (error) {
        console.error('Error tracking performance metric:', error);
    }
};

// Image lazy loading performance
export const trackImageLoadTime = (imageUrl, loadTime) => {
    trackPerformanceMetrics('image_load_time', {
        imageUrl,
        loadTime
    });
};

// API response time tracking
export const trackApiResponseTime = (endpoint, responseTime) => {
    trackPerformanceMetrics('api_response_time', {
        endpoint,
        responseTime
    });
};

// Component render time tracking
export const trackComponentRenderTime = (componentName, renderTime) => {
    trackPerformanceMetrics('component_render_time', {
        componentName,
        renderTime
    });
};

// Memory usage tracking
export const trackMemoryUsage = () => {
    if (window.performance && window.performance.memory) {
        trackPerformanceMetrics('memory_usage', {
            totalJSHeapSize: window.performance.memory.totalJSHeapSize,
            usedJSHeapSize: window.performance.memory.usedJSHeapSize,
            jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
        });
    }
};

// Network performance tracking
export const trackNetworkPerformance = () => {
    if (window.performance && window.performance.getEntriesByType) {
        const navigationTiming = window.performance.getEntriesByType('navigation')[0];
        if (navigationTiming) {
            trackPerformanceMetrics('network_performance', {
                dnsLookup: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
                tcpConnection: navigationTiming.connectEnd - navigationTiming.connectStart,
                serverResponse: navigationTiming.responseEnd - navigationTiming.requestStart,
                domLoad: navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart,
                fullPageLoad: navigationTiming.loadEventEnd - navigationTiming.navigationStart
            });
        }
    }
};

// Error tracking
export const trackError = (error, componentStack) => {
    trackPerformanceMetrics('error', {
        message: error.message,
        stack: error.stack,
        componentStack,
        timestamp: new Date().toISOString()
    });
};

// Resource loading performance
export const trackResourceLoading = () => {
    if (window.performance && window.performance.getEntriesByType) {
        const resources = window.performance.getEntriesByType('resource');
        resources.forEach(resource => {
            trackPerformanceMetrics('resource_loading', {
                name: resource.name,
                type: resource.initiatorType,
                duration: resource.duration,
                size: resource.transferSize
            });
        });
    }
};

// Start performance monitoring
export const startPerformanceMonitoring = () => {
    // Track initial page load
    window.addEventListener('load', () => {
        trackNetworkPerformance();
        trackMemoryUsage();
        trackResourceLoading();
    });

    // Track memory usage periodically
    setInterval(trackMemoryUsage, 60000); // Every minute

    // Track network performance on navigation
    window.addEventListener('popstate', trackNetworkPerformance);
}; 