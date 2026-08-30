import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import SplitBuilder from './features/splits/SplitBuilder';
import WorkoutLogger from './features/workouts/WorkoutLogger';
import createDayGif from './gifs/CreateDay.gif';
import createExerciseGif from './gifs/CreateExercise.gif';
import createSetGif from './gifs/CreateSet.gif';


function NavBar() {
  var navigate = useNavigate();
  var location = useLocation();

  function goBack() {
    navigate(-1);
  }

  var leftButton = null;
  if (location.pathname != '/' && location.pathname != '/split') {
    leftButton = (
      <button
        onClick={goBack}
        style={{
          backgroundColor: '#18181b',
          color: '#d4d4d8',
          border: '1px solid #3f3f46',
          padding: '4px 10px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        &larr; Back to Split
      </button>
    );
  }

  var splitColor = '#a1a1aa';
  var splitBg = 'transparent';
  var splitBorder = '1px solid transparent';
  if (location.pathname == '/' || location.pathname == '/split') {
    splitColor = '#60a5fa';
    splitBg = '#172554';
    splitBorder = '1px solid #3b82f6';
  }

  var workoutColor = '#a1a1aa';
  var workoutBg = 'transparent';
  var workoutBorder = '1px solid transparent';
  if (location.pathname == '/workout') {
    workoutColor = '#34d399';
    workoutBg = '#064e3b';
    workoutBorder = '1px solid #10b981';
  }

  var guideColor = '#a1a1aa';
  var guideBg = 'transparent';
  var guideBorder = '1px solid transparent';
  if (location.pathname == '/guide') {
    guideColor = '#c084fc';
    guideBg = '#3b0764';
    guideBorder = '1px solid #a855f7';
  }

  return (
    <nav style={{
      backgroundColor: '#0c0c0e',
      borderBottom: '1px solid #27272a',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'monospace',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {leftButton}
      </div>

      <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
        <Link to="/" style={{ color: splitColor, backgroundColor: splitBg, border: splitBorder, textDecoration: 'none', padding: '5px 10px' }}>
          Split
        </Link>
        <Link to="/workout" style={{ color: workoutColor, backgroundColor: workoutBg, border: workoutBorder, textDecoration: 'none', padding: '5px 10px' }}>
          Workouts
        </Link>
        <Link to="/guide" style={{ color: guideColor, backgroundColor: guideBg, border: guideBorder, textDecoration: 'none', padding: '5px 10px' }}>
          Guide
        </Link>
      </div>
    </nav>
  );
}

function Guide() {
  const containerStyle = {
    maxWidth: '750px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
    color: '#c5c9ce',
    lineHeight: '1.6'
  };

  const sectionStyle = {
    marginBottom: '32px'
  };

  const headingStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const gifStyle = {
    border: '1px solid #d1d5db',
    display: 'block',
    marginTop: '12px'
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
        How to Use the Split Builder
      </h1>

      <p style={{ marginBottom: '24px' }}>
        Here is a quick guide on how to use the split builder page. It is pretty easy to figure out once you know where everything is.
      </p>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Making your workout days</h2>
        <p>
          When you first open up the site you land right on the split builder page. To start off, just click on the text box and type in the name of the day you want to make, like Legs or Push. After you type it out, click the Add Workout Day button. That will create the day and put it right on your screen.
        </p>
        <img src="/src/gifs/CreateDay.gif" alt="" style={gifStyle} />
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Adding your exercises</h2>
        <p>
          Once your day is on the screen you can start adding lifts to it. Click on the text box that says add exercise and type in whatever you are doing, like Squats or Bench Press. Click add and it will show up in the list under that day. You can keep adding more exercises, and if you mess up you can just click remove to get rid of them.
        </p>
        <img src="/src/gifs/CreateExercise.gif" alt="" style={gifStyle} />
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Tracking your sets, reps, and notes</h2>
        <p>
          When you click on any exercise in your list, it opens up the workout section for that movement. This is where you actually log what you lifted, you can enter your weight and reps, like for instance, 255 lbs for 5 reps. There is also a spot for training notes if you want to write down things like seat height/angle or how hard the set was. Once you finish all your sets, click the Complete Exercise button.
        </p>
        <img src="/src/gifs/CreateSet.gif" alt="" style={gifStyle} />
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>What the colors mean</h2>
        <p>
          The app changes colors so you can quickly see what you have done and what you still need to do.
        </p>
        <ul>
          <li
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#000000',
                border: '1px solid #3f3f46',
                color: '#d4d4d8',
                padding: '7px 10px',
                marginBottom: '6px',
                fontSize: '13px'
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#27272a',
                  border: '1px solid #71717a',
                  display: 'inline-block',
                  flexShrink: 0
                }}
              ></span>
              <p style={{ margin: 0 }}>Gray means you have not started the exercise yet.</p>
            </li>

            <li
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#422006',
                border: '1px solid #ca8a04',
                color: '#fef08a',
                padding: '7px 10px',
                marginBottom: '6px',
                fontSize: '13px'
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#eab308',
                  border: '1px solid #facc15',
                  display: 'inline-block',
                  flexShrink: 0
                }}
              ></span>
              <p style={{ margin: 0 }}>Yellow/Orange means it is in progress or incomplete.</p>
            </li>

            <li
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#052e16',
                border: '1px solid #16a34a',
                color: '#bbf7d0',
                padding: '7px 10px',
                marginBottom: '6px',
                fontSize: '13px'
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  border: '1px solid #4ade80',
                  display: 'inline-block',
                  flexShrink: 0
                }}
              ></span>
              <p style={{ margin: 0 }}>Green means you finished it and clicked complete.</p>
            </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Saving your stuff</h2>
        <p>
          The app will autosave your workouts as you go so you do not lose anything. If you want to be extra safe, you can also just hit the manual save button whenever you want before closing the page.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh' }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<SplitBuilder />} />
        <Route path="/split" element={<SplitBuilder />} />
        <Route path="/workout" element={<WorkoutLogger />} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
    </div>
  );
}

export default App;
