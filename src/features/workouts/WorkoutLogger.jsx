import { useState } from "react";
import { Link } from "react-router-dom";

const STARTER_EXERCISES = [
  { id: "bench-press", name: "Bench Press" },
  { id: "barbell-row", name: "Barbell Row" },
  { id: "overhead-press", name: "Overhead Press" },
];

function createSet() {
  return {
    id: `set-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    weight: "",
    reps: "",
  };
}

function createStarterLog() {
  return STARTER_EXERCISES.map((exercise) => ({
    ...exercise,
    sets: [createSet()],
  }));
}

function SetRow({ exerciseId, index, set, canRemove, onChange, onRemove }) {
  function handleWeightChange(event) {
    onChange(exerciseId, set.id, "weight", event.target.value);
  }

  function handleRepsChange(event) {
    onChange(exerciseId, set.id, "reps", event.target.value);
  }

  function handleRemove() {
    onRemove(exerciseId, set.id);
  }

  return (
    <div className="grid grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_34px] items-end gap-1.5 sm:grid-cols-[42px_minmax(0,1fr)_minmax(0,1fr)_40px] sm:gap-2">
      <div className="pb-2 text-xs font-semibold text-zinc-500">
        #{index + 1}
      </div>

      <label className="grid min-w-0 gap-1 text-xs font-semibold text-zinc-400">
        Weight
        <input
          type="number"
          min="0"
          inputMode="decimal"
          value={set.weight}
          onChange={handleWeightChange}
          className="min-w-0 border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
        />
      </label>

      <label className="grid min-w-0 gap-1 text-xs font-semibold text-zinc-400">
        Reps
        <input
          type="number"
          min="0"
          inputMode="numeric"
          value={set.reps}
          onChange={handleRepsChange}
          className="min-w-0 border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
        />
      </label>

      <button
        type="button"
        onClick={handleRemove}
        disabled={!canRemove}
        aria-label={`Remove set ${index + 1}`}
        title="Remove set"
        className="h-[38px] min-w-0 border border-red-500/60 bg-red-900/40 text-sm font-bold text-red-200 enabled:hover:bg-red-800/70 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-600"
      >
        X
      </button>
    </div>
  );
}

function ExerciseLogCard({ exercise, onAddSet, onRemoveSet, onSetChange }) {
  function handleAddSet() {
    onAddSet(exercise.id);
  }

  return (
    <article className="border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">{exercise.name}</h2>
        <span className="border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs font-semibold text-zinc-400">
          {exercise.sets.length} {exercise.sets.length === 1 ? "set" : "sets"}
        </span>
      </div>

      <div className="grid gap-3">
        {exercise.sets.map((set, index) => (
          <SetRow
            key={set.id}
            exerciseId={exercise.id}
            index={index}
            set={set}
            canRemove={exercise.sets.length > 1}
            onChange={onSetChange}
            onRemove={onRemoveSet}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddSet}
        className="mt-4 border border-indigo-500 bg-indigo-700 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
      >
        Add Set
      </button>
    </article>
  );
}

export default function WorkoutLogger() {
  const [exercises, setExercises] = useState(createStarterLog);

  function addSet(exerciseId) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: [...exercise.sets, createSet()],
        };
      }),
    );
  }

  function removeSet(exerciseId, setId) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId || exercise.sets.length === 1) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.filter((set) => set.id !== setId),
        };
      }),
    );
  }

  function updateSet(exerciseId, setId, field, value) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id !== setId) {
              return set;
            }

            return {
              ...set,
              [field]: value,
            };
          }),
        };
      }),
    );
  }

  function resetLog() {
    setExercises(createStarterLog());
  }

  const totalSets = exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-7 font-mono text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 border-b-2 border-zinc-800 pb-4">
          <Link
            to="/"
            className="mb-4 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            Back
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Active Workout Log
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Enter sets, reps, and weight for a starter lifting session.
              </p>
            </div>

            <button
              type="button"
              onClick={resetLog}
              className="border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
            >
              Reset Log
            </button>
          </div>
        </header>

        <section className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Exercises
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {exercises.length}
            </p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Set Rows
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{totalSets}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {exercises.map((exercise) => (
            <ExerciseLogCard
              key={exercise.id}
              exercise={exercise}
              onAddSet={addSet}
              onRemoveSet={removeSet}
              onSetChange={updateSet}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
