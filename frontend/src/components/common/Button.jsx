import React from 'react';

/**
 * Reusable Button Component
 * Support multiple variants, sizes, and states
 */

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}) => {
    // Variant styles
    const variantStyles = {
        primary: 'bg-gradient-to-r from-purple6 to-pink6 hover:from-purple7 hover:to-pink7 text-white',
        secondary: 'bg-gray7 hover:bg-gray6 text-white',
        outline: 'bg-transparent border-2 border-white/30 hover:bg-white/10 text-white',
        danger: 'bg-red6 hover:bg-red5 text-white',
        ghost: 'bg-transparent hover:bg-white/5 text-white'
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    // Base styles
    const baseStyles = 'rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Hover effect
    const hoverEffect = disabled || loading ? '' : 'hover:scale-105 transform';

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${hoverEffect} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="w-5 h-5"/>}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
                </>
            )}
        </button>
    )
}

export default Button
