import React from 'react';
import { Search, HelpCircle, Book, Shield, DollarSign, MessageSquare, ExternalLink, ChevronRight, Mail, LifeBuoy } from 'lucide-react';

const HelpCenter = () => {
    const categories = [
        { icon: Book, title: 'Courses & Learning', desc: 'Enrolling, accessing content, and progress tracking.' },
        { icon: DollarSign, title: 'Billing & Subscriptions', desc: 'Manage payments, refunds, and invoice history.' },
        { icon: Shield, title: 'Account Security', desc: '2FA setup, password management, and data privacy.' },
        { icon: MessageSquare, title: 'Community & Guidelines', desc: 'Forum rules, interaction standards, and moderation.' },
    ];

    const faqs = [
        "How do I request a refund?",
        "Can I download course videos for offline viewing?",
        "How do I become an instructor on Orbit?",
        "Are the certificates recognized by employers?",
        "How do I update my email address?"
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-16 md:space-y-24 py-12 md:py-20 px-6 font-inter text-white pb-40">
            {/* Hero Section */}
            <header className="relative text-center space-y-8 py-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

                <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-orange-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-primary/30 rotate-3 hover:rotate-0 transition-all duration-500">
                    <LifeBuoy className="text-white" size={48} />
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">
                        How can we <span className="text-brand-primary">help?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-dark-muted font-medium">Search our knowledge base or browse categories below.</p>
                </div>

                <div className="max-w-2xl mx-auto relative group z-20">
                    <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-brand-primary transition-colors pointer-events-none" size={24} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full bg-[#141414] border border-white/10 group-hover:border-brand-primary/50 text-white rounded-full py-6 pl-20 pr-8 text-lg focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-2xl placeholder:text-dark-muted/50"
                    />
                </div>
            </header>

            {/* Categories Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat, i) => (
                    <div key={i} className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 hover:border-brand-primary/30 hover:bg-[#141414] transition-all duration-300 cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronRight className="text-brand-primary" size={32} />
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300 shadow-lg">
                                <cat.icon className="text-dark-muted group-hover:text-black transition-colors" size={32} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-white tracking-tight">{cat.title}</h3>
                                <p className="text-dark-muted font-medium leading-relaxed max-w-xs">{cat.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* FAQ Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-[#141414] border border-white/5 rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
                <div className="lg:col-span-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-brand-primary text-xs font-bold uppercase tracking-widest border border-white/5">
                        <HelpCircle size={14} /> FAQ
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Common <br /> Questions</h2>
                    <p className="text-dark-muted font-medium">Quick answers to the most frequent inquiries from our community.</p>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 gap-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer p-6 rounded-2xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            <span className="text-lg text-dark-muted group-hover:text-white font-bold transition-colors">{faq}</span>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 transition-all">
                                <ExternalLink size={14} className="text-dark-muted group-hover:text-brand-primary transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support CTA */}
            <footer className="relative bg-gradient-to-br from-brand-primary to-orange-600 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[0.95]">Still need assistance?</h3>
                    <p className="text-white/80 text-lg font-medium leading-relaxed">If you couldn't find the answer in our help center, our dedicated support team is ready to assist you personally.</p>
                    <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-sm transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto uppercase tracking-widest hover:bg-black hover:text-white">
                        <Mail size={20} /> Contact Support Team
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default HelpCenter;
