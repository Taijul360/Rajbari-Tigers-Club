import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { fetchApi } from '../lib/api/client';
import { Link } from 'react-router-dom';

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ tournaments: any[], notices: any[], members: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
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
    if (!query || query.length < 2) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchApi<any>(`/search?q=${encodeURIComponent(query)}`);
        setResults(res);
      } catch (e) {
        // Ignore
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:bg-white/10 rounded-sm transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-[300px] md:w-[400px] bg-white rounded-md shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              autoFocus
              type="text"
              placeholder="টুর্নামেন্ট, নোটিশ বা সদস্য খুঁজুন..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm font-bangla text-gray-800 placeholder:text-gray-400 p-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500 font-bangla">খোঁজা হচ্ছে...</div>
            ) : results ? (
              <div className="space-y-4 p-2">
                {results.tournaments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">টুর্নামেন্ট</h4>
                    {results.tournaments.map(t => (
                      <Link key={t._id} to="/tournaments" onClick={() => setIsOpen(false)} className="block p-2 hover:bg-gray-50 rounded text-sm font-bangla text-tiger-navy mb-1">
                        {t.title.bn}
                      </Link>
                    ))}
                  </div>
                )}
                {results.notices.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">নোটিশ</h4>
                    {results.notices.map(n => (
                      <Link key={n._id} to="/notices" onClick={() => setIsOpen(false)} className="block p-2 hover:bg-gray-50 rounded text-sm font-bangla text-tiger-navy mb-1">
                        {n.title.bn}
                      </Link>
                    ))}
                  </div>
                )}
                {results.members.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">সদস্য</h4>
                    {results.members.map(m => (
                      <div key={m._id} className="p-2 text-sm font-bangla text-tiger-navy mb-1 flex justify-between">
                        <span>{m.name.bn}</span>
                        <span className="text-xs text-gray-500 font-mono">{m.memberCode}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {results.tournaments.length === 0 && results.notices.length === 0 && results.members.length === 0 && (
                   <div className="p-4 text-center text-sm text-gray-500 font-bangla">কোনো ফলাফল পাওয়া যায়নি</div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-400 font-bangla">অনুসন্ধান করতে টাইপ করুন</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
