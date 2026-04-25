import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";

const ExecuteRoutine = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [routine, setRoutine] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const [exerciseData, setExerciseData] = useState({});

  useEffect(() => {
    loadRoutineData();
  }, [id]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadRoutineData = async () => {
    try {
      setLoading(true);

      const { data: routineData, error } = await supabase
        .from('routines')
        .select(`
          *,
          routine_exercises (
            id,
            exercise_id,
            order_index,
            target_sets,
            target_reps,
            target_weight,
            target_rir,
            rest_seconds,
            exercises (
              id,
              name,
              muscle_group,
              equipment
            )
          )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setRoutine(routineData);

      const sortedExercises = routineData.routine_exercises
        .sort((a, b) => a.order_index - b.order_index)
        .map(re => ({
          ...re.exercises,
          routineExerciseId: re.id,
          targetSets: re.target_sets,
          targetReps: Array.isArray(re.target_reps) ? re.target_reps : [],
          targetWeight: Array.isArray(re.target_weight) ? re.target_weight : [],
          targetRIR: Array.isArray(re.target_rir) ? re.target_rir : [],
          restSeconds: re.rest_seconds || "90", // ✅ Mantener como string
          orderIndex: re.order_index
        }));

      setExercises(sortedExercises);

      const initialData = {};
      sortedExercises.forEach(exercise => {
        initialData[exercise.id] = exercise.targetReps.map((reps, idx) => ({
          serieNumber: idx + 1,
          targetReps: reps,
          targetWeight: exercise.targetWeight[idx] || 0,
          targetRIR: exercise.targetRIR[idx] || 0,
          actualReps: '',
          actualWeight: '',
          actualRIR: '',
          completed: false
        }));
      });
      setExerciseData(initialData);

    } catch (error) {
      console.error('Error cargando rutina:', error);
      alert('Error al cargar la rutina');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatRestTime = (restValue) => {
    // Si no hay valor, usar 1:30 por defecto
    if (!restValue) return "1:30";
    
    const value = String(restValue).trim();
    
    // Si ya tiene formato "m:ss" o "mm:ss", devolverlo tal cual
    if (value.includes(':')) {
      return value;
    }
    
    // Si es un número, convertir a formato m:ss
    const totalSeconds = parseFloat(value) || 0;
    
    if (totalSeconds < 60) {
      return `${totalSeconds}`;
    }
    
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const toggleExercise = (exerciseId) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  const handleSerieInputChange = (exerciseId, serieIndex, field, value) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((serie, idx) => 
        idx === serieIndex 
          ? { ...serie, [field]: value }
          : serie
      )
    }));
  };

  const isSerieComplete = (exerciseId, serieIndex) => {
    const serie = exerciseData[exerciseId]?.[serieIndex];
    return serie?.actualReps !== '' && serie?.actualWeight !== '';
  };

  const toggleSerieComplete = (exerciseId, serieIndex) => {
    if (isSerieComplete(exerciseId, serieIndex)) {
      setExerciseData(prev => ({
        ...prev,
        [exerciseId]: prev[exerciseId].map((serie, idx) => 
          idx === serieIndex 
            ? { ...serie, completed: !serie.completed }
            : serie
        )
      }));
    }
  };

  const calculateProgress = () => {
    let totalSeries = 0;
    let completedSeries = 0;

    Object.values(exerciseData).forEach(exerciseSeries => {
      totalSeries += exerciseSeries.length;
      completedSeries += exerciseSeries.filter(s => s.completed).length;
    });

    return totalSeries > 0 ? (completedSeries / totalSeries) * 100 : 0;
  };

  const getCompletedExercisesCount = () => {
    return exercises.filter(exercise => {
      const series = exerciseData[exercise.id] || [];
      return series.length > 0 && series.every(s => s.completed);
    }).length;
  };

  const handleFinishSession = async () => {
    const completedExercises = getCompletedExercisesCount();
    const totalSets = Object.values(exerciseData).reduce((sum, series) => 
      sum + series.filter(s => s.completed).length, 0
    );

    if (completedExercises === 0) {
      if (!window.confirm('No has completado ningún ejercicio. ¿Seguro que quieres finalizar?')) {
        return;
      }
    }

    try {
      const todayDate = new Date().toISOString().split('T')[0];

      const { data: sessionData, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          routine_id: routine.id,
          routine_name: routine.name,
          session_date: todayDate,
          duration_minutes: Math.floor(sessionTime / 60),
          exercises_completed: completedExercises,
          total_sets: totalSets,
          notes: null
        })
        .select()
        .single();

      if (error) throw error;

      const enrichedExerciseData = {};
      exercises.forEach(exercise => {
        enrichedExerciseData[exercise.id] = exerciseData[exercise.id].map(serie => ({
          ...serie,
          exerciseName: exercise.name
        }));
      });

      navigate('/WorkoutSumary', {
        state: {
          routineName: routine.name,
          sessionDuration: Math.floor(sessionTime / 60),
          totalSets: totalSets,
          completedExercises: completedExercises,
          exercisesData: enrichedExerciseData,
          sessionId: sessionData.id
        }
      });

    } catch (error) {
      console.error('Error guardando sesión:', error);
      alert('❌ Error al guardar la sesión');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent1"></div>
      </div>
    );
  }

  const progress = calculateProgress();
  const completedExercises = getCompletedExercisesCount();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-[100px]">
      <section className="w-full px-4 pt-4 pb-3 sticky top-0 bg-background z-50 border-b border-text-low/20">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (window.confirm('¿Seguro que quieres salir? Se perderá el progreso.')) {
                navigate('/dashboard');
              }
            }}
            className="bg-surf h-10 w-10 rounded-lg border border-text-low flex items-center justify-center text-text-high hover:bg-surface transition-colors"
          >
            ←
          </button>

          <div className="flex flex-col items-center flex-1 mx-4">
            <p className="font-subheading text-[11px] text-text-low uppercase tracking-wider">
              EN CURSO - {routine.training_type || 'RUTINA'}
            </p>
            <h1 className="font-heading font-extrabold text-[20px] text-text-high leading-tight">
              {routine.name}
            </h1>
          </div>

          <button className="bg-surf h-10 w-10 rounded-lg border border-text-low flex items-center justify-center text-text-high hover:bg-surface transition-colors">
            ⋮
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-surf border border-text-low rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="text-accent1 text-[20px]">⏱️</div>
            <div>
              <p className="font-heading font-bold text-[24px] text-text-high leading-none">
                {formatTime(sessionTime)}
              </p>
              <p className="font-body text-[11px] text-text-low">sesión</p>
            </div>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="bg-surf h-[56px] w-[56px] rounded-xl border border-text-low flex items-center justify-center text-[20px] hover:bg-surface transition-colors"
          >
            {isTimerRunning ? '⏸️' : '▶️'}
          </button>
        </div>

        <div className="mt-3">
          <div className="w-full h-2 bg-surf rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-body text-[11px] text-text-low text-right mt-1">
            {completedExercises} de {exercises.length} ejercicios
          </p>
        </div>
      </section>

      <section className="px-4 mt-4 flex flex-col gap-3">
        {exercises.map((exercise, index) => {
          const isExpanded = expandedExercise === exercise.id;
          const series = exerciseData[exercise.id] || [];
          const allCompleted = series.length > 0 && series.every(s => s.completed);

          return (
            <Card key={exercise.id}>
              <button
                onClick={() => toggleExercise(exercise.id)}
                className="w-full flex items-center gap-3"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-heading font-bold text-[18px] shrink-0 ${
                  allCompleted 
                    ? 'bg-primary text-text-high' 
                    : 'bg-primary-bg1 border border-primary text-primary'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1 text-left">
                  <p className="font-heading font-bold text-[16px] text-text-high">
                    {exercise.name}
                  </p>
                  <p className="font-body text-[12px] text-text-low">
                    {series.length} series
                  </p>
                </div>

                <div className="text-text-low text-[20px] transition-transform">
                  {isExpanded ? '⌃' : '⌄'}
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-text-low">
                  <div className="flex items-center justify-center gap-2 mb-4 text-[13px] text-text-low">
                    <span>⏳</span>
                    <span>Descanso entre series:</span>
                    <span className="font-heading font-bold text-primary">
                      {formatRestTime(exercise.restSeconds)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr_40px] gap-2 text-[11px] font-subheading font-semibold text-text-low uppercase tracking-wide text-center">
                      <div>#</div>
                      <div>REPS</div>
                      <div>PESO (KG)</div>
                      <div>RIR</div>
                      <div></div>
                    </div>

                    {series.map((serie, serieIndex) => (
                      <div 
                        key={serieIndex}
                        className={`grid grid-cols-[60px_1fr_1fr_1fr_40px] gap-2 items-center p-2 rounded-lg transition-all ${
                          serie.completed 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'bg-surf border border-text-low'
                        }`}
                      >
                        <div className="font-heading font-bold text-[14px] text-text-high text-center">
                          S{serie.serieNumber}
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            placeholder={serie.targetReps.toString()}
                            value={serie.actualReps}
                            onChange={(e) => handleSerieInputChange(exercise.id, serieIndex, 'actualReps', e.target.value)}
                            disabled={serie.completed}
                            className="w-full bg-background border border-text-low rounded-lg px-2 py-1.5 text-text-high text-[14px] font-heading font-semibold text-center outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-low/40"
                          />
                        </div>

                        <div>
                          <input
                            type="number"
                            step="0.5"
                            placeholder={serie.targetWeight > 0 ? serie.targetWeight.toString() : "0"}
                            value={serie.actualWeight}
                            onChange={(e) => handleSerieInputChange(exercise.id, serieIndex, 'actualWeight', e.target.value)}
                            disabled={serie.completed}
                            className="w-full bg-background border border-text-low rounded-lg px-2 py-1.5 text-text-high text-[14px] font-heading font-semibold text-center outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-low/40"
                          />
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            value={serie.targetRIR > 0 ? serie.targetRIR : "—"}
                            disabled
                            className="w-full bg-background/50 border border-text-low/50 rounded-lg px-2 py-1.5 text-text-low/50 text-[14px] font-heading font-semibold text-center cursor-not-allowed"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-text-low/30">🔒</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleSerieComplete(exercise.id, serieIndex)}
                          disabled={!isSerieComplete(exercise.id, serieIndex)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
                            serie.completed
                              ? 'bg-primary text-text-high'
                              : isSerieComplete(exercise.id, serieIndex)
                                ? 'bg-surf border border-primary text-primary hover:bg-primary/10'
                                : 'bg-surf border border-text-low/30 text-text-low/30 cursor-not-allowed'
                          }`}
                        >
                          {serie.completed && '✓'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </section>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          variant="outlined"
          text="✓ Finalizar entrenamiento"
          bgColor="bg-accent3"
          textColor="text-green"
          borderColor="border-accent3"
          w="w-full"
          onClick={handleFinishSession}
        />
      </div>
    </div>
  );
};

export default ExecuteRoutine;