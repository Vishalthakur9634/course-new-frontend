import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Smartphone, QrCode, Download, Bell,
    RefreshCw, Smartphone as MobileIcon,
    CheckCircle, CloudOff, Settings
} from 'lucide-react';
import StatWidget from '../components/StatWidget';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const MobileAppSync = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const { data } = await api.get('/mobile');
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
            addToast('Failed to load devices', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDevice = async (id) => {
        try {
            await api.delete(`/mobile/${id}`);
            setDevices(devices.filter(d => d._id !== id));
            addToast('Device removed', 'success');
        } catch (error) {
            addToast('Failed to remove device', 'error');
        }
    };

    const stats = [
        { label: 'Synced Devices', value: devices.length, icon: MobileIcon },
        { label: 'Offline Courses', value: 3, icon: CloudOff }, // Partially mock for now
        { label: 'Storage Used', value: 1.2, suffix: 'GB', icon: RefreshCw },
        { label: 'Push Tokens', value: devices.filter(d => d.pushToken).length, icon: Bell }
    ];

    if (loading && devices.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <Smartphone className="text-blue-500" size={24} />
                            </div>
                            Mobile App Sync
                        </h1>
                        <p className="text-dark-muted">Manage your companion app and offline learning content</p>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="blue-500" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* QR Code & Pairing */}
                <div className="lg:col-span-2 bg-dark-layer1 border border-white/5 rounded-3xl p-8">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex flex-col items-center">
                            <div className="p-6 bg-white rounded-3xl mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                <QrCode size={180} className="text-dark-bg" />
                            </div>
                            <span className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">Scan with Quest App</span>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-4">Pair Your Device</h2>
                            <p className="text-dark-muted mb-8 leading-relaxed">Download the Quest companion app and scan this QR code to instantly sync your progress, courses, and certificates.</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-dark-muted">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-[10px]">1</div>
                                    Install app from App Store or Play Store
                                </div>
                                <div className="flex items-center gap-3 text-sm text-dark-muted">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-[10px]">2</div>
                                    Navigate to Profile {'>'} Device Sync
                                </div>
                                <div className="flex items-center gap-3 text-sm text-dark-muted">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-[10px]">3</div>
                                    Scan the code on the left
                                </div>
                            </div>

                            <button className="px-8 py-3 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-2 group">
                                Generate New Code
                                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Linked Devices */}
                <div className="bg-dark-layer1 border border-white/5 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Linked Devices</h2>
                    <div className="space-y-4">
                        {devices.map((device) => (
                            <div key={device._id} className="bg-dark-bg/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-dark-muted'}`} />
                                    <div>
                                        <div className="text-sm font-bold text-white">{device.deviceName}</div>
                                        <div className="text-[10px] text-dark-muted font-bold uppercase">{new Date(device.lastActive).toLocaleString()}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveDevice(device._id)}
                                    className="p-2 text-dark-muted hover:text-red-500 transition-colors"
                                >
                                    <Settings size={14} />
                                </button>
                            </div>
                        ))}
                        {devices.length === 0 && (
                            <div className="text-center py-8 text-dark-muted text-xs font-bold uppercase opacity-30">No devices synced</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileAppSync;
