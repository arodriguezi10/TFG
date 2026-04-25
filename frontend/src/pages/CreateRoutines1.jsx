import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";

const CreateRoutines1 = () => {
  const navigate = useNavigate();
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
    { short: "L", full: "Lunes" },
    { short: "M", full: "Martes" },
    { short: "X", full: "Miércoles" },
    { short: "J", full: "Jueves" },
    { short: "V", full: "Viernes" },
    { short: "S", full: "Sábado" },
    { short: "D", full: "Domingo" }
  ];
  const muscleGroups = [
    "Pecho", "Hombro", "Tríceps", "Espalda", "Bíceps", 
    "Cuádriceps", "Femoral", "Glúteo", "Gemelo", 
    "Core", "Trapecios", "Antebrazo"
  ];

  useEffect(() => {
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
      selectedMuscles
    };
    localStorage.setItem('createRoutineFormData', JSON.stringify(formData));
  }, [routineName, description, selectedType, selectedDays, duration, selectedMuscles]);

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const handleDayClick = (day) => {
    if (selectedDays.includes(day.full)) {
      setSelectedDays(selectedDays.filter(d => d !== day.full));
    } else {
      setSelectedDays([...selectedDays, day.full]);
    }
  };

  const handleMuscleClick = (muscle) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter(m => m !== muscle));
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
        .from('routines')
        .insert([{
          user_id: user.id,
          name: routineName.trim(),
          description: description.trim() || null,
          training_type: selectedType,
          assigned_days: JSON.stringify(selectedDays),
          estimated_duration_min: duration,
          target_muscle_groups: JSON.stringify(selectedMuscles)
        }])
        .select()
        .single();

      if (routineError) {
        console.error('Error al crear rutina:', routineError);
        setError('Error al guardar la rutina');
        return;
      }

      console.log('Rutina creada:', routineData);

      if (routineConfiguration && routineConfiguration.series && routineConfiguration.rest) {
        const exercisesToInsert = selectedExercises.map((exercise, index) => {
          const series = routineConfiguration.series[exercise.id] || [];
          const restSeconds = parseFloat(routineConfiguration.rest[exercise.id]?.replace(',', '.')) || 90;

          // Extraer target_reps y target_weight de las series
          const targetReps = series.map(s => parseInt(s.reps) || 0);
          const targetWeight = series.map(s => {
            const weight = s.weight?.replace(',', '.') || '0';
            return parseFloat(weight) || 0;
          });
          const targetRIR = series.map(() => 0); // RIR en 0 para plan free

          return {
            routine_id: routineData.id,
            exercise_id: exercise.id,
            order_index: index + 1,
            target_sets: series.length,
            target_reps: targetReps,    
            target_weight: targetWeight,
            target_rir: targetRIR,      
            rest_seconds: restSeconds,
            intensity_technique: null
          };
        });

        const { error: exercisesError } = await supabase
          .from('routine_exercises')
          .insert(exercisesToInsert);

        if (exercisesError) {
          console.error('Error al insertar ejercicios:', exercisesError);
          setError('Error al guardar los ejercicios de la rutina');
          return;
        }

        console.log('Ejercicios insertados correctamente');
      }

      clearRoutineConfiguration();
      clearExercises();
      localStorage.removeItem('createRoutineFormData');
      alert('¡Rutina guardada exitosamente!');
      navigate("/routines1");

    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
      <section className="w-full flex items-center justify-between">
        <Header showback subtitle={"Rutinas"} title={"Crear rutinas"} />
      </section>

      {error && (
        <section className="mt-[16px] w-full px-[16px]">
          <div className="rounded-[16px] bg-red/10 border border-red p-[14px]">
            <p className="font-body text-[13px] text-red">{error}</p>
          </div>
        </section>
      )}

      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
        <p className="font-subheading font-bold text-text-low text-[16px]">
          INFORMACIÓN BÁSICA
        </p>

        <Card>
          <div className="flex flex-col justify-between">
            <label className="font-subheading font-bold text-[14px] text-text-low uppercase tracking-wider">
              NOMBRE DE LA RUTINA
            </label>

            <div className="flex gap-[15px]">
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

          <div className="w-full h-[1px] bg-text-low mt-[15px]"></div>

          <div className="mt-[15px] flex flex-col justify-between">
            <label className="font-subheading font-bold text-text-low text-[14px] uppercase tracking-wider">
              DESCRIPCIÓN
              <span className="font-subheading font-semibold text-[12px]"> (opcional)</span>
            </label>

            <div className="flex gap-[15px]">
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

      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
        <p className="font-subheading font-bold text-[16px] text-text-low">
          TIPO DE ENTRENAMIENTO
        </p>

        <Card>
          <div className="flex gap-[10px] items-center justify-center">
            {trainingTypes.slice(0, 3).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeClick(type)}
                className={`px-[10px] py-[3px] rounded-[16px] border font-body text-[16px] transition-colors ${
                  selectedType === type
                    ? "bg-primary-bg border-primary text-primary"
                    : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            {trainingTypes.slice(3).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeClick(type)}
                className={`px-[10px] py-[3px] rounded-[16px] border font-body text-[16px] transition-colors ${
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

      <section className="mt-[16px] w-full px-[16px] w-full flex gap-[10px]">
        <div className="w-full flex flex-col">
          <p className="font-subheading font-bold text-[16px] text-text-low">
            DÍA
          </p>
          <Card>
            <div className="flex gap-[10px]">
              {days.slice(0, 4).map((day) => (
                <button
                  key={day.short}
                  onClick={() => handleDayClick(day)}
                  className={`h-[35px] w-[35px] rounded-[8px] border font-subheading font-bold text-[16px] flex items-center justify-center transition-colors ${
                    selectedDays.includes(day.full)
                      ? "bg-primary-bg border-primary text-primary"
                      : "bg-surface border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>

            <div className="mt-[10px] flex gap-[10px] flex items-center justify-center">
              {days.slice(4).map((day) => (
                <button
                  key={day.short}
                  onClick={() => handleDayClick(day)}
                  className={`h-[35px] w-[35px] rounded-[8px] border font-subheading font-bold text-[16px] flex items-center justify-center transition-colors ${
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
                  <span className="font-body text-[16px] text-text-low ml-[5px]">
                    min
                  </span>
                </p>
              </div>
              <div className="mt-[10px] flex justify-end align-end gap-[10px]">
                <button
                  onClick={() => handleDurationChange(-5)}
                  className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors"
                >
                  -
                </button>

                <button
                  onClick={() => handleDurationChange(5)}
                  className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
        <div className="w-[100%] flex gap-[10px] items-center justify-between">
          <div className="flex gap-[10px] items-center">
            <p className="font-subheading font-bold text-text-low text-[16px]">
              EJERCICIOS
            </p>
            <p className="font-body text-text-low text-[14px]">
              {selectedExercises.length} añadido{selectedExercises.length !== 1 ? 's' : ''}
            </p>
          </div>

          {selectedExercises.length > 0 && (
            <button
              onClick={() => navigate('/exerciseSearchFree')}
              className="bg-primary h-[32px] px-[12px] rounded-[8px] font-body text-[12px] text-text-high hover:bg-primary/80 transition-colors"
            >
              + Añadir más
            </button>
          )}
        </div>

        {selectedExercises.length === 0 ? (
          <Card>
            <div className="mt-[16px] flex flex-col items-center justify-center gap-[12px]">
              <span className="bg-primary-bg h-[60px] w-[60px] px-[10px] rounded-[16px] border border-primary font-body text-[25px] text-primary flex items-center justify-center">
                💪
              </span>

              <p className="font-heading font-bold text-[16px] text-text-high">
                Sin ejercicios todavía
              </p>

              <div className="flex items-center justify-center">
                <p className="font-body text-[16px] text-text-low text-center">
                  Añade los ejercicios que componen esta sesión. Podrás ordenarlos
                  y configurar series y repeticiones
                </p>
              </div>
              <Button
                onClick={() => navigate("/exerciseSearchFree")}
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
          <div className="flex flex-col gap-[10px]">
            {selectedExercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <div className="flex items-center gap-[12px]">
                  <div className="flex flex-col items-center gap-[4px]">
                    <div className="bg-primary-bg min-w-[35px] h-[24px] rounded-[8px] border border-primary font-heading font-bold text-[14px] text-primary flex items-center justify-center flex-shrink-0 px-[8px]">
                      {index + 1}
                    </div>
                    <span className="bg-primary-bg h-[50px] w-[50px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-primary flex items-center justify-center flex-shrink-0">
                      {exercise.is_custom ? '⚡' : '💪'}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1">
                    <p className="font-subheading font-bold text-[16px] text-text-high">
                      {exercise.name}
                    </p>

                    <p className="font-body text-[12px] text-text-low">
                      {exercise.muscle_group} · {exercise.equipment || 'Sin equipo'}
                    </p>

                    <div className="mt-[3px] flex gap-[6px]">
                      <span
                        className={`h-auto px-[10px] rounded-[16px] border font-body text-[12px] ${
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
                        <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                          Personalizado
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="bg-surf h-[35px] w-[35px] rounded-[8px] border border-red flex items-center justify-center text-red text-[20px] hover:bg-red/10 transition-colors flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-[16px] pb-[70px] w-full px-[16px] flex flex-col gap-[10px]">
        <p className="font-subheading font-bold text-[16px] text-text-low">
          GRUPOS MUSCULARES
        </p>

        <Card>
          <p className="font-subheading font-semibold text-[12px] text-text-low">
            SELECCIONA LOS QUE TRABAJES
          </p>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            {muscleGroups.slice(0, 3).map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleClick(muscle)}
                className={`w-[98px] px-[10px] py-[5px] rounded-[8px] border font-subheading text-[16px] transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? "bg-primary-bg border-primary text-primary"
                    : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            {muscleGroups.slice(3, 6).map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleClick(muscle)}
                className={`w-[98px] px-[10px] py-[5px] rounded-[8px] border font-subheading text-[16px] transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? "bg-primary-bg border-primary text-primary"
                    : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            {muscleGroups.slice(6, 9).map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleClick(muscle)}
                className={`w-[98px] px-[10px] py-[5px] rounded-[8px] border font-subheading text-[16px] transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? "bg-primary-bg border-primary text-primary"
                    : "border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            {muscleGroups.slice(9).map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleClick(muscle)}
                className={`w-[98px] px-[10px] py-[5px] rounded-[8px] border font-subheading text-[16px] transition-colors ${
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

      <section className="mt-[16px] w-full px-[16px] fixed bottom-1 gap-[10px]">
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