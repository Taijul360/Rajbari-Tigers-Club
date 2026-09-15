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
    headers,
    credentials: 'include' // Required for AI Studio proxy authentication
  });
  
  // Note: Handle 401 Unauthorized for refresh token logic later
  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || 'API Request failed');
  }

  return data.data;
}
