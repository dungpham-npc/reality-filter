import { useSession } from '../context/SessionContext';
import ReadingList from '../components/ReadingList';

export default function Readings() {
    const { session } = useSession();

    if (!session) {
        return (
            <div className="page">
                <div className="page-content" style={{ textAlign: 'center' }}>
                    <h2>No active session</h2>
                    <p>Readings are unavailable.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page fade-in" style={{ justifyContent: 'flex-start', paddingTop: '3rem' }}>
            <div className="readings-page">
                <h1 style={{ textAlign: 'center' }}>Lenses</h1>

                <div className="readings-framing">
                    <p>
                        These are not lessons. There is no curriculum. No one is grading you.
                    </p>
                    <p style={{ marginBottom: 0 }}>
                        If any of this resonates with you, you might be wired for this kind of work.
                    </p>
                </div>

                <ReadingList sessionId={session.id} />

                <div style={{ textAlign: 'center', marginTop: '3rem', paddingBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                        You got here. That already means something.
                    </p>
                </div>
            </div>
        </div>
    );
}
