export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  const url = `${baseUrl}${endpoint}`;

  // Read access token from memory/local storage (Phase 2+ auth state)
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { 
    ...options, 
    headers
  });
  
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    const lowerText = text.trim().toLowerCase();
    if (lowerText.startsWith('<html') || lowerText.includes('<html') || lowerText.includes('cookie_check')) {
      throw new Error("ব্রাউজার কুকি ব্লক করেছে। দয়া করে অ্যাপটি 'নতুন ট্যাবে' (New Tab) ওপেন করুন (উপরের ডানের আইকনে ক্লিক করে)।");
    }
    throw new Error('সার্ভার থেকে সঠিক ডাটা আসেনি।');
  }
  
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || 'API Request failed');
  }

  return data.data;
}
