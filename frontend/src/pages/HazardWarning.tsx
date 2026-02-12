import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const WARNING_TEXT = `
**This is not a tutorial. This is not a course. There are no credentials, no certificates, and no career promises.**

This system exists for one purpose: to show you what software engineering actually demands — honestly and without comfort.

Most people who encounter this will leave quickly. **That is a success, not a failure.** If the reality of this field does not excite you, then leaving with clarity is vastly more valuable than staying out of obligation or sunk cost.

What follows will ask you to write code. Your code will work — or appear to work. Then you will see it break under conditions that are routine in real systems.

**This is not a trick. This is not a puzzle. This is how software fails in production, every day, in companies of every size.**

There is no score. There is no timer. There is no leaderboard. No one will know whether you stayed or left. This is entirely for you.
`;

const ETHICAL_LINE = `"This is what the field actually demands. You get to decide — with open eyes — whether it's for you. Leaving is a valid, rational choice. Staying only makes sense if the deeper reality excites you."`;

export default function HazardWarning() {
    const { startSession, isLoading } = useSession();
    const navigate = useNavigate();

    const handleProceed = async () => {
        await startSession();
        navigate('/phase/comfort-bait');
    };

    return (
        <div className="page hazard-page fade-in">
            <div className="page-content">
                <h1>⚠ HAZARD WARNING</h1>

                <div className="hazard-warning-text">
                    <ReactMarkdown>{WARNING_TEXT}</ReactMarkdown>
                </div>

                <div style={{ margin: '2rem 0', padding: '1rem', borderLeft: '3px solid #666', fontStyle: 'italic' }}>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>{ETHICAL_LINE}</p>
                </div>

                <div className="hazard-button-area">
                    <button
                        id="hazard-proceed-btn"
                        className="btn btn-danger"
                        onClick={handleProceed}
                        disabled={isLoading}
                        style={{ fontSize: '1rem', padding: '1rem 3rem' }}
                    >
                        {isLoading ? 'Entering...' : 'I Understand and Want to Proceed'}
                    </button>
                </div>
            </div>
        </div>
    );
}
