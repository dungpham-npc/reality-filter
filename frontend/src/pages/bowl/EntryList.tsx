import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBowl } from '../../context/BowlContext';
import { bowlListEntries, bowlCreateEntry, bowlDeleteEntry, type SoupEntryData } from '../../api/bowlClient';

const STATUS_LABELS: Record<string, string> = {
    DRAFT_EXAMPLE: '① Example',
    DRAFT_EXPLANATION: '② Explanation',
    DRAFT_ARTICLE: '③ Article',
    PUBLISHED: '✓ Published',
};

const STATUS_COLORS: Record<string, string> = {
    DRAFT_EXAMPLE: 'var(--accent-amber)',
    DRAFT_EXPLANATION: 'var(--accent-amber)',
    DRAFT_ARTICLE: 'var(--accent-amber)',
    PUBLISHED: 'var(--accent-green)',
};

export default function EntryList() {
    const { password, isAuthenticated } = useBowl();
    const navigate = useNavigate();
    const [entries, setEntries] = useState<SoupEntryData[]>([]);
    const [error, setError] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/bowl');
            return;
        }
        loadEntries();
    }, [isAuthenticated]);

    const loadEntries = async () => {
        try {
            const data = await bowlListEntries(password);
            setEntries(data);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const entry = await bowlCreateEntry(password, newTitle, newSlug);
            setNewTitle('');
            setNewSlug('');
            setShowCreate(false);
            navigate(`/bowl/entries/${entry.id}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        }
        setCreating(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this entry?')) return;
        try {
            await bowlDeleteEntry(password, id);
            loadEntries();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

    const slugify = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    return (
        <div className="page fade-in" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
            <div style={{ maxWidth: '900px', width: '100%', padding: '0 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ marginBottom: 0 }}>Soup Bowl</h1>
                    <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
                        + Add to Soup
                    </button>
                </div>

                {error && (
                    <p style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>{error}</p>
                )}

                {showCreate && (
                    <form onSubmit={handleCreate} className="bowl-create-form">
                        <input
                            className="bowl-input"
                            placeholder="Title"
                            value={newTitle}
                            onChange={(e) => {
                                setNewTitle(e.target.value);
                                setNewSlug(slugify(e.target.value));
                            }}
                            autoFocus
                        />
                        <input
                            className="bowl-input"
                            placeholder="Slug (URL-safe)"
                            value={newSlug}
                            onChange={(e) => setNewSlug(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" disabled={creating || !newTitle || !newSlug}>
                            {creating ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                )}

                {entries.length === 0 && !showCreate && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '3rem' }}>
                        No entries yet. Click "Add to Soup" to begin the ceremony.
                    </p>
                )}

                <div className="bowl-entry-list">
                    {entries.map(entry => (
                        <div
                            key={entry.id}
                            className="bowl-entry-row"
                            onClick={() => navigate(`/bowl/entries/${entry.id}`)}
                        >
                            <div className="bowl-entry-info">
                                <span className="bowl-entry-title">{entry.title}</span>
                                <span className="bowl-entry-slug">/{entry.slug}</span>
                            </div>
                            <div className="bowl-entry-meta">
                                <span
                                    className="bowl-status-badge"
                                    style={{ color: STATUS_COLORS[entry.status] }}
                                >
                                    {STATUS_LABELS[entry.status]}
                                </span>
                                {entry.status !== 'PUBLISHED' && (
                                    <button
                                        className="btn btn-ghost"
                                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(entry.id);
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
