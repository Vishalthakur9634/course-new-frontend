import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4">
                    <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(255,50,50,0.1)] text-center space-y-6 relative overflow-hidden">

                        {/* Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20"
                        >
                            <AlertTriangle size={40} className="text-red-500" />
                        </motion.div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-wider text-white">System Malfunction</h2>
                            <p className="text-dark-muted text-sm font-medium">
                                A critical error has occurred in the neural network.
                            </p>
                            {this.state.error && (
                                <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-left overflow-hidden">
                                    <p className="text-[10px] font-mono text-red-400 break-words">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={this.handleReload}
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Reboot System
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10"
                            >
                                <Home size={18} />
                                Return to Base
                            </button>
                        </div>

                        <div className="text-[10px] text-dark-muted uppercase tracking-widest pt-4 opacity-50">
                            Error Code: 500_INTERNAL_UI_FAILURE
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
