import { API_BASE_URL } from './apiConfig';

export interface SoupEntryData {
    id: string;
    slug: string;
    title: string;
    status: 'DRAFT_EXAMPLE' | 'DRAFT_EXPLANATION' | 'DRAFT_ARTICLE' | 'PUBLISHED';
    exampleDescription: string | null;
    exampleStarterCode: string | null;
    exampleTestsCode: string | null;
    exampleSimulationCode: string | null;
    explanationAssumption: string | null;
    explanationInvariant: string | null;
    explanationMachineBehavior: string | null;
    articleContent: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

export interface EntrySummary {
    slug: string;
    title: string;
    hasArticle: boolean;
    publishedAt: string;
}

const BASE = `${API_BASE_URL}/api/bowl`;

function headers(password: string): Record<string, string> {
    return {
        'Content-Type': 'application/json',
        'X-Admin-Password': password,
    };
}

export async function bowlListEntries(password: string): Promise<SoupEntryData[]> {
    const res = await fetch(`${BASE}/entries`, { headers: headers(password) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function bowlCreateEntry(password: string, title: string, slug: string): Promise<SoupEntryData> {
    const res = await fetch(`${BASE}/entries`, {
        method: 'POST',
        headers: headers(password),
        body: JSON.stringify({ title, slug }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function bowlGetEntry(password: string, id: string): Promise<SoupEntryData> {
    const res = await fetch(`${BASE}/entries/${id}`, { headers: headers(password) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function bowlDeleteEntry(password: string, id: string): Promise<void> {
    const res = await fetch(`${BASE}/entries/${id}`, {
        method: 'DELETE',
        headers: headers(password),
    });
    if (!res.ok) throw new Error(await res.text());
}

export async function bowlUpdateExample(
    password: string, id: string,
    data: { description: string; starterCode: string; testsCode: string; simulationCode: string }
): Promise<SoupEntryData> {
    const res = await fetch(`${BASE}/entries/${id}/example`, {
        method: 'PUT',
        headers: headers(password),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function bowlUpdateExplanation(
    password: string, id: string,
    data: { assumption: string; invariant: string; machineBehavior: string }
): Promise<SoupEntryData> {
    const res = await fetch(`${BASE}/entries/${id}/explanation`, {
        method: 'PUT',
        headers: headers(password),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function bowlUpdateArticle(
    password: string, id: string, articleContent: string
): Promise<SoupEntryData> {
    const res = await fetch(`${BASE}/entries/${id}/article`, {
        method: 'PUT',
        headers: headers(password),
        body: JSON.stringify({ articleContent }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function bowlAdvance(password: string, id: string): Promise<SoupEntryData> {
    const res = await fetch(`${BASE}/entries/${id}/advance`, {
        method: 'POST',
        headers: headers(password),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function bowlPublish(password: string, id: string): Promise<SoupEntryData> {
    const res = await fetch(`${BASE}/entries/${id}/publish`, {
        method: 'POST',
        headers: headers(password),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function bowlUnpublish(password: string, id: string): Promise<SoupEntryData> {
    const res = await fetch(`${BASE}/entries/${id}/unpublish`, {
        method: 'POST',
        headers: headers(password),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// Public API for user-facing workbench
export async function fetchPublishedEntries(): Promise<EntrySummary[]> {
    const res = await fetch(`${API_BASE_URL}/api/entries`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function fetchEntryBySlug(slug: string): Promise<SoupEntryData> {
    const res = await fetch(`${API_BASE_URL}/api/entries/${slug}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
