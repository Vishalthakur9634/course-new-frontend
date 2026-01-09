import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Package, Search, Flame, Loader2, Sparkles, Check, X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';

const BundleManagement = () => {
    const [bundles, setBundles] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        discountPercentage: '10',
        tag: 'NEW BUNDLE',
        bg: 'from-brand-primary to-orange-600',
        thumbnail: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bundleRes, courseRes] = await Promise.all([
                api.get('/mega/bundles/my-bundles'),
                api.get('/instructor/courses')
            ]);
            setBundles(bundleRes.data || []);
            setCourses(courseRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCourse = (courseId) => {
        if (selectedCourses.includes(courseId)) {
            setSelectedCourses(selectedCourses.filter(id => id !== courseId));
        } else {
            setSelectedCourses([...selectedCourses, courseId]);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, thumbnail: response.data.url }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedCourses.length < 2) {
            return alert('Select at least 2 courses to create a bundle');
        }

        const data = {
            ...formData,
            courses: selectedCourses,
            price: Number(formData.price),
            discountPercentage: Number(formData.discountPercentage)
        };

        try {
            await api.post('/mega/bundles', data);
            fetchData();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Bundle creation error:', error);
            alert(error.response?.data?.message || 'Error creating bundle: ' + error.message);
        }
    };

    const handleDelete = async (bundleId) => {
        if (!window.confirm('Are you sure you want to delete this bundle?')) return;
        try {
            await api.delete(`/mega/bundles/${bundleId}`);
            fetchData();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting bundle');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            discountPercentage: '10',
            tag: 'NEW BUNDLE',
            bg: 'from-brand-primary to-orange-600',
            thumbnail: ''
        });
        setSelectedCourses([]);
    };

    if (loading) return <div className="flex items-center justify-center h-96 text-white"><Loader2 className="animate-spin mr-2" /> Loading Bundles...</div>;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 p-6 md:p-8 pb-32">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-gradient-to-r from-brand-primary/10 to-transparent border border-white/5 rounded-[2.5rem]">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Bundle Creator</h1>
                    <p className="text-base text-dark-muted font-medium">Architect multi-course curriculum tracks for advanced student progression.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-primary text-dark-bg font-bold rounded-xl hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/25"
                >
                    <Plus size={22} /> <span className="uppercase tracking-wider text-sm">Create New Bundle</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bundles.map((bundle) => (
                    <div key={bundle._id} className="group bg-[#141414] border border-white/5 rounded-[2rem] overflow-hidden hover:border-brand-primary/30 transition-all shadow-xl hover:shadow-2xl">
                        <div className="h-48 relative overflow-hidden">
                            {bundle.thumbnail ? (
                                <img src={bundle.thumbnail} alt={bundle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${bundle.bg} flex items-center justify-center`}>
                                    <Package size={48} className="text-white/50" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10">
                                {bundle.courses.length} Courses
                            </div>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col gap-6">
                            <div className="space-y-4 flex-1">
                                <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 min-h-[3.5rem]">{bundle.title}</h3>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {bundle.courses.slice(0, 3).map(c => (
                                            <span key={c._id} className="text-[10px] font-bold bg-white/5 px-2.5 py-1.5 rounded-md text-dark-muted border border-white/5 line-clamp-1 max-w-[150px]">{c.title}</span>
                                        ))}
                                        {bundle.courses.length > 3 && (
                                            <span className="text-[10px] font-bold bg-brand-primary/10 px-2.5 py-1.5 rounded-md text-brand-primary border border-brand-primary/20">+{bundle.courses.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-end justify-between pt-4 border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-dark-muted uppercase tracking-wider">Total Value</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-black text-white">${bundle.price}</span>
                                        {bundle.discountPercentage > 0 && <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded uppercase tracking-wider">-{bundle.discountPercentage}% OFF</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(bundle._id)}
                                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                                    title="Delete Bundle"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {bundles.length === 0 && !loading && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-dark-muted"><Package size={40} /></div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">No Bundles Configured</h3>
                            <p className="text-dark-muted max-w-sm mx-auto">Create your first course bundle to start determining custom learning paths.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Bundle Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[#0f0f0f] border border-white/10 w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[2.5rem] flex flex-col shadow-2xl shadow-black/80">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#141414]">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Configure New Bundle</h2>
                                <p className="text-sm text-dark-muted mt-1">Set parameters for a new learning track</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full text-dark-muted transition-colors"><X size={24} /></button>
                        </div>

                        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left Column: Basic Info & Image */}
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                            Bundle Thumbnail <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="h-64 rounded-2xl border-2 border-dashed border-white/10 bg-[#141414] overflow-hidden flex flex-col items-center justify-center relative hover:border-brand-primary/40 transition-colors">
                                                {formData.thumbnail ? (
                                                    <>
                                                        <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <p className="text-white font-bold text-sm">Click to Change</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center space-y-3 p-4">
                                                        <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-dark-muted group-hover:text-brand-primary transition-colors">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                        <p className="text-dark-muted text-sm font-medium">Click to upload 16:9 thumbnail</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl z-20">
                                                    <Loader2 className="animate-spin text-brand-primary" size={32} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em]">Bundle Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-[#181818] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-primary/50 focus:bg-[#1f1f1f] transition-all text-sm font-medium placeholder:text-white/20"
                                            placeholder="e.g. Advanced System Architecture Track"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em]">Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-[#181818] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-primary/50 focus:bg-[#1f1f1f] transition-all h-32 text-sm font-medium placeholder:text-white/20 leading-relaxed resize-none"
                                            placeholder="Describe the value proposition of this bundle..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em]">Price ($)</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-muted font-bold">$</span>
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full bg-[#181818] border border-white/5 rounded-xl pl-10 pr-5 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em]">Discount (%)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.discountPercentage}
                                                    onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })}
                                                    className="w-full bg-[#181818] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
                                                />
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-muted font-bold">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Course Selection */}
                                <div className="lg:col-span-5 flex flex-col h-full">
                                    <div className="space-y-4 flex-1 flex flex-col min-h-0">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em]">Select Courses</label>
                                            <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md">{selectedCourses.length} Selected</span>
                                        </div>

                                        <div className="flex-1 overflow-y-scroll custom-scrollbar pr-2 space-y-3 bg-[#141414] border border-white/5 rounded-2xl p-4">
                                            {courses.map(course => (
                                                <div
                                                    key={course._id}
                                                    onClick={() => toggleCourse(course._id)}
                                                    className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border ${selectedCourses.includes(course._id)
                                                            ? 'bg-brand-primary/10 border-brand-primary/40'
                                                            : 'bg-transparent border-transparent hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${selectedCourses.includes(course._id) ? 'bg-brand-primary text-dark-bg' : 'bg-white/5 text-dark-muted'
                                                        }`}>
                                                        {selectedCourses.includes(course._id) ? <Check size={18} strokeWidth={3} /> : <div className="w-10 h-10 bg-gray-800 animate-pulse rounded" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-bold line-clamp-1 ${selectedCourses.includes(course._id) ? 'text-white' : 'text-dark-muted'}`}>{course.title}</p>
                                                        <p className="text-[10px] text-dark-muted opacity-60">${course.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {courses.length === 0 && (
                                                <div className="py-10 text-center text-dark-muted text-sm px-4">
                                                    No available courses to bundle. Create courses first.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-8 mt-auto">
                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-brand-primary text-dark-bg font-black rounded-xl hover:bg-brand-hover shadow-xl shadow-brand-primary/20 transition-all uppercase tracking-[0.2em] transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Publish Bundle
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BundleManagement;
