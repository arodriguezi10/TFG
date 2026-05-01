import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";

const CreateRoutines1 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const {
    selectedExercises,
    removeExercise,
    routineConfiguration,
    clearExercises,
    clearRoutineConfiguration,
  } = useRoutine();

  const isInitialMount = useRef(true);

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
    { short: "X", full: "Miércoles" },
    { short: "J", full: "Jueves" },
    { short: "V", full: "Viernes" },
    { short: "S", full: "Sábado" },
    { short: "D", full: "Domingo" },
  ];
  const muscleGroups = [
    "Pecho",
    "Hombro",
    "Tríceps",
    "Espalda",
    "Bíceps",
    "Cuádriceps",
    "Femoral",
    "Glúteo",
    "Gemelo",
    "Core",
    "Trapecios",
    "Antebrazo",
  ];

  useEffect(() => {
  if (selectedExercises.length === 0) {
    localStorage.removeItem('createRoutineFormData');
    return;
  }

  const savedData = localStorage.getItem('createRoutineFormData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      setRoutineName(parsedData.routineName || "");
      setDescription(parsedData.description || "");
      setSelectedType(parsedData.selectedType || "");
      setSelectedDays(parsedData.selectedDays || []);
      setDuration(parsedData.duration || 45);
      setSelectedMuscles(parsedData.selectedMuscles || []);
    } catch (error) {
      console.error('Error al cargar datos guardados:', error);
    }
  }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const formData = {
      routineName,
      description,
      selectedType,
      selectedDays,
      duration,
      selectedMuscles,
    };
    localStorage.setItem("createRoutineFormData", JSON.stringify(formData));
  }, [
    routineName,
    description,
    selectedType,
    selectedDays,
    duration,
    selectedMuscles,
  ]);

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const handleDayClick = (day) => {
    if (selectedDays.includes(day.full)) {
      setSelectedDays(selectedDays.filter((d) => d !== day.full));
    } else {
      setSelectedDays([...selectedDays, day.full]);
    }
  };

  const handleMuscleClick = (muscle) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter((m) => m !== muscle));
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  const handleDurationChange = (increment) => {
    const newDuration = duration + increment;
    if (newDuration >= 15 && newDuration <= 180) {
      setDuration(newDuration);
    }
  };

  const handleNavigateToExercises = () => {
    const formData = {
      routineName,
      description,
      selectedType,
      selectedDays,
      duration,
      selectedMuscles,
    };
    localStorage.setItem("createRoutineFormData", JSON.stringify(formData));
    navigate("/exerciseSearchFree");
  };

  const handleSaveRoutine = async () => {
    if (!routineName.trim()) {
      setError("El nombre de la rutina es obligatorio");
      return;
    }

    if (selectedExercises.length === 0) {
      setError("Debes añadir al menos un ejercicio");
      return;
    }

    if (!selectedType) {
      setError("Selecciona un tipo de entrenamiento");
      return;
    }

    if (selectedDays.length === 0) {
      setError("Selecciona al menos un día");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data: routineData, error: routineError } = await supabase
        .from("routines")
        .insert([
          {
            user_id: user.id,
            name: routineName.trim(),
            description: description.trim() || null,
            training_type: selectedType,
            assigned_days: JSON.stringify(selectedDays),
            estimated_duration_min: duration,
            target_muscle_groups: JSON.stringify(selectedMuscles),
          },
        ])
        .select()
        .single();

      if (routineError) {
        console.error("Error al crear rutina:", routineError);
        setError("Error al guardar la rutina");
        return;
      }

      console.log("Rutina creada:", routineData);

      if (
        routineConfiguration &&
        routineConfiguration.series &&
        routineConfiguration.rest
      ) {
        const exercisesToInsert = selectedExercises.map((exercise, index) => {
          const series = routineConfiguration.series[exercise.id] || [];
          const restSeconds = routineConfiguration.rest[exercise.id] || "90";

          // Extraer target_reps y target_weight de las series
          const targetReps = series.map((s) => parseInt(s.reps) || 0);
          const targetWeight = series.map((s) => {
            const weight = s.weight?.replace(",", ".") || "0";
            return parseFloat(weight) || 0;
          });
          const targetRIR = series.map((s) => parseInt(s.rir) || 0);
          const intensity_technique =
            routineConfiguration.techniques?.[exercise.id] || null;

          return {
            routine_id: routineData.id,
            exercise_id: exercise.id,
            order_index: index + 1,
            target_sets: series.length,
            target_reps: targetReps,
            target_weight: targetWeight,
            target_rir: targetRIR,
            rest_seconds: restSeconds,
            intensity_technique: intensity_technique,
          };
        });

        const { error: exercisesError } = await supabase
          .from("routine_exercises")
          .insert(exercisesToInsert);

        if (exercisesError) {
          console.error("Error al insertar ejercicios:", exercisesError);
          setError("Error al guardar los ejercicios de la rutina");
          return;
        }

        console.log("Ejercicios insertados correctamente");
      }

      clearRoutineConfiguration();
      clearExercises();
      localStorage.removeItem("createRoutineFormData");
      alert("¡Rutina guardada exitosamente!");
      navigate("/routines1");
      if (location.state?.returnTo){
        navigate(location.state.returnTo);
      }else{
        navigate("/routines1");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Error inesperado al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <section className="w-full flex items-center justify-between">
        <Header showback subtitle={"Rutinas"} title={"Crear rutinas"} />
      </section>

      {error && (
        <section className="mt-4 w-full px-4">
          <div className="rounded-2xl bg-red/10 border border-red p-3.5">
            <p className="font-body text-[13px] text-red">{error}</p>
          </div>
        </section>
      )}

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-text-low text-[16px]">
          INFORMACIÓN BÁSICA
        </p>

        <Card>
          <div className="flex flex-col justify-between">
            <label className="font-subheading font-bold text-[14px] text-text-low uppercase tracking-wider">
              NOMBRE DE LA RUTINA
            </label>

            <div className="flex gap-3.75">
              <p className="text-text-low">📋</p>
              <input
                className="font-body text-[16px] text-text-high bg-transparent border-none outline-none w-full"
                type="text"
                placeholder="Ej: Push A, Piernas Fuerza..."
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full h-px bg-text-low mt-3.75"></div>

          <div className="mt-3.75 flex flex-col justify-between">
            <label className="font-subheading font-bold text-text-low text-[14px] uppercase tracking-wider">
              DESCRIPCIÓN
              <span className="font-subheading font-semibold text-[12px]">
                {" "}
                (opcional)
              </span>
            </label>

            <div className="flex gap-3.75">
              <p className="text-text-low">📝</p>
              <textarea
                className="w-full font-body text-[16px] text-text-high bg-transparent border-none outline-none resize-none"
                placeholder="Ej: Rutina de empuje enfocada en pecho"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-[16px] text-text-low">
          TIPO DE ENTRENAMIENTO
        </p>

        <Card>
          <div className="flex gap-2.5 items-center justify-center">
            {trainingTypes.slice(0, 3).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeClick(type)}
                className={`px-2.5 py-0.75 rounded-2xl border font-body text-[16px] transition-colors ${
                  selectedType === type
                    ? "bg-primary-bg border-primary text-primary"
                    : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="mt-2.5 flex gap-2.5 items-center justify-center">
            {trainingTypes.slice(3).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeClick(type)}
                className={`px-2.5 py-0.75 rounded-2xl border font-body text-[16px] transition-colors ${
                  selectedType === type
                    ? "bg-primary-bg border-primary text-primary"
                    : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-4 w-full px-4 flex gap-2.5">
        <div className="w-full flex flex-col">
          <p className="font-subheading font-bold text-[16px] text-text-low">
            DÍA
          </p>
          <Card>
            <div className="flex gap-2.5">
              {days.slice(0, 4).map((day) => (
                <button
                  key={day.short}
                  onClick={() => handleDayClick(day)}
                  className={`h-8.75 w-8.75 rounded-lg border font-subheading font-bold text-[16px] flex items-center justify-center transition-colors ${
                    selectedDays.includes(day.full)
                      ? "bg-primary-bg border-primary text-primary"
                      : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>

            <div className="mt-2.5 gap-2.5 flex items-center justify-center">
              {days.slice(4).map((day) => (
                <button
                  key={day.short}
                  onClick={() => handleDayClick(day)}
                  className={`h-8.75 w-8.75 rounded-lg border font-subheading font-bold text-[16px] flex items-center justify-center transition-colors ${
                    selectedDays.includes(day.full)
                      ? "bg-primary-bg border-primary text-primary"
                      : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="w-full flex flex-col">
          <p className="font-subheading font-bold text-[16px] text-text-low">
            DURACIÓN
          </p>
          <Card>
            <div className="flex flex-col">
              <div>
                <p className="font-heading font-bold text-[22px] text-primary">
                  {duration}
                  <span className="font-body text-[16px] text-text-low ml-1.25">
                    min
                  </span>
                </p>
              </div>
              <div className="mt-2.5 flex justify-end align-end gap-2.5">
                <button
                  onClick={() => handleDurationChange(-5)}
                  className="bg-surface h-8.75 w-8.75 rounded-lg border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors"
                >
                  -
                </button>

                <button
                  onClick={() => handleDurationChange(5)}
                  className="bg-surface h-8.75 w-8.75 rounded-lg border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <div className="w-full flex gap-2.5 items-center justify-between">
          <div className="flex gap-2.5 items-center">
            <p className="font-subheading font-bold text-text-low text-[16px]">
              EJERCICIOS
            </p>
            <p className="font-body text-text-low text-[14px]">
              {selectedExercises.length} añadido
              {selectedExercises.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* ✅ AQUÍ VA EL CÓDIGO */}
          {selectedExercises.length > 0 && (
            <button
              onClick={handleNavigateToExercises}
              className="bg-primary h-8 px-3 rounded-lg font-body text-[12px] text-text-high hover:bg-primary/80 transition-colors"
            >
              + Añadir más
            </button>
          )}
        </div>

        {selectedExercises.length === 0 ? (
          <Card>
            <div className="mt-4 flex flex-col items-center justify-center gap-3">
              <span className="bg-primary-bg h-15 w-15 px-2.5 rounded-2xl border border-primary font-body text-[25px] text-primary flex items-center justify-center">
                💪
              </span>

              <p className="font-heading font-bold text-[16px] text-text-high">
                Sin ejercicios todavía
              </p>

              <div className="flex items-center justify-center">
                <p className="font-body text-[16px] text-text-low text-center">
                  Añade los ejercicios que componen esta sesión. Podrás
                  ordenarlos y configurar series y repeticiones
                </p>
              </div>
              <Button
                onClick={handleNavigateToExercises}
                variant="outlined"
                text="Añadir ejercicios"
                bgColor={"bg-primary-bg"}
                textColor={"text-primary"}
                borderColor={"border-primary"}
                w="w-[65%]"
              />
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {selectedExercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-primary-bg min-w-8.75 h-6 rounded-lg border border-primary font-heading font-bold text-[14px] text-primary flex items-center justify-center shrink-0 px-2">
                      {index + 1}
                    </div>
                    <span className="bg-primary-bg h-12.5 w-12.5 rounded-xl border border-primary font-heading font-extrabold text-[18px] text-primary flex items-center justify-center shrink-0">
                      {exercise.is_custom ? "⚡" : "💪"}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1">
                    <p className="font-subheading font-bold text-[16px] text-text-high">
                      {exercise.name}
                    </p>

                    <p className="font-body text-[12px] text-text-low">
                      {exercise.muscle_group} ·{" "}
                      {exercise.equipment || "Sin equipo"}
                    </p>

                    <div className="mt-0.75 flex gap-1.5">
                      <span
                        className={`h-auto px-2.5 rounded-2xl border font-body text-[12px] ${
                          exercise.difficulty_level === "Principiante"
                            ? "bg-green-bg2 border-accent2 text-accent2"
                            : exercise.difficulty_level === "Intermedio"
                              ? "bg-orange-bg2 border-orange text-orange"
                              : "bg-accent1-bg1 border-accent1 text-accent1"
                        }`}
                      >
                        {exercise.difficulty_level}
                      </span>

                      {exercise.is_custom && (
                        <span className="bg-surface h-auto px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">
                          Personalizado
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="bg-surf h-8.75 w-8.75 rounded-lg border border-red flex items-center justify-center text-red text-[20px] hover:bg-red/10 transition-colors shrink-0"
                  >
                    ×
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-4 pb-17.5 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-[16px] text-text-low">
          GRUPOS MUSCULARES
        </p>

        <Card>
          <p className="font-subheading font-semibold text-[12px] text-text-low">
            SELECCIONA LOS QUE TRABAJES
          </p>

          <div className="mt-2.5 flex gap-2.5 items-center justify-center">
            {muscleGroups.slice(0, 3).map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleClick(muscle)}
                className={`w-24.5 px-2.5 py-1.25 rounded-lg border font-subheading text-[16px] transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? "bg-primary-bg border-primary text-primary"
                    : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>

          <div className="mt-2.5 flex gap-2.5 items-center justify-center">
            {muscleGroups.slice(3, 6).map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleClick(muscle)}
                className={`w-24.5 px-2.5 py-1.25 rounded-lg border font-subheading text-[16px] transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? "bg-primary-bg border-primary text-primary"
                    : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>

          <div className="mt-2.5 flex gap-2.5 items-center justify-center">
            {muscleGroups.slice(6, 9).map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleClick(muscle)}
                className={`w-24.5 px-2.5 py-1.25 rounded-lg border font-subheading text-[16px] transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? "bg-primary-bg border-primary text-primary"
                    : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>

          <div className="mt-2.5 flex gap-2.5 items-center justify-center">
            {muscleGroups.slice(9).map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleClick(muscle)}
                className={`w-24.5 px-2.5 py-1.25 rounded-lg border font-subheading text-[16px] transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? "bg-primary-bg border-primary text-primary"
                    : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-4 w-full px-4 fixed bottom-1 gap-2.5">
        <Button
          variant="outlined"
          text={loading ? "Guardando..." : "Guardar rutina"}
          bgColor={"bg-primary"}
          textColor={"text-text-high"}
          borderColor={"border-primary"}
          w="w-[100%]"
          onClick={handleSaveRoutine}
          disabled={loading}
        />
      </section>
    </div>
  );
};

export default CreateRoutines1;
