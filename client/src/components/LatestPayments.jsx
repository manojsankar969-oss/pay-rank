import { useState, useEffect } from 'react';
import { fetchLatestPayments } from '../utils/api';
import { timeAgo } from '../utils/timeAgo';
import './LatestPayments.css';

export default function LatestPayments({ refreshKey }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetchLatestPayments();
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
        <div className="latest-card">
            <h2 className="card-title">
                <span className="card-icon">⚡</span> Latest Payments
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
                <ul className="latest-list">
                    {data.map((entry) => (
                        <li key={entry._id} className="latest-item">
                            <div className="latest-info">
                                <span className="latest-nickname">{entry.nickname}</span>
                                <span className="latest-amount">₹{entry.amount}</span>
                            </div>
                            <span className="latest-time">{timeAgo(entry.createdAt)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
