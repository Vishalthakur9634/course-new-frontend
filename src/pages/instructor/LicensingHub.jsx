import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Award, Shield, Globe, Users, DollarSign, FileCheck,
    Plus, Filter, Search, BarChart3, Lock, Copy, ArrowUpRight
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const LicensingHub = () => {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/licenses/my-licenses');
            setLicenses(data);
        } catch (error) {
            console.error('Error fetching licenses:', error);
            addToast('Failed to load licenses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Active Licenses', value: licenses.length, icon: FileCheck },
        { label: 'Total Partners', value: [...new Set(licenses.map(l => l.partnerName))].length, icon: Globe },
        { label: 'Licensed Students', value: 1560, icon: Users }, // Mocking students for now
        { label: 'License Revenue', value: licenses.reduce((acc, l) => acc + l.revenue, 0), prefix: '$', icon: DollarSign }
    ];

    if (loading && licenses.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                <Award className="text-green-500" size={24} />
                            </div>
                            Licensing Hub
                        </h1>
                        <p className="text-dark-muted">Manage B2B course licensing and enterprise distribution</p>
                    </div>

                    <button
                        onClick={() => addToast('License deal creation coming soon!', 'info')}
                        className="px-8 py-3 bg-green-500 text-dark-bg font-extrabold rounded-xl hover:bg-green-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    >
                        <Plus size={20} />
                        New License Deal
                    </button>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="green-500" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Active Contracts Table */}
                <div className="lg:col-span-8 bg-dark-layer1 border border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Active Contracts</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={14} />
                                <input placeholder="Filter partners..." className="bg-dark-bg/40 border border-white/5 rounded-lg px-10 py-2 text-xs text-white focus:outline-none focus:border-green-500/50" />
                            </div>
                            <button className="p-2 text-dark-muted hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-dark-bg/20">
                                    <th className="text-left px-8 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">Partner & Course</th>
                                    <th className="text-left px-8 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">License Type</th>
                                    <th className="text-left px-8 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">Expiry</th>
                                    <th className="text-right px-8 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {licenses.length > 0 ? licenses.map((l) => (
                                    <tr key={l._id} className="border-t border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="text-white font-bold group-hover:text-green-400 transition-colors uppercase tracking-tight">{l.partnerName}</div>
                                            <div className="text-[10px] text-dark-muted font-bold mt-1 uppercase opacity-60">{l.courseId?.title || 'Unknown Course'}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-xs font-bold text-dark-muted uppercase">{l.type}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-white text-xs font-bold">{new Date(l.expiryDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="text-green-500 font-extrabold">${l.revenue.toLocaleString()}</div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-20 text-dark-muted font-bold uppercase tracking-widest opacity-30">
                                            No licenses found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* License Insights Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-dark-layer1 border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/30 transition-all">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart3 className="text-green-500" size={20} />
                            Market Trends
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'B2B Demand', value: '+12%', color: 'green-500' },
                                { label: 'Avg. Contract Value', value: '$8,400', color: 'blue-500' },
                                { label: 'License Renewal', value: '94%', color: 'green-500' }
                            ].map((trend, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-dark-muted">{trend.label}</span>
                                    <span className={`text-sm font-extrabold text-${trend.color} flex items-center gap-1`}>
                                        {trend.value}
                                        <ArrowUpRight size={14} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20 rounded-3xl p-8">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6">
                            <Shield className="text-green-500" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-4">Enterprise Protection</h3>
                        <p className="text-xs text-dark-muted leading-relaxed mb-6">Quest's intelligent DRM ensures your licensed content is only accessible via authorized domains and verified partner login systems.</p>
                        <button className="text-[10px] font-bold text-green-500 uppercase tracking-widest hover:underline flex items-center gap-2">
                            Review DRM Policies <Copy size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicensingHub;
