import React from 'react';
import {CheckCircle, AlertCircle, Clock, Zap} from 'lucide-react';


/**
 * Reusable Status Badges Componenet
 * Shows status with icon and color coding
 */
const StatusBadge = ({
    status = 'idle',
    text,
    icon: CustomIcon,
    animate = false,
    className = ''
}) => {
    // Status configurations
    const statusConfig = {
        success: {
        icon: CheckCircle,
        color: 'bg-green62 text-green4 border-green5/30',
        dotColor: 'bg-green4'
        },
        error: {
        icon: AlertCircle,
        color: 'bg-red5/20 text-red5 border-red6/30',
        dotColor: 'bg-red5'
        },
        warning: {
        icon: AlertCircle,
        color: 'bg-yellow62 text-yellow4 border-yellow5/30',
        dotColor: 'bg-yellow4'
        },
        processing: {
        icon: Zap,
        color: 'bg-blue62 text-blue4 border-blue5/30',
        dotColor: 'bg-blue4'
        },
        idle: {
        icon: Clock,
        color: 'bg-gray62 text-gray4 border-gray5/30',
        dotColor: 'bg-gray4'
        }
    };

    const config = statusConfig[status] || statusConfig.idle;
    const Icon = CustomIcon || config.icon;

    return (
        <div
            className={`w-2 h-2 ${config.dotColor} rounded-full ${animate ? 'animate-pulse' : ''}`}
        >
            {/* Icon */}
            <Icon className='w-4 h-4' />

            {/* Text  */}
            {text && (
                <span className='text-sm font-medium'>{text}</span>
            )}
        </div>
    )
}

export default StatusBadge
