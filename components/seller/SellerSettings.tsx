import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { CURRENCY_OPTIONS } from '../../constants';

const SellerSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const { getStoreByOwner, updateStore } = useStore();
  const store = user ? getStoreByOwner(user.id) : undefined;

  const [name, setName] = useState(store?.name || '');
  const [description, setDescription] = useState(store?.description || '');
  const [currency, setCurrency] = useState(store?.currency || '$');
  const [saved, setSaved] = useState(false);

  if (!store) return null;

  const handleSave = () => {
    updateStore({ ...store, name, description, currency });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>

      <div className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-lg">Store Profile</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Store Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="input min-h-[80px] resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
            <div className="flex gap-3">
              {CURRENCY_OPTIONS.map(c => (
                <button
                  key={c.symbol}
                  onClick={() => setCurrency(c.symbol)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${currency === c.symbol ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  {c.symbol} {c.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="btn btn-primary">
            {saved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Saved!
              </>
            ) : 'Save Changes'}
          </button>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-2">Account</h2>
          <p className="text-sm text-gray-500 mb-4">Logged in as {user?.email}</p>
          <button onClick={logout} className="btn text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
