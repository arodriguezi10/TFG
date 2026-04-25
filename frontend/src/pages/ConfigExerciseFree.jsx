import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";
import { useRoutine } from "../context/RoutinesContext";

const ConfigExerciseFree = () => {
  const navigate = useNavigate();
  const { selectedExercises, removeExercise, saveRoutineConfiguration, routineConfiguration } = useRoutine();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const isInitialMount = useRef(true);

  const [exercisesSeries, setExercisesSeries] = useState(() => {
    if (routineConfiguration?.series) {
      return routineConfiguration.series;
    }
    const initialSeries = {};
    selectedExercises.forEach(exercise => {
      initialSeries[exercise.id] = [
        { id: 1, reps: "", weight: "" },
        { id: 2, reps: "", weight: "" },
        { id: 3, reps: "", weight: "" }
      ];
    });
    return initialSeries;
  });

  const [exercisesRest, setExercisesRest] = useState(() => {
    if (routineConfiguration?.rest) {
      return routineConfiguration.rest;
    }
    const initialRest = {};
    selectedExercises.forEach(exercise => {
      initialRest[exercise.id] = "";
    });
    return initialRest;
  });



  useEffect(() => {
    if (!isInitialMount.current) {
      const tempConfig = {
        exercises: selectedExercises,
        series: exercisesSeries,
        rest: exercisesRest,
        timestamp: new Date().toISOString()
      };
      saveRoutineConfiguration(tempConfig);
    }
  }, [exercisesSeries, exercisesRest]);

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const addSerie = (exerciseId) => {
    setExercisesSeries(prev => {
      const currentSeries = prev[exerciseId] || [];
      const newSerieId = currentSeries.length + 1;
      return {
        ...prev,
        [exerciseId]: [...currentSeries, { id: newSerieId, reps: "", weight: "" }]
      };
    });
  };

  const deleteSerie = (exerciseId, serieId) => {
    setExercisesSeries(prev => {
      const filteredSeries = prev[exerciseId].filter(serie => serie.id !== serieId);
      const renumberedSeries = filteredSeries.map((serie, index) => ({
        ...serie,
        id: index + 1
      }));
      return {
        ...prev,
        [exerciseId]: renumberedSeries
      };
    });
  };

  const validateNumberInput = (value, allowDecimals = false) => {
    if (allowDecimals) {
      return /^\d*[,.]?\d*$/.test(value);
    }
    return /^\d*$/.test(value);
  };

  const updateSerie = (exerciseId, serieId, field, value) => {
    if (field === 'reps') {
      if (!validateNumberInput(value, false)) return;
    }
    if (field === 'weight') {
      if (!validateNumberInput(value, true)) return;
    }

    setExercisesSeries(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map(serie =>
        serie.id === serieId ? { ...serie, [field]: value } : serie
      )
    }));
  };

