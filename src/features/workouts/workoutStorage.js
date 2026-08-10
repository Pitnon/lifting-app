export const ACTIVE_WORKOUT_STORAGE_KEY = "activeWorkoutLog";

const STORAGE_VERSION = 1;

function normalizeSet(set, exerciseIndex, setIndex) {
  return {
    id:
      typeof set?.id === "string" && set.id
        ? set.id
        : `restored-${exerciseIndex}-${setIndex}`,
    weight: typeof set?.weight === "string" ? set.weight : "",
    reps: typeof set?.reps === "string" ? set.reps : "",
  };
}

function normalizeExercise(exercise, exerciseIndex) {
  if (
    typeof exercise?.id !== "string" ||
    !exercise.id ||
    typeof exercise?.name !== "string" ||
    !exercise.name ||
    !Array.isArray(exercise.sets) ||
    exercise.sets.length === 0
  ) {
    return null;
  }

  return {
    id: exercise.id,
    name: exercise.name,
    notes: typeof exercise.notes === "string" ? exercise.notes : "",
    completed: exercise.completed === true,
    sets: exercise.sets.map((set, setIndex) =>
      normalizeSet(set, exerciseIndex, setIndex),
    ),
  };
}

export function loadActiveWorkout(fallbackFactory) {
  try {
    const savedValue = localStorage.getItem(ACTIVE_WORKOUT_STORAGE_KEY);

    if (!savedValue) {
      return fallbackFactory();
    }

    const savedWorkout = JSON.parse(savedValue);

    if (
      savedWorkout?.version !== STORAGE_VERSION ||
      !Array.isArray(savedWorkout.exercises)
    ) {
      return fallbackFactory();
    }

    const exercises = savedWorkout.exercises
      .map(normalizeExercise)
      .filter(Boolean);

    return exercises.length > 0 ? exercises : fallbackFactory();
  } catch {
    return fallbackFactory();
  }
}

export function saveActiveWorkout(exercises) {
  try {
    const workoutData = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      exercises,
    };

    localStorage.setItem(
      ACTIVE_WORKOUT_STORAGE_KEY,
      JSON.stringify(workoutData),
    );
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}
