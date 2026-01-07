import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Award, Download, CheckCircle } from 'lucide-react';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem('user')).id;
            const { data } = await api.get(`/certificates/user/${userId}`);
            setCertificates(data);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white text-center">Loading certificates...</div>;

    return (
        <div className="space-y-6 md:space-y-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-2xl">
                    <Award size={32} className="text-brand-primary" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">My Certificates</h1>
                    <p className="text-dark-muted font-black uppercase tracking-[0.3em] text-[10px] mt-1">Achievements & Credentials</p>
                </div>
            </div>

            {certificates.length === 0 ? (
                <div className="bg-dark-layer1 p-8 md:p-20 rounded-[2rem] md:rounded-[4rem] border border-dashed border-white/10 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Award size={40} className="text-dark-muted" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic mb-2">No Certificates Yet</h3>
                    <p className="text-dark-muted text-sm font-medium max-w-md">Complete courses and pass assessments to earn your official credentials. Your journey has just begun!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {certificates.map(cert => (
                        <div
                            key={cert._id}
                            className="bg-dark-layer1 border border-white/10 rounded-3xl p-5 md:p-8 hover:border-brand-primary/50 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 md:p-0 md:relative">
                                <CheckCircle size={20} className="text-green-500 md:hidden" />
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-orange-500 flex items-center justify-center shadow-lg shadow-brand-primary/20">
                                        <Award size={24} className="text-white md:w-8 md:h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                                            Certificate
                                        </h3>
                                        <p className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">
                                            Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <CheckCircle size={24} className="text-green-500 hidden md:block" />
                            </div>

                            <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xl md:text-2xl font-black text-white mb-1 leading-none">
                                    {cert.courseId?.title}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[9px] font-black text-dark-muted uppercase tracking-widest">ID:</span>
                                    <span className="text-brand-primary font-mono text-xs font-bold tracking-wider">
                                        {cert.certificateCode}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full bg-white/5 hover:bg-brand-primary hover:text-dark-bg text-white border border-white/10 hover:border-brand-primary py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all">
                                <Download size={16} />
                                Download PDF
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Certificates;
