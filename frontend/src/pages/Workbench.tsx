import { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import ReadingList from '../components/ReadingList';
import Sandbox from '../components/Sandbox';
import EntryFlow from '../components/EntryFlow';
import { fetchPublishedEntries, fetchEntryBySlug, type EntrySummary, type SoupEntryData } from '../api/bowlClient';

type Tab = 'entries' | 'readings' | 'sandbox';

export default function Workbench() {
    const [activeTab, setActiveTab] = useState<Tab>('entries');
    const { session } = useSession();
    const [entries, setEntries] = useState<EntrySummary[]>([]);
    const [activeEntry, setActiveEntry] = useState<SoupEntryData | null>(null);
    const [loadingEntry, setLoadingEntry] = useState(false);

    useEffect(() => {
        fetchPublishedEntries()
            .then(setEntries)
            .catch(() => { }); // silently fail if no entries
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

    // If viewing a specific entry flow
    if (activeEntry) {
        return <EntryFlow entry={activeEntry} onBack={handleBackFromEntry} />;
    }

    return (
        <div className="workbench fade-in">
            {/* Header */}
            <div className="workbench-header">
                <div className="workbench-title">
                    <h1>Workbench</h1>
                    <p>The space is here if you want it.</p>
                </div>

                <div className="workbench-tabs">
                    {entries.length > 0 && (
                        <button
                            className={`workbench-tab ${activeTab === 'entries' ? 'active' : ''}`}
                            onClick={() => setActiveTab('entries')}
                        >
                            Explore
                        </button>
                    )}
                    <button
                        className={`workbench-tab ${activeTab === 'sandbox' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sandbox')}
                    >
                        Sandbox
                    </button>
                    <button
                        className={`workbench-tab ${activeTab === 'readings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('readings')}
                    >
                        Readings
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="workbench-content">
                {activeTab === 'entries' && (
                    <div className="workbench-entries">
                        {loadingEntry && <div className="loading">Loading...</div>}
                        {entries.map((entry) => (
                            <div
                                key={entry.slug}
                                className="entry-card"
                                onClick={() => handleOpenEntry(entry.slug)}
                            >
                                <h3>{entry.title}</h3>
                            </div>
                        ))}
                        {entries.length === 0 && (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                                No entries published yet.
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 'readings' && (
                    <div className="workbench-readings">
                        <div className="readings-framing" style={{ marginBottom: '2rem' }}>
                            <p>
                                These are not lessons. There is no curriculum. No one is grading you.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                If any of this resonates with you, you might be wired for this kind of work.
                            </p>
                        </div>
                        <ReadingList sessionId={session.id} />
                    </div>
                )}

                {activeTab === 'sandbox' && (
                    <Sandbox />
                )}
            </div>
        </div>
    );
}
