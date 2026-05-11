import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { ChevronLeft, Plus, X, Dumbbell, Zap } from "lucide-react";


const EditRoutineDesktop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    selectedExercises,
    setSelectedExercises,
    removeExercise,
    routineConfiguration,
    setRoutineConfiguration,
    clearExercises,
    clearRoutineConfiguration,
  } = useRoutine();

  console.log("🟡 RENDER EditRoutineDesktop");
  console.log("🟡 selectedExercises en render:", selectedExercises);

  const [loadingRoutine, setLoadingRoutine] = useState(true);
  const [routineName, setRoutineName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [duration, setDuration] = useState(45);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trainingTypes = [
    "Push",
    "Pull",
    "Legs",
    "Upper",
    "Lower",
    "Cardio",
    "Otro",
  ];
  const days = [
    { short: "L", full: "Lunes" },
    { short: "M", full: "Martes" },
    { short: "X", full: "Miercoles" },
    { short: "J", full: "Jueves" },
    { short: "V", full: "Viernes" },
    { short: "S", full: "Sabado" },
    { short: "D", full: "Domingo" },
  ];
  const muscleGroups = [
    "Pecho",
    "Hombro",
    "Triceps",
    "Espalda",
    "Biceps",
    "Cuadriceps",
    "Femoral",
    "Gluteo",
    "Gemelo",
    "Core",
    "Trapecios",
    "Antebrazo",
  ];

  console.log("🟡 RENDER EditRoutineDesktop");
console.log("🟡 selectedExercises en render:", selectedExercises);

  useEffect(() => {
   if (user && id){
        console.log("📥 Cargando rutina desde Supabase...");
    fetchRoutineData();} 
  }, [user, id]);

  const fetchRoutineData = async () => {
    try {
      setLoadingRoutine(true);
      const { data: routineData, error: routineError } = await supabase
        .from("routines")
        .select(
          `*, routine_exercises (id, exercise_id, order_index, target_sets, target_reps, target_weight, target_rir, rest_seconds, intensity_technique, exercises (id, name, muscle_group, equipment, difficulty_level, is_custom))`,
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      if (routineError) {
        setError(routineError.message || "Error al cargar la rutina");
        navigate("/routines1");
        return;
      }

      setRoutineName(routineData.name || "");
      setDescription(routineData.description || "");
      setSelectedType(routineData.training_type || "");
      setSelectedDays(JSON.parse(routineData.assigned_days || "[]"));
      setDuration(routineData.estimated_duration_min || 45);
      setSelectedMuscles(JSON.parse(routineData.target_muscle_groups || "[]"));

      if (selectedExercises.length === 0) {
  const exercises = routineData.routine_exercises
    .sort((a, b) => a.order_index - b.order_index)
    .map((re) => re.exercises);
  setSelectedExercises(exercises);
}

      if (!routineConfiguration || !routineConfiguration.series) {
        const seriesConfig = {},
          restConfig = {},
          techniquesConfig = {};
        routineData.routine_exercises.forEach((re) => {
          const exerciseId = re.exercise_id;
          const repsArray = Array.isArray(re.target_reps) ? re.target_reps : [];
          const weightArray = Array.isArray(re.target_weight)
            ? re.target_weight
            : [];
          const rirArray = Array.isArray(re.target_rir) ? re.target_rir : [];
          seriesConfig[exerciseId] = repsArray.map((reps, idx) => ({
            id: idx + 1,
            reps: String(reps || ""),
            weight: String(weightArray[idx] || ""),
            rir: String(rirArray[idx] || ""),
          }));
          restConfig[exerciseId] = String(re.rest_seconds || "90");
          if (re.intensity_technique)
            techniquesConfig[exerciseId] = re.intensity_technique;
        });
        setRoutineConfiguration({
          series: seriesConfig,
          rest: restConfig,
          techniques: techniquesConfig,
        });
      }
    } catch (error) {
      setError(error.message || "Error inesperado al cargar");
      navigate("/routines1");
    } finally {
      setLoadingRoutine(false);
    }
  };

  const handleDayClick = (day) => {
    setSelectedDays(
      selectedDays.includes(day.full)
        ? selectedDays.filter((d) => d !== day.full)
        : [...selectedDays, day.full],
    );
  };

  const handleMuscleClick = (muscle) => {
    setSelectedMuscles(
      selectedMuscles.includes(muscle)
        ? selectedMuscles.filter((m) => m !== muscle)
        : [...selectedMuscles, muscle],
    );
  };

  const handleUpdateRoutine = async () => {
    if (!routineName.trim()) {
      setError("El nombre de la rutina es obligatorio");
      return;
    }
    if (selectedExercises.length === 0) {
      setError("Debes anadir al menos un ejercicio");
      return;
    }
    if (!selectedType) {
      setError("Selecciona un tipo de entrenamiento");
      return;
    }
    if (selectedDays.length === 0) {
      setError("Selecciona al menos un dia");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { error: routineError } = await supabase
        .from("routines")
        .update({
          name: routineName.trim(),
          description: description.trim() || null,
          training_type: selectedType,
          assigned_days: JSON.stringify(selectedDays),
          estimated_duration_min: duration,
          target_muscle_groups: JSON.stringify(selectedMuscles),
        })
        .eq("id", id)
        .eq("user_id", user.id);
      if (routineError) {
        setError("Error al actualizar la rutina");
        return;
      }

      const { error: deleteError } = await supabase
        .from("routine_exercises")
        .delete()
        .eq("routine_id", id);
      if (deleteError) {
        setError("Error al actualizar ejercicios");
        return;
      }

      if (routineConfiguration?.series && routineConfiguration?.rest) {
        const exercisesToInsert = selectedExercises.map((exercise, index) => {
          const series = routineConfiguration.series[exercise.id] || [];
          const restSeconds = routineConfiguration.rest[exercise.id] || "90";
          return {
            routine_id: id,
            exercise_id: exercise.id,
            order_index: index + 1,
            target_sets: series.length,
            target_reps: series.map((s) => parseInt(s.reps) || 0),
            target_weight: series.map(
              (s) => parseFloat(s.weight?.replace(",", ".") || "0") || 0,
            ),
            target_rir: series.map((s) => parseInt(s.rir) || 0),
            rest_seconds: restSeconds,
            intensity_technique:
              routineConfiguration.techniques?.[exercise.id] || null,
          };
        });
        const { error: exercisesError } = await supabase
          .from("routine_exercises")
          .insert(exercisesToInsert);
        if (exercisesError) {
          setError("Error al guardar los ejercicios");
          return;
        }
      }

      clearRoutineConfiguration();
      clearExercises();
      alert("Rutina actualizada exitosamente");
      navigate("/routines1");
    } catch (error) {
      setError(error.message || "Error inesperado al actualizar");
    } finally {
      setLoading(false);
    }
  };

  if (loadingRoutine)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-text-low">Cargando rutina...</p>
      </div>
    );

  const btnClass = (active) =>
    `px-3 py-1.5 rounded-xl border font-subheading font-bold text-[14px] transition-colors cursor-pointer ${active ? "bg-accent1-bg1 border-accent1 text-accent1" : "bg-surf border-text-low text-text-low hover:border-accent1 hover:text-accent1"}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/routines1")}
            className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">
              Rutinas
            </p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high">
              Editar rutina
            </h1>
          </div>
        </div>
        <Button
          variant="outlined"
          text={loading ? "Guardando..." : "Guardar cambios"}
          bgColor="bg-accent1"
          textColor="text-text-high"
          borderColor="border-accent1"
          w="w-auto px-6"
          onClick={handleUpdateRoutine}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="mx-8 mt-4 rounded-2xl bg-red/10 border border-red p-3.5">
          <p className="font-body text-[13px] text-red">{error}</p>
        </div>
      )}

      <div className="flex-1 px-8 py-6 grid grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA — INFO BÁSICA */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">
              Informacion basica
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide block mb-2">
                  Nombre de la rutina
                </label>
                <input
                  type="text"
                  placeholder="Ej: Push A, Piernas Fuerza..."
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="w-full bg-background border border-text-low rounded-xl px-4 py-3 text-text-high text-[14px] font-body outline-none focus:border-accent1 transition-colors"
                />
              </div>
              <div>
                <label className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide block mb-2">
                  Descripcion{" "}
                  <span className="normal-case text-[10px]">(opcional)</span>
                </label>
                <textarea
                  placeholder="Ej: Rutina de empuje enfocada en pecho"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background border border-text-low rounded-xl px-4 py-3 text-text-high text-[14px] font-body outline-none focus:border-accent1 transition-colors resize-none"
                />
              </div>
            </div>
          </Card>

          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">
              Tipo de entrenamiento
            </p>
            <div className="flex flex-wrap gap-2">
              {trainingTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={btnClass(selectedType === type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">
              Dias de entrenamiento
            </p>
            <div className="flex gap-2 flex-wrap">
              {days.map((day) => (
                <button
                  key={day.short}
                  onClick={() => handleDayClick(day)}
                  className={`h-10 w-10 rounded-xl border font-subheading font-bold text-[14px] flex items-center justify-center transition-colors ${selectedDays.includes(day.full) ? "bg-accent1-bg1 border-accent1 text-accent1" : "bg-surf border-text-low text-text-low hover:border-accent1 hover:text-accent1"}`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">
              Duracion estimada
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDuration((d) => Math.max(15, d - 5))}
                className="bg-surf h-10 w-10 rounded-xl border border-text-low font-heading font-bold text-[18px] text-text-high flex items-center justify-center hover:bg-accent1 hover:text-text-high transition-colors"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <p className="font-heading font-bold text-[32px] text-accent1 leading-none">
                  {duration}
                </p>
                <p className="font-body text-[12px] text-text-low">minutos</p>
              </div>
              <button
                onClick={() => setDuration((d) => Math.min(180, d + 5))}
                className="bg-surf h-10 w-10 rounded-xl border border-text-low font-heading font-bold text-[18px] text-text-high flex items-center justify-center hover:bg-accent1 hover:text-text-high transition-colors"
              >
                +
              </button>
            </div>
          </Card>
        </div>

        {/* COLUMNA CENTRAL — EJERCICIOS */}
        <div className="flex flex-col gap-5">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">
                  Ejercicios
                </p>
                <p className="font-body text-[13px] text-text-low">
                  {selectedExercises.length} anadido
                  {selectedExercises.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => navigate("/exerciseSearchFree")}
                className="bg-accent1 h-9 px-4 rounded-xl font-body text-[13px] text-text-high hover:opacity-80 transition-opacity flex items-center gap-1.5"
              >
                <Plus size={14} /> Anadir
              </button>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-3">
                <div className="bg-accent1-bg1 h-16 w-16 rounded-2xl border border-accent1 flex items-center justify-center">
                  <Dumbbell size={32} className="text-accent1" />
                </div>
                <p className="font-heading font-bold text-[15px] text-text-high">
                  Sin ejercicios todavia
                </p>
                <p className="font-body text-[13px] text-text-low text-center">
                  Anade los ejercicios que componen esta sesion
                </p>
                <Button
                  onClick={() => navigate("/exerciseSearchFree")}
                  variant="outlined"
                  text="Anadir ejercicios"
                  bgColor="bg-accent1-bg1"
                  textColor="text-accent1"
                  borderColor="border-accent1"
                  w="w-auto px-6"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedExercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="bg-background border border-text-low rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="bg-accent1-bg1 min-w-7 h-5 rounded-lg border border-accent1 font-heading font-bold text-[12px] text-accent1 flex items-center justify-center px-1.5">
                        {index + 1}
                      </div>
                      <div className="bg-accent1-bg1 h-10 w-10 rounded-xl border border-accent1 font-heading font-extrabold text-[16px] text-accent1 flex items-center justify-center">
                        {exercise.is_custom ? (
                          <Zap size={18} />
                        ) : (
                          <Dumbbell size={18} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-subheading font-bold text-[14px] text-text-high truncate">
                        {exercise.name}
                      </p>
                      <p className="font-body text-[11px] text-text-low">
                        {exercise.muscle_group} ·{" "}
                        {exercise.equipment || "Sin equipo"}
                      </p>
                      <div className="flex gap-1.5 mt-0.5">
                        <span
                          className={`px-2 rounded-full border font-body text-[10px] ${exercise.difficulty_level === "Principiante" ? "bg-green-bg2 border-accent2 text-accent2" : exercise.difficulty_level === "Intermedio" ? "bg-orange-bg2 border-orange text-orange" : "bg-accent1-bg1 border-accent1 text-accent1"}`}
                        >
                          {exercise.difficulty_level}
                        </span>
                        {exercise.is_custom && (
                          <span className="bg-surf px-2 rounded-full border border-text-low font-body text-[10px] text-text-low">
                            Personalizado
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="bg-surf h-8 w-8 rounded-lg border border-red flex items-center justify-center text-red hover:bg-red/10 transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* COLUMNA DERECHA — MUSCULOS */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-1">
              Grupos musculares
            </p>
            <p className="font-body text-[12px] text-text-low mb-4">
              Selecciona los que trabajes
            </p>
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => handleMuscleClick(muscle)}
                  className={btnClass(selectedMuscles.includes(muscle))}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </Card>

          {/* RESUMEN */}
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">
              Resumen
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-body text-[13px] text-text-low">Nombre</p>
                <p className="font-subheading font-bold text-[13px] text-text-high truncate max-w-32">
                  {routineName || "--"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[13px] text-text-low">Tipo</p>
                <p className="font-subheading font-bold text-[13px] text-accent1">
                  {selectedType || "--"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[13px] text-text-low">Dias</p>
                <p className="font-subheading font-bold text-[13px] text-text-high">
                  {selectedDays.length > 0
                    ? selectedDays.map((d) => d.slice(0, 2)).join(", ")
                    : "--"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[13px] text-text-low">Duracion</p>
                <p className="font-subheading font-bold text-[13px] text-text-high">
                  {duration} min
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[13px] text-text-low">
                  Ejercicios
                </p>
                <p className="font-subheading font-bold text-[13px] text-text-high">
                  {selectedExercises.length}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[13px] text-text-low">Musculos</p>
                <p className="font-subheading font-bold text-[13px] text-text-high">
                  {selectedMuscles.length} seleccionados
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditRoutineDesktop;
