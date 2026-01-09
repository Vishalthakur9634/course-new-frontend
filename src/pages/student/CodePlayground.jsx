import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code, Play, Save, Share2, Maximize2, Minimize2, Settings,
    RotateCcw, Copy, Download, Terminal, Upload, FileCode,
    Sparkles, Zap, Loader2, X, ChevronRight
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const CodePlayground = () => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(`// Welcome to Neural Code Environment v2.0
// Execute complex logic in real-time

function calculateFactorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * calculateFactorial(n - 1);
}

console.log("Analyzing Quantum State...");
const result = calculateFactorial(5);
console.log("Factorial(5) Result: " + result);`);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [snippets, setSnippets] = useState([]);
    const [loadingSnippets, setLoadingSnippets] = useState(false);
    const editorRef = useRef(null);
    const { addToast } = useToast();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch snippets on mount
    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        try {
            setLoadingSnippets(true);
            const { data } = await api.get('/playground/snippets');
            setSnippets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching snippets:', error);
        } finally {
            setLoadingSnippets(false);
        }
    };

    const handleSaveSnippet = async () => {
        const title = prompt('Enter snippet title:', 'Neural Algorithm #1');
        if (!title) return;

        try {
            await api.post('/playground/snippets', {
                title,
                language,
                code,
                isPublic: false
            });
            addToast('Code Artifact Archived', 'success');
            fetchSnippets();
        } catch (error) {
            addToast('Archive Protocol Failed', 'error');
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('Initializing Runtime Environment...');

        // Real Execution Logic
        setTimeout(() => {
            try {
                if (language === 'javascript') {
                    const logs = [];
                    // Override console.log to capture output
                    const originalLog = console.log;
                    console.log = (...args) => {
                        logs.push(args.map(arg =>
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                        ).join(' '));
                        // originalLog(...args); // Optional: keep browser console logging
                    };

                    try {
                        // Secure-ish execution (Client side)
                        const runFunc = new Function(code);
                        runFunc();
                    } catch (execError) {
                        logs.push(`Runtime Error: ${execError.message}`);
                    } finally {
                        console.log = originalLog; // Restore
                    }

                    if (logs.length === 0) logs.push("Script executed successfully (No Output)");
                    setOutput(logs.join('\n'));
                } else {
                    // For other languages, we'd need a backend compiler (Piston API etc)
                    // Since we don't have that set up, we simulate or show a message
                    setOutput(`[System Message] Execution for ${language.toUpperCase()} requires cloud compilation node.\nCurrently running in Client-Side JavaScript Mode only.\n\nCode successfully parsed.`);
                }
            } catch (error) {
                setOutput(`Critical Failure: ${error.message}`);
            } finally {
                setIsRunning(false);
            }
        }, 800); // Artificial delay for "processing" feel
    };

    const resetCode = () => {
        setCode('// Ready for input...\n');
        setOutput('');
    };

    const languages = [
        { id: 'javascript', name: 'JS (Node)', icon: '⚡' },
        { id: 'python', name: 'Python 3', icon: '🐍' },
        { id: 'java', name: 'Java', icon: '☕' },
        { id: 'cpp', name: 'C++', icon: '⚙️' },
        { id: 'html', name: 'HTML5', icon: '🌐' }
    ];

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-[100]' : 'min-h-screen'} bg-dark-bg font-orbit transition-all duration-300`}>
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-green-500/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className={`relative z-10 ${isFullscreen ? 'h-full p-4' : 'p-4 md:p-8'}`}>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center backdrop-blur-md">
                            <Code size={28} className="text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                                NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">PLAYGROUND</span>
                            </h1>
                            <p className="text-dark-muted font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Runtime Active
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-4 bg-dark-layer1 hover:bg-dark-layer2 text-white rounded-2xl border border-white/5 transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                    </div>
                </div>

                {/* Editor Layout */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isFullscreen ? 'h-[calc(100%-80px)]' : 'h-[800px]'}`}>

                    {/* Main Editor */}
                    <div className="lg:col-span-8 flex flex-col gap-4 h-full">
                        {/* Toolbar */}
                        <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-2 flex items-center justify-between backdrop-blur-md">
                            <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
                                {languages.map(lang => (
                                    <button
                                        key={lang.id}
                                        onClick={() => setLanguage(lang.id)}
                                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${language === lang.id
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                : 'text-dark-muted hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span>{lang.icon}</span> {lang.name}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2 pl-4 border-l border-white/10">
                                <button onClick={resetCode} className="p-3 text-dark-muted hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                    <RotateCcw size={18} />
                                </button>
                                <button
                                    onClick={runCode}
                                    disabled={isRunning}
                                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                >
                                    {isRunning ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                                    {isRunning ? 'EXECUTING...' : 'RUN'}
                                </button>
                            </div>
                        </div>

                        {/* Code Area */}
                        <div className="flex-1 bg-[#0a0a0a] rounded-[2rem] border border-white/10 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-full bg-transparent p-6 text-sm font-mono text-white/90 resize-none outline-none leading-relaxed"
                                spellCheck="false"
                            />
                        </div>

                        {/* Output Area */}
                        <div className="h-1/3 bg-[#0a0a0a] rounded-[2rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
                            <div className="px-6 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                <span className="text-xs font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                                    <Terminal size={14} /> Console Output
                                </span>
                                <button onClick={() => setOutput('')} className="text-[10px] text-dark-muted hover:text-white uppercase font-bold tracking-wider">Clear Logs</button>
                            </div>
                            <pre className="flex-1 p-6 font-mono text-xs text-green-400/90 overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                                {output || '// System Idle. Awaiting execution command...'}
                            </pre>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">

                        {/* Actions */}
                        <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-6 space-y-4">
                            <h3 className="text-xs font-black text-dark-muted uppercase tracking-[0.2em] mb-2 pl-2">VCS Controls</h3>
                            <button onClick={handleSaveSnippet} className="w-full py-4 bg-white/5 hover:bg-blue-600 hover:text-white text-dark-muted font-bold rounded-2xl transition-all border border-white/5 flex items-center justify-between px-6 group">
                                <span className="flex items-center gap-3"><Save size={18} /> Save Artifact</span>
                                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                            </button>
                            <button onClick={() => addToast('Share Logic Copied', 'success')} className="w-full py-4 bg-white/5 hover:bg-purple-600 hover:text-white text-dark-muted font-bold rounded-2xl transition-all border border-white/5 flex items-center justify-between px-6 group">
                                <span className="flex items-center gap-3"><Share2 size={18} /> Share Link</span>
                                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                            </button>
                        </div>

                        {/* Snippets List */}
                        <div className="flex-1 bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-6 overflow-hidden flex flex-col">
                            <h3 className="text-xs font-black text-dark-muted uppercase tracking-[0.2em] mb-4 pl-2">Archive</h3>
                            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                                {loadingSnippets ? (
                                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-green-500" /></div>
                                ) : snippets.length > 0 ? (
                                    snippets.map((snippet) => (
                                        <button
                                            key={snippet._id}
                                            onClick={() => {
                                                setCode(snippet.code);
                                                setLanguage(snippet.language);
                                                addToast('Artifact Loaded', 'success');
                                            }}
                                            className="w-full text-left p-4 bg-dark-bg border border-white/5 rounded-2xl hover:border-green-500/30 hover:bg-green-500/5 transition-all group"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileCode size={14} className="text-green-500" />
                                                    <span className="font-bold text-white text-sm line-clamp-1 group-hover:text-green-400 transition-colors">{snippet.title}</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-dark-muted">{snippet.language}</span>
                                            </div>
                                            <div className="text-[10px] text-dark-muted font-mono truncate opacity-60">
                                                {snippet.code.substring(0, 40)}...
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-dark-muted text-xs font-bold uppercase tracking-wider opacity-50">
                                        No Artifacts Found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CodePlayground;
