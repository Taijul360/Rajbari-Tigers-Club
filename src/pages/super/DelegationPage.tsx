import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api/client';
import { PERMISSIONS } from '../../shared/permissions';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../shared/types';

export default function DelegationPage() {
  const { roles, fetchRoles } = useAuthStore();
  const [isDelegating, setIsDelegating] = useState(false);
  const [expiryDays, setExpiryDays] = useState(1);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const adminRole = roles.find(r => r.key === 'admin');
  const isDelegated = !!adminRole?.delegatedBy;

  const handleDelegate = async () => {
    if (!confirm('আপনি কি নিশ্চিত যে অ্যাডমিনকে সম্পূর্ণ ক্ষমতা অর্পণ করতে চান?')) return;
    setIsDelegating(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);
      
      await fetchApi('/super/delegate', {
        method: 'POST',
        body: JSON.stringify({ expiresAt: expiresAt.toISOString() })
      });
      await fetchRoles();
    } catch (err) {
      alert('Error delegating authority');
    } finally {
      setIsDelegating(false);
    }
  };

  const handleRevoke = async () => {
    setIsDelegating(true);
    try {
      await fetchApi('/super/revoke', { method: 'POST' });
      await fetchRoles();
    } catch (err) {
      alert('Error revoking authority');
    } finally {
      setIsDelegating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold font-bangla text-tiger-navy border-b-4 border-red-500 pb-2 mb-6 inline-block">
        সুপার অ্যাডমিন: ক্ষমতা অর্পণ (Delegation)
      </h1>

      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-md mb-8">
        <h3 className="font-bold font-bangla text-lg mb-2">সতর্কতা!</h3>
        <p className="font-bangla text-sm">
          অ্যাডমিনকে সম্পূর্ণ ক্ষমতা দিলে তিনি সিস্টেমের প্রায় সব কিছু পরিবর্তন করতে পারবেন। তবে অ্যাডমিন কখনই সুপার অ্যাডমিনকে অপসারণ করতে পারবে না বা অডিট লগ মুছে ফেলতে পারবে না।
        </p>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold font-bangla text-tiger-navy">বর্তমান অবস্থা</h2>
            <p className="text-sm font-bangla text-gray-500 mt-1">
              অ্যাডমিন এখন {isDelegated ? <span className="font-bold text-red-600">সম্পূর্ণ ক্ষমতাপ্রাপ্ত</span> : <span className="font-bold text-green-600">সাধারণ ক্ষমতায়</span>} আছে।
            </p>
            {isDelegated && adminRole?.delegationExpiresAt && (
              <p className="text-xs text-gray-400 mt-1">
                মেয়াদ শেষ হবে: {new Date(adminRole.delegationExpiresAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isDelegated ? (
              <>
                <select 
                  value={expiryDays} 
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-2 text-sm font-bangla"
                >
                  <option value={1}>১ দিনের জন্য</option>
                  <option value={7}>৭ দিনের জন্য</option>
                  <option value={30}>৩০ দিনের জন্য</option>
                </select>
                <button 
                  onClick={handleDelegate}
                  disabled={isDelegating}
                  className="bg-red-600 text-white px-6 py-2 rounded font-bangla hover:bg-red-700 transition-colors"
                >
                  {isDelegating ? 'অপেক্ষা করুন...' : 'সম্পূর্ণ ক্ষমতা দিন'}
                </button>
              </>
            ) : (
              <button 
                onClick={handleRevoke}
                disabled={isDelegating}
                className="bg-tiger-navy text-white px-6 py-2 rounded font-bangla hover:bg-tiger-navy/90 transition-colors"
              >
                {isDelegating ? 'অপেক্ষা করুন...' : 'ক্ষমতা বাতিল করুন'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="font-bold font-bangla mb-4">অ্যাডমিন এখন যা করতে পারবে:</h3>
          <div className="flex flex-wrap gap-2">
            {adminRole?.permissions.map(p => (
              <span key={p} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
