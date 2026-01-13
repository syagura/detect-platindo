import React from 'react'

/**
 * Reusable Card Component
 * Container with consistent styling across the app
 */

const Card = ({
    children,
    title,
    subtitle,
    icon: Icon,
    gradient = false,
    hover = false,
    padding = 'md',
    className = '',
    ...props
}) => {
    // Padding styles
    const paddingStyles = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    // Base styles
    const baseStyles = 'bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10';
    
    // Gradient border
    const gradientStyles = gradient 
        ? 'border-gradient-to-r from-pink5/30 to-purple6/30' 
        : '';
    
    // Hover effect
    const hoverStyles = hover 
        ? 'hover:border-pink5/50 hover:shadow-lg transition-all duration-300 cursor-pointer' 
        : '';
    return (
        <div
            className={`${baseStyles} ${gradientStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
            {...props}
        >
            {/* Header with Icon  */}
            {(title || Icon) && (
                <div className='flex items-center gap-3 mb-4'>
                    {Icon && (
                        <div className='bg-gradient-to-r from-pink5 to-purple6 w-10 h-10 rounded-lg flex items-center justify-center'>
                            <Icon className='w-6 h-6 text-white' />
                        </div>
                    )}
                    {title && (
                        <div>
                            <h3 className='text-xl font-semibold text-white'>{title}</h3>
                            {subtitle && <p className='text-sm text-gray3'>{subtitle}</p>}
                        </div>
                    )}
                </div>
            )}

            {/* Content  */}
            <div className='text-gray3'>{children}</div>
        </div>
    )
}

export default Card
