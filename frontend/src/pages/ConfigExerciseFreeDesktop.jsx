import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { useRoutine } from "../context/RoutinesContext";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { Plus, X, Lock, Crown, ChevronRight, ChevronLeft, Trash2 } from "lucide-react";
import {
  TECHNIQUES, validateNumberInput, isInputFilled, buildInitialState,
  validateConfiguration, buildRoutineData, loadSubscription,
} from "../utils/configExerciseUtils";

const ConfigExerciseFreeDesktop = () => {
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
    const { newSeries, newRest, newTechniques } = buildInitialState(selectedExercises, routineConfiguration);
    setTimeout(() => {
      setExercisesSeries(newSeries);
      setExercisesRest(newRest);
      setExercisesTechnique(newTechniques);
    }, 0);
    isInitialLoad.current = false;
  }
}, []);

  useEffect(() => {
    loadSubscription(supabase, user.id, setSubscriptionTier, setIsLoadingSubscription);
  }, []);

  const hasProAccess = subscriptionTier === 'pro' || subscriptionTier === 'elite';

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const addSerie = (exerciseId) => {
    setExercisesSeries(prev => {
      const currentSeries = prev[exerciseId] || [];
      return { ...prev, [exerciseId]: [...currentSeries, { id: currentSeries.length + 1, reps: "", weight: "", rir: "" }] };
    });
  };

  const deleteSerie = (exerciseId, serieId) => {
    setExercisesSeries(prev => {
      const filtered = prev[exerciseId].filter(s => s.id !== serieId).map((s, i) => ({ ...s, id: i + 1 }));
      return { ...prev, [exerciseId]: filtered };
    });
  };

  const updateSerie = (exerciseId, serieId, field, value) => {
    if ((field === 'reps' || field === 'rir') && !validateNumberInput(value, false)) return;
    if (field === 'weight' && !validateNumberInput(value, true)) return;
    setExercisesSeries(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map(s => s.id === serieId ? { ...s, [field]: value } : s),
    }));
  };

  const updateRest = (exerciseId, value) => {
    if (!/^[\d:,.\s]*$/.test(value)) return;
    setExercisesRest(prev => ({ ...prev, [exerciseId]: value }));
  };

  const toggleTechnique = (exerciseId, technique) => {
    if (!hasProAccess) { showAlertMessage('Necesitas el Plan Pro o Elite para usar tecnicas avanzadas'); return; }
    setExercisesTechnique(prev => ({ ...prev, [exerciseId]: prev[exerciseId] === technique ? null : technique }));
  };

  const handleRemoveExercise = (exerciseId) => {
    const exercise = selectedExercises.find(ex => ex.id === exerciseId);
    if (confirm(`Eliminar "${exercise.name}" de la rutina?`)) {
      removeExercise(exerciseId);
      setExercisesSeries(prev => { const n = { ...prev }; delete n[exerciseId]; return n; });
      setExercisesRest(prev => { const n = { ...prev }; delete n[exerciseId]; return n; });
      setExercisesTechnique(prev => { const n = { ...prev }; delete n[exerciseId]; return n; });
    }
  };

  const handleSaveRoutine = () => {
    if (!validateConfiguration(selectedExercises, exercisesSeries, exercisesRest, showAlertMessage)) return;
    saveRoutineConfiguration(buildRoutineData(selectedExercises, exercisesSeries, exercisesRest, exercisesTechnique));
    navigate(-1);
  };

  const handleBack = () => {
    saveRoutineConfiguration(buildRoutineData(selectedExercises, exercisesSeries, exercisesRest, exercisesTechnique));
    navigate(-1);
  };

  if (isLoadingSubscription) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent1"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showAlert && (
        <div className="fixed top-5 left-[50%] transform -translate-x-1/2 z-50 w-[500px]">
          <div className="bg-red/90 border border-red rounded-2xl p-4 shadow-lg">
            <p className="font-body text-[14px] text-text-high text-center">{alertMessage}</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Rutinas</p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high leading-tight">Configurar ejercicio</h1>
          </div>
        </div>

        {/* TOGGLE BUSCAR / CONFIGURAR */}
        <div className="flex items-center gap-3">
          <div className="bg-surf rounded-2xl border border-text-low p-1.5 flex items-center gap-1">
            <button onClick={() => { handleBack(); navigate("/exerciseSearchFree"); }} className="rounded-xl px-4 py-1.5 bg-transparent transition-colors">
              <p className="font-subheading font-bold text-[14px] text-text-low">Buscar</p>
            </button>
            <button className="rounded-xl px-4 py-1.5 bg-primary transition-colors">
              <p className="font-subheading font-bold text-[14px] text-text-high">Configurar</p>
            </button>
          </div>

          {selectedExercises.length > 0 && (
            <Button variant="outlined" text="Guardar rutina" bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-auto px-6" onClick={handleSaveRoutine} />
          )}
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        {selectedExercises.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="font-heading font-bold text-[18px] text-text-high text-center">Sin ejercicios anadidos</p>
              <p className="font-body text-[14px] text-text-low text-center">Vuelve a la pantalla anterior y anade ejercicios para configurar series y repeticiones.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {selectedExercises.map((exercise, index) => (
              <Card key={exercise.id}>
                {/* CABECERA EJERCICIO */}
                <div className="flex items-center gap-3 mb-3">
                  <p className="bg-primary-bg min-w-8 h-8 rounded-lg border border-primary font-heading font-bold text-[18px] text-primary text-center flex items-center justify-center px-2">{index + 1}</p>
                  <div className="flex flex-col flex-1">
                    <p className="font-heading font-extrabold text-[16px] text-text-high">{exercise.name}</p>
                    <p className="font-body text-[11px] text-text-low">{exercise.muscle_group} - {exercise.equipment}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-body text-[11px] text-text-low">Descanso</p>
                    <input
                      type="text" inputMode="text"
                      value={exercisesRest[exercise.id] || ""}
                      onChange={e => updateRest(exercise.id, e.target.value)}
                      className={`w-16 h-7 rounded-lg border font-heading font-bold text-[16px] text-center ${isInputFilled(exercisesRest[exercise.id]) ? "bg-accent2 border-accent2 text-background" : "bg-green-bg2 border-accent2 text-accent2"}`}
                      placeholder="1:30"
                    />
                  </div>
                </div>

                <hr className="text-text-low -mx-4 mb-3" />

                {/* TABLA SERIES */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[36px_1fr_1fr_1fr_32px] gap-2 items-center">
                    <p className="font-body text-[11px] text-text-low text-center">#</p>
                    <p className="font-body text-[11px] text-text-low text-center">REPS</p>
                    <p className="font-body text-[11px] text-text-low text-center">KG</p>
                    <div className="flex items-center justify-center gap-0.5">
                      <p className="font-body text-[11px] text-text-low text-center">RIR</p>
                      {!hasProAccess && <Lock size={8} className="text-orange" />}
                    </div>
                    <div></div>
                  </div>

                  <hr className="text-text-low -mx-4" />

                  {(exercisesSeries[exercise.id] || []).map((serie, serieIndex) => (
                    <React.Fragment key={serie.id}>
                      <div className="grid grid-cols-[36px_1fr_1fr_1fr_32px] gap-2 items-center">
                        <p className="font-heading font-bold text-[18px] text-text-high text-center">S{serie.id}</p>
                        <input type="text" inputMode="numeric" value={serie.reps} onChange={e => updateSerie(exercise.id, serie.id, 'reps', e.target.value)}
                          className={`h-7 rounded-lg border font-body text-[12px] text-center ${isInputFilled(serie.reps) ? "bg-primary border-primary text-background" : "border-text-low text-text-high"}`} placeholder="12" />
                        <input type="text" inputMode="decimal" value={serie.weight} onChange={e => updateSerie(exercise.id, serie.id, 'weight', e.target.value)}
                          className={`h-7 rounded-lg border font-body text-[12px] text-center ${isInputFilled(serie.weight) ? "bg-primary border-primary text-background" : "border-text-low text-text-high"}`} placeholder="60" />
                        {hasProAccess ? (
                          <input type="text" inputMode="numeric" value={serie.rir || ""} onChange={e => updateSerie(exercise.id, serie.id, 'rir', e.target.value)}
                            className={`h-7 rounded-lg border font-body text-[12px] text-center ${isInputFilled(serie.rir) ? "bg-primary border-primary text-background" : "border-text-low text-text-high"}`} placeholder="2" />
                        ) : (
                          <span className="h-7 rounded-lg border border-orange bg-orange-bg2 flex items-center justify-center opacity-55 cursor-not-allowed"><Lock size={13} className="text-orange" /></span>
                        )}
                        <button onClick={() => deleteSerie(exercise.id, serie.id)} className="bg-surface h-7 w-7 rounded-lg border border-red flex items-center justify-center hover:bg-red/10 transition-colors"><X size={13} className="text-red" /></button>
                      </div>
                      {serieIndex < (exercisesSeries[exercise.id] || []).length - 1 && <hr className="text-text-low h-px" />}
                    </React.Fragment>
                  ))}
                </div>

                <hr className="text-text-low -mx-4 mt-3 mb-3" />

                {/* TECNICAS */}
                <div className="flex gap-2 items-center mb-3">
                  <p className="font-body text-[11px] text-text-low shrink-0">Tecnica</p>
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                    {TECHNIQUES.map(technique => (
                      <button key={technique} onClick={() => toggleTechnique(exercise.id, technique)} disabled={!hasProAccess}
                        className={`px-2.5 py-1 rounded-full border font-body text-[11px] whitespace-nowrap transition-all ${hasProAccess ? exercisesTechnique[exercise.id] === technique ? 'bg-primary border-primary text-background' : 'bg-transparent border-primary/40 text-primary hover:bg-primary/10' : 'bg-transparent border-text-low/30 text-text-low/50 cursor-not-allowed'}`}>
                        {technique}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="text-text-low -mx-4 mb-3" />

                <div className="flex items-center justify-between">
                  <button onClick={() => addSerie(exercise.id)} className="font-body font-bold text-[13px] text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    <Plus size={14} /> Anadir serie
                  </button>
                  <button onClick={() => handleRemoveExercise(exercise.id)} className="font-body font-semibold text-[13px] text-red hover:text-red/80 transition-colors flex items-center gap-1">
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* BANNER PRO */}
        {selectedExercises.length > 0 && !hasProAccess && (
          <div className="mt-5">
            <button onClick={() => { if (confirm("Si sales ahora, se perderan todos los datos. Continuar?")) window.location.href = '/subscription'; }} className="w-full">
              <Card variant="outlined">
                <div className="flex items-center justify-between gap-3 cursor-pointer hover:bg-surface/50 transition-colors rounded-2xl -m-4 p-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-brown-bg h-12 w-12 rounded-xl border border-orange flex items-center justify-center shrink-0"><Crown size={20} className="text-orange" /></span>
                    <div className="flex flex-col">
                      <p className="font-heading font-semibold text-[18px] text-text-high leading-tight">Desbloquea RIR y tecnicas avanzadas</p>
                      <p className="font-body text-[12px] text-text-low">Con <span className="text-orange">Plan Pro o Elite</span> activa RIR, Dropsets, Rest-pause y mas.</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-orange" />
                </div>
              </Card>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigExerciseFreeDesktop;