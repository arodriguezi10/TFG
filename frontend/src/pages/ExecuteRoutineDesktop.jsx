import React, { useState, useEffect} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";
import { ChevronLeft, Timer, Pause, Play, CheckCircle2, Lock, Dumbbell } from "lucide-react";
import { useTargetUser } from "../hooks/useTargetUser";

const ExecuteRoutineDesktop = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { targetUserId } = useTargetUser();

  const location = useLocation();

  const fromProgression = location.state?.fromProgression || false;
  const completedDate = location.state?.completedDate || null;
  const viewOnly = location.state?.viewOnly || false;
  const viewSessionId = location.state?.sessionId || null;

  const [routine, setRoutine] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [exerciseData, setExerciseData] = useState({});
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [intensityTechniques, setIntensityTechniques] = useState({});

  useEffect(() => { loadRoutineData(); loadUserSubscription(); }, [id]);

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await supabase.from("users").select("subscription_tier").eq("id", targetUserId).single();
      setSubscriptionTier(error ? "free" : data?.subscription_tier || "free");
    } catch { setSubscriptionTier("free"); }
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) interval = setInterval(() => setSessionTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadRoutineData = async () => {
    try {
      setLoading(true);
      const { data: routineData, error } = await supabase.from("routines").select(`*, routine_exercises (id, exercise_id, order_index, target_sets, target_reps, target_weight, target_rir, rest_seconds, intensity_technique, exercises (id, name, muscle_group, equipment))`).eq("id", id).eq("user_id", targetUserId).single();
      if (error) throw error;
      setRoutine(routineData);

      const sortedExercises = routineData.routine_exercises.sort((a, b) => a.order_index - b.order_index).map((re) => ({
        ...re.exercises,
        routineExerciseId: re.id,
        targetSets: re.target_sets,
        targetReps: Array.isArray(re.target_reps) ? re.target_reps : [],
        targetWeight: Array.isArray(re.target_weight) ? re.target_weight : [],
        targetRIR: Array.isArray(re.target_rir) ? re.target_rir : [],
        restSeconds: re.rest_seconds || "90",
        orderIndex: re.order_index,
      }));
      setExercises(sortedExercises);

      const techniques = {};
      routineData.routine_exercises.forEach((re) => { if (re.intensity_technique) techniques[re.exercises.id] = re.intensity_technique; });
      setIntensityTechniques(techniques);

      const initialData = {};
      sortedExercises.forEach((exercise) => {
        initialData[exercise.id] = exercise.targetReps.map((reps, idx) => ({
          serieNumber: idx + 1, targetReps: reps, targetWeight: exercise.targetWeight[idx] || 0,
          targetRIR: exercise.targetRIR[idx] || 0, actualReps: "", actualWeight: "", actualRIR: "", completed: false,
        }));
      });
      setExerciseData(initialData);

      if (viewOnly && viewSessionId) {
        const { data: logs } = await supabase.from("workout_exercise_logs").select("*").eq("session_id", viewSessionId);
        if (logs) {
          const viewData = {};
          sortedExercises.forEach((exercise) => {
            const exerciseLogs = logs.filter((l) => l.exercise_id === exercise.id).sort((a, b) => a.serie_number - b.serie_number);
            viewData[exercise.id] = exerciseLogs.map((log) => ({
              serieNumber: log.serie_number, targetReps: log.target_reps, targetWeight: log.target_weight,
              targetRIR: log.target_rir, actualReps: log.actual_reps?.toString() || "",
              actualWeight: log.actual_weight?.toString() || "", actualRIR: log.actual_rir?.toString() || "", completed: log.completed,
            }));
          });
          setExerciseData(viewData);
        }
      }
    } catch (error) { console.error("Error cargando rutina:", error); navigate("/dashboard"); }
    finally { setLoading(false); }
  };

  const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const formatRestTime = (restValue) => {
    if (!restValue) return "1:30";
    const value = String(restValue).trim();
    if (value.includes(":")) return value;
    const totalSeconds = parseFloat(value) || 0;
    if (totalSeconds < 60) return `${totalSeconds}`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleSerieInputChange = (exerciseId, serieIndex, field, value) => {
    setExerciseData((prev) => ({ ...prev, [exerciseId]: prev[exerciseId].map((serie, idx) => idx === serieIndex ? { ...serie, [field]: value } : serie) }));
  };

  const isSerieComplete = (exerciseId, serieIndex) => {
    const serie = exerciseData[exerciseId]?.[serieIndex];
    return serie?.actualReps !== "" && serie?.actualWeight !== "";
  };

  const toggleSerieComplete = (exerciseId, serieIndex) => {
    if (isSerieComplete(exerciseId, serieIndex)) {
      setExerciseData((prev) => ({ ...prev, [exerciseId]: prev[exerciseId].map((serie, idx) => idx === serieIndex ? { ...serie, completed: !serie.completed } : serie) }));
    }
  };

  const calculateProgress = () => {
    let totalSeries = 0, completedSeries = 0;
    Object.values(exerciseData).forEach((exerciseSeries) => { totalSeries += exerciseSeries.length; completedSeries += exerciseSeries.filter((s) => s.completed).length; });
    return totalSeries > 0 ? (completedSeries / totalSeries) * 100 : 0;
  };

  const getCompletedExercisesCount = () => exercises.filter((exercise) => { const series = exerciseData[exercise.id] || []; return series.length > 0 && series.every((s) => s.completed); }).length;

  const handleFinishSession = async () => {
    const completedExercises = getCompletedExercisesCount();
    const totalSets = Object.values(exerciseData).reduce((sum, series) => sum + series.filter((s) => s.completed).length, 0);
    if (completedExercises === 0 && !window.confirm("No has completado ningún ejercicio. ¿Seguro que quieres finalizar?")) return;

    try {
      const sessionDate = completedDate || new Date().toISOString().split("T")[0];
      const { data: sessionData, error } = await supabase.from("workout_sessions").insert({ user_id: targetUserId, routine_id: routine.id, routine_name: routine.name, session_date: sessionDate, duration_minutes: Math.floor(sessionTime / 60), exercises_completed: completedExercises, total_sets: totalSets, notes: null }).select().single();
      if (error) throw error;

      const exerciseLogs = [];
      exercises.forEach((exercise) => {
        const series = exerciseData[exercise.id] || [];
        series.forEach((serie) => {
          exerciseLogs.push({ session_id: sessionData.id, exercise_id: exercise.id, serie_number: serie.serieNumber, target_reps: serie.targetReps, actual_reps: parseInt(serie.actualReps) || 0, target_weight: serie.targetWeight, actual_weight: parseFloat(serie.actualWeight) || 0, target_rir: serie.targetRIR, actual_rir: parseInt(serie.actualRIR) || 0, completed: serie.completed });
        });
      });
      if (exerciseLogs.length > 0) await supabase.from("workout_exercise_logs").insert(exerciseLogs);

      const enrichedExerciseData = {};
      exercises.forEach((exercise) => { enrichedExerciseData[exercise.id] = exerciseData[exercise.id].map((serie) => ({ ...serie, exerciseName: exercise.name })); });

      navigate("/WorkoutSumary", { state: { routineName: routine.name, sessionDuration: Math.floor(sessionTime / 60), totalSets, completedExercises, exercisesData: enrichedExerciseData, sessionId: sessionData.id, fromProgression, completedDate } });
    } catch (error) { console.error("Error guardando sesión:", error); alert("❌ Error al guardar la sesión"); }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent1"></div></div>;

  const progress = calculateProgress();
  const completedExercises = getCompletedExercisesCount();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-6 pb-4 border-b border-text-low/20 sticky top-0 bg-background z-50">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => { if (window.confirm("¿Seguro que quieres salir? Se perderá el progreso.")) navigate(fromProgression ? "/progression" : "/dashboard"); }}
            className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors shrink-0">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="font-subheading text-[11px] text-text-low uppercase tracking-wider">{viewOnly ? "MODO ESPECTADOR" : `EN CURSO · ${routine.training_type || "RUTINA"}`}</p>
            <h1 className="font-heading font-extrabold text-[24px] text-text-high leading-tight">{routine.name}</h1>
          </div>

          {/* TIMER */}
          <div className="flex items-center gap-3 bg-surf border border-text-low rounded-2xl px-5 py-3">
            <Timer size={20} className="text-accent1" />
            <p className="font-heading font-bold text-[28px] text-text-high leading-none">{formatTime(sessionTime)}</p>
            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="bg-background h-9 w-9 rounded-lg border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors ml-2">
              {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>

          {/* PROGRESO */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <p className="font-subheading font-bold text-[13px] text-text-low">{completedExercises}/{exercises.length} ejercicios</p>
            <div className="w-40 h-2.5 bg-surf rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="font-body text-[11px] text-text-low">{Math.round(progress)}% completado</p>
          </div>
        </div>
      </div>

      {/* CONTENIDO — 2 COLUMNAS */}
      <div className="flex-1 px-8 py-6 grid grid-cols-3 gap-6">

        {/* LISTA EJERCICIOS */}
        <div className="col-span-2 flex flex-col gap-3">
          {exercises.map((exercise, index) => {
            const isExpanded = expandedExercise === exercise.id;
            const series = exerciseData[exercise.id] || [];
            const allCompleted = series.length > 0 && series.every((s) => s.completed);
            const completedCount = series.filter(s => s.completed).length;

            return (
              <Card key={exercise.id}>
                <button onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)} className="w-full flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-heading font-bold text-[18px] shrink-0 ${allCompleted ? "bg-primary text-text-high" : "bg-primary-bg1 border border-primary text-primary"}`}>
                    {allCompleted ? <CheckCircle2 size={20} /> : index + 1}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-heading font-bold text-[16px] text-text-high">{exercise.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="font-body text-[12px] text-text-low">{exercise.muscle_group}</p>
                      <span className="text-text-low/30">·</span>
                      <p className="font-body text-[12px] text-text-low">{series.length} series · {completedCount} completadas</p>
                      {intensityTechniques[exercise.id] && (
                        <span className="bg-primary/10 border border-primary px-2 py-0.5 rounded-full font-body text-[11px] text-primary">⚡ {intensityTechniques[exercise.id]}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-body text-[12px] text-text-low">⏳ {formatRestTime(exercise.restSeconds)}</span>
                    <div className={`text-text-low transition-transform ${isExpanded ? "rotate-180" : ""}`}>⌄</div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-text-low">
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr_48px] gap-3 text-[11px] font-subheading font-semibold text-text-low uppercase tracking-wide text-center mb-2">
                      <div>#</div><div>Reps</div><div>Peso (kg)</div><div>RIR</div><div></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {series.map((serie, serieIndex) => (
                        <div key={serieIndex} className={`grid grid-cols-[60px_1fr_1fr_1fr_48px] gap-3 items-center p-3 rounded-xl transition-all ${serie.completed ? "bg-primary/10 border border-primary/30" : "bg-surf border border-text-low"}`}>
                          <div className="font-heading font-bold text-[15px] text-text-high text-center">S{serie.serieNumber}</div>

                          <input type="number" placeholder={serie.targetReps.toString()} value={serie.actualReps}
                            onChange={(e) => handleSerieInputChange(exercise.id, serieIndex, "actualReps", e.target.value)}
                            disabled={serie.completed || viewOnly}
                            className="w-full bg-background border border-text-low rounded-xl px-3 py-2 text-text-high text-[15px] font-heading font-semibold text-center outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-low/40" />

                          <input type="number" step="0.5" placeholder={serie.targetWeight > 0 ? serie.targetWeight.toString() : "0"} value={serie.actualWeight}
                            onChange={(e) => handleSerieInputChange(exercise.id, serieIndex, "actualWeight", e.target.value)}
                            disabled={serie.completed || viewOnly}
                            className="w-full bg-background border border-text-low rounded-xl px-3 py-2 text-text-high text-[15px] font-heading font-semibold text-center outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-low/40" />

                          <div>
                            {subscriptionTier === "elite" || subscriptionTier === "pro" ? (
                              <input type="number" placeholder={serie.targetRIR > 0 ? serie.targetRIR.toString() : "0"} value={serie.actualRIR}
                                onChange={(e) => handleSerieInputChange(exercise.id, serieIndex, "actualRIR", e.target.value)}
                                disabled={serie.completed || viewOnly}
                                className="w-full bg-background border border-text-low rounded-xl px-3 py-2 text-text-high text-[15px] font-heading font-semibold text-center outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-low/40" />
                            ) : (
                              <div className="w-full bg-background/50 border border-text-low/50 rounded-xl px-3 py-2 flex items-center justify-center">
                                <Lock size={14} className="text-text-low/40" />
                              </div>
                            )}
                          </div>

                          <button onClick={() => toggleSerieComplete(exercise.id, serieIndex)}
                            disabled={!isSerieComplete(exercise.id, serieIndex) || viewOnly}
                            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all mx-auto ${serie.completed ? "bg-primary text-text-high" : isSerieComplete(exercise.id, serieIndex) ? "bg-surf border border-primary text-primary hover:bg-primary/10" : "bg-surf border border-text-low/30 text-text-low/30 cursor-not-allowed"}`}>
                            {serie.completed && <CheckCircle2 size={18} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* SIDEBAR — RESUMEN + CTA */}
        <div className="flex flex-col gap-4 sticky top-28 h-fit">
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Progreso de sesión</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-body text-[14px] text-text-low">Ejercicios completados</p>
                <p className="font-heading font-bold text-[16px] text-text-high">{completedExercises}/{exercises.length}</p>
              </div>
              <div className="w-full h-3 bg-surf rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[14px] text-text-low">Series totales</p>
                <p className="font-heading font-bold text-[16px] text-text-high">
                  {Object.values(exerciseData).reduce((sum, s) => sum + s.filter(s => s.completed).length, 0)}/
                  {Object.values(exerciseData).reduce((sum, s) => sum + s.length, 0)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[14px] text-text-low">Tiempo</p>
                <p className="font-heading font-bold text-[16px] text-accent1">{formatTime(sessionTime)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Ejercicios</p>
            <div className="flex flex-col gap-2">
              {exercises.map((exercise, index) => {
                const series = exerciseData[exercise.id] || [];
                const allCompleted = series.length > 0 && series.every((s) => s.completed);
                const completedCount = series.filter(s => s.completed).length;
                return (
                  <button key={exercise.id} onClick={() => { setExpandedExercise(exercise.id); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surf transition-colors text-left">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-heading font-bold text-[13px] shrink-0 ${allCompleted ? "bg-primary text-text-high" : "bg-primary-bg border border-primary text-primary"}`}>
                      {allCompleted ? <CheckCircle2 size={14} /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[13px] text-text-high truncate">{exercise.name}</p>
                      <p className="font-body text-[11px] text-text-low">{completedCount}/{series.length} series</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {viewOnly ? (
            <Button variant="outlined" text="← Volver al panel" bgColor="bg-surf" textColor="text-text-high" borderColor="border-text-low" w="w-full" onClick={() => navigate("/dashboard")} />
          ) : (
            <button onClick={handleFinishSession} className="w-full py-4 rounded-2xl font-heading font-bold text-[16px] bg-accent3 text-green border border-green hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <CheckCircle2 size={20} /> Finalizar entrenamiento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecuteRoutineDesktop;