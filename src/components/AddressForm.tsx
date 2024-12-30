'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddressFormProps {
  onSuccess?: () => void;
}

export default function AddressForm({ onSuccess }: AddressFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const tagsString = formData.get('tags')?.toString() || '';
    const tags = tagsString
      ? tagsString.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag !== '')
          .map(tag => ({ tag }))
      : [];

    const data = {
      address: formData.get('address'),
      chain: formData.get('chain'),
      storageType: formData.get('storageType'),
      accessType: formData.get('accessType'),
      notes: formData.get('notes') || '',
      tags,
    };

    try {
      console.log('Submitting address data:', data); // Debug log

      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status); // Debug log

      const responseData = await response.json();
      console.log('Response data:', responseData); // Debug log

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create address');
      }

      // Clear form fields manually
      form.reset();
      
      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error creating address:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="chain" className="block text-sm font-medium text-gray-700">
          Chain
        </label>
        <select
          id="chain"
          name="chain"
          required
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a chain</option>
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="optimism">Optimism</option>
        </select>
      </div>

      <div>
        <label htmlFor="storageType" className="block text-sm font-medium text-gray-700">
          Storage Type
        </label>
        <select
          id="storageType"
          name="storageType"
          required
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select storage type</option>
          <option value="seed_phrase">Seed Phrase</option>
          <option value="keystore">Keystore</option>
          <option value="private_key">Private Key</option>
        </select>
      </div>

      <div>
        <label htmlFor="accessType" className="block text-sm font-medium text-gray-700">
          Access Type
        </label>
        <select
          id="accessType"
          name="accessType"
          required
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select access type</option>
          <option value="hardware_wallet">Hardware Wallet</option>
          <option value="mobile_wallet">Mobile Wallet</option>
          <option value="desktop_browser_wallet">Desktop Browser Wallet</option>
          <option value="multisig">Multisig</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., defi, trading, personal"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Creating...' : 'Create Address'}
      </button>
    </form>
  );
}
