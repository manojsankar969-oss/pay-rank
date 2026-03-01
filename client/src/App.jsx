import { useState, useCallback } from 'react';
import PaymentForm from './components/PaymentForm';
import Leaderboard from './components/Leaderboard';
import LatestPayments from './components/LatestPayments';
import Toast from './components/Toast';
import './App.css';

export default function App() {
  // Increment to trigger re-fetch in child components
  const [refreshKey, setRefreshKey] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const handlePaymentSuccess = useCallback((message) => {
    setToastMessage(message);
    setRefreshKey((k) => k + 1);
  }, []);

  const closeToast = useCallback(() => {
    setToastMessage('');
  }, []);

  return (
    <div className="app">
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <h1>Pay<span className="accent">Rank</span></h1>
        </div>
        <p className="tagline">Simulate payments. Climb the ranks.</p>
      </header>

      <main className="app-main">
        <PaymentForm onPaymentSuccess={handlePaymentSuccess} />

        <div className="boards-grid">
          <Leaderboard refreshKey={refreshKey} />
          <LatestPayments refreshKey={refreshKey} />
        </div>
      </main>

      <footer className="app-footer">
        <p>PayRank &mdash; Phase 1 (Simulated Payments) &bull; Built with ❤️</p>
      </footer>

      <Toast message={toastMessage} onClose={closeToast} />
    </div>
  );
}
