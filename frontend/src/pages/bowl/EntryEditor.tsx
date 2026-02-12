import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useBowl } from '../../context/BowlContext';
import {
    bowlGetEntry, bowlUpdateExample, bowlUpdateExplanation,
    bowlUpdateArticle, bowlAdvance, bowlPublish, bowlUnpublish,
    type SoupEntryData,
} from '../../api/bowlClient';

type EditorTab = 'example' | 'explanation' | 'article';

const STATUS_ORDER = ['DRAFT_EXAMPLE', 'DRAFT_EXPLANATION', 'DRAFT_ARTICLE', 'PUBLISHED'];

export default function EntryEditor() {
    const { id } = useParams<{ id: string }>();
    const { password, isAuthenticated } = useBowl();
    const navigate = useNavigate();

    const [entry, setEntry] = useState<SoupEntryData | null>(null);
    const [activeTab, setActiveTab] = useState<EditorTab>('example');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Example fields
    const [description, setDescription] = useState('');
    const [starterCode, setStarterCode] = useState('');
    const [testsCode, setTestsCode] = useState('');
    const [simulationCode, setSimulationCode] = useState('');

    // Explanation fields
    const [assumption, setAssumption] = useState('');
    const [invariant, setInvariant] = useState('');
    const [machineBehavior, setMachineBehavior] = useState('');

    // Article
    const [articleContent, setArticleContent] = useState('');

    useEffect(() => {
        if (!isAuthenticated) { navigate('/bowl'); return; }
        if (!id) return;
        loadEntry();
    }, [id, isAuthenticated]);

    const loadEntry = async () => {
        try {
            const data = await bowlGetEntry(password, id!);
            setEntry(data);
            setDescription(data.exampleDescription || '');
            setStarterCode(data.exampleStarterCode || '');
            setTestsCode(data.exampleTestsCode || '');
            setSimulationCode(data.exampleSimulationCode || '');
            setAssumption(data.explanationAssumption || '');
            setInvariant(data.explanationInvariant || '');
            setMachineBehavior(data.explanationMachineBehavior || '');
            setArticleContent(data.articleContent || '');

            // Set active tab to current phase
            if (data.status === 'DRAFT_EXAMPLE') setActiveTab('example');
            else if (data.status === 'DRAFT_EXPLANATION') setActiveTab('explanation');
            else setActiveTab('article');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const flash = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 2000);
    };

    const isTabUnlocked = (tab: EditorTab): boolean => {
        if (!entry) return false;
        const idx = STATUS_ORDER.indexOf(entry.status);
        if (tab === 'example') return true;
        if (tab === 'explanation') return idx >= 1;
        if (tab === 'article') return idx >= 2;
        return false;
    };

    const handleSaveExample = async () => {
        setSaving(true);
        setError('');
        try {
            const updated = await bowlUpdateExample(password, id!, {
                description, starterCode, testsCode, simulationCode,
            });
            setEntry(updated);
            flash('Example saved');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
        setSaving(false);
    };

    const handleSaveExplanation = async () => {
        setSaving(true);
        setError('');
        try {
            const updated = await bowlUpdateExplanation(password, id!, {
                assumption, invariant, machineBehavior,
            });
            setEntry(updated);
            flash('Explanation saved');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
        setSaving(false);
    };

    const handleSaveArticle = async () => {
        setSaving(true);
        setError('');
        try {
            const updated = await bowlUpdateArticle(password, id!, articleContent);
            setEntry(updated);
            flash('Article saved');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
        setSaving(false);
    };

    const handleAdvance = async () => {
        setError('');
        try {
            const updated = await bowlAdvance(password, id!);
            setEntry(updated);
            flash('Advanced to next phase');
            if (updated.status === 'DRAFT_EXPLANATION') setActiveTab('explanation');
            else if (updated.status === 'DRAFT_ARTICLE') setActiveTab('article');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const handlePublish = async () => {
        setError('');
        try {
            const updated = await bowlPublish(password, id!);
            setEntry(updated);
            flash('Published!');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const handleUnpublish = async () => {
        setError('');
        try {
            const updated = await bowlUnpublish(password, id!);
            setEntry(updated);
            flash('Unpublished');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    if (!entry) {
        return <div className="loading">Loading entry...</div>;
    }

    return (
        <div className="bowl-editor fade-in">
            {/* Header */}
            <div className="bowl-editor-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-ghost" onClick={() => navigate('/bowl/entries')}>← Back</button>
                    <h2 style={{ margin: 0 }}>{entry.title}</h2>
                    <span className="bowl-status-badge" style={{
                        color: entry.status === 'PUBLISHED' ? 'var(--accent-green)' : 'var(--accent-amber)',
                    }}>
                        {entry.status.replace('DRAFT_', '').toLowerCase()}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {message && <span style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{message}</span>}
                    {error && <span style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{error}</span>}
                </div>
            </div>

            {/* Tabs */}
            <div className="bowl-editor-tabs">
                {(['example', 'explanation', 'article'] as EditorTab[]).map(tab => (
                    <button
                        key={tab}
                        className={`workbench-tab ${activeTab === tab ? 'active' : ''} ${!isTabUnlocked(tab) ? 'locked' : ''}`}
                        onClick={() => isTabUnlocked(tab) && setActiveTab(tab)}
                        disabled={!isTabUnlocked(tab)}
                    >
                        {tab === 'example' && '① Example'}
                        {tab === 'explanation' && '② Explanation'}
                        {tab === 'article' && '③ Article'}
                        {!isTabUnlocked(tab) && ' 🔒'}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bowl-editor-content">
                {/* EXAMPLE TAB */}
                {activeTab === 'example' && (
                    <div className="bowl-phase-panel">
                        <div className="bowl-field-group">
                            <label>Task Description (Markdown)</label>
                            <textarea
                                className="bowl-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={8}
                                placeholder="Describe the coding task..."
                            />
                        </div>

                        <div className="bowl-field-group">
                            <label>Starter Code (JavaScript)</label>
                            <div style={{ height: '250px', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                                <Editor
                                    height="100%"
                                    defaultLanguage="javascript"
                                    value={starterCode}
                                    onChange={(val) => setStarterCode(val || '')}
                                    theme="vs-dark"
                                    options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 } }}
                                />
                            </div>
                        </div>

                        <div className="bowl-field-group">
                            <label>Tests Code (JS function body — receives <code>userCode</code>, returns TestResult[])</label>
                            <div style={{ height: '250px', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                                <Editor
                                    height="100%"
                                    defaultLanguage="javascript"
                                    value={testsCode}
                                    onChange={(val) => setTestsCode(val || '')}
                                    theme="vs-dark"
                                    options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 } }}
                                />
                            </div>
                        </div>

                        <div className="bowl-field-group">
                            <label>Simulation Code (JS function body — receives <code>userCode</code>, returns SimulationResult)</label>
                            <div style={{ height: '250px', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                                <Editor
                                    height="100%"
                                    defaultLanguage="javascript"
                                    value={simulationCode}
                                    onChange={(val) => setSimulationCode(val || '')}
                                    theme="vs-dark"
                                    options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 } }}
                                />
                            </div>
                        </div>

                        <div className="bowl-actions">
                            <button className="btn btn-primary" onClick={handleSaveExample} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Example'}
                            </button>
                            {entry.status === 'DRAFT_EXAMPLE' && (
                                <button className="btn btn-success" onClick={handleAdvance}>
                                    Advance to Explanation →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* EXPLANATION TAB */}
                {activeTab === 'explanation' && (
                    <div className="bowl-phase-panel">
                        <div className="bowl-field-group">
                            <label>The Assumption — What the user assumed was true</label>
                            <textarea
                                className="bowl-textarea"
                                value={assumption}
                                onChange={(e) => setAssumption(e.target.value)}
                                rows={4}
                                placeholder="You assumed that..."
                            />
                        </div>

                        <div className="bowl-field-group">
                            <label>The Broken Invariant — What property was violated</label>
                            <textarea
                                className="bowl-textarea"
                                value={invariant}
                                onChange={(e) => setInvariant(e.target.value)}
                                rows={4}
                                placeholder="The invariant that broke was..."
                            />
                        </div>

                        <div className="bowl-field-group">
                            <label>What The Machine Did — The technical reality</label>
                            <textarea
                                className="bowl-textarea"
                                value={machineBehavior}
                                onChange={(e) => setMachineBehavior(e.target.value)}
                                rows={4}
                                placeholder="What actually happened was..."
                            />
                        </div>

                        <div className="bowl-actions">
                            <button className="btn btn-primary" onClick={handleSaveExplanation} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Explanation'}
                            </button>
                            {entry.status === 'DRAFT_EXPLANATION' && (
                                <button className="btn btn-success" onClick={handleAdvance}>
                                    Advance to Article →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ARTICLE TAB */}
                {activeTab === 'article' && (
                    <div className="bowl-phase-panel">
                        <div className="bowl-field-group">
                            <label>Article Content (Markdown) — optional, the deeper story</label>
                            <textarea
                                className="bowl-textarea bowl-textarea-large"
                                value={articleContent}
                                onChange={(e) => setArticleContent(e.target.value)}
                                rows={20}
                                placeholder="The philosophical writing, postmortem, deeper context..."
                            />
                        </div>

                        <div className="bowl-actions">
                            <button className="btn btn-primary" onClick={handleSaveArticle} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Article'}
                            </button>
                            {entry.status === 'DRAFT_ARTICLE' && (
                                <button className="btn btn-success" onClick={handlePublish}>
                                    🚀 Publish
                                </button>
                            )}
                            {entry.status === 'PUBLISHED' && (
                                <button className="btn btn-ghost" onClick={handleUnpublish}>
                                    Unpublish
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
