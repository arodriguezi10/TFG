import React, { createContext, useState, useContext } from 'react';

const RoutineContext = createContext();

export function useRoutine() {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutine debe usarse dentro de RoutineProvider');
  }
  return context;
}

export function RoutineProvider({ children }) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [routineConfiguration, setRoutineConfiguration] = useState(null);

  const addExercise = (exercise) => {
    if (!selectedExercises.find(ex => ex.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExercise = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
  };

  const clearExercises = () => {
    setSelectedExercises([]);
  };

  const isExerciseSelected = (exerciseId) => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  const saveRoutineConfiguration = (config) => {
    setRoutineConfiguration(config);
  };

  const clearRoutineConfiguration = () => {
    setRoutineConfiguration(null);
  };

  const value = {
    selectedExercises,
    setSelectedExercises,
    addExercise,
    removeExercise,
    clearExercises,
    isExerciseSelected,
    routineConfiguration,
    setRoutineConfiguration,
    saveRoutineConfiguration, 
    clearRoutineConfiguration 
  };

  return (
    <RoutineContext.Provider value={value}>
      {children}
    </RoutineContext.Provider>
  );
}