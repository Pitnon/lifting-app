import React, {useState} from 'react';

export default function SplitBuilder() {
    const [days, setDays] = useState([
    { id: 1, dayName: 'Day 1 - Push', exercises: ['Incline Dumbbell Press', 'Dips', 'Tricep Pushdowns'] },
    { id: 2, dayName: 'Day 2 - Pull', exercises: ['Pullups', 'Barbell Rows', 'Bicep Curls'] }
  ]);
  const [newDayName, setNewDayName] = useState('');
  const [newExerciseText, setNewExerciseText] = useState({});

  function addDay() {
    if (newDayName == '') {
      return;
    }
    var newDay = {
      id: Date.now(),
      dayName: newDayName,
      exercises: []
    };
    var updatedDays = [];
    for (var i = 0; i < days.length; i++) {
      updatedDays.push(days[i]);
    }
    updatedDays.push(newDay);
    setDays(updatedDays);
    setNewDayName('');
  }

  function deleteDay(id) {
    var updatedDays = [];
    for (var i = 0; i < days.length; i++) {
      if (days[i].id != id) {
        updatedDays.push(days[i]);
      }
    }
    setDays(updatedDays);
  }

  function handleDeleteDayClick(event) {
    var id = Number(event.currentTarget.getAttribute('data-id'));
    deleteDay(id);
  }

  function handleExerciseInputChange(event) {
    var dayId = Number(event.target.getAttribute('data-dayid'));
    var value = event.target.value;
    
    var updatedText = {};
    for (var key in newExerciseText) {
      updatedText[key] = newExerciseText[key];
    }
    updatedText[dayId] = value;
    setNewExerciseText(updatedText);
  }

  function addExercise(dayId) {
    var exerciseName = newExerciseText[dayId];
    if (!exerciseName) {
      return;
    }
    if (exerciseName == '') {
      return;
    }

    var updatedDays = [];
    for (var i = 0; i < days.length; i++) {
      var currentDay = days[i];
      if (currentDay.id == dayId) {
        var newExercisesList = [];
        for (var j = 0; j < currentDay.exercises.length; j++) {
          newExercisesList.push(currentDay.exercises[j]);
        }
        newExercisesList.push(exerciseName.trim());
        
        var updatedDayObj = {
          id: currentDay.id,
          dayName: currentDay.dayName,
          exercises: newExercisesList
        };
        updatedDays.push(updatedDayObj);
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

  function handleAddExerciseClick(event) {
    var dayId = Number(event.currentTarget.getAttribute('data-dayid'));
    addExercise(dayId);
  }

  function removeExercise(dayId, exerciseIndex) {
    var updatedDays = [];
    for (var i = 0; i < days.length; i++) {
      var currentDay = days[i];
      if (currentDay.id == dayId) {
        var newExercisesList = [];
        for (var j = 0; j < currentDay.exercises.length; j++) {
          if (j != exerciseIndex) {
            newExercisesList.push(currentDay.exercises[j]);
          }
        }
        var updatedDayObj = {
          id: currentDay.id,
          dayName: currentDay.dayName,
          exercises: newExercisesList
        };
        updatedDays.push(updatedDayObj);
      } else {
        updatedDays.push(currentDay);
      }
    }
    setDays(updatedDays);
  }

  function handleRemoveExerciseClick(event) {
    var dayId = Number(event.currentTarget.getAttribute('data-dayid'));
    var index = Number(event.currentTarget.getAttribute('data-index'));
    removeExercise(dayId, index);
  }

  function handleNewDayNameChange(event) {
    setNewDayName(event.target.value);
  }

  function saveSplitToLocalStorage() {
    localStorage.setItem('workoutSplit', JSON.stringify(days));
    alert('Split saved to local storage!');
  }

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#f3f4f6', padding: '27px 15px', fontFamily: 'monospace' }}>
      <header style={{ marginBottom: '23px', borderBottom: '2px solid #27272a', paddingBottom: '9px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Workout Split Builder</h1>
        <p style={{ color: '#71717a', fontSize: '13px', margin: '0' }}>Customize your weekly routine and plan exercises</p>
      </header>

      <div style={{ display: 'flex', gap: '9px', marginBottom: '29px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="e.g. Day 3 - Legs" value={newDayName} onChange={handleNewDayNameChange} style={{padding: '9px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#ffffff', flex: '1', minWidth: '220px'}} />
        <button onClick={addDay} style={{padding: '9px 15px', backgroundColor: '#1d4ed8', color: '#ffffff', border: '1px solid #3b82f6', cursor: 'pointer', fontWeight: '600'}}>Add Workout Day</button>
        <button onClick={saveSplitToLocalStorage} style={{padding: '9px 15px', backgroundColor: '#15803d', color: '#ffffff', border: '1px solid #22c55e', cursor: 'pointer', fontWeight: '600'}}>Save Split Data</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '17px' }}>
        {days.map(function(day) {
          return (
            <div key={day.id} style={{backgroundColor: '#141416', border: '1px solid #27272a', padding: '13px 18px 22px 18px'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '13px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>{day.dayName}</h3>
                <button data-id={day.id} onClick={handleDeleteDayClick} style={{backgroundColor: '#b91c1c', color: '#ffffff', border: '1px solid #ef4444', padding: '4px 8px', cursor: 'pointer', fontSize: '11px'}}>Delete Day</button>
              </div>

              <div style={{ marginBottom: '17px' }}>
                {day.exercises.length == 0 && <p style={{color: '#71717a', fontSize: '12px', fontStyle: 'italic', margin: '5px 0'}}>No exercises added yet.</p>}
                {day.exercises.length > 0 && <ul style={{listStyleType: 'none', padding: '0', margin: '0'}}>
                  {day.exercises.map(function(exercise, index) {
                    return (
                      <li key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#202023', padding: '7px 11px', borderBottom: '1px solid #2d2d30', marginBottom: '4px', fontSize: '13px'}}>
                        <span>{exercise}</span>
                        <button data-dayid={day.id} data-index={index} onClick={handleRemoveExerciseClick} style={{backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: '0 3px'}}>X</button>
                      </li>
                    );
                  })}
                </ul>}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="text" placeholder="Add exercise" data-dayid={day.id} value={newExerciseText[day.id] || ''} onChange={handleExerciseInputChange} style={{flex: '1', padding: '6px 10px', backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#ffffff', fontSize: '12px'}} />
                <button data-dayid={day.id} onClick={handleAddExerciseClick} style={{padding: '6px 12px', backgroundColor: '#4338ca', color: '#ffffff', border: '1px solid #6366f1', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}>Add</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}