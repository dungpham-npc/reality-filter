import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function Reveal() {
    const { advance, exit, isLoading } = useSession();
    const navigate = useNavigate();

    const handleContinue = async () => {
        await advance(); // REVEAL → FORK
        navigate('/phase/fork');
    };

    const handleQuit = async () => {
        await exit();
        navigate('/readings');
    };

    return (
        <div className="page fade-in">
            <div className="quit-bar">
                <button className="btn btn-ghost" onClick={handleQuit} disabled={isLoading}>
                    I want to leave
                </button>
            </div>

            <div className="reveal-page">
                <h1>What Happened</h1>

                <p>
                    Your code was correct — in the sense that it did exactly what you told it to do.
                    The computer followed your instructions precisely. The problem was in <em>what you told it</em>.
                </p>

                <div className="reveal-section">
                    <h3>The Assumption You Made</h3>
                    <p>
                        You assumed that <code style={{ color: 'var(--accent-amber)', background: 'var(--bg-tertiary)', padding: '0.1rem 0.3rem', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>transfer(from, to, amount)</code> would
                        complete as a single, uninterruptible operation — that nothing could happen between reading
                        a balance and updating it.
                    </p>
                    <p>
                        In a single-threaded, sequential execution, this assumption holds. Your tests confirmed it.
                        But that's not how production systems work.
                    </p>
                </div>

                <div className="reveal-section">
                    <h3>The Invariant That Broke</h3>
                    <p>
                        <strong>Conservation of money:</strong> The total amount of money across all accounts must
                        remain constant after any transfer operation. Money cannot be created or destroyed — only
                        moved from one account to another.
                    </p>
                    <p>
                        Under concurrent access, your <code style={{ color: 'var(--accent-amber)', background: 'var(--bg-tertiary)', padding: '0.1rem 0.3rem', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>transfer</code> function breaks this invariant
                        because the read-then-write pattern is not atomic. Two concurrent transfers can both read
                        the same balance, then both write their modifications, causing one to be lost.
                    </p>
                </div>

                <div className="reveal-section">
                    <h3>What the Machine Actually Did</h3>
                    <p>
                        The machine executed your code exactly as written. It read the balance, computed the new
                        value, and wrote it back. The problem is that between reading and writing, another operation
                        also read and wrote — and the last write wins, silently erasing the other operation's effect.
                    </p>
                    <p>
                        This is called a <em>race condition</em>, and it is one of the most common — and most
                        dangerous — failures in real software systems. It passes every test that doesn't simulate
                        concurrency.
                    </p>
                </div>

                <div style={{ margin: '2rem 0', padding: '1.5rem', borderLeft: '3px solid var(--text-muted)' }}>
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>
                        This is not a "gotcha." This is routine. Systems handling money, inventory, reservations,
                        votes — anything with shared mutable state — face this exact problem. The question is never
                        <em> whether </em> it will happen, but whether you've designed for it.
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <button
                        id="continue-to-fork-btn"
                        className="btn btn-primary"
                        onClick={handleContinue}
                        disabled={isLoading}
                    >
                        Continue →
                    </button>
                </div>
            </div>
        </div>
    );
}
