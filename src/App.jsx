import SplitBuilder from "./features/splits/SplitBuilder";
import WorkoutLogger from "./features/workouts/WorkoutLogger";
import { Routes, Route, Link } from "react-router-dom";

//Temporary Function
function Choice() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 font-mono text-zinc-100">
      <div className="mx-auto max-w-3xl">
        <p className="mb-5 max-w-2xl text-sm leading-6 text-zinc-400">
          I have it set up this way temporarily so that before we merge we can
          work on our own parts of the project.
        </p>

        <div className="flex flex-wrap gap-3 border-t border-zinc-800 pt-5">
          <Link
            to="/split"
            className="border border-blue-500 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Split Builder
          </Link>

          <Link
            to="/workout"
            className="border border-emerald-500 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Workouts
          </Link>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Choice />} />
      <Route path="/split" element={<SplitBuilder />} />
      <Route path="/workout" element={<WorkoutLogger />} />
    </Routes>
  );
}

export default App;
