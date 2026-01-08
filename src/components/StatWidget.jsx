import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatWidget = ({
    label,
    value,
    previousValue,
    icon: Icon,
    trend,
    trendLabel,
    suffix = '',
    prefix = '',
    color = 'brand-primary',
    size = 'md',
    animate = true,
    sparklineData = [],
    className = ''
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [calculatedTrend, setCalculatedTrend] = useState(null);

    // Auto-calculate trend if previousValue provided
    useEffect(() => {
        if (previousValue !== undefined && value !== previousValue) {
            const change = ((value - previousValue) / previousValue) * 100;
            setCalculatedTrend({
                direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
                percentage: Math.abs(change).toFixed(1)
            });
        } else if (trend) {
            setCalculatedTrend(trend);
        }
    }, [value, previousValue, trend]);

    // Animated counter
    useEffect(() => {
        if (!animate) {
            setDisplayValue(value);
            return;
        }

        let start = 0;
        const end = typeof value === 'number' ? value : parseFloat(value) || 0;
        const duration = 1000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value, animate]);

    const sizeClasses = {
        sm: { container: 'p-4', value: 'text-xl', label: 'text-xs', icon: 16 },
        md: { container: 'p-6', value: 'text-3xl', label: 'text-sm', icon: 20 },
        lg: { container: 'p-8', value: 'text-4xl', label: 'text-base', icon: 24 }
    };

    const currentSize = sizeClasses[size];

    const getTrendIcon = () => {
        if (!calculatedTrend) return null;
        switch (calculatedTrend.direction) {
            case 'up':
                return <TrendingUp size={14} className="text-green-500" />;
            case 'down':
                return <TrendingDown size={14} className="text-red-500" />;
            default:
                return <Minus size={14} className="text-gray-500" />;
        }
    };

    const getTrendColor = () => {
        if (!calculatedTrend) return 'text-gray-500';
        switch (calculatedTrend.direction) {
            case 'up':
                return 'text-green-500';
            case 'down':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative bg-dark-layer1 rounded-2xl border border-white/5 overflow-hidden group hover:border-${color}/30 transition-all duration-300 ${currentSize.container} ${className}`}
        >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className={`${currentSize.label} font-semibold text-dark-muted uppercase tracking-wider`}>
                        {label}
                    </span>
                    {Icon && (
                        <div className={`w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon size={currentSize.icon} className={`text-${color}`} />
                        </div>
                    )}
                </div>

                {/* Value */}
                <div className="mb-2">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${currentSize.value} font-bold text-white flex items-baseline gap-1`}
                    >
                        {prefix && <span className="text-lg opacity-70">{prefix}</span>}
                        <span>{typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}</span>
                        {suffix && <span className="text-lg opacity-70">{suffix}</span>}
                    </motion.div>
                </div>

                {/* Trend Indicator */}
                {calculatedTrend && (
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${calculatedTrend.direction === 'up' ? 'bg-green-500/10' : calculatedTrend.direction === 'down' ? 'bg-red-500/10' : 'bg-gray-500/10'}`}>
                            {getTrendIcon()}
                            <span className={`text-xs font-semibold ${getTrendColor()}`}>
                                {calculatedTrend.percentage}%
                            </span>
                        </div>
                        {trendLabel && (
                            <span className="text-xs text-dark-muted">{trendLabel}</span>
                        )}
                    </div>
                )}

                {/* Sparkline */}
                {sparklineData && sparklineData.length > 0 && (
                    <div className="mt-4 h-12">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" className={`text-${color}`} stopColor="currentColor" stopOpacity="0.3" />
                                    <stop offset="100%" className={`text-${color}`} stopColor="currentColor" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Area */}
                            <path
                                d={generateSparklinePath(sparklineData, true)}
                                fill={`url(#gradient-${label})`}
                            />
                            {/* Line */}
                            <path
                                d={generateSparklinePath(sparklineData, false)}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={`text-${color}`}
                            />
                        </svg>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Helper function to generate SVG path for sparkline
const generateSparklinePath = (data, area = false) => {
    if (!data || data.length === 0) return '';

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 30 - ((value - min) / range) * 30;
        return `${x},${y}`;
    });

    if (area) {
        return `M 0,30 L ${points.join(' L ')} L 100,30 Z`;
    }

    return `M ${points.join(' L ')}`;
};

export default StatWidget;
