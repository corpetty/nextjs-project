export default function PortfolioPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl mb-2">Portfolio</h1>
          <p className="text-gray-600">View and manage your cryptocurrency holdings</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2">
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl mb-4">Portfolio Value</h2>
              <div className="text-3xl font-bold text-blue-600">$0.00 USD</div>
              <p className="text-gray-600 mt-2">No assets found</p>
            </section>

            <section className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-2xl mb-4">Holdings</h2>
              <div className="text-gray-600 text-center py-8">
                No holdings to display. Add an address to get started.
              </div>
            </section>
          </div>

          <div>
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl mb-4">Distribution</h2>
              <div className="text-gray-600 text-center py-8">
                No data to display
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-2xl mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button className="btn btn-primary w-full">
                  Add New Address
                </button>
                <button className="btn btn-secondary w-full">
                  Import Portfolio
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