const updateRest = (exerciseId, value) => {
  // Permitir números, decimales, comas, puntos y dos puntos para formato mm:ss
  if (!/^[\d:,.\s]*$/.test(value)) return;
  
  setExercisesRest(prev => ({
    ...prev,
    [exerciseId]: value
  }));
};

  const handleRemoveExercise = (exerciseId) => {
    const exercise = selectedExercises.find(ex => ex.id === exerciseId);
    if (confirm(`¿Eliminar "${exercise.name}" de la rutina?`)) {
      removeExercise(exerciseId);
      setExercisesSeries(prev => {
        const newState = { ...prev };
        delete newState[exerciseId];
        return newState;
      });
      setExercisesRest(prev => {
        const newState = { ...prev };
        delete newState[exerciseId];
        return newState;
      });
    }
  };

  const handleNavigateToSubscription = () => {
    if (confirm("Si sales ahora, se perderán todos los datos que has configurado. ¿Continuar?")) {
      window.location.href = '/suscription';
    }
  };

  const validateConfiguration = () => {
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

const handleSaveRoutine = () => {
  if (!validateConfiguration()) {
    return;
  }

  const transformedExercises = selectedExercises.map(exercise => {
    const series = exercisesSeries[exercise.id] || [];
    
    return {
      exercise_id: exercise.id,
      exercise: exercise,
      target_reps: series.map(s => parseInt(s.reps) || 0),
      target_weight: series.map(s => {
        const weight = s.weight.replace(',', '.');
        return parseFloat(weight) || 0;
      }),
      target_rir: series.map(() => 0),
      rest_seconds: exercisesRest[exercise.id] || "90" // ✅ Guardar string directo, SIN parseRestToSeconds
    };
  });

  const routineData = {
    exercises: transformedExercises,
    series: exercisesSeries,
    rest: exercisesRest,
    timestamp: new Date().toISOString()
  };

  saveRoutineConfiguration(routineData);
  console.log("Configuración guardada:", routineData);
  navigate("/createRoutines1");
};

  const isInputFilled = (value) => {
    return value && value.trim() !== "";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
      {showAlert && (
        <div className="fixed top-[20px] left-[50%] transform -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
          <div className="bg-red/90 border border-red rounded-[16px] p-[16px] shadow-lg">
            <p className="font-body text-[14px] text-text-high text-center">
              {alertMessage}
            </p>
          </div>
        </div>
      )}

      <section className="w-full flex items-center justify-between">
        <Header showback title={<>Configurar<br/>ejercicio</>}/>
      </section>

      {selectedExercises.length === 0 ? (
        <section className="mt-[16px] w-full px-[16px]">
          <Card>
            <div className="flex flex-col items-center justify-center py-[40px] gap-[16px]">
              <span className="text-[48px]">💪</span>
              <p className="font-heading font-bold text-[18px] text-text-high text-center">
                Sin ejercicios añadidos
              </p>
              <p className="font-body text-[14px] text-text-low text-center">
                Vuelve a la pantalla anterior y añade ejercicios para configurar series y repeticiones.
              </p>
            </div>
          </Card>
        </section>
      ) : (
        selectedExercises.map((exercise, index) => (
          <section key={exercise.id} className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            <Card>
              <div className="flex items-center gap-[15px]">
                <p className="bg-primary-bg min-w-[35px] h-[35px] rounded-[8px] border border-primary font-heading font-bold text-[22px] text-primary text-center flex items-center justify-center px-[8px]">
                  {index + 1}
                </p>

                <div className="flex items-center gap-[10px]">
                  <div className="flex flex-col">
                    <p className="font-heading font-extrabold text-[18px] text-text-high">
                      {exercise.name}
                    </p>

                    <p className="font-body text-[12px] text-text-low">
                      {exercise.muscle_group} - {exercise.equipment}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-[5px] ml-auto">
                  <p className="font-body text-[12px] text-text-low">Descanso</p>

                  <input
                    type="text"
                    inputMode="text"
                    name={`descanso-${exercise.id}`}
                    value={exercisesRest[exercise.id] || ""}
                    onChange={(e) => updateRest(exercise.id, e.target.value)}
                    className={`w-[70px] h-[29px] rounded-[8px] border font-heading font-bold text-[18px] text-center ${
                      isInputFilled(exercisesRest[exercise.id])
                        ? "bg-accent2 border-accent2 text-background"
                        : "bg-green-bg2 border-accent2 text-accent2"
                    }`}
                    placeholder="1:30"
                  />
                </div>
              </div>

              <hr className="text-text-low -mx-[16px] mt-[5px] mb-[5px]" />

              <div className="flex flex-col gap-[8px]">
                <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">
                  <p className="font-body text-[12px] text-text-low text-center">#</p>
                  <p className="font-body text-[12px] text-text-low text-center">REPS</p>
                  <p className="font-body text-[12px] text-text-low text-center">PESO (KG)</p>
                  <div className="flex items-center justify-center gap-[2px]">
                    <p className="font-body text-[12px] text-text-low text-center">RIR</p>
                    <p className="bg-orange-bg2 h-[14px] w-[14px] rounded-[4px] border border-orange font-body text-[10px] text-orange text-center flex items-center justify-center">🔒</p>
                  </div>   
                  <div></div>
                </div>

                <hr className="text-text-low -mx-[16px]" />

                {(exercisesSeries[exercise.id] || []).map((serie, serieIndex) => (
                  <React.Fragment key={serie.id}>
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">
                      <p className="font-heading font-bold text-[22px] text-text-high text-center">
                        S{serie.id}
                      </p>

                      <input
                        type="text"
                        inputMode="numeric"
                        name={`reps-${exercise.id}-${serie.id}`}
                        value={serie.reps}
                        onChange={(e) => updateSerie(exercise.id, serie.id, 'reps', e.target.value)}
                        className={`w-[65px] h-[25px] rounded-[8px] border font-body text-[12px] text-center ${
                          isInputFilled(serie.reps)
                            ? "bg-primary border-primary text-background"
                            : "border-text-low text-text-high"
                        }`}
                        placeholder="12"
                      />

                      <input
                        type="text"
                        inputMode="decimal"
                        name={`weight-${exercise.id}-${serie.id}`}
                        value={serie.weight}
                        onChange={(e) => updateSerie(exercise.id, serie.id, 'weight', e.target.value)}
                        className={`w-[65px] h-[25px] rounded-[8px] border font-body text-[12px] text-center ${
                          isInputFilled(serie.weight)
                            ? "bg-primary border-primary text-background"
                            : "border-text-low text-text-high"
                        }`}
                        placeholder="60"
                      />

                      <span className="bg-orange-bg2 w-[65px] h-[25px] rounded-[8px] border border-orange font-body text-[12px] text-orange flex items-center justify-center opacity-55 cursor-not-allowed">
                        🔒 RIR
                      </span>

                      <button
                        onClick={() => deleteSerie(exercise.id, serie.id)}
                        className="bg-surface w-[25px] h-[25px] rounded-[8px] border border-red font-body text-[16px] text-red flex items-center justify-center hover:bg-red/10 transition-colors"
                      >
                        x
                      </button>
                    </div>

                    {serieIndex < (exercisesSeries[exercise.id] || []).length - 1 && (
                      <hr className="text-text-low h-[1px]"/>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <hr className="text-text-low -mx-[16px] mt-[5px] mb-[5px]" />

              <div className="flex gap-[8px] mt-[8px] items-center">
                <p className="font-body text-[12px] text-text-low flex-shrink-0">Técnica</p>
                
                <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
                  <button className="bg-orange-bg2 px-[10px] py-[1px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Dropset
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Rest-pause
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Topset
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 TS/BO
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Parciales
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Myo-reps
                  </button>
                </div>
              </div>

              <hr className="text-text-low -mx-[16px] mt-[8px] mb-[5px]" />

              <div className="flex items-center justify-between items-center mt-[8px]">
                <button
                  onClick={() => addSerie(exercise.id)}
                  className="font-body font-bold text-[14px] text-primary hover:text-primary/80 transition-colors"
                >
                  + Añadir serie
                </button>

                <button
                  onClick={() => handleRemoveExercise(exercise.id)}
                  className="font-body font-semibold text-[14px] text-red hover:text-red/80 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </Card>
          </section>
        ))
      )}

      {selectedExercises.length > 0 && (
        <section className="mt-[16px] pb-[70px] w-full px-[16px] flex flex-col gap-[10px]">
          <button
            onClick={handleNavigateToSubscription}
            className="w-full"
          >
            <Card variant="outlined">
              <div className="flex items-center justify-between gap-[12px] cursor-pointer hover:bg-surface/50 transition-colors rounded-[16px] -m-[16px] p-[16px]">
                <div className="flex items-center justify-center gap-[10px]">
                  <span className="bg-brown-bg h-[55px] w-[55px] px-[16px] rounded-[12px] border border-orange font-heading font-extrabold text-[18px] text-orange flex items-center justify-center">
                    👑
                  </span>

                  <div className="flex flex-col">
                    <p className="font-heading font-semibold text-[20px] text-text-high leading-tight text-left">
                      Desbloquea RIR y técnicas avanzadas
                    </p>

                    <p className="font-body text-[12px] text-text-low text-left">
                      Con <span className="text-orange">Plan Élite</span> activa control de intensidad por RIR, Dropsets, Rest-pause y más funciones.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center text-orange text-[20px]">
                  →
                </div>
              </div>
            </Card>
          </button>
        </section>
      )}

      {selectedExercises.length > 0 && (
        <section className="mt-[16px] w-full px-[16px] fixed bottom-1 gap-[10px]">
          <Button
            variant="outlined"
            text="Guardar rutina"
            bgColor={"bg-primary"}
            textColor={"text-text-high"}
            borderColor={"border-primary"}
            w="w-[100%]"
            onClick={handleSaveRoutine}
          />
        </section>
      )}
    </div>
  );
};

export default ConfigExerciseFree;