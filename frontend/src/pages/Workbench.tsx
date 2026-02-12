import { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import EntryFlow from '../components/EntryFlow';
import { fetchPublishedEntries, fetchEntryBySlug, type EntrySummary, type SoupEntryData } from '../api/bowlClient';

export default function Workbench() {
    const { session } = useSession();
    const [entries, setEntries] = useState<EntrySummary[]>([]);
    const [activeEntry, setActiveEntry] = useState<SoupEntryData | null>(null);
    const [loadingEntry, setLoadingEntry] = useState(false);

    useEffect(() => {
        fetchPublishedEntries()
            .then(setEntries)
            .catch(() => { });
    }, []);

    const handleOpenEntry = async (slug: string) => {
        setLoadingEntry(true);
        try {
            const entry = await fetchEntryBySlug(slug);
            setActiveEntry(entry);
        } catch (e) {
            console.error(e);
        }
        setLoadingEntry(false);
    };

    const handleBackFromEntry = () => {
        setActiveEntry(null);
    };

    if (!session) {
        return (
            <div className="page">
                <div className="page-content" style={{ textAlign: 'center' }}>
                    <h2>No active session</h2>
                    <p>You need to go through the flow first.</p>
                </div>
            </div>
        );
    }

    if (activeEntry) {
        return <EntryFlow entry={activeEntry} onBack={handleBackFromEntry} />;
    }

    return (
        <div className="workbench fade-in">
            <div className="workbench-header">
                <div className="workbench-title">
                    <h1>Workbench</h1>
                    <p>Each one is a trap. The kind that teaches you something.</p>
                </div>
            </div>

            <div className="workbench-content">
                <div className="workbench-entries">
                    {loadingEntry && <div className="loading">Loading...</div>}
                    {entries.map((entry) => (
                        <div
                            key={entry.slug}
                            className="entry-card"
                            onClick={() => handleOpenEntry(entry.slug)}
                        >
                            <h3>{entry.title}</h3>
                            {entry.hasArticle && (
                                <span className="entry-card-badge">📖 Deep reading</span>
                            )}
                        </div>
                    ))}
                    {entries.length === 0 && !loadingEntry && (
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                The soup is empty. Nothing has been published yet.
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', opacity: 0.6 }}>
                                Check back later.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
