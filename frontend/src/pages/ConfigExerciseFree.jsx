import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";
import { useRoutine } from "../context/RoutinesContext";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";

const ConfigExerciseFree = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { selectedExercises, removeExercise, saveRoutineConfiguration, routineConfiguration } = useRoutine();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const isInitialLoad = useRef(true);

  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  const [exercisesSeries, setExercisesSeries] = useState({});
  const [exercisesRest, setExercisesRest] = useState({});
  const [exercisesTechnique, setExercisesTechnique] = useState({});

  useEffect(() => {
    if (isInitialLoad.current) {
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
            { id: 3, reps: "", weight: "", rir: "" }
          ];
        }

        newRest[exercise.id] = routineConfiguration?.rest?.[exercise.id] || "";
        
        if (routineConfiguration?.techniques?.[exercise.id]) {
          newTechniques[exercise.id] = routineConfiguration.techniques[exercise.id];
        }
      });
    
      setExercisesSeries(newSeries);
      setExercisesRest(newRest);
      setExercisesTechnique(newTechniques);
      isInitialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error cargando suscripción:', error);
        setSubscriptionTier('free');
      } else {
        setSubscriptionTier(data?.subscription_tier || 'free');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubscriptionTier('free');
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const hasProAccess = subscriptionTier === 'pro' || subscriptionTier === 'elite';

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
        [exerciseId]: [...currentSeries, { id: newSerieId, reps: "", weight: "", rir: "" }]
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
    if (field === 'reps' || field === 'rir') {
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
    if (!/^[\d:,.\s]*$/.test(value)) return;
    
    setExercisesRest(prev => ({
      ...prev,
      [exerciseId]: value
    }));
  };

  const toggleTechnique = (exerciseId, technique) => {
    if (!hasProAccess) {
      showAlertMessage('Necesitas el Plan Pro o Elite para usar técnicas avanzadas');
      return;
    }

    setExercisesTechnique(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId] === technique ? null : technique
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
      setExercisesTechnique(prev => {
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
        target_rir: series.map(s => parseInt(s.rir) || 0),
        rest_seconds: exercisesRest[exercise.id] || "90",
        technique: exercisesTechnique[exercise.id] || null
      };
    });

    const routineData = {
      exercises: transformedExercises,
      series: exercisesSeries,
      rest: exercisesRest,
      techniques: exercisesTechnique,
      timestamp: new Date().toISOString()
    };

    saveRoutineConfiguration(routineData);
    navigate(-1);
  };

  const handleBack = () => {
    const routineData = {
      exercises: selectedExercises,
      series: exercisesSeries,
      rest: exercisesRest,
      techniques: exercisesTechnique,
      timestamp: new Date().toISOString()
    };

    saveRoutineConfiguration(routineData);
    navigate(-1);
  };

  const isInputFilled = (value) => {
    return value !== null && value !== undefined && String(value).trim() !== "";
  };

  if (isLoadingSubscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent1"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {showAlert && (
        <div className="fixed top-5 left-[50%] transform -translate-x-1/2 z-50 w-[90%] max-w-100">
          <div className="bg-red/90 border border-red rounded-2xl p-4 shadow-lg">
            <p className="font-body text-[14px] text-text-high text-center">
              {alertMessage}
            </p>
          </div>
        </div>
      )}

      <section className="w-full flex items-center justify-between">
        <Header showback onBackClick={handleBack} title={<>Configurar<br/>ejercicio</>}/>
      </section>

      {selectedExercises.length === 0 ? (
        <section className="mt-4 w-full px-4">
          <Card>
            <div className="flex flex-col items-center justify-center py-10 gap-4">
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
          <section key={exercise.id} className="mt-4 w-full px-4 flex flex-col gap-2.5">
            <Card>
              <div className="flex items-center gap-3.75">
                <p className="bg-primary-bg min-w-8.75 h-8.75 rounded-lg border border-primary font-heading font-bold text-[22px] text-primary text-center flex items-center justify-center px-2">
                  {index + 1}
                </p>

                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col">
                    <p className="font-heading font-extrabold text-[18px] text-text-high">
                      {exercise.name}
                    </p>

                    <p className="font-body text-[12px] text-text-low">
                      {exercise.muscle_group} - {exercise.equipment}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.25 ml-auto">
                  <p className="font-body text-[12px] text-text-low">Descanso</p>

                  <input
                    type="text"
                    inputMode="text"
                    name={`descanso-${exercise.id}`}
                    value={exercisesRest[exercise.id] || ""}
                    onChange={(e) => updateRest(exercise.id, e.target.value)}
                    className={`w-17.5 h-7.25 rounded-lg border font-heading font-bold text-[18px] text-center ${
                      isInputFilled(exercisesRest[exercise.id])
                        ? "bg-accent2 border-accent2 text-background"
                        : "bg-green-bg2 border-accent2 text-accent2"
                    }`}
                    placeholder="1:30"
                  />
                </div>
              </div>

              <hr className="text-text-low -mx-4 mt-1.25 mb-1.25" />

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 items-center">
                  <p className="font-body text-[12px] text-text-low text-center">#</p>
                  <p className="font-body text-[12px] text-text-low text-center">REPS</p>
                  <p className="font-body text-[12px] text-text-low text-center">PESO (KG)</p>
                  <div className="flex items-center justify-center gap-0.5">
                    <p className="font-body text-[12px] text-text-low text-center">RIR</p>
                    {!hasProAccess && (
                      <p className="bg-orange-bg2 h-3.5 w-3.5 rounded-sm border border-orange font-body text-[10px] text-orange text-center flex items-center justify-center">🔒</p>
                    )}
                  </div>   
                  <div></div>
                </div>

                <hr className="text-text-low -mx-4" />

                {(exercisesSeries[exercise.id] || []).map((serie, serieIndex) => (
                  <React.Fragment key={serie.id}>
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 items-center">
                      <p className="font-heading font-bold text-[22px] text-text-high text-center">
                        S{serie.id}
                      </p>

                      <input
                        type="text"
                        inputMode="numeric"
                        name={`reps-${exercise.id}-${serie.id}`}
                        value={serie.reps}
                        onChange={(e) => updateSerie(exercise.id, serie.id, 'reps', e.target.value)}
                        className={`w-16.25 h-6.25 rounded-lg border font-body text-[12px] text-center ${
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
                        className={`w-16.25 h-6.25 rounded-lg border font-body text-[12px] text-center ${
                          isInputFilled(serie.weight)
                            ? "bg-primary border-primary text-background"
                            : "border-text-low text-text-high"
                        }`}
                        placeholder="60"
                      />

                      {hasProAccess ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          name={`rir-${exercise.id}-${serie.id}`}
                          value={serie.rir || ""}
                          onChange={(e) => updateSerie(exercise.id, serie.id, 'rir', e.target.value)}
                          className={`w-16.25 h-6.25 rounded-lg border font-body text-[12px] text-center ${
                            isInputFilled(serie.rir)
                              ? "bg-primary border-primary text-background"
                              : "border-text-low text-text-high"
                          }`}
                          placeholder="2"
                        />
                      ) : (
                        <span className="bg-orange-bg2 w-16.25 h-6.25 rounded-lg border border-orange font-body text-[12px] text-orange flex items-center justify-center opacity-55 cursor-not-allowed">
                          🔒 RIR
                        </span>
                      )}

                      <button
                        onClick={() => deleteSerie(exercise.id, serie.id)}
                        className="bg-surface w-6.25 h-6.25 rounded-lg border border-red font-body text-[16px] text-red flex items-center justify-center hover:bg-red/10 transition-colors"
                      >
                        x
                      </button>
                    </div>

                    {serieIndex < (exercisesSeries[exercise.id] || []).length - 1 && (
                      <hr className="text-text-low h-px"/>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <hr className="text-text-low -mx-4 mt-1.25 mb-1.25" />

              <div className="flex gap-2 mt-2 items-center">
                <p className="font-body text-[12px] text-text-low shrink-0">Técnica</p>
                
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                  {['Dropset', 'Rest-pause', 'Topset', 'TS/BO', 'Parciales', 'Myo-reps'].map((technique) => (
                    <button
                      key={technique}
                      onClick={() => toggleTechnique(exercise.id, technique)}
                      disabled={!hasProAccess}
                      className={`px-3.5 py-1.5 rounded-[20px] border font-body text-[13px] font-medium whitespace-nowrap transition-all ${
                        hasProAccess
                          ? exercisesTechnique[exercise.id] === technique
                            ? 'bg-primary border-primary text-background shadow-sm'
                            : 'bg-transparent border-primary/40 text-primary hover:bg-primary/10 hover:border-primary'
                          : 'bg-transparent border-text-low/30 text-text-low/50 cursor-not-allowed'
                      }`}
                    >
                      {technique}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="text-text-low -mx-4 mt-2 mb-1.25" />

              <div className="flex items-center justify-between mt-2">
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

      {selectedExercises.length > 0 && !hasProAccess && (
        <section className="mt-4 pb-17.5 w-full px-4 flex flex-col gap-2.5">
          <button
            onClick={handleNavigateToSubscription}
            className="w-full"
          >
            <Card variant="outlined">
              <div className="flex items-center justify-between gap-3 cursor-pointer hover:bg-surface/50 transition-colors rounded-2xl -m-4 p-4">
                <div className="flex items-center justify-center gap-2.5">
                  <span className="bg-brown-bg h-13.75 w-13.75 px-4 rounded-xl border border-orange font-heading font-extrabold text-[18px] text-orange flex items-center justify-center">
                    👑
                  </span>

                  <div className="flex flex-col">
                    <p className="font-heading font-semibold text-[20px] text-text-high leading-tight text-left">
                      Desbloquea RIR y técnicas avanzadas
                    </p>

                    <p className="font-body text-[12px] text-text-low text-left">
                      Con <span className="text-orange">Plan Pro o Élite</span> activa control de intensidad por RIR, Dropsets, Rest-pause y más funciones.
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
        <section className="mt-4 w-full px-4 fixed bottom-1 gap-2.5">
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