const API_BASE = '/api';

export interface SessionData {
    id: string;
    currentPhase: string;
    createdAt: string | null;
    hazardAcceptedAt: string | null;
    codeSubmittedAt: string | null;
    failureRevealedAt: string | null;
    forkReachedAt: string | null;
    exitedAt: string | null;
    quitPhase: string | null;
}

export interface ReadingData {
    id: string;
    title: string;
    summary: string;
    markdownContent: string;
    category: string;
}

export async function createSession(): Promise<SessionData> {
    const res = await fetch(`${API_BASE}/sessions`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
}

export async function getSession(id: string): Promise<SessionData> {
    const res = await fetch(`${API_BASE}/sessions/${id}`);
    if (!res.ok) throw new Error('Session not found');
    return res.json();
}

export async function advancePhase(id: string): Promise<SessionData> {
    const res = await fetch(`${API_BASE}/sessions/${id}/advance`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to advance phase');
    return res.json();
}

export async function exitSession(id: string): Promise<SessionData> {
    const res = await fetch(`${API_BASE}/sessions/${id}/exit`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to exit session');
    return res.json();
}

export async function fetchReadings(sessionId: string): Promise<ReadingData[]> {
    const res = await fetch(`${API_BASE}/readings`, {
        headers: { 'X-Session-Id': sessionId },
    });
    if (!res.ok) throw new Error('Readings locked or unavailable');
    return res.json();
}

export async function fetchReading(id: string, sessionId: string): Promise<ReadingData> {
    const res = await fetch(`${API_BASE}/readings/${id}`, {
        headers: { 'X-Session-Id': sessionId },
    });
    if (!res.ok) throw new Error('Reading not found');
    return res.json();
}
