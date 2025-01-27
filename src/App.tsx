import React, { useState } from 'react';
import { Shield, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { checkPassword } from './utils/passwordChecker';

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ breached: boolean; count?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const checkResult = await checkPassword(password);
      setResult(checkResult);
    } catch (error) {
      console.error('Error checking password:', error);
      setResult({ breached: false, count: 0 });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Shield className="w-12 h-12 text-indigo-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Password Security Checker
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Check if your password has been exposed in data breaches
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check Password'}
          </button>
        </form>

        {result && (
          <div className={`mt-8 p-4 rounded-lg ${result.breached ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className="flex items-center gap-3">
              {result.breached ? (
                <ShieldAlert className="w-6 h-6 text-red-600" />
              ) : (
                <Shield className="w-6 h-6 text-green-600" />
              )}
              <div>
                <h3 className={`font-semibold ${result.breached ? 'text-red-800' : 'text-green-800'}`}>
                  {result.breached
                    ? 'Password Has Been Compromised!'
                    : 'Password Appears Safe!'}
                </h3>
                <p className={`text-sm ${result.breached ? 'text-red-600' : 'text-green-600'}`}>
                  {result.breached
                    ? `Found in ${result.count?.toLocaleString()} data breaches`
                    : 'No breaches found containing this password'}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-8 text-center">
          Your password is never sent over the network. We use k-anonymity and only send a partial hash to check against known breaches.
        </p>
      </div>
    </div>
  );
}

export default App;