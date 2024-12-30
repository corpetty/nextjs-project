'use client';

import { useState, useEffect } from 'react';
import AddressForm from '../../components/AddressForm';

interface Address {
  id: string;
  address: string;
  chain: string;
  storageType: string;
  accessType: string;
  notes?: string;
  tags?: { tag: string }[];
}

export default function AddressesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(0); // Add key for form reset

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch addresses');
      }
      const data = await res.json();
      setAddresses(data.docs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressCreated = async () => {
    try {
      await fetchAddresses();
      setShowAddForm(false);
      setFormKey(prev => prev + 1); // Increment key to force new form instance
    } catch (err) {
      console.error('Error refreshing addresses:', err);
    }
  };

  const handleOpenModal = () => {
    setFormKey(prev => prev + 1); // Reset form when opening modal
    setShowAddForm(true);
  };

  const groupedAddresses = addresses.reduce((groups, address) => {
    const group = address.accessType;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(address);
    return groups;
  }, {} as Record<string, Address[]>);

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl mb-2">Addresses</h1>
              <p className="text-gray-600">Manage your wallet addresses and their security settings</p>
            </div>
            <button 
              onClick={handleOpenModal}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            >
              Add New Address
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl mb-6">Address Groups</h2>
            <div className="grid gap-4">
              {Object.entries(groupedAddresses).map(([type, addresses]) => (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h3>
                      <p className="text-gray-600">
                        {type === 'hardware_wallet' && 'Addresses secured by hardware devices'}
                        {type === 'mobile_wallet' && 'Addresses from mobile wallets'}
                        {type === 'desktop_browser_wallet' && 'Addresses from desktop browser wallets'}
                        {type === 'multisig' && 'Multi-signature addresses'}
                      </p>
                    </div>
                    <span className={`
                      text-xs font-medium px-2.5 py-0.5 rounded
                      ${type === 'hardware_wallet' ? 'bg-blue-100 text-blue-800' : ''}
                      ${type === 'mobile_wallet' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${type === 'desktop_browser_wallet' ? 'bg-orange-100 text-orange-800' : ''}
                      ${type === 'multisig' ? 'bg-purple-100 text-purple-800' : ''}
                    `}>
                      {type === 'hardware_wallet' && 'Most Secure'}
                      {type === 'mobile_wallet' && 'Medium Security'}
                      {type === 'desktop_browser_wallet' && 'Basic Security'}
                      {type === 'multisig' && 'Multi-Signature'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-mono text-sm mb-1">{address.address}</p>
                            <p className="text-sm text-gray-600">Chain: {address.chain}</p>
                            {address.notes && (
                              <p className="text-sm text-gray-600 mt-2">{address.notes}</p>
                            )}
                          </div>
                          {address.tags && address.tags.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {address.tags.map(({ tag }, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(groupedAddresses).length === 0 && (
                <div className="text-gray-600 text-center py-8 border rounded-lg">
                  No addresses added yet. Click &quot;Add New Address&quot; to get started.
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl mb-4">Security Overview</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Total Addresses</h3>
                <p className="text-3xl font-bold text-blue-600">{addresses.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Hardware Protected</h3>
                <p className="text-3xl font-bold text-green-600">
                  {addresses.length > 0 ? Math.round((groupedAddresses['hardware_wallet']?.length || 0) / addresses.length * 100) : 0}%
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Multi-Signature</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {groupedAddresses['multisig']?.length || 0}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Address</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <AddressForm key={formKey} onSuccess={handleAddressCreated} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
