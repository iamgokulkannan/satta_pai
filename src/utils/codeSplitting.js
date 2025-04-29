import React, { Suspense, lazy } from 'react';
import { trackComponentRenderTime } from './performance';

// Component loading fallback
const LoadingFallback = ({ componentName }) => {
  return (
    <div className="loading-fallback">
      <div className="spinner"></div>
      <p>Loading {componentName}...</p>
    </div>
  );
};

// Error boundary for lazy-loaded components
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (hasError) {
      // Track error for monitoring
      console.error('Error in lazy-loaded component:', error);
    }
  }, [hasError, error]);

  if (hasError) {
    return fallback || <div>Something went wrong. Please try again.</div>;
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

// Wrapper for lazy-loaded components with performance tracking
export const lazyLoadComponent = (importFn, componentName) => {
  const LazyComponent = lazy(importFn);
  
  return (props) => {
    const startTime = performance.now();
    
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback componentName={componentName} />}>
          <LazyComponent 
            {...props} 
            onLoad={() => {
              const endTime = performance.now();
              trackComponentRenderTime(componentName, endTime - startTime);
            }}
          />
        </Suspense>
      </ErrorBoundary>
    );
  };
};

// Preload component for faster subsequent loads
export const preloadComponent = (importFn) => {
  importFn();
};

// Route-based code splitting
export const createRouteConfig = (routes) => {
  return routes.map(route => ({
    ...route,
    component: lazyLoadComponent(route.importFn, route.name)
  }));
};

// Dynamic import with retry logic
export const dynamicImportWithRetry = (importFn, maxRetries = 3) => {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount = 0) => {
      importFn()
        .then(resolve)
        .catch(error => {
          if (retryCount < maxRetries) {
            console.warn(`Import failed, retrying (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => attempt(retryCount + 1), 1000 * (retryCount + 1));
          } else {
            reject(error);
          }
        });
    };
    
    attempt();
  });
}; 