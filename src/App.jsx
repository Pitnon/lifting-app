function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Workout Split Tracker
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            React, Vite, and TailwindCSS are ready.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            This starter is prepared for a browser-based lifting tracker. App
            state and JSON-backed localStorage features can be added in the
            dedicated folders when the product logic is ready.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {['React app shell', 'Tailwind styling', 'Future tracker folders'].map(
            (item) => (
              <div
                className="rounded-lg border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30"
                key={item}
              >
                <p className="text-sm font-medium text-emerald-300">Ready</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{item}</h2>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  )
}

export default App
