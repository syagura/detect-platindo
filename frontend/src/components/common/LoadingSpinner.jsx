import React from 'react'

/**
 * Reusable Loading Spinner Component
 * Displays loading state with optional text
 */

const LoadingSpinner = ({
    size = 'md',
    text = 'Loading...',
    fullScreen = false,
    className = ''
}) => {
    // Size variants
    const sizeStyles = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4'
    };

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <div 
            className={`${sizeStyles[size]} border-blue5 border-t-transparent rounded-full animate-spin`}
        />
        {text && (
            <p className="text-gray3 text-sm animate-pulse">{text}</p>
        )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-dark bg-opacity-90 flex items-center justify-center z-50">
                {spinner}
            </div>
        )
    }

    return spinner;

};

export default LoadingSpinner
