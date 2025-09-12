import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Events from './pages/Events';
import QRScanner from './pages/QRScanner';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Invitations from './pages/Invitations';
import CheckIn from './pages/CheckIn';
import Invitation from './pages/Invitation';
import TestQR from './pages/TestQR';
import './App.css';
import './exp-brand.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
          <div className="App">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/guests" element={<Guests />} />
                <Route path="/events" element={<Events />} />
                <Route path="/invitations" element={<Invitations />} />
                <Route path="/scanner" element={<QRScanner />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              <Route path="/checkin" element={<CheckIn />} />
              <Route path="/invitation/:guestId" element={<Invitation />} />
              <Route path="/test-qr" element={<TestQR />} />
              </Routes>
            </Layout>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#fff',
                  border: '1px solid rgba(0, 188, 212, 0.3)',
                },
              }}
            />
          </div>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
