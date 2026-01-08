import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const CodePlayground = () => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(`// Welcome to Code Playground!\n// Write your code here and run it\n\nconsole.log("Hello, World!");`);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [snippets, setSnippets] = useState([]);
    const [runCount, setRunCount] = useState(247);
    const editorRef = useRef(null);
    const { addToast } = useToast();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [loadingSnippets, setLoadingSnippets] = useState(false);

    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        try {
            setLoadingSnippets(true);
            const { data } = await api.get('/playground/snippets');
            setSnippets(data);
        } catch (error) {
            console.error('Error fetching snippets:', error);
        } finally {
            setLoadingSnippets(false);
        }
    };

    const handleSaveSnippet = async () => {
        const title = prompt('Enter snippet title:', 'My Code Snippet');
        if (!title) return;

        try {
            await api.post('/playground/snippets', {
                title,
                language,
                code,
                isPublic: false
            });
            addToast('Snippet Synchronized to Personal Vault', 'success');
            fetchSnippets();
        } catch (error) {
            addToast('Synchronisation Failure', 'error');
        }
    };

    const languages = [
        { id: 'javascript', name: 'JavaScript', icon: '🟨' },
        { id: 'python', name: 'Python', icon: '🐍' },
        { id: 'java', name: 'Java', icon: '☕' },
        { id: 'cpp', name: 'C++', icon: '⚙️' },
        { id: 'html', name: 'HTML/CSS', icon: '🌐' }
    ];

    const stats = [
        { label: 'Code Runs', value: runCount },
        { label: 'Saved Snippets', value: snippets.length },
        { label: 'Languages', value: 5 },
        { label: 'Sync Status', value: 'Active', prefix: '' }
    ];

    const runCode = () => {
        setIsRunning(true);
        setOutput('Executing Protocol...');
        setRunCount(prev => prev + 1);

        setTimeout(() => {
            try {
                // Simulate code execution
                const result = `Output:\n${code}\n\n✓ Executed successfully`;
                setOutput(result);
            } catch (error) {
                setOutput(`Error:\n${error.message}`);
            }
            setIsRunning(false);
        }, 1000);
    };

    const resetCode = () => {
        setCode('// Write your code here\n\n');
        setOutput('');
    };

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-dark-bg font-orbit`}>
            {/* Header */}
            <div className="mb-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center">
                            <Code size={28} className="text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Code Playground
                            </h1>
                            <p className="text-dark-muted">
                                Write, run, and share code in real-time
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-3 bg-dark-layer1 hover:bg-dark-layer2 text-white rounded-xl border border-white/5 transition-all"
                        >
                            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                        <button className="p-3 bg-dark-layer1 hover:bg-dark-layer2 text-white rounded-xl border border-white/5 transition-all">
                            <Settings size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            {!isFullscreen && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, idx) => (
                        <StatWidget
                            key={idx}
                            {...stat}
                            icon={idx === 0 ? Play : idx === 1 ? Save : idx === 2 ? Code : Share2}
                            color="green-500"
                            size="sm"
                        />
                    ))}
                </div>
            )}

            {/* Main Editor Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Code Editor */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-dark-layer1 rounded-xl border border-white/5">
                        <div className="flex gap-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setLanguage(lang.id)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${language === lang.id
                                        ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                        : 'bg-dark-layer2 text-dark-muted border border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <span className="mr-2">{lang.icon}</span>
                                    {lang.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={resetCode}
                                className="px-4 py-2 bg-dark-layer2 hover:bg-dark-layer1 text-white rounded-lg font-semibold text-sm transition-all border border-white/5 flex items-center gap-2"
                            >
                                <RotateCcw size={16} />
                                Reset
                            </button>
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isRunning ? <Loader size={16} className="animate-spin" /> : <Play size={16} />}
                                {isRunning ? 'Running...' : 'Run Code'}
                            </button>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="bg-[#1e1e1e] rounded-xl border border-white/5 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                            <span className="text-sm font-mono text-dark-muted">editor.{language}</span>
                            <div className="flex gap-2">
                                <button className="p-1.5 hover:bg-white/5 rounded transition-all">
                                    <Copy size={14} className="text-dark-muted" />
                                </button>
                                <button className="p-1.5 hover:bg-white/5 rounded transition-all">
                                    <Download size={14} className="text-dark-muted" />
                                </button>
                            </div>
                        </div>
                        <textarea
                            ref={editorRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-96 p-6 bg-[#1e1e1e] text-white font-mono text-sm resize-none focus:outline-none"
                            spellCheck="false"
                        />
                    </div>

                    {/* Output Console */}
                    <div className="bg-dark-layer1 rounded-xl border border-white/5 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-dark-layer2 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Terminal size={16} className="text-green-500" />
                                <span className="text-sm font-semibold text-white">Output</span>
                            </div>
                            <button className="text-xs text-dark-muted hover:text-white transition-all">
                                Clear
                            </button>
                        </div>
                        <pre className="p-6 text-sm font-mono text-green-500 min-h-[200px] whitespace-pre-wrap">
                            {output || '// Output will appear here...'}
                        </pre>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Actions */}
                    <div className="bg-dark-layer1 rounded-xl border border-white/5 p-4 space-y-3">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Actions</h3>
                        {[
                            { icon: Save, label: 'Save Snippet', color: 'blue', onClick: handleSaveSnippet },
                            { icon: Share2, label: 'Share Code', color: 'purple', onClick: () => addToast('Pulsing Signal Transmitted', 'info') },
                            { icon: Upload, label: 'Import File', color: 'green', onClick: () => addToast('Neural Link Active', 'info') }
                        ].map((action, idx) => (
                            <button
                                key={idx}
                                onClick={action.onClick}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-dark-layer2 hover:bg-white/5 text-white rounded-lg transition-all border border-white/5"
                            >
                                <action.icon size={18} className={`text-${action.color}-500`} />
                                <span className="text-sm font-semibold">{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Code Snippets */}
                    <div className="bg-dark-layer1 rounded-xl border border-white/5 p-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Snippets</h3>
                        <div className="space-y-2">
                            {snippets.map((snippet) => (
                                <button
                                    key={snippet._id}
                                    onClick={() => {
                                        setCode(snippet.code);
                                        setLanguage(snippet.language);
                                        addToast('Snippet Loaded from Vault', 'success');
                                    }}
                                    className="w-full text-left px-4 py-3 bg-dark-layer2 hover:bg-white/5 rounded-lg transition-all border border-white/5 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileCode size={16} className="text-green-500" />
                                            <div className="overflow-hidden">
                                                <div className="text-sm font-semibold text-white truncate">{snippet.title}</div>
                                                <div className="text-[10px] text-dark-muted uppercase font-bold tracking-widest">{snippet.language}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-dark-muted group-hover:text-green-500 transition-colors">
                                            Load
                                        </span>
                                    </div>
                                </button>
                            ))}
                            {snippets.length === 0 && (
                                <p className="text-xs text-dark-muted text-center py-4">No personal snippets archived</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePlayground;
