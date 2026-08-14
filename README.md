# Lifting App

A React + Vite starter for a browser-based workout split and progress tracker.
TailwindCSS is configured through the Vite plugin, and the default Vite demo
has been removed.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

## Structure

- `src/components` for shared UI components.
- `src/features/splits` for the split builder.
- `src/features/workouts` for the active workout logger.
- `src/hooks` for reusable React hooks.
- `src/lib` for browser utilities such as future localStorage helpers.
- `src/data` for seed data or schemas.
- `src/styles` for shared styling files if the app grows beyond `index.css`.

## Current project scope

- Leo's split builder can add/remove workout days, add/remove exercises, and save the split JSON string to the `workoutSplit` localStorage key.
- Brady's active workout logger is built through the week of July 20 scope: set rows and notes can be edited, the active log autosaves to the `activeWorkoutLog` localStorage key, and exercise cards show yellow in-progress or green completed states.
- Brady's August 3 handoff is ready: `/workout?exercise=Exercise%20Name` opens one exercise and restores its saved logger data. The Split Builder still needs Leo's link or button to send users to that URL.
