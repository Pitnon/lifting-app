import { useState } from 'react';

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
    <main className="min-h-screen bg-zinc-950 px-[15px] py-[27px] font-mono text-zinc-100">
      <header className="mb-[23px] border-b-2 border-zinc-800 pb-[9px]">
        <h1 className="mb-[5px] text-[26px] font-bold text-white">Workout Split Builder</h1>
        <p className="text-[13px] text-zinc-500">Customize your weekly routine and plan exercises</p>
      </header>

      <div className="mb-[29px] flex flex-wrap gap-[9px]">
        <input type="text" placeholder="e.g. Day 3 - Legs" value={newDayName} onChange={handleNewDayNameChange} className="min-w-[220px] flex-1 border border-zinc-700 bg-zinc-900 p-[9px] text-white outline-none focus:border-blue-500" />
        <button onClick={addDay} className="cursor-pointer border border-blue-500 bg-blue-700 px-[15px] py-[9px] font-semibold text-white hover:bg-blue-600">Add Workout Day</button>
        <button onClick={saveSplitToLocalStorage} className="cursor-pointer border border-green-500 bg-green-700 px-[15px] py-[9px] font-semibold text-white hover:bg-green-600">Save Split Data</button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[17px]">
        {days.map(function(day) {
          return (
            <div key={day.id} className="border border-zinc-800 bg-zinc-900 px-[18px] pb-[22px] pt-[13px]">
              <div className="mb-[13px] flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">{day.dayName}</h3>
                <button data-id={day.id} onClick={handleDeleteDayClick} className="cursor-pointer border border-red-500 bg-red-700 px-2 py-1 text-[11px] text-white hover:bg-red-600">Delete Day</button>
              </div>

              <div className="mb-[17px]">
                {day.exercises.length == 0 && <p className="my-[5px] text-xs italic text-zinc-500">No exercises added yet.</p>}
                {day.exercises.length > 0 && <ul className="m-0 list-none p-0">
                  {day.exercises.map(function(exercise, index) {
                    return (
                      <li key={index} className="mb-1 flex items-center justify-between gap-3 border-b border-zinc-700 bg-zinc-800/80 px-[11px] py-[7px] text-[13px]">
                        <span>{exercise}</span>
                        <button data-dayid={day.id} data-index={index} onClick={handleRemoveExerciseClick} className="cursor-pointer bg-transparent px-[3px] text-[13px] font-bold text-red-500 hover:text-red-400">X</button>
                      </li>
                    );
                  })}
                </ul>}
              </div>

              <div className="flex gap-[6px]">
                <input type="text" placeholder="Add exercise" data-dayid={day.id} value={newExerciseText[day.id] || ''} onChange={handleExerciseInputChange} className="flex-1 border border-zinc-700 bg-zinc-950 px-[10px] py-[6px] text-xs text-white outline-none focus:border-indigo-500" />
                <button data-dayid={day.id} onClick={handleAddExerciseClick} className="cursor-pointer border border-indigo-500 bg-indigo-700 px-3 py-[6px] text-xs font-semibold text-white hover:bg-indigo-600">Add</button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
