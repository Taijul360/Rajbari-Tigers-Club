import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { fetchApi } from '../lib/api/client';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchApi('/public/notifications').then((res: any) => {
      setNotifications(res || []);
      setUnreadCount(res?.length || 0);
    }).catch(() => {});
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Mark as read locally
    }
  };

  const getLink = (type: string) => {
    if (type === 'blood') return '/blood-donors';
    if (type === 'tournament') return '/tournaments';
    return '/notices';
  };

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      <button 
        onClick={handleOpen}
        className="p-2 text-white hover:bg-white/10 rounded-sm transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-tiger-navy"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-[300px] md:w-[380px] bg-white rounded-md shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bangla font-bold text-tiger-navy">নোটিফিকেশন</h3>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((n, i) => (
                  <Link 
                    key={`${n.id}-${i}`} 
                    to={getLink(n.type)}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-3 p-3 hover:bg-gray-50 transition-colors items-start"
                  >
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${n.priority === 'urgent' ? 'bg-red-500' : 'bg-tiger-orange'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-bangla text-gray-800 leading-snug">{n.title}</p>
                      <p className="text-xs text-gray-400 font-archivo mt-1">
                        {n.date ? formatDistanceToNow(new Date(n.date), { addSuffix: true }) : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
               <div className="p-6 text-center text-sm text-gray-500 font-bangla">কোনো নোটিফিকেশন নেই</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
