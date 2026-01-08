import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Star, TrendingUp, CheckCircle } from 'lucide-react';

const FeatureCard = ({
    icon: Icon,
    title,
    description,
    status = 'available', // 'available', 'locked', 'new', 'beta', 'premium'
    badge,
    progress,
    stats,
    primaryAction,
    secondaryAction,
    gradient = 'from-brand-primary/10 to-purple-500/10',
    glowColor = 'brand-primary',
    className = ''
}) => {
    const statusConfig = {
        available: { color: 'green', icon: CheckCircle, label: 'Available' },
        locked: { color: 'gray', icon: Lock, label: 'Locked' },
        new: { color: 'blue', icon: Star, label: 'New' },
        beta: { color: 'purple', icon: TrendingUp, label: 'Beta' },
        premium: { color: 'yellow', icon: Star, label: 'Premium' }
    };

    const currentStatus = statusConfig[status];
    const StatusIcon = currentStatus.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={`group relative bg-dark-layer1 rounded-2xl border border-white/5 p-6 overflow-hidden transition-all duration-300 hover:border-${glowColor}/30 hover:shadow-lg hover:shadow-${glowColor}/10 ${className}`}
        >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        {Icon && (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} border border-${glowColor}/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={24} className={`text-${glowColor}`} />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">
                                    {title}
                                </h3>
                                {badge && (
                                    <span className="px-2 py-0.5 text-xs font-bold bg-brand-primary/20 text-brand-primary rounded-full border border-brand-primary/30">
                                        {badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-dark-muted leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-${currentStatus.color}-500/10 border border-${currentStatus.color}-500/20`}>
                        <StatusIcon size={12} className={`text-${currentStatus.color}-500`} />
                        <span className={`text-xs font-semibold text-${currentStatus.color}-500`}>
                            {currentStatus.label}
                        </span>
                    </div>
                </div>

                {/* Progress Bar (if provided) */}
                {typeof progress === 'number' && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-dark-muted">Progress</span>
                            <span className="text-xs font-bold text-brand-primary">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-brand-primary to-purple-500"
                            />
                        </div>
                    </div>
                )}

                {/* Stats Row (if provided) */}
                {stats && stats.length > 0 && (
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span className="text-lg font-bold text-white">{stat.value}</span>
                                <span className="text-xs text-dark-muted">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                {(primaryAction || secondaryAction) && (
                    <div className="flex items-center gap-3 mt-4">
                        {primaryAction && (
                            <button
                                onClick={primaryAction.onClick}
                                disabled={status === 'locked'}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-primary to-purple-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-brand-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.02]"
                            >
                                {primaryAction.label}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                        {secondaryAction && (
                            <button
                                onClick={secondaryAction.onClick}
                                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold text-sm transition-all border border-white/10 hover:border-white/20"
                            >
                                {secondaryAction.label}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default FeatureCard;
