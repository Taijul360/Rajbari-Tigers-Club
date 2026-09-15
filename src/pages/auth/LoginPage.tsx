import { useState, FormEvent } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ phone, password, ...(showOtp ? { otp } : {}) });
      navigate('/');
    } catch (err: any) {
      if (err.message === '2FA OTP required for Super Admin') {
        setShowOtp(true);
        setError('সুপার এডমিন লগইনের জন্য 2FA OTP প্রয়োজন (Mock: 123456)');
      } else {
        setError(err.message || 'লগইন ব্যর্থ হয়েছে');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-md border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-tiger-navy text-bone rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">RTC</div>
          <h2 className="text-2xl font-bold font-bangla text-tiger-navy">লগইন করুন</h2>
          <p className="text-sm text-gray-500 font-bangla mt-1">আপনার অ্যাকাউন্ট অ্যাক্সেস করতে লগইন করুন</p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-bangla rounded border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">মোবাইল নম্বর</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2.5 font-archivo focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
              placeholder="+8801XXXXXXXXX"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2.5 font-archivo focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {showOtp && (
            <div>
              <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">2FA OTP (নমুনা: 123456)</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2.5 font-archivo focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                placeholder="123456"
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-tiger-navy text-white font-bold py-3 rounded hover:bg-tiger-navy/90 transition-colors font-bangla disabled:opacity-70"
          >
            {isLoading ? 'অপেক্ষা করুন...' : 'লগইন'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-bangla text-gray-600">
          অ্যাকাউন্ট নেই? <Link to="/join" className="text-tiger-royal font-bold hover:underline">যোগদান করুন</Link>
        </div>
      </div>
    </div>
  );
}
