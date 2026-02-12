import { createContext, useContext, useState, type ReactNode } from 'react';

interface BowlContextType {
    password: string;
    isAuthenticated: boolean;
    login: (pwd: string) => Promise<boolean>;
    logout: () => void;
}

const BowlContext = createContext<BowlContextType | null>(null);

export function BowlProvider({ children }: { children: ReactNode }) {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (pwd: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/bowl/entries', {
                headers: { 'X-Admin-Password': pwd },
            });
            if (res.ok) {
                setPassword(pwd);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    const logout = () => {
        setPassword('');
        setIsAuthenticated(false);
    };

    return (
        <BowlContext.Provider value={{ password, isAuthenticated, login, logout }}>
            {children}
        </BowlContext.Provider>
    );
}

export function useBowl() {
    const ctx = useContext(BowlContext);
    if (!ctx) throw new Error('useBowl must be used within BowlProvider');
    return ctx;
}
