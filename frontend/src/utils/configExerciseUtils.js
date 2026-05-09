export const TECHNIQUES = ['Dropset', 'Rest-pause', 'Topset', 'TS/BO', 'Parciales', 'Myo-reps'];

export const validateNumberInput = (value, allowDecimals = false) => {
  if (allowDecimals) return /^\d*[,.]?\d*$/.test(value);
  return /^\d*$/.test(value);
};

export const isInputFilled = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== "";
};

export const buildInitialState = (selectedExercises, routineConfiguration) => {
  const newSeries = {};
  const newRest = {};
  const newTechniques = {};

  selectedExercises.forEach(exercise => {
    if (routineConfiguration?.series?.[exercise.id]) {
      newSeries[exercise.id] = routineConfiguration.series[exercise.id];
    } else {
      newSeries[exercise.id] = [
        { id: 1, reps: "", weight: "", rir: "" },
        { id: 2, reps: "", weight: "", rir: "" },
        { id: 3, reps: "", weight: "", rir: "" },
      ];
    }
    newRest[exercise.id] = routineConfiguration?.rest?.[exercise.id] || "";
    if (routineConfiguration?.techniques?.[exercise.id]) {
      newTechniques[exercise.id] = routineConfiguration.techniques[exercise.id];
    }
  });

  return { newSeries, newRest, newTechniques };
};

export const validateConfiguration = (selectedExercises, exercisesSeries, exercisesRest, showAlertMessage) => {
  for (const exercise of selectedExercises) {
    const series = exercisesSeries[exercise.id] || [];
    const rest = exercisesRest[exercise.id];

    if (!rest || rest.trim() === "") {
      showAlertMessage(`El ejercicio "${exercise.name}" no tiene tiempo de descanso configurado.`);
      return false;
    }

    for (const serie of series) {
      if (!serie.reps || serie.reps.trim() === "") {
        showAlertMessage(`El ejercicio "${exercise.name}" tiene series sin repeticiones configuradas.`);
        return false;
      }
      if (!serie.weight || serie.weight.trim() === "") {
        showAlertMessage(`El ejercicio "${exercise.name}" tiene series sin peso configurado.`);
        return false;
      }
    }
  }
  return true;
};

export const buildRoutineData = (selectedExercises, exercisesSeries, exercisesRest, exercisesTechnique) => {
  const transformedExercises = selectedExercises.map(exercise => {
    const series = exercisesSeries[exercise.id] || [];
    return {
      exercise_id: exercise.id,
      exercise,
      target_reps: series.map(s => parseInt(s.reps) || 0),
      target_weight: series.map(s => parseFloat(s.weight.replace(',', '.')) || 0),
      target_rir: series.map(s => parseInt(s.rir) || 0),
      rest_seconds: exercisesRest[exercise.id] || "90",
      technique: exercisesTechnique[exercise.id] || null,
    };
  });

  return {
    exercises: transformedExercises,
    series: exercisesSeries,
    rest: exercisesRest,
    techniques: exercisesTechnique,
    timestamp: new Date().toISOString(),
  };
};

export const loadSubscription = async (supabase, userId, setSubscriptionTier, setIsLoadingSubscription) => {
  try {
    const { data, error } = await supabase.from('users').select('subscription_tier').eq('id', userId).single();
    if (error) { setSubscriptionTier('free'); }
    else { setSubscriptionTier(data?.subscription_tier || 'free'); }
  } catch { setSubscriptionTier('free'); }
  finally { setIsLoadingSubscription(false); }
};