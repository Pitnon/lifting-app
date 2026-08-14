import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  loadActiveWorkout,
  saveActiveWorkout,
} from "./workoutStorage";

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
  return STARTER_EXERCISES.map((exercise) =>
    createExercise(exercise.name, exercise.id),
  );
}

function createExercise(name, id = null) {
  return {
    id: id ?? `exercise-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    notes: "",
    completed: false,
    sets: [createSet()],
  };
}

function normalizeRequestedExerciseName(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedName = value.trim().replace(/\s+/g, " ").slice(0, 80);
  return normalizedName || null;
}

function namesMatch(firstName, secondName) {
  return firstName.localeCompare(secondName, undefined, {
    sensitivity: "accent",
  }) === 0;
}

function createInitialLog(requestedExerciseName) {
  const savedExercises = loadActiveWorkout(createStarterLog);

  if (
    !requestedExerciseName ||
    savedExercises.some((exercise) =>
      namesMatch(exercise.name, requestedExerciseName),
    )
  ) {
    return savedExercises;
  }

  return [...savedExercises, createExercise(requestedExerciseName)];
}

function exerciseHasData(exercise) {
  return (
    exercise.notes.trim() !== "" ||
    exercise.sets.some((set) => set.weight !== "" || set.reps !== "")
  );
}

function getExerciseStatus(exercise) {
  if (exercise.completed) {
    return "complete";
  }

  return exerciseHasData(exercise) ? "in-progress" : "not-started";
}

const STATUS_STYLES = {
  "not-started": {
    card: "border-zinc-800 bg-zinc-900",
    badge: "border-zinc-700 bg-zinc-950 text-zinc-400",
    label: "Not started",
  },
  "in-progress": {
    card: "border-yellow-500/70 bg-yellow-950/25",
    badge: "border-yellow-500/70 bg-yellow-950 text-yellow-200",
    label: "In progress",
  },
  complete: {
    card: "border-green-500/70 bg-green-950/25",
    badge: "border-green-500/70 bg-green-950 text-green-200",
    label: "Complete",
  },
};

function SetRow({
  exerciseId,
  exerciseName,
  index,
  set,
  canRemove,
  onChange,
  onRemove,
}) {
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
          aria-label={`Weight for ${exerciseName} set ${index + 1}`}
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
          aria-label={`Reps for ${exerciseName} set ${index + 1}`}
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

function ExerciseLogCard({
  exercise,
  onAddSet,
  onRemoveSet,
  onSetChange,
  onNotesChange,
  onToggleComplete,
}) {
  function handleAddSet() {
    onAddSet(exercise.id);
  }

  function handleNotesChange(event) {
    onNotesChange(exercise.id, event.target.value);
  }

  function handleToggleComplete() {
    onToggleComplete(exercise.id);
  }

  const status = getExerciseStatus(exercise);
  const statusStyles = STATUS_STYLES[status];

  return (
    <article className={`border p-4 transition-colors ${statusStyles.card}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">{exercise.name}</h2>
        <div className="flex items-center gap-2">
          <span className="border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs font-semibold text-zinc-400">
            {exercise.sets.length} {exercise.sets.length === 1 ? "set" : "sets"}
          </span>
          <span
            className={`border px-2 py-1 text-xs font-semibold ${statusStyles.badge}`}
          >
            {statusStyles.label}
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {exercise.sets.map((set, index) => (
          <SetRow
            key={set.id}
            exerciseId={exercise.id}
            exerciseName={exercise.name}
            index={index}
            set={set}
            canRemove={exercise.sets.length > 1}
            onChange={onSetChange}
            onRemove={onRemoveSet}
          />
        ))}
      </div>

      <label className="mt-4 grid gap-1 text-xs font-semibold text-zinc-400">
        Training notes
        <textarea
          value={exercise.notes}
          onChange={handleNotesChange}
          rows="2"
          aria-label={`Training notes for ${exercise.name}`}
          placeholder="Optional notes for this exercise"
          className="resize-y border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-normal text-white outline-none focus:border-blue-500"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAddSet}
          className="border border-indigo-500 bg-indigo-700 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
        >
          Add Set
        </button>
        <button
          type="button"
          onClick={handleToggleComplete}
          disabled={!exerciseHasData(exercise)}
          aria-label={
            exercise.completed
              ? `Reopen ${exercise.name}`
              : `Complete ${exercise.name}`
          }
          className="border border-green-500 bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          {exercise.completed ? "Reopen Exercise" : "Complete Exercise"}
        </button>
      </div>
    </article>
  );
}

function WorkoutLoggerSession({ requestedExerciseName }) {
  const [exercises, setExercises] = useState(() =>
    createInitialLog(requestedExerciseName),
  );

  useEffect(() => {
    saveActiveWorkout(exercises);
  }, [exercises]);

  function addSet(exerciseId) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          completed: false,
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
          completed: false,
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
          completed: false,
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

  function updateNotes(exerciseId, notes) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, notes, completed: false }
          : exercise,
      ),
    );
  }

  function toggleComplete(exerciseId) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, completed: !exercise.completed }
          : exercise,
      ),
    );
  }

  function resetLog() {
    if (!requestedExerciseName) {
      setExercises(createStarterLog());
      return;
    }

    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        namesMatch(exercise.name, requestedExerciseName)
          ? createExercise(exercise.name, exercise.id)
          : exercise,
      ),
    );
  }

  const visibleExercises = requestedExerciseName
    ? exercises.filter((exercise) =>
        namesMatch(exercise.name, requestedExerciseName),
      )
    : exercises;

  const totalSets = visibleExercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-7 font-mono text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 border-b-2 border-zinc-800 pb-4">
          <Link
            to={requestedExerciseName ? "/split" : "/"}
            className="mb-4 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            {requestedExerciseName ? "Back to Split Builder" : "Back"}
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {requestedExerciseName ?? "Active Workout Log"}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {requestedExerciseName
                  ? "Edit this exercise. Changes save automatically."
                  : "Enter sets, reps, weight, and notes. Changes save automatically."}
              </p>
              <p className="mt-2 text-xs font-semibold text-green-400">
                Autosave is on
              </p>
            </div>

            <button
              type="button"
              onClick={resetLog}
              className="border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
            >
              {requestedExerciseName ? "Reset Exercise" : "Reset Log"}
            </button>
          </div>
        </header>

        <section className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Exercises
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {visibleExercises.length}
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
          {visibleExercises.map((exercise) => (
            <ExerciseLogCard
              key={exercise.id}
              exercise={exercise}
              onAddSet={addSet}
              onRemoveSet={removeSet}
              onSetChange={updateSet}
              onNotesChange={updateNotes}
              onToggleComplete={toggleComplete}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

export default function WorkoutLogger() {
  const [searchParams] = useSearchParams();
  const requestedExerciseName = normalizeRequestedExerciseName(
    searchParams.get("exercise"),
  );

  return (
    <WorkoutLoggerSession
      key={requestedExerciseName?.toLocaleLowerCase() ?? "all-exercises"}
      requestedExerciseName={requestedExerciseName}
    />
  );
}
