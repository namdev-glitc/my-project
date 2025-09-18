import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Events from './pages/Events';
import QRScanner from './pages/QRScanner';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Invitations from './pages/Invitations';
import CheckIn from './pages/CheckIn';
import Invitation from './pages/Invitation';
import InvitationPublic from './pages/InvitationPublic';
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
          <AuthProvider>
            <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/guests" element={
                  <ProtectedRoute>
                    <Layout>
                      <Guests />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <Layout>
                      <Events />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/invitations" element={
                  <ProtectedRoute>
                    <Layout>
                      <Invitations />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/scanner" element={
                  <ProtectedRoute>
                    <Layout>
                      <QRScanner />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/checkin" element={
                  <ProtectedRoute>
                    <Layout>
                      <CheckIn />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/invitation/:guestId" element={
                  <ProtectedRoute>
                    <Layout>
                      <Invitation />
                    </Layout>
                  </ProtectedRoute>
                } />
                {/* Public invitation route by token (no auth) */}
                <Route path="/i/:token" element={<InvitationPublic />} />
              </Routes>
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
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
