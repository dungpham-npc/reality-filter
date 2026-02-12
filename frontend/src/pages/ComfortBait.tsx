import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { TASK_DESCRIPTION, STARTER_CODE } from '../engine/taskDefinition';
import { runHappyPathTests, type TestResult } from '../engine/happyPathTests';
import { useSession } from '../context/SessionContext';

export default function ComfortBait() {
    const [code, setCode] = useState(STARTER_CODE);
    const [testResults, setTestResults] = useState<TestResult[] | null>(null);
    const [allPassed, setAllPassed] = useState(false);
    const { advance, exit, isLoading } = useSession();
    const navigate = useNavigate();

    const handleRunTests = () => {
        const results = runHappyPathTests(code);
        setTestResults(results);
        setAllPassed(results.every(r => r.passed));
    };

    const handleSimulate = async () => {
        await advance(); // COMFORT_BAIT → HIDDEN_FAILURE
        navigate('/phase/hidden-failure', { state: { userCode: code } });
    };

    const handleQuit = async () => {
        await exit();
        navigate('/readings');
    };

    return (
        <div className="fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="quit-bar">
                <button className="btn btn-ghost" onClick={handleQuit} disabled={isLoading}>
                    I want to leave
                </button>
            </div>

            <div className="editor-layout" style={{ flex: 1 }}>
                {/* Left: Task Description */}
                <div className="task-panel">
                    <h2>Your Task</h2>
                    <ReactMarkdown>{TASK_DESCRIPTION}</ReactMarkdown>

                    {testResults && (
                        <div className="test-results" style={{ marginTop: '1.5rem' }}>
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
                </div>

                {/* Right: Code Editor */}
                <div className="editor-panel">
                    <div className="editor-wrapper">
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
                        <button
                            id="run-tests-btn"
                            className="btn btn-primary"
                            onClick={handleRunTests}
                        >
                            ▶ Run Tests
                        </button>

                        {allPassed && (
                            <button
                                id="simulate-btn"
                                className="btn btn-danger"
                                onClick={handleSimulate}
                                disabled={isLoading}
                            >
                                ⚡ Simulate Production / High Load
                            </button>
                        )}

                        {allPassed && (
                            <span style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                All tests passed
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
