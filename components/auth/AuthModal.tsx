import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BRAND_NAME } from '../../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole: 'seller' | 'buyer';
  onSuccess: (role: 'seller' | 'buyer') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole, onSuccess }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'seller' | 'buyer'>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    if (mode === 'login') {
      const result = login(email, password);
      if (result.success) {
        const users = JSON.parse(localStorage.getItem('chatmarket_users') || '[]');
        const found = users.find((u: any) => u.email === email);
        onSuccess(found?.role || 'buyer');
      } else {
        setError(result.error || 'Login failed');
      }
    } else {
      if (!name.trim()) { setError('Name is required'); setIsLoading(false); return; }
      if (!email.trim()) { setError('Email is required'); setIsLoading(false); return; }
      if (password.length < 4) { setError('Password must be at least 4 characters'); setIsLoading(false); return; }
      const result = signup(name, email, password, role);
      if (result.success) {
        onSuccess(role);
      } else {
        setError(result.error || 'Signup failed');
      }
    }
    setIsLoading(false);
  };

  const fillDemo = (type: 'seller' | 'buyer') => {
    setMode('login');
    if (type === 'seller') {
      setEmail('seller@demo.com');
      setPassword('demo123');
    } else {
      setEmail('buyer@demo.com');
      setPassword('demo123');
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">C</div>
              <span className="font-bold">{BRAND_NAME}</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${mode === 'login' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {mode === 'signup' && (
            <>
              {/* Role selector */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">I want to</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${role === 'seller' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-1">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke={role === 'seller' ? '#1A1A2E' : '#9CA3AF'} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className={`text-sm font-semibold ${role === 'seller' ? 'text-primary' : 'text-gray-500'}`}>Sell</div>
                    <div className="text-xs text-gray-400 mt-0.5">Create a store</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${role === 'buyer' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-1">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke={role === 'buyer' ? '#1A1A2E' : '#9CA3AF'} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <div className={`text-sm font-semibold ${role === 'buyer' ? 'text-primary' : 'text-gray-500'}`}>Shop</div>
                    <div className="text-xs text-gray-400 mt-0.5">Browse & buy</div>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="John Doe" />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="Enter password" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          {/* Demo accounts */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Quick demo access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemo('seller')}
                className="p-2.5 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center"
              >
                Demo Seller
              </button>
              <button
                type="button"
                onClick={() => fillDemo('buyer')}
                className="p-2.5 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center"
              >
                Demo Buyer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
