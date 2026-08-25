import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import SplitBuilder from './features/splits/SplitBuilder';
import WorkoutLogger from './features/workouts/WorkoutLogger';

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
  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '92vh', color: '#f3f4f6', padding: '30px 20px', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Guide</h1>
        <p style={{ color: '#71717a', fontSize: '13px' }}>Guide placeholder.</p>
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
