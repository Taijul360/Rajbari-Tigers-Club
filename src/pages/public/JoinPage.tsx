import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../../lib/api/client';

export default function JoinPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name_bn: '',
    name_en: '',
    phone: '',
    password: '',
    bloodGroup: 'A+',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetchApi<any>('/applications/apply', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setSuccess(res.message || 'আপনার আবেদন জমা হয়েছে।');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'আবেদন জমা দিতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <div className="py-16 px-4 flex justify-center">
        <div className="bg-white p-8 rounded-md shadow-sm border border-green-200 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
          <h2 className="text-2xl font-bold font-bangla text-tiger-navy mb-2">ধন্যবাদ!</h2>
          <p className="font-bangla text-gray-600 mb-6">{success}</p>
          <p className="text-sm font-bangla text-gray-500">লগইন পেজে নিয়ে যাওয়া হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-md border border-gray-200 shadow-sm">
        <h1 className="text-3xl font-bold font-bangla text-tiger-navy mb-2 text-center">সদস্যপদের আবেদন</h1>
        <p className="text-gray-500 text-center font-bangla mb-8">নিচের ফর্মটি পূরণ করে রাজবাড়ি টাইগার্স ক্লাবের সদস্য হওয়ার জন্য আবেদন করুন।</p>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bangla rounded border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">নাম (বাংলায়) <span className="text-red-500">*</span></label>
              <input 
                name="name_bn" type="text" required
                value={formData.name_bn} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 font-bangla focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none"
                placeholder="যেমন: মোঃ তাইজুল ইসলাম"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">নাম (ইংরেজিতে) <span className="text-red-500">*</span></label>
              <input 
                name="name_en" type="text" required
                value={formData.name_en} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 font-archivo focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none"
                placeholder="e.g. Md Taijul Islam"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">মোবাইল নম্বর <span className="text-red-500">*</span></label>
              <input 
                name="phone" type="tel" required
                value={formData.phone} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 font-archivo focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none"
                placeholder="+8801XXXXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-1 font-bangla">এটি আপনার লগইন আইডি হিসেবে ব্যবহৃত হবে</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">রক্তের গ্রুপ <span className="text-red-500">*</span></label>
              <select 
                name="bloodGroup" required
                value={formData.bloodGroup} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 font-archivo focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">ঠিকানা <span className="text-red-500">*</span></label>
            <textarea 
              name="address" required rows={3}
              value={formData.address} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 font-bangla focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none resize-none"
              placeholder="আপনার বর্তমান ঠিকানা"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 font-bangla mb-1">পাসওয়ার্ড সেট করুন <span className="text-red-500">*</span></label>
            <input 
              name="password" type="password" required minLength={6}
              value={formData.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 font-archivo focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-tiger-orange text-white font-bold py-3 rounded hover:bg-tiger-orange/90 transition-colors font-bangla disabled:opacity-70"
            >
              {loading ? 'জমা দেওয়া হচ্ছে...' : 'আবেদন জমা দিন'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm font-bangla text-gray-600">
          ইতোমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="text-tiger-navy font-bold hover:underline">লগইন করুন</Link>
        </div>
      </div>
    </div>
  );
}
