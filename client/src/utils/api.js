/**
 * API utility — centralised fetch wrapper for PayRank backend.
 * Base URL is configurable via VITE_API_URL env var.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic request helper with error handling.
 */
async function request(endpoint, options = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

/** POST /api/pay — simulate a payment */
export function submitPayment(nickname, amount) {
    return request('/pay', {
        method: 'POST',
        body: JSON.stringify({ nickname, amount }),
    });
}

/** GET /api/leaderboard/top — top 10 by amount */
export function fetchTopLeaderboard() {
    return request('/leaderboard/top');
}

/** GET /api/leaderboard/latest — latest 20 payments */
export function fetchLatestPayments() {
    return request('/leaderboard/latest');
}
