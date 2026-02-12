import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBowl } from '../../context/BowlContext';

export default function BowlLogin() {
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useBowl();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const ok = await login(pwd);
        setLoading(false);
        if (ok) {
            navigate('/bowl/entries');
        } else {
            setError('Wrong password');
        }
    };

    return (
        <div className="page fade-in">
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                <h1>Soup Bowl</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Creator access only.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        placeholder="Password"
                        className="bowl-input"
                        autoFocus
                    />
                    {error && (
                        <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !pwd}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {loading ? 'Checking...' : 'Enter'}
                    </button>
                </form>
            </div>
        </div>
    );
}
