// Add Enter Keybind to Enter Values in textboxes
// Work on implementation with Brady's individual lifts.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

var DEFAULT_DAYS = [
  {
    id: 2,
    dayName: 'Day 2 - Pull',
    exercises: [
      { id: 'pullups-2', name: 'Pullups' },
      { id: 'barbell-rows-2', name: 'Barbell Rows' },
      { id: 'bicep-curls-2', name: 'Bicep Curls' }
    ]
  },
  {
    id: 1,
    dayName: 'Day 1 - Push',
    exercises: [
      { id: 'incline-db-1', name: 'Incline Dumbbell Press' },
      { id: 'dips-1', name: 'Dips' },
      { id: 'tricep-push-1', name: 'Tricep Pushdowns' }
    ]
  }
];

function loadSavedDays() {
  var saved = localStorage.getItem('workoutSplit');
  if (!saved) {
    return DEFAULT_DAYS;
  }
  
  var parsed = JSON.parse(saved);
  var cleaned = [];
  for (var i = 0; i < parsed.length; i++) {
    var day = parsed[i];
    var exercisesList = [];

    var currentDayId = day.id;
    if (!currentDayId) {
      currentDayId = Date.now() + i;
    }

    if (day.exercises) {
      for (var j = 0; j < day.exercises.length; j++) {
        var item = day.exercises[j];
        if (typeof item == 'string') {
          exercisesList.push({
            id: 'ex-' + currentDayId + '-' + j,
            name: item
          });
        } else {
          var exId = item.id;
          if (!exId) {
            exId = 'ex-' + currentDayId + '-' + j;
          }
          exercisesList.push({
            id: exId,
            name: item.name
          });
        }
      }
    }

    var currentDayName = day.dayName;
    if (!currentDayName) {
      currentDayName = 'Workout Day';
    }

    cleaned.push({
      id: currentDayId,
      dayName: currentDayName,
      exercises: exercisesList
    });
  }
  return cleaned;
}

