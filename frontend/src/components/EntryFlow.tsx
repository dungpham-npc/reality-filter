import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { runDynamicTests, runDynamicSimulation, type TestResult, type SimulationLog } from '../engine/dynamicRunner';
import type { SoupEntryData } from '../api/bowlClient';

type EntryStep = 'coding' | 'simulation' | 'explanation';

interface EntryFlowProps {
    entry: SoupEntryData;
    onBack: () => void;
}

export default function EntryFlow({ entry, onBack }: EntryFlowProps) {
    const [code, setCode] = useState(entry.exampleStarterCode || '');
    const [step, setStep] = useState<EntryStep>('coding');
    const [testResults, setTestResults] = useState<TestResult[] | null>(null);
    const [allPassed, setAllPassed] = useState(false);
    const [simLogs, setSimLogs] = useState<SimulationLog[]>([]);
    const [simSummary, setSimSummary] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [showArticle, setShowArticle] = useState(false);

    const handleRunTests = () => {
        if (!entry.exampleTestsCode) return;
        const results = runDynamicTests(code, entry.exampleTestsCode);
        setTestResults(results);
        setAllPassed(results.every(r => r.passed));
    };

    const handleSimulate = useCallback(async () => {
        if (!entry.exampleSimulationCode) return;
        setIsSimulating(true);
        setSimLogs([]);
        setSimSummary('');

        const result = await runDynamicSimulation(code, entry.exampleSimulationCode);

        for (let i = 0; i < result.logs.length; i++) {
            await new Promise(r => setTimeout(r, 60));
            setSimLogs(prev => [...prev, result.logs[i]]);
        }

        setSimSummary(result.summary);
        setIsSimulating(false);
        setStep('simulation');
    }, [code, entry.exampleSimulationCode]);

    const handleSeeExplanation = () => setStep('explanation');

    const handleReset = () => {
        setCode(entry.exampleStarterCode || '');
        setStep('coding');
        setTestResults(null);
        setAllPassed(false);
        setSimLogs([]);
        setSimSummary('');
    };

    return (
        <div className="entry-flow fade-in">
            {/* Back button */}
            <div className="entry-flow-nav">
                <button className="btn btn-ghost" onClick={onBack}>← Back</button>
                <h2>{entry.title}</h2>
            </div>

            {/* Main content */}
            <div className="entry-flow-main">
                <div className="entry-flow-left">
                    {/* Task description */}
                    <div className="task-panel">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {entry.exampleDescription || ''}
                        </ReactMarkdown>
                    </div>

                    {/* Test results */}
                    {testResults && (
                        <div className="test-results" style={{ marginTop: '1rem' }}>
                            <h3 style={{ marginBottom: '0.75rem' }}>Test Results</h3>
                            {testResults.map((r, i) => (
                                <div key={i} className="test-item">
                                    <span className="test-icon">{r.passed ? '✅' : '❌'}</span>
                                    <span className="test-name">{r.name}</span>
                                    <span className="test-message">{r.message}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Simulation log */}
                    {simLogs.length > 0 && (
                        <div className="simulation-log" style={{ marginTop: '1rem' }}>
                            {simLogs.map((log, i) => (
                                <div key={i} className={`log-line ${log.type}`}>
                                    {log.message}
                                </div>
                            ))}
                            {isSimulating && (
                                <div className="log-line info" style={{ opacity: 0.5 }}>▌</div>
                            )}
                        </div>
                    )}

                    {/* Simulation summary + next step */}
                    {simSummary && step === 'simulation' && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem 1.25rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--accent-red-muted)',
                            borderRadius: '6px',
                        }}>
                            <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                                {simSummary}
                            </p>
                            <button className="btn btn-primary" onClick={handleSeeExplanation}>
                                See What Happened
                            </button>
                        </div>
                    )}

                    {/* Explanation */}
                    {step === 'explanation' && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div className="reveal-section">
                                <h3>The Assumption</h3>
                                <p>{entry.explanationAssumption}</p>
                            </div>
                            <div className="reveal-section">
                                <h3>The Broken Invariant</h3>
                                <p>{entry.explanationInvariant}</p>
                            </div>
                            <div className="reveal-section">
                                <h3>What The Machine Did</h3>
                                <p>{entry.explanationMachineBehavior}</p>
                            </div>

                            {entry.articleContent && (
                                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                    <button className="btn btn-primary" onClick={() => setShowArticle(true)}>
                                        Read the deeper story
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Editor */}
                <div className="entry-flow-right">
                    <div className="editor-wrapper" style={{ flex: 1 }}>
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                fontFamily: "'IBM Plex Mono', Consolas, monospace",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                padding: { top: 16 },
                            }}
                        />
                    </div>

                    <div className="editor-actions">
                        <button className="btn btn-primary" onClick={handleRunTests}>
                            ▶ Run Tests
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={handleSimulate}
                            disabled={isSimulating || !allPassed}
                            title={!allPassed ? 'Pass all tests first' : ''}
                        >
                            ⚡ Simulate Production
                        </button>

                        <button className="btn btn-ghost" onClick={handleReset}>
                            ↺ Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Article Reading Modal */}
            {showArticle && entry.articleContent && (
                <div className="reading-modal-backdrop" onClick={() => setShowArticle(false)}>
                    <div className="reading-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="reading-modal-header">
                            <h2>{entry.title}</h2>
                            <button className="btn btn-ghost" onClick={() => setShowArticle(false)}>✕ Close</button>
                        </div>
                        <div className="reading-modal-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {entry.articleContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
