import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { runConcurrencySimulation, type SimulationLog } from '../engine/concurrencySimulation';
import { useSession } from '../context/SessionContext';
import { STARTER_CODE } from '../engine/taskDefinition';

export default function HiddenFailure() {
    const [logs, setLogs] = useState<SimulationLog[]>([]);
    const [summary, setSummary] = useState('');
    const [isRunning, setIsRunning] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const { advance, exit, isLoading } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const userCode = (location.state as any)?.userCode || STARTER_CODE;

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            const result = await runConcurrencySimulation(userCode);
            if (cancelled) return;

            // Animate logs appearing one by one
            for (let i = 0; i < result.logs.length; i++) {
                if (cancelled) return;
                await new Promise(r => setTimeout(r, 80));
                setLogs(prev => [...prev, result.logs[i]]);
            }

            setSummary(result.summary);
            setIsRunning(false);
            setIsComplete(true);
        };

        run();
        return () => { cancelled = true; };
    }, [userCode]);

    const handleSeeReveal = async () => {
        await advance(); // HIDDEN_FAILURE → REVEAL
        navigate('/phase/reveal');
    };

    const handleQuit = async () => {
        await exit();
        navigate('/readings');
    };

    return (
        <div className="page fade-in" style={{ alignItems: 'center' }}>
            <div className="quit-bar">
                <button className="btn btn-ghost" onClick={handleQuit} disabled={isLoading}>
                    I want to leave
                </button>
            </div>

            <div className="simulation-container">
                <h1 style={{ marginBottom: '0.5rem' }}>Production Simulation</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Running your code under realistic concurrent load conditions...
                </p>

                <div className="simulation-log">
                    {logs.map((log, i) => (
                        <div key={i} className={`log-line ${log.type}`}>
                            {log.message}
                        </div>
                    ))}
                    {isRunning && (
                        <div className="log-line info" style={{ opacity: 0.5 }}>
                            ▌
                        </div>
                    )}
                </div>

                {summary && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--accent-red-muted)',
                        borderRadius: '6px',
                        marginBottom: '1.5rem',
                    }}>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                            {summary}
                        </p>
                    </div>
                )}

                {isComplete && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            id="see-reveal-btn"
                            className="btn btn-primary"
                            onClick={handleSeeReveal}
                            disabled={isLoading}
                        >
                            See What Happened →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
