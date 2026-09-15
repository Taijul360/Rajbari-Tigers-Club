import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { PERMISSIONS } from '../../shared/permissions';
import { fetchApi } from '../../lib/api/client';

export default function RolesPage() {
  const { roles, fetchRoles } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const activeRole = roles.find(r => r.key === selectedRole);

  const togglePermission = async (permissionKey: string) => {
    if (!activeRole) return;
    
    // Prevent editing super_admin
    if (activeRole.key === 'super_admin') return;

    const newPermissions = activeRole.permissions.includes(permissionKey)
      ? activeRole.permissions.filter(p => p !== permissionKey)
      : [...activeRole.permissions, permissionKey];

    setIsSaving(true);
    try {
      await fetchApi(`/roles/${activeRole.key}/permissions`, {
        method: 'PATCH',
        body: JSON.stringify({ permissions: newPermissions })
      });
      await fetchRoles(); // Refresh roles list
    } catch (error) {
      alert('Failed to update permissions');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold font-bangla text-tiger-navy border-b-4 border-tiger-orange pb-2 mb-6 inline-block">
        রোল ও অনুমতি (Roles & Permissions)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-tiger-navy text-bone px-4 py-3 font-bangla font-bold">সকল রোল</div>
          <ul className="divide-y divide-gray-100">
            {roles.map(role => (
              <li key={role.key}>
                <button 
                  onClick={() => setSelectedRole(role.key)}
                  className={`w-full text-left px-4 py-3 font-bangla hover:bg-gray-50 transition-colors ${
                    selectedRole === role.key ? 'bg-orange-50 border-l-4 border-tiger-orange font-bold text-tiger-orange' : 'text-ink'
                  }`}
                >
                  {role.label?.bn || role.key}
                  {role.key === 'super_admin' && <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded ml-2 uppercase">Locked</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Permissions Editor */}
        <div className="md:col-span-2 bg-white rounded-md shadow-sm border border-gray-200 p-6">
          {!activeRole ? (
            <div className="text-center text-gray-400 font-bangla py-12">
              একটি রোল নির্বাচন করুন
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-bangla text-tiger-navy">
                  {activeRole.label?.bn} - এর অনুমতিসমূহ
                </h2>
                {isSaving && <span className="text-sm text-tiger-orange animate-pulse">সংরক্ষণ করা হচ্ছে...</span>}
              </div>

              {activeRole.key === 'super_admin' ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-md font-bangla border border-red-200">
                  সুপার অ্যাডমিনের অনুমতি পরিবর্তন করা সম্ভব নয়। এটি সিস্টেমের সর্বোচ্চ ক্ষমতা ধারণ করে।
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(PERMISSIONS).map(([key, value]) => (
                    <label key={value} className="flex items-start gap-3 p-3 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 text-tiger-orange rounded border-gray-300 focus:ring-tiger-orange"
                        checked={activeRole.permissions.includes(value)}
                        onChange={() => togglePermission(value)}
                        disabled={isSaving}
                      />
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-gray-700">{key}</span>
                        <span className="text-xs text-gray-500 font-mono mt-0.5">{value}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
