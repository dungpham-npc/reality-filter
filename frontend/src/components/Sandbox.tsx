import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { TASK_DESCRIPTION, STARTER_CODE } from '../engine/taskDefinition';
import { runHappyPathTests, type TestResult } from '../engine/happyPathTests';
import { runConcurrencySimulation, type SimulationLog } from '../engine/concurrencySimulation';

export default function Sandbox() {
    const [code, setCode] = useState(STARTER_CODE);
    const [testResults, setTestResults] = useState<TestResult[] | null>(null);
    const [allPassed, setAllPassed] = useState(false);
    const [simLogs, setSimLogs] = useState<SimulationLog[]>([]);
    const [simSummary, setSimSummary] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simComplete, setSimComplete] = useState(false);

    const handleRunTests = () => {
        setSimLogs([]);
        setSimSummary('');
        setSimComplete(false);
        const results = runHappyPathTests(code);
        setTestResults(results);
        setAllPassed(results.every(r => r.passed));
    };

    const handleSimulate = useCallback(async () => {
        setIsSimulating(true);
        setSimLogs([]);
        setSimSummary('');
        setSimComplete(false);

        const result = await runConcurrencySimulation(code);

        // Animate logs
        for (let i = 0; i < result.logs.length; i++) {
            await new Promise(r => setTimeout(r, 60));
            setSimLogs(prev => [...prev, result.logs[i]]);
        }

        setSimSummary(result.summary);
        setIsSimulating(false);
        setSimComplete(true);
    }, [code]);

    const handleReset = () => {
        setCode(STARTER_CODE);
        setTestResults(null);
        setAllPassed(false);
        setSimLogs([]);
        setSimSummary('');
        setSimComplete(false);
    };

    return (
        <div className="sandbox-layout">
            {/* Left: Task + Results */}
            <div className="sandbox-left">
                <div className="task-panel">
                    <h2>Bank Account</h2>
                    <ReactMarkdown>{TASK_DESCRIPTION}</ReactMarkdown>
                </div>

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

                {simSummary && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem 1.25rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--accent-red-muted)',
                        borderRadius: '6px',
                    }}>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                            {simSummary}
                        </p>
                    </div>
                )}
            </div>

            {/* Right: Editor + Actions */}
            <div className="sandbox-right">
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
                        disabled={isSimulating}
                    >
                        ⚡ Simulate Production
                    </button>

                    <button className="btn btn-ghost" onClick={handleReset}>
                        ↺ Reset
                    </button>

                    {allPassed && !simComplete && (
                        <span style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                            All tests passed
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
