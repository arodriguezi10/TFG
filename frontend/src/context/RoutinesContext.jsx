// @refresh reset
import React, { createContext, useState, useContext } from 'react';

const RoutineContext = createContext();

export const useRoutine = () => {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutine debe usarse dentro de RoutineProvider');
  }
  return context;
};

export const RoutineProvider = ({ children }) => {
  const [selectedExercises, setSelectedExercises] = useState([]);

  const addExercise = (exercise) => {
    // Evitar duplicados
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

  return (
    <RoutineContext.Provider
      value={{
        selectedExercises,
        addExercise,
        removeExercise,
        clearExercises,
        isExerciseSelected,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};