import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchReadings, type ReadingData } from '../api/client';

interface ReadingListProps {
    sessionId: string;
}

export default function ReadingList({ sessionId }: ReadingListProps) {
    const [readings, setReadings] = useState<ReadingData[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReadings(sessionId)
            .then(setReadings)
            .catch((e) => setError(e.message));
    }, [sessionId]);

    const toggleReading = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3>Unable to load readings</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            {readings.map((reading) => (
                <div key={reading.id} className="reading-card">
                    <div
                        className="reading-card-header"
                        onClick={() => toggleReading(reading.id)}
                    >
                        <div>
                            <h3>{reading.title}</h3>
                            <div className="reading-card-summary">{reading.summary}</div>
                        </div>
                        <span className={`reading-card-toggle ${expandedId === reading.id ? 'open' : ''}`}>
                            ▾
                        </span>
                    </div>

                    {expandedId === reading.id && (
                        <div className="reading-card-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {reading.markdownContent}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
