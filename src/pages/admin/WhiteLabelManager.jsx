import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Layout, Palette, Globe, Shield, Code, Settings,
    Save, Eye, RefreshCw, Upload, Image as ImageIcon,
    Type, Database, Lock, Terminal
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const WhiteLabelManager = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedTab, setSelectedTab] = useState('branding');
    const { addToast } = useToast();

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const { data } = await api.get('/whitelabel');
            setConfig(data);
        } catch (error) {
            console.error('Error fetching whitelabel config:', error);
            addToast('Failed to load configuration', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data } = await api.put('/whitelabel', config);
            setConfig(data);
            addToast('Configuration saved successfully', 'success');
        } catch (error) {
            console.error('Error saving config:', error);
            addToast('Failed to save configuration', 'error');
        } finally {
            setSaving(false);
        }
    };

    const stats = [
        { label: 'Active Clients', value: 12, icon: Globe },
        { label: 'API Calls', value: 450, suffix: 'k', icon: Code },
        { label: 'Uptime', value: 99.9, suffix: '%', icon: Shield },
        { label: 'Revenue Share', value: 15600, prefix: '$', icon: Database }
    ];

    const menuItems = [
        { id: 'branding', label: 'Branding & Theme', icon: Palette },
        { id: 'domain', label: 'Domain & SSL', icon: Globe },
        { id: 'integrations', label: 'API & Webhooks', icon: Code },
        { id: 'security', label: 'Access Control', icon: Lock }
    ];

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                <Layout className="text-indigo-500" size={24} />
                            </div>
                            White-Label Hub
                        </h1>
                        <p className="text-dark-muted">Configure enterprise-grade branding and platform styling</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-dark-layer1 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center gap-2">
                            <Eye size={20} />
                            Preview Portal
                        </button>
                        <button
                            disabled={saving}
                            onClick={handleSave}
                            className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? 'Saving...' : 'Save Config'}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="indigo-500" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Sidebar */}
                <div className="lg:col-span-3 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all border ${selectedTab === item.id
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-lg'
                                : 'text-dark-muted border-transparent hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-3">
                            <Terminal size={14} />
                            System Log
                        </div>
                        <p className="text-[10px] text-dark-muted leading-relaxed font-mono">
                            [{new Date().toLocaleTimeString()}] Config session active...<br />
                            [Status] Ready for deployment.
                        </p>
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="lg:col-span-9 bg-dark-layer1 border border-white/5 rounded-3xl overflow-hidden min-h-[500px]">
                    {selectedTab === 'branding' && (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <Palette className="text-indigo-500" />
                                Branding Identity
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-4">Platform Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 outline-none"
                                            value={config.platformName || ''}
                                            onChange={(e) => setConfig({ ...config, platformName: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-4">Platform Logo</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-dark-muted group hover:border-indigo-500/50 cursor-pointer transition-all">
                                                {config.logo ? <img src={config.logo} alt="Logo" className="w-full h-full object-contain p-2" /> : <ImageIcon size={24} className="mb-2" />}
                                                {!config.logo && <span className="text-[10px] font-bold">1024x1024</span>}
                                            </div>
                                            <div className="flex-1">
                                                <button className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                                                    <Upload size={14} />
                                                    Upload New
                                                </button>
                                                <p className="text-[10px] text-dark-muted mt-2">Preferred formats: SVG, Transparent PNG. Max 2MB.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-4">Brand Color</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="color"
                                                className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                                                value={config.primaryColor || '#6366f1'}
                                                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 bg-dark-bg/40 border border-white/5 rounded-xl px-4 py-3 text-white font-mono uppercase"
                                                value={config.primaryColor || '#6366f1'}
                                                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-4">Typography</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setConfig({ ...config, fontFamily: 'Orbit' })}
                                                className={`p-4 bg-dark-bg/40 border rounded-xl text-left ${config.fontFamily === 'Orbit' ? 'border-indigo-500/50' : 'border-white/5'}`}
                                            >
                                                <Type size={16} className={`${config.fontFamily === 'Orbit' ? 'text-indigo-500' : 'text-dark-muted'} mb-2`} />
                                                <div className={`text-sm font-bold ${config.fontFamily === 'Orbit' ? 'text-white' : 'text-dark-muted'}`}>Orbit (Default)</div>
                                            </button>
                                            <button
                                                onClick={() => setConfig({ ...config, fontFamily: 'Inter' })}
                                                className={`p-4 bg-dark-bg/40 border rounded-xl text-left ${config.fontFamily === 'Inter' ? 'border-indigo-500/50' : 'border-white/5'}`}
                                            >
                                                <Type size={16} className={`${config.fontFamily === 'Inter' ? 'text-indigo-500' : 'text-dark-muted'} mb-2`} />
                                                <div className={`text-sm font-bold ${config.fontFamily === 'Inter' ? 'text-white' : 'text-dark-muted'}`}>Inter</div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'domain' && (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <Globe className="text-indigo-500" />
                                Domain Configuration
                            </h2>
                            <div className="space-y-6 max-w-2xl">
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-4">Custom Subdomain</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 bg-dark-bg/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 outline-none"
                                            placeholder="enterprise-name"
                                            value={config.customDomain || ''}
                                            onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
                                        />
                                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-dark-muted font-bold self-center">.quest-platform.io</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                        <Lock size={14} className="text-indigo-500" />
                                        Automatic SSL
                                    </h4>
                                    <p className="text-xs text-dark-muted leading-relaxed">Once you connect a custom domain, we'll automatically provision and manage an Let's Encrypt SSL certificate for you.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WhiteLabelManager;
