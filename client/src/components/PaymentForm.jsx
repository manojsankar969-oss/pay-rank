import { useState } from 'react';
import { submitPayment } from '../utils/api';
import './PaymentForm.css';

const AMOUNT_OPTIONS = [1, 2, 5, 10];

export default function PaymentForm({ onPaymentSuccess }) {
    const [nickname, setNickname] = useState('');
    const [amount, setAmount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        const trimmed = nickname.trim();
        if (!trimmed) {
            setError('Please enter a nickname.');
            return;
        }
        if (!amount) {
            setError('Please select an amount.');
            return;
        }

        setLoading(true);
        try {
            const result = await submitPayment(trimmed, amount);
            // Reset form
            setNickname('');
            setAmount(null);
            // Notify parent to refresh lists & show toast
            onPaymentSuccess(result.message);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="payment-form" onSubmit={handleSubmit}>
            <h2 className="form-title">
                <span className="form-icon">💸</span> Make a Payment
            </h2>

            <div className="input-group">
                <label htmlFor="nickname">Your Nickname</label>
                <input
                    id="nickname"
                    type="text"
                    placeholder="Enter nickname..."
                    maxLength={20}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={loading}
                    autoComplete="off"
                />
                <span className="char-count">{nickname.length}/20</span>
            </div>

            <div className="amount-group">
                <label>Select Amount</label>
                <div className="amount-buttons">
                    {AMOUNT_OPTIONS.map((val) => (
                        <button
                            key={val}
                            type="button"
                            className={`amount-btn ${amount === val ? 'active' : ''}`}
                            onClick={() => setAmount(val)}
                            disabled={loading}
                        >
                            ₹{val}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
                type="submit"
                className="pay-btn"
                disabled={loading || !nickname.trim() || !amount}
            >
                {loading ? (
                    <span className="btn-loading">
                        <span className="spinner"></span> Processing...
                    </span>
                ) : (
                    'Pay Now'
                )}
            </button>
        </form>
    );
}
