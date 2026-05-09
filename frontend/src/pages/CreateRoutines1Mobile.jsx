import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";
import { ClipboardList, FileText, Dumbbell, X, Plus, ChevronRight, AlertCircle } from "lucide-react";

const CreateRoutines1Mobile = () => {
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

  const btnClass = (active) => `px-2.5 py-0.75 rounded-2xl border font-body text-[16px] transition-colors ${active ? "bg-primary-bg border-primary text-primary" : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"}`;

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <section className="w-full">
        <Header showback subtitle="Rutinas" title="Crear rutinas" />
      </section>

      {error && (
        <section className="mt-4 w-full px-4">
          <div className="rounded-2xl bg-red/10 border border-red p-3.5 flex items-center gap-2">
            <AlertCircle size={16} className="text-red shrink-0" />
            <p className="font-body text-[13px] text-red">{error}</p>
          </div>
        </section>
      )}

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-text-low text-[16px]">INFORMACION BASICA</p>
        <Card>
          <div className="flex flex-col">
            <label className="font-subheading font-bold text-[14px] text-text-low uppercase tracking-wider">NOMBRE DE LA RUTINA</label>
            <div className="flex gap-3.75 mt-0.5">
              <ClipboardList size={20} className="text-text-low shrink-0" />
              <input className="font-body text-[16px] text-text-high bg-transparent border-none outline-none w-full" type="text" placeholder="Ej: Push A, Piernas Fuerza..." value={routineName} onChange={e => setRoutineName(e.target.value)} />
            </div>
          </div>
          <div className="w-full h-px bg-text-low mt-3.75" />
          <div className="mt-3.75 flex flex-col">
            <label className="font-subheading font-bold text-text-low text-[14px] uppercase tracking-wider">DESCRIPCION <span className="font-semibold text-[12px]">(opcional)</span></label>
            <div className="flex gap-3.75 mt-0.5">
              <FileText size={20} className="text-text-low shrink-0 mt-0.5" />
              <textarea className="w-full font-body text-[16px] text-text-high bg-transparent border-none outline-none resize-none" placeholder="Ej: Rutina de empuje enfocada en pecho" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-[16px] text-text-low">TIPO DE ENTRENAMIENTO</p>
        <Card>
          <div className="flex gap-2.5 items-center justify-center">
            {trainingTypes.slice(0, 3).map(t => <button key={t} onClick={() => setSelectedType(t)} className={btnClass(selectedType === t)}>{t}</button>)}
          </div>
          <div className="mt-2.5 flex gap-2.5 items-center justify-center">
            {trainingTypes.slice(3).map(t => <button key={t} onClick={() => setSelectedType(t)} className={btnClass(selectedType === t)}>{t}</button>)}
          </div>
        </Card>
      </section>

      <section className="mt-4 w-full px-4 flex gap-2.5">
        <div className="w-full flex flex-col">
          <p className="font-subheading font-bold text-[16px] text-text-low">DIA</p>
          <Card>
            <div className="flex gap-2.5">
              {days.slice(0, 4).map(day => (
                <button key={day.short} onClick={() => handleDayClick(day)} className={`h-8.75 w-8.75 rounded-lg border font-subheading font-bold text-[16px] flex items-center justify-center transition-colors ${selectedDays.includes(day.full) ? "bg-primary-bg border-primary text-primary" : "bg-surface border-text-low text-text-low"}`}>{day.short}</button>
              ))}
            </div>
            <div className="mt-2.5 gap-2.5 flex items-center justify-center">
              {days.slice(4).map(day => (
                <button key={day.short} onClick={() => handleDayClick(day)} className={`h-8.75 w-8.75 rounded-lg border font-subheading font-bold text-[16px] flex items-center justify-center transition-colors ${selectedDays.includes(day.full) ? "bg-primary-bg border-primary text-primary" : "bg-surface border-text-low text-text-low"}`}>{day.short}</button>
              ))}
            </div>
          </Card>
        </div>

        <div className="w-full flex flex-col">
          <p className="font-subheading font-bold text-[16px] text-text-low">DURACION</p>
          <Card>
            <div className="flex flex-col">
              <p className="font-heading font-bold text-[22px] text-primary">{duration}<span className="font-body text-[16px] text-text-low ml-1.25">min</span></p>
              <div className="mt-2.5 flex justify-end gap-2.5">
                <button onClick={() => handleDurationChange(-5)} className="bg-surface h-8.75 w-8.75 rounded-lg border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors">-</button>
                <button onClick={() => handleDurationChange(5)} className="bg-surface h-8.75 w-8.75 rounded-lg border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors">+</button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <div className="w-full flex gap-2.5 items-center justify-between">
          <div className="flex gap-2.5 items-center">
            <p className="font-subheading font-bold text-text-low text-[16px]">EJERCICIOS</p>
            <p className="font-body text-text-low text-[14px]">{selectedExercises.length} anadido{selectedExercises.length !== 1 ? "s" : ""}</p>
          </div>
          {selectedExercises.length > 0 && (
            <button onClick={handleNavigateToExercises} className="bg-primary h-8 px-3 rounded-lg font-body text-[12px] text-text-high hover:bg-primary/80 transition-colors">+ Anadir mas</button>
          )}
        </div>

        {selectedExercises.length === 0 ? (
          <Card>
            <div className="mt-4 flex flex-col items-center justify-center gap-3">
              <span className="bg-primary-bg h-15 w-15 rounded-2xl border border-primary text-primary flex items-center justify-center"><Dumbbell size={28} /></span>
              <p className="font-heading font-bold text-[16px] text-text-high">Sin ejercicios todavia</p>
              <p className="font-body text-[16px] text-text-low text-center">Anade los ejercicios que componen esta sesion.</p>
              <Button onClick={handleNavigateToExercises} variant="outlined" text="Anadir ejercicios" bgColor="bg-primary-bg" textColor="text-primary" borderColor="border-primary" w="w-[65%]" />
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {selectedExercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-primary-bg min-w-8.75 h-6 rounded-lg border border-primary font-heading font-bold text-[14px] text-primary flex items-center justify-center px-2">{index + 1}</div>
                    <span className="bg-primary-bg h-12.5 w-12.5 rounded-xl border border-primary text-primary flex items-center justify-center shrink-0"><Dumbbell size={20} /></span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="font-subheading font-bold text-[16px] text-text-high">{exercise.name}</p>
                    <p className="font-body text-[12px] text-text-low">{exercise.muscle_group} · {exercise.equipment || "Sin equipo"}</p>
                    <div className="mt-0.75 flex gap-1.5">
                      <span className={`h-auto px-2.5 rounded-2xl border font-body text-[12px] ${exercise.difficulty_level === "Principiante" ? "bg-green-bg2 border-accent2 text-accent2" : exercise.difficulty_level === "Intermedio" ? "bg-orange-bg2 border-orange text-orange" : "bg-accent1-bg1 border-accent1 text-accent1"}`}>{exercise.difficulty_level}</span>
                      {exercise.is_custom && <span className="bg-surface px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">Personalizado</span>}
                    </div>
                  </div>
                  <button onClick={() => removeExercise(exercise.id)} className="bg-surf h-8.75 w-8.75 rounded-lg border border-red flex items-center justify-center text-red hover:bg-red/10 transition-colors shrink-0"><X size={16} /></button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-4 pb-17.5 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-[16px] text-text-low">GRUPOS MUSCULARES</p>
        <Card>
          <p className="font-subheading font-semibold text-[12px] text-text-low">SELECCIONA LOS QUE TRABAJES</p>
          {[muscleGroups.slice(0, 3), muscleGroups.slice(3, 6), muscleGroups.slice(6, 9), muscleGroups.slice(9)].map((group, gi) => (
            <div key={gi} className="mt-2.5 flex gap-2.5 items-center justify-center">
              {group.map(muscle => (
                <button key={muscle} onClick={() => handleMuscleClick(muscle)} className={`w-24.5 px-2.5 py-1.25 rounded-lg border font-subheading text-[16px] transition-colors ${selectedMuscles.includes(muscle) ? "bg-primary-bg border-primary text-primary" : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"}`}>{muscle}</button>
              ))}
            </div>
          ))}
        </Card>
      </section>

      <section className="mt-4 w-full px-4 fixed bottom-1">
        <Button variant="outlined" text={loading ? "Guardando..." : "Guardar rutina"} bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-[100%]" onClick={handleSaveRoutine} disabled={loading} />
      </section>
    </div>
  );
};

export default CreateRoutines1Mobile;