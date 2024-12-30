'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const cookies = document.cookie.split(';');
      const hasToken = cookies.some(cookie => {
        const trimmedCookie = cookie.trim();
        return trimmedCookie.startsWith('payload-token=') && 
               trimmedCookie !== 'payload-token=' &&
               trimmedCookie.length > 14; // "payload-token=".length
      });
      setIsLoggedIn(hasToken);
    };

    // Check initially
    checkLoginStatus();

    // Set up an interval to check periodically
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const clearAllCookies = () => {
    const paths = ['/', '/admin', '/api'];
    const domains = [window.location.hostname, ''];

    paths.forEach(path => {
      domains.forEach(domain => {
        document.cookie = `payload-token=; path=${path}; ${domain ? `domain=${domain};` : ''} expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
      });
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/login', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to logout');
      }

      // Clear cookies on the client side
      clearAllCookies();
      
      // Update state
      setIsLoggedIn(false);
      
      // Force a hard refresh to clear any cached state
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Estate Dashboard
              </Link>
            </div>
            {isLoggedIn && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/addresses"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                >
                  Addresses
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                >
                  Portfolio
                </Link>
                <Link
                  href="/settings"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                >
                  Settings
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Signing out...' : 'Sign out'}
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}
    </nav>
  );
}