export default function SplitBuilder() {
  var navigate = useNavigate();
  var [days, setDays] = useState(loadSavedDays);
  var [newDayName, setNewDayName] = useState('');
  var [newExerciseText, setNewExerciseText] = useState({});
  var [activeWorkoutExercises, setActiveWorkoutExercises] = useState([]);

  useEffect(function() {
    localStorage.setItem('workoutSplit', JSON.stringify(days));
  }, [days]);

  useEffect(function() {
    var savedWorkout = localStorage.getItem('activeWorkoutLog');
    if (savedWorkout) {
      var parsed = JSON.parse(savedWorkout);
      if (parsed.exercises) {
        setActiveWorkoutExercises(parsed.exercises);
      }
    }
  }, []);

  function getExerciseStatus(exerciseId) {
    if (!activeWorkoutExercises || activeWorkoutExercises.length == 0) {
      return 'not-started';
    }

    var match = null;
    for (var i = 0; i < activeWorkoutExercises.length; i++) {
      if (activeWorkoutExercises[i].id == exerciseId) {
        match = activeWorkoutExercises[i];
        break;
      }
    }

    if (!match) {
      return 'not-started';
    }

    if (match.completed) {
      return 'complete';
    }

    var hasData = false;
    if (match.notes && match.notes.trim() != '') {
      hasData = true;
    }
    if (match.sets) {
      for (var s = 0; s < match.sets.length; s++) {
        if ((match.sets[s].weight && match.sets[s].weight != '') || (match.sets[s].reps && match.sets[s].reps != '')) {
          hasData = true;
          break;
        }
      }
    }

    if (hasData) {
      return 'in-progress';
    } else {
      return 'not-started';
    }
  }

  function handleExerciseClick(exercise) {
    var savedWorkout = localStorage.getItem('activeWorkoutLog');
    var exerciseList = [];

    if (savedWorkout) {
      var parsed = JSON.parse(savedWorkout);
      if (parsed.exercises) {
        for (var k = 0; k < parsed.exercises.length; k++) {
          if (parsed.exercises[k].id != exercise.id) {
            exerciseList.push(parsed.exercises[k]);
          }
        }
      }
    }

    var targetItem = {
      id: exercise.id,
      name: exercise.name,
      notes: '',
      completed: false,
      sets: [
        {
          id: 'set-' + Date.now(),
          weight: '',
          reps: ''
        }
      ]
    };

    var updatedList = [targetItem];
    for (var m = 0; m < exerciseList.length; m++) {
      updatedList.push(exerciseList[m]);
    }

    var payload = {
      version: 1,
      savedAt: new Date().toString(),
      exercises: updatedList
    };

    localStorage.setItem('activeWorkoutLog', JSON.stringify(payload));
    setActiveWorkoutExercises(updatedList);

    navigate('/workout?exercise=' + encodeURIComponent(exercise.name));
  }

  function addDay() {
    if (newDayName.trim() == '') {
      return;
    }
    var newDay = {
      id: Date.now(),
      dayName: newDayName.trim(),
      exercises: []
    };

    var updatedDays = [newDay];
    for (var i = 0; i < days.length; i++) {
      updatedDays.push(days[i]);
    }

    setDays(updatedDays);
    setNewDayName('');
  }

  function handleNewDayKeyDown(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      addDay();
    }
  }

  function deleteDay(id) {
    var dayToDelete = null;
    for (var d = 0; d < days.length; d++) {
      if (days[d].id == id) {
        dayToDelete = days[d];
        break;
      }
    }

    if (dayToDelete && dayToDelete.exercises) {
      var rawLog = localStorage.getItem('activeWorkoutLog');
      if (rawLog) {
        var parsedLog = JSON.parse(rawLog);
        if (parsedLog.exercises) {
          var filteredLogs = [];
          for (var m = 0; m < parsedLog.exercises.length; m++) {
            var isDeleted = false;
            for (var e = 0; e < dayToDelete.exercises.length; e++) {
              if (dayToDelete.exercises[e].id == parsedLog.exercises[m].id) {
                isDeleted = true;
                break;
              }
            }
            if (!isDeleted) {
              filteredLogs.push(parsedLog.exercises[m]);
            }
          }
          parsedLog.exercises = filteredLogs;
          localStorage.setItem('activeWorkoutLog', JSON.stringify(parsedLog));
          setActiveWorkoutExercises(filteredLogs);
        }
      }
    }

    var updatedDays = [];
    for (var i = 0; i < days.length; i++) {
      if (days[i].id != id) {
        updatedDays.push(days[i]);
      }
    }
    setDays(updatedDays);
  }

  function handleExerciseInputChange(event) {
    var dayId = event.target.getAttribute('data-dayid');
    var value = event.target.value;
    var updated = {};
    for (var key in newExerciseText) {
      updated[key] = newExerciseText[key];
    }
    updated[dayId] = value;
    setNewExerciseText(updated);
  }

  function addExercise(dayId) {
    var exerciseName = newExerciseText[dayId];
    if (!exerciseName || exerciseName.trim() == '') {
      return;
    }

    var newExerciseObj = {
      id: 'ex-' + dayId + '-' + Date.now(),
      name: exerciseName.trim()
    };

    var updatedDays = [];
    for (var i = 0; i < days.length; i++) {
      var currentDay = days[i];
      if (currentDay.id == dayId) {
        var updatedExercises = [];
        for (var j = 0; j < currentDay.exercises.length; j++) {
          updatedExercises.push(currentDay.exercises[j]);
        }
        updatedExercises.push(newExerciseObj);

        updatedDays.push({
          id: currentDay.id,
          dayName: currentDay.dayName,
          exercises: updatedExercises
        });
      } else {
        updatedDays.push(currentDay);
      }
    }
    setDays(updatedDays);

    var updatedText = {};
    for (var k in newExerciseText) {
      updatedText[k] = newExerciseText[k];
    }
    updatedText[dayId] = '';
    setNewExerciseText(updatedText);
  }

  function handleExerciseKeyDown(event, dayId) {
    if (event.key == 'Enter') {
      event.preventDefault();
      addExercise(dayId);
    }
  }

  function removeExercise(dayId, exerciseId) {
    var rawLog = localStorage.getItem('activeWorkoutLog');
    if (rawLog) {
      var parsedLog = JSON.parse(rawLog);
      if (parsedLog.exercises) {
        var filteredLogs = [];
        for (var m = 0; m < parsedLog.exercises.length; m++) {
          if (parsedLog.exercises[m].id != exerciseId) {
            filteredLogs.push(parsedLog.exercises[m]);
          }
        }
        parsedLog.exercises = filteredLogs;
        localStorage.setItem('activeWorkoutLog', JSON.stringify(parsedLog));
        setActiveWorkoutExercises(filteredLogs);
      }
    }

    var updatedDays = [];
    for (var i = 0; i < days.length; i++) {
      var currentDay = days[i];
      if (currentDay.id == dayId) {
        var filteredExercises = [];
        for (var j = 0; j < currentDay.exercises.length; j++) {
          if (currentDay.exercises[j].id != exerciseId) {
            filteredExercises.push(currentDay.exercises[j]);
          }
        }
        updatedDays.push({
          id: currentDay.id,
          dayName: currentDay.dayName,
          exercises: filteredExercises
        });
      } else {
        updatedDays.push(currentDay);
      }
    }
    setDays(updatedDays);
  }

  function saveSplitToLocalStorage() {
    localStorage.setItem('workoutSplit', JSON.stringify(days));
    alert('Split saved to local storage!');
  }

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '92vh', color: '#f3f4f6', padding: '27px 15px', fontFamily: 'monospace' }}>
      <header style={{ marginBottom: '23px', borderBottom: '2px solid #27272a', paddingBottom: '12px' }}>
        <button
          onClick={function() { navigate(-1); }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#60a5fa',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            padding: '0 0 10px 0'
          }}
        >
          &larr; Back
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Workout Split Builder</h1>
            <p style={{ color: '#71717a', fontSize: '13px', margin: '0' }}>
              Newest days appear on the left. Click any exercise to open its workout.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#141416', border: '1px solid #27272a', padding: '6px 12px', fontSize: '11px' }}>
            <span style={{ color: '#71717a', fontWeight: 'bold' }}>Status:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#a1a1aa' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000', border: '1px solid #71717a', display: 'inline-block' }}></span>
              Not Started
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#facc15' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308', border: '1px solid #ca8a04', display: 'inline-block' }}></span>
              In Progress
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4ade80' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', border: '1px solid #16a34a', display: 'inline-block' }}></span>
              Complete
            </span>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '9px', marginBottom: '29px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="e.g. Day 3 - Legs (Press Enter)"
          value={newDayName}
          onChange={function(e) { setNewDayName(e.target.value); }}
          onKeyDown={handleNewDayKeyDown}
          style={{ padding: '9px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#ffffff', flex: '1', minWidth: '220px' }}
        />
        <button
          onClick={addDay}
          style={{ padding: '9px 15px', backgroundColor: '#1d4ed8', color: '#ffffff', border: '1px solid #3b82f6', cursor: 'pointer', fontWeight: '600' }}
        >
          Add Workout Day
        </button>
        <button
          onClick={saveSplitToLocalStorage}
          style={{ padding: '9px 15px', backgroundColor: '#15803d', color: '#ffffff', border: '1px solid #22c55e', cursor: 'pointer', fontWeight: '600' }}
        >
          Save Split Data
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '17px', alignItems: 'start' }}>
        {days.map(function(day) {
          var inputVal = '';
          if (newExerciseText[day.id]) {
            inputVal = newExerciseText[day.id];
          }

          return (
            <div key={day.id} style={{ backgroundColor: '#141416', border: '1px solid #27272a', padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '13px', borderBottom: '1px solid #27272a', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0' }}>{day.dayName}</h3>
                <button
                  onClick={function() { deleteDay(day.id); }}
                  style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', border: '1px solid #ef4444', padding: '3px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                >
                  Delete
                </button>
              </div>

              <div style={{ marginBottom: '17px' }}>
                {day.exercises.length == 0 && (
                  <p style={{ color: '#71717a', fontSize: '12px', fontStyle: 'italic', margin: '5px 0' }}>No exercises added yet.</p>
                )}

                {day.exercises.length > 0 && (
                  <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                    {day.exercises.map(function(exercise) {
                      var status = getExerciseStatus(exercise.id);

                      var itemBg = '#000000';
                      var itemBorder = '#3f3f46';
                      var dotBg = '#27272a';
                      var dotBorder = '#71717a';
                      var textColor = '#d4d4d8';

                      if (status == 'complete') {
                        itemBg = '#052e16';
                        itemBorder = '#16a34a';
                        dotBg = '#22c55e';
                        dotBorder = '#4ade80';
                        textColor = '#bbf7d0';
                      } else if (status == 'in-progress') {
                        itemBg = '#422006';
                        itemBorder = '#ca8a04';
                        dotBg = '#eab308';
                        dotBorder = '#facc15';
                        textColor = '#fef08a';
                      }

                      return (
                        <li
                          key={exercise.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: itemBg,
                            border: '1px solid ' + itemBorder,
                            padding: '7px 10px',
                            marginBottom: '6px',
                            fontSize: '13px'
                          }}
                        >
                          <div
                            onClick={function() { handleExerciseClick(exercise); }}
                            title={'Click to log ' + exercise.name}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: textColor,
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            <span style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              backgroundColor: dotBg,
                              border: '1px solid ' + dotBorder,
                              display: 'inline-block',
                              flexShrink: 0
                            }}></span>
                            <span>{exercise.name}</span>
                          </div>

                          <button
                            onClick={function() { removeExercise(day.id, exercise.id); }}
                            style={{ backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: '0 4px' }}
                            title="Remove exercise"
                          >
                            &times;
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Add exercise (Press Enter)"
                  data-dayid={day.id}
                  value={inputVal}
                  onChange={handleExerciseInputChange}
                  onKeyDown={function(e) { handleExerciseKeyDown(e, day.id); }}
                  style={{ flex: '1', padding: '6px 9px', backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#ffffff', fontSize: '12px' }}
                />
                <button
                  onClick={function() { addExercise(day.id); }}
                  style={{ padding: '6px 12px', backgroundColor: '#4338ca', color: '#ffffff', border: '1px solid #6366f1', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                >
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
