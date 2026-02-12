import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createSession as apiCreateSession, advancePhase as apiAdvance, exitSession as apiExit, type SessionData } from '../api/client';

interface SessionContextType {
    session: SessionData | null;
    startSession: () => Promise<void>;
    advance: () => Promise<void>;
    exit: () => Promise<void>;
    isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const startSession = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await apiCreateSession();
            setSession(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const advance = useCallback(async () => {
        if (!session) return;
        setIsLoading(true);
        try {
            const data = await apiAdvance(session.id);
            setSession(data);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    const exit = useCallback(async () => {
        if (!session) return;
        setIsLoading(true);
        try {
            const data = await apiExit(session.id);
            setSession(data);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    return (
        <SessionContext.Provider value={{ session, startSession, advance, exit, isLoading }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error('useSession must be used within SessionProvider');
    return ctx;
}
