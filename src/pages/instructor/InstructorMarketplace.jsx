import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag, Search, Filter, Star, Download, Play,
    FileText, Zap, Layout, Image as ImageIcon, Briefcase,
    CheckCircle, MessageSquare
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';

const InstructorMarketplace = () => {
    const [activeTab, setActiveTab] = useState('templates');

    const categories = [
        { id: 'templates', label: 'Course Templates', icon: Layout },
        { id: 'assets', label: 'Stock Assets', icon: ImageIcon },
        { id: 'quizzes', label: 'Quiz Packs', icon: FileText },
        { id: 'marketing', label: 'Marketing Kits', icon: Briefcase }
    ];

    const items = [
        {
            id: 1,
            title: 'Modern Tech Course Theme',
            description: 'Fully responsive UI kit for high-end technical training videos.',
            price: '$49',
            rating: 4.9,
            sales: 124,
            type: 'templates'
        },
        {
            id: 2,
            title: 'Abstract Background Bundle',
            description: '4K animated backgrounds optimized for studio lighting setups.',
            price: '$29',
            rating: 4.7,
            sales: 89,
            type: 'assets'
        },
        {
            id: 3,
            title: 'Python Mastery Quiz Bank',
            description: '500+ unique questions covering Django, Flask, and FastAPI.',
            price: '$35',
            rating: 4.8,
            sales: 45,
            type: 'quizzes'
        }
    ];

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <ShoppingBag className="text-brand-primary" size={32} />
                        Instructor Marketplace
                    </h1>
                    <p className="text-dark-muted">Accelerate your course creation with premium assets and templates</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-brand-primary text-dark-bg font-bold rounded-xl hover:bg-brand-hover transition-all flex items-center gap-2">
                        Sell Your Assets
                    </button>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search marketplace..."
                            className="bg-dark-layer1 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-white focus:outline-none focus:border-brand-primary/50 w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border ${activeTab === cat.id
                                ? 'bg-brand-primary text-dark-bg border-brand-primary shadow-[0_0_20px_rgba(255,204,0,0.3)]'
                                : 'bg-dark-layer1 text-dark-muted border-white/5 hover:border-white/20'
                            }`}
                    >
                        <cat.icon size={20} />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.filter(item => item.type === activeTab || activeTab === 'all').map((item) => (
                    <FeatureCard
                        key={item.id}
                        icon={activeTab === 'templates' ? Layout : activeTab === 'assets' ? ImageIcon : FileText}
                        title={item.title}
                        description={item.description}
                        badge={item.price}
                        stats={[
                            { label: 'Rating', value: `⭐ ${item.rating}` },
                            { label: 'Sales', value: item.sales }
                        ]}
                        primaryAction={{
                            label: 'Purchase Now',
                            onClick: () => console.log('Purchasing', item.id)
                        }}
                        secondaryAction={{
                            label: 'Preview',
                            onClick: () => console.log('Previewing', item.id)
                        }}
                        status="available"
                        glowColor="brand-primary"
                    />
                ))}

                {/* Sell Assets CTA */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-primary/50 transition-all cursor-pointer bg-dark-layer1/50"
                >
                    <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
                        <Zap className="text-brand-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Have great content?</h3>
                    <p className="text-dark-muted text-center mb-6">Earn passive income by sharing your templates with other instructors.</p>
                    <button className="text-brand-primary font-bold hover:underline flex items-center gap-2">
                        Get Started <ChevronRight size={16} />
                    </button>
                </motion.div>
            </div>

            {/* Featured Collaborators */}
            <div className="mt-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-brand-primary" />
                        Collaboration Proposals
                    </h2>
                    <button className="text-sm font-bold text-brand-primary hover:underline">View All Requests</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-dark-layer1 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                            <div className="w-16 h-16 rounded-xl bg-dark-layer2 p-1 border border-white/10 flex-shrink-0">
                                <div className="w-full h-full rounded-lg bg-brand-primary/20 flex items-center justify-center font-bold text-brand-primary">JD</div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-white">Looking for Voice-over Artist</h3>
                                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">Hiring</span>
                                </div>
                                <p className="text-dark-muted text-sm mb-4 leading-relaxed">I've completed my "Cyber Security" path and need a professional voice-over for 45 minutes of content. Competitive rates offered.</p>
                                <div className="flex items-center gap-4">
                                    <button className="text-xs font-bold text-white bg-dark-layer2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all">Send Message</button>
                                    <span className="text-xs text-dark-muted">Posted 2h ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstructorMarketplace;
