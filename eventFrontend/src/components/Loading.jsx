import { useState, useEffect } from 'react';

export default function LoadingPage() {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4'>
      <div className="text-center">
        {/* Main Loading Spinner */}
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          {/* <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-indigo-300 rounded-full animate-spin mx-auto mt-2 ml-2" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div> */}
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
          Loading Events{dots}
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Preparing amazing experiences for you
        </p>
        
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 animate-pulse"
              style={{
                animation: `pulse 2s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Image Skeleton */}
              <div className="relative w-full h-64 bg-gray-700">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
                  <div className="h-8 bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-6 w-6 bg-gray-600 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-600 rounded w-32"></div>
                </div>
                
                <div className="flex items-start space-x-3 mb-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-6 w-6 bg-gray-600 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-600 rounded w-40"></div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-6 w-6 bg-gray-600 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-600 rounded w-36"></div>
                </div>
              </div>
              
              {/* Footer Skeleton */}
              <div className="px-6 py-4 bg-gray-700/50">
                <div className="h-6 bg-gray-600 rounded w-24 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Floating Elements */}
        <div className="fixed top-20 left-10 w-4 h-4 bg-indigo-500 rounded-full animate-bounce opacity-60" style={{animationDelay: '0s'}}></div>
        <div className="fixed top-32 right-20 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-40" style={{animationDelay: '0.5s'}}></div>
        <div className="fixed bottom-40 left-1/4 w-2 h-2 bg-indigo-300 rounded-full animate-bounce opacity-50" style={{animationDelay: '1s'}}></div>
        <div className="fixed bottom-20 right-1/3 w-3 h-3 bg-indigo-500 rounded-full animate-bounce opacity-30" style={{animationDelay: '1.5s'}}></div>
      </div>
    </div>
  );
}