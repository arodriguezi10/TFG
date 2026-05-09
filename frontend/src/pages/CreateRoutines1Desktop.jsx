import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { ClipboardList, FileText, Dumbbell, X, Plus, AlertCircle, ChevronLeft } from "lucide-react";

const CreateRoutines1Desktop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { selectedExercises, removeExercise, routineConfiguration, clearExercises, clearRoutineConfiguration } = useRoutine();
  const isInitialMount = useRef(true);

  const [routineName, setRoutineName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [duration, setDuration] = useState(45);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trainingTypes = ["Push", "Pull", "Legs", "Upper", "Lower", "Cardio", "Otro"];
  const days = [
    { short: "L", full: "Lunes" }, { short: "M", full: "Martes" }, { short: "X", full: "Miercoles" },
    { short: "J", full: "Jueves" }, { short: "V", full: "Viernes" }, { short: "S", full: "Sabado" }, { short: "D", full: "Domingo" },
  ];
  const muscleGroups = ["Pecho", "Hombro", "Triceps", "Espalda", "Biceps", "Cuadriceps", "Femoral", "Gluteo", "Gemelo", "Core", "Trapecios", "Antebrazo"];

  useEffect(() => {
    if (selectedExercises.length === 0) { localStorage.removeItem("createRoutineFormData"); return; }
    const savedData = localStorage.getItem("createRoutineFormData");
    if (savedData) {
      try {
        const p = JSON.parse(savedData);
        setRoutineName(p.routineName || ""); setDescription(p.description || ""); setSelectedType(p.selectedType || "");
        setSelectedDays(p.selectedDays || []); setDuration(p.duration || 45); setSelectedMuscles(p.selectedMuscles || []);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    localStorage.setItem("createRoutineFormData", JSON.stringify({ routineName, description, selectedType, selectedDays, duration, selectedMuscles }));
  }, [routineName, description, selectedType, selectedDays, duration, selectedMuscles]);

  const handleDayClick = (day) => {
    setSelectedDays(selectedDays.includes(day.full) ? selectedDays.filter(d => d !== day.full) : [...selectedDays, day.full]);
  };

  const handleMuscleClick = (muscle) => {
    setSelectedMuscles(selectedMuscles.includes(muscle) ? selectedMuscles.filter(m => m !== muscle) : [...selectedMuscles, muscle]);
  };

  const handleDurationChange = (inc) => {
    const n = duration + inc;
    if (n >= 15 && n <= 180) setDuration(n);
  };

  const handleNavigateToExercises = () => {
    localStorage.setItem("createRoutineFormData", JSON.stringify({ routineName, description, selectedType, selectedDays, duration, selectedMuscles }));
    navigate("/exerciseSearchFree");
  };

  const handleSaveRoutine = async () => {
    if (!routineName.trim()) { setError("El nombre de la rutina es obligatorio"); return; }
    if (selectedExercises.length === 0) { setError("Debes anadir al menos un ejercicio"); return; }
    if (!selectedType) { setError("Selecciona un tipo de entrenamiento"); return; }
    if (selectedDays.length === 0) { setError("Selecciona al menos un dia"); return; }

    try {
      setLoading(true); setError("");
      const { data: routineData, error: routineError } = await supabase.from("routines").insert([{
        user_id: user.id, name: routineName.trim(), description: description.trim() || null,
        training_type: selectedType, assigned_days: JSON.stringify(selectedDays),
        estimated_duration_min: duration, target_muscle_groups: JSON.stringify(selectedMuscles),
      }]).select().single();
      if (routineError) { setError("Error al guardar la rutina"); return; }

      if (routineConfiguration?.series && routineConfiguration?.rest) {
        const exercisesToInsert = selectedExercises.map((exercise, index) => {
          const series = routineConfiguration.series[exercise.id] || [];
          return {
            routine_id: routineData.id, exercise_id: exercise.id, order_index: index + 1,
            target_sets: series.length,
            target_reps: series.map(s => parseInt(s.reps) || 0),
            target_weight: series.map(s => parseFloat(s.weight?.replace(",", ".")) || 0),
            target_rir: series.map(s => parseInt(s.rir) || 0),
            rest_seconds: routineConfiguration.rest[exercise.id] || "90",
            intensity_technique: routineConfiguration.techniques?.[exercise.id] || null,
          };
        });
        const { error: exercisesError } = await supabase.from("routine_exercises").insert(exercisesToInsert);
        if (exercisesError) { setError("Error al guardar los ejercicios"); return; }
      }

      clearRoutineConfiguration(); clearExercises(); localStorage.removeItem("createRoutineFormData");
      alert("Rutina guardada exitosamente!");
      navigate(location.state?.returnTo || "/routines1");
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  };

  const btnType = (active) => `px-3 py-1.5 rounded-xl border font-body text-[14px] transition-colors ${active ? "bg-primary-bg border-primary text-primary" : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"}`;
  const btnDay = (active) => `h-10 w-10 rounded-lg border font-subheading font-bold text-[15px] flex items-center justify-center transition-colors ${active ? "bg-primary-bg border-primary text-primary" : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"}`;
  const btnMuscle = (active) => `px-3 py-1.5 rounded-lg border font-subheading text-[14px] transition-colors ${active ? "bg-primary-bg border-primary text-primary" : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/routines1")} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Rutinas</p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high leading-tight">Crear rutina</h1>
          </div>
        </div>
        <Button variant="outlined" text={loading ? "Guardando..." : "Guardar rutina"} bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-auto px-6" onClick={handleSaveRoutine} disabled={loading} />
      </div>

      {error && (
        <div className="mx-8 mt-4 rounded-2xl bg-red/10 border border-red p-3.5 flex items-center gap-2">
          <AlertCircle size={16} className="text-red shrink-0" />
          <p className="font-body text-[13px] text-red">{error}</p>
        </div>
      )}

      {/* CONTENIDO EN DOS COLUMNAS */}
      <div className="flex-1 px-8 py-6 grid grid-cols-2 gap-6 pb-10">

        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-5">

          {/* INFO BASICA */}
          <div>
            <p className="font-subheading font-bold text-text-low text-[13px] uppercase tracking-wide mb-3">Informacion basica</p>
            <Card>
              <div className="flex flex-col">
                <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wider">NOMBRE DE LA RUTINA</label>
                <div className="flex gap-3 mt-2">
                  <ClipboardList size={18} className="text-text-low shrink-0 mt-0.5" />
                  <input className="font-body text-[15px] text-text-high bg-transparent border-none outline-none w-full" type="text" placeholder="Ej: Push A, Piernas Fuerza..." value={routineName} onChange={e => setRoutineName(e.target.value)} />
                </div>
              </div>
              <div className="w-full h-px bg-text-low my-3" />
              <div className="flex flex-col">
                <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wider">DESCRIPCION <span className="font-normal normal-case">(opcional)</span></label>
                <div className="flex gap-3 mt-2">
                  <FileText size={18} className="text-text-low shrink-0 mt-0.5" />
                  <textarea className="w-full font-body text-[15px] text-text-high bg-transparent border-none outline-none resize-none" placeholder="Ej: Rutina de empuje enfocada en pecho" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
              </div>
            </Card>
          </div>

          {/* TIPO */}
          <div>
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Tipo de entrenamiento</p>
            <Card>
              <div className="flex flex-wrap gap-2">
                {trainingTypes.map(t => <button key={t} onClick={() => setSelectedType(t)} className={btnType(selectedType === t)}>{t}</button>)}
              </div>
            </Card>
          </div>

          {/* DIA Y DURACION */}
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Dia</p>
              <Card>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => <button key={day.short} onClick={() => handleDayClick(day)} className={btnDay(selectedDays.includes(day.full))}>{day.short}</button>)}
                </div>
              </Card>
            </div>
            <div className="flex-1">
              <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Duracion</p>
              <Card>
                <p className="font-heading font-bold text-[28px] text-primary leading-none">{duration}<span className="font-body text-[14px] text-text-low ml-1">min</span></p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleDurationChange(-5)} className="bg-surface h-9 w-9 rounded-lg border border-text-low font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors">-</button>
                  <button onClick={() => handleDurationChange(5)} className="bg-surface h-9 w-9 rounded-lg border border-text-low font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors">+</button>
                </div>
              </Card>
            </div>
          </div>

          {/* GRUPOS MUSCULARES */}
          <div>
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Grupos musculares</p>
            <Card>
              <p className="font-subheading font-semibold text-[11px] text-text-low mb-3">SELECCIONA LOS QUE TRABAJES</p>
              <div className="flex flex-wrap gap-2">
                {muscleGroups.map(muscle => <button key={muscle} onClick={() => handleMuscleClick(muscle)} className={btnMuscle(selectedMuscles.includes(muscle))}>{muscle}</button>)}
              </div>
            </Card>
          </div>
        </div>

        {/* COLUMNA DERECHA — EJERCICIOS */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Ejercicios</p>
                <span className="font-body text-text-low text-[13px]">{selectedExercises.length} anadido{selectedExercises.length !== 1 ? "s" : ""}</span>
              </div>
              {selectedExercises.length > 0 && (
                <button onClick={handleNavigateToExercises} className="flex items-center gap-1.5 bg-primary h-8 px-3 rounded-lg font-body text-[12px] text-text-high hover:bg-primary/80 transition-colors">
                  <Plus size={14} /> Anadir mas
                </button>
              )}
            </div>

            {selectedExercises.length === 0 ? (
              <Card>
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <span className="bg-primary-bg h-16 w-16 rounded-2xl border border-primary text-primary flex items-center justify-center"><Dumbbell size={32} /></span>
                  <p className="font-heading font-bold text-[18px] text-text-high">Sin ejercicios todavia</p>
                  <p className="font-body text-[14px] text-text-low text-center max-w-xs">Anade los ejercicios que componen esta sesion. Podras ordenarlos y configurar series y repeticiones.</p>
                  <button onClick={handleNavigateToExercises} className="flex items-center gap-2 bg-primary-bg border border-primary px-5 py-2.5 rounded-xl font-subheading font-bold text-[14px] text-primary hover:bg-primary/10 transition-colors">
                    <Plus size={16} /> Anadir ejercicios
                  </button>
                </div>
              </Card>
            ) : (
              <div className="flex flex-col gap-2.5">
                {selectedExercises.map((exercise, index) => (
                  <Card key={exercise.id}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className="bg-primary-bg min-w-8 h-6 rounded-lg border border-primary font-heading font-bold text-[13px] text-primary flex items-center justify-center px-2">{index + 1}</div>
                        <span className="bg-primary-bg h-11 w-11 rounded-xl border border-primary text-primary flex items-center justify-center"><Dumbbell size={18} /></span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-subheading font-bold text-[15px] text-text-high">{exercise.name}</p>
                        <p className="font-body text-[12px] text-text-low">{exercise.muscle_group} · {exercise.equipment || "Sin equipo"}</p>
                        <div className="mt-0.75 flex gap-1.5">
                          <span className={`px-2.5 rounded-2xl border font-body text-[11px] ${exercise.difficulty_level === "Principiante" ? "bg-green-bg2 border-accent2 text-accent2" : exercise.difficulty_level === "Intermedio" ? "bg-orange-bg2 border-orange text-orange" : "bg-accent1-bg1 border-accent1 text-accent1"}`}>{exercise.difficulty_level}</span>
                          {exercise.is_custom && <span className="bg-surface px-2.5 rounded-2xl border border-text-low font-body text-[11px] text-text-low">Personalizado</span>}
                        </div>
                      </div>
                      <button onClick={() => removeExercise(exercise.id)} className="bg-surf h-8 w-8 rounded-lg border border-red flex items-center justify-center text-red hover:bg-red/10 transition-colors shrink-0"><X size={15} /></button>
                    </div>
                  </Card>
                ))}

                <button onClick={handleNavigateToExercises} className="w-full border border-dashed border-text-low/30 rounded-2xl py-4 flex items-center justify-center gap-2 text-text-low hover:border-primary hover:text-primary transition-colors font-subheading font-bold text-[14px]">
                  <Plus size={16} /> Anadir mas ejercicios
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutines1Desktop;