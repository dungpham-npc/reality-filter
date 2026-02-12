import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function Fork() {
    const { advance, exit, isLoading } = useSession();
    const navigate = useNavigate();

    const handleExit = async () => {
        await exit();
        navigate('/workbench');
    };

    const handleContinue = async () => {
        await advance(); // FORK → READINGS
        navigate('/workbench');
    };

    return (
        <div className="page fade-in">
            <div className="fork-page" style={{ margin: '0 auto' }}>
                <h1>A Decision</h1>

                <p style={{ maxWidth: '500px', margin: '0 auto 1rem' }}>
                    You've seen one example of how software fails in ways that correct-looking code cannot prevent.
                    This is not an exception — it is the norm.
                </p>

                <p style={{ maxWidth: '500px', margin: '0 auto 1rem' }}>
                    Real software engineering is mostly about:
                </p>

                <div style={{ textAlign: 'left', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                    <ul style={{ color: 'var(--text-secondary)', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>→ Modeling messy, changing reality</li>
                        <li style={{ marginBottom: '0.5rem' }}>→ Discovering and protecting invariants</li>
                        <li style={{ marginBottom: '0.5rem' }}>→ Reasoning under uncertainty and incomplete information</li>
                        <li style={{ marginBottom: '0.5rem' }}>→ Understanding how and why things fail</li>
                    </ul>
                </div>

                <p style={{ maxWidth: '500px', margin: '0 auto 1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    Leaving is a valid, rational choice. Staying only makes sense if the deeper reality excites you.
                </p>

                <div className="fork-buttons">
                    <button
                        id="fork-exit-btn"
                        className="btn btn-ghost"
                        onClick={handleExit}
                        disabled={isLoading}
                    >
                        Exit — Show me what to read
                    </button>

                    <button
                        id="fork-continue-btn"
                        className="btn btn-primary"
                        onClick={handleContinue}
                        disabled={isLoading}
                    >
                        Continue — I want to go deeper
                    </button>
                </div>
            </div>
        </div>
    );
}
