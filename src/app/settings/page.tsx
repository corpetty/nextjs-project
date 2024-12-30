export default function SettingsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl mb-2">Settings</h1>
          <p className="text-gray-600">Configure your portfolio and security preferences</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl mb-6">General Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Currency
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Portfolio View
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="list">List View</option>
                    <option value="grid">Grid View</option>
                    <option value="chart">Chart View</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Two-Factor Authentication
                  </label>
                  <button className="btn btn-primary">
                    Enable 2FA
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          <div>
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl mb-6">Account Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-600">Not set</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Created
                  </label>
                  <p className="text-gray-600">Just now</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Login
                  </label>
                  <p className="text-gray-600">Just now</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
                <button className="btn w-full bg-red-600 text-white hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
