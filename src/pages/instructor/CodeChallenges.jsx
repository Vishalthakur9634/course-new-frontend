import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code, Plus, Edit, Play, CheckCircle, XCircle, Clock,
    Award, Users, BarChart3, TrendingUp, FileCode
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import StatWidget from '../../components/StatWidget';

const CodeChallenges = () => {
    const challenges = [
        {
            id: 1,
            title: 'Array Manipulation',
            language: 'JavaScript',
            difficulty: 'Easy',
            submissions: 456,
            passRate: 78,
            avgTime: '12 min'
        },
        {
            id: 2,
            title: 'Binary Search Tree',
            language: 'Python',
            difficulty: 'Medium',
            submissions: 234,
            passRate: 62,
            avgTime: '25 min'
        },
        {
            id: 3,
            title: 'Dynamic Programming',
            language: 'Java',
            difficulty: 'Hard',
            submissions: 89,
            passRate: 45,
            avgTime: '45 min'
        }
    ];

    const stats = [
        { label: 'Total Challenges', value: challenges.length },
        { label: 'Submissions', value: 779 },
        { label: 'Avg Pass Rate', value: 62, suffix: '%' },
        { label: 'Active Students', value: 234 }
    ];

    return (
        <div className="min-h-screen bg-dark-bg font-orbit">
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center">
                                <Code size={28} className="text-green-500" />
                            </div>
                            Code Challenges
                        </h1>
                        <p className="text-dark-muted text-lg">Create and manage coding challenges with auto-grading</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all">
                        <Plus size={20} />
                        Create Challenge
                    </button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatWidget
                        key={idx}
                        {...stat}
                        icon={idx === 0 ? FileCode : idx === 1 ? Play : idx === 2 ? CheckCircle : Users}
                        color="green-500"
                        size="sm"
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {challenges.map((challenge) => (
                    <FeatureCard
                        key={challenge.id}
                        icon={Code}
                        title={challenge.title}
                        description={`${challenge.language} • ${challenge.difficulty}`}
                        badge={challenge.difficulty}
                        stats={[
                            { label: 'Submissions', value: challenge.submissions },
                            { label: 'Pass Rate', value: `${challenge.passRate}%` },
                            { label: 'Avg Time', value: challenge.avgTime }
                        ]}
                        primaryAction={{
                            label: 'View Submissions',
                            onClick: () => console.log('View', challenge.id)
                        }}
                        secondaryAction={{
                            label: 'Edit',
                            onClick: () => console.log('Edit', challenge.id)
                        }}
                        gradient="from-green-500/10 to-blue-500/10"
                        glowColor="green-500"
                    />
                ))}
            </div>
        </div>
    );
};

export default CodeChallenges;
