import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, onClose }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="toast">
            <span className="toast-icon">✅</span>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={onClose} aria-label="Close">×</button>
        </div>
    );
}
