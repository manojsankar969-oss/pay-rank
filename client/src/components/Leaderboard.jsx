import { useState, useEffect } from 'react';
import { fetchTopLeaderboard } from '../utils/api';
import './Leaderboard.css';

// Medal emojis for the top 3
const RANK_ICONS = ['👑', '🥈', '🥉'];

export default function Leaderboard({ refreshKey }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetchTopLeaderboard();
                if (!cancelled) setData(res.data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [refreshKey]);

    return (
        <div className="leaderboard-card">
            <h2 className="card-title">
                <span className="card-icon">🏆</span> Top Leaderboard
            </h2>

            {loading && (
                <div className="skeleton-list">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton-row" />
                    ))}
                </div>
            )}

            {error && <p className="card-error">{error}</p>}

            {!loading && !error && data.length === 0 && (
                <p className="card-empty">No payments yet. Be the first! 🚀</p>
            )}

            {!loading && !error && data.length > 0 && (
                <ol className="leaderboard-list">
                    {data.map((entry, index) => (
                        <li key={entry._id} className={`leaderboard-item rank-${index + 1}`}>
                            <span className="rank">
                                {index < 3 ? RANK_ICONS[index] : `#${index + 1}`}
                            </span>
                            <span className="lb-nickname">{entry.nickname}</span>
                            <span className="lb-amount">₹{entry.amount}</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
