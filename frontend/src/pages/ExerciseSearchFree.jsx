import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

const ExerciseSearchFree = () => {
  const { user } = useContext(AuthContext);
  const { addExercise, removeExercise, isExerciseSelected, selectedExercises } =
    useRoutine();
  const navigate = useNavigate();
  const location = useLocation();

  const [customExercises, setCustomExercises] = useState([]);
  const [predefinedExercisesFromDB, setPredefinedExercisesFromDB] = useState([]);
  const [intermediateExercisesFromDB, setIntermediateExercisesFromDB] = useState([]);
  const [advancedExercisesFromDB, setAdvancedExercisesFromDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState("Todos");
  const [subscriptionTier, setSubscriptionTier] = useState('free');

  const isSearchActive =
    location.pathname === "/exerciseSearchFree" ||
    !location.pathname.includes("config");
  const isConfigActive = location.pathname.includes("config");

  const predefinedExercises = [
    {
      name: "Peck deck",
      muscle_group: "Pecho",
      equipment: "Máquina",
      difficulty_level: "Principiante",
    },
    {
      name: "Press plano",
      muscle_group: "Pecho",
      equipment: "Máquina",
      difficulty_level: "Principiante",
    },
    {
      name: "Flexiones",
      muscle_group: "Pecho",
      equipment: "Peso corporal",
      difficulty_level: "Principiante",
    },
    {
      name: "Jalón al pecho",
      muscle_group: "Espalda",
      equipment: "Máquina",
      difficulty_level: "Principiante",
    },
    {
      name: "Pull over",
      muscle_group: "Espalda",
      equipment: "Polea",
      difficulty_level: "Principiante",
    },
    {
      name: "Hiperextensiones lumbares",
      muscle_group: "Espalda",
      equipment: "Peso libre",
      difficulty_level: "Principiante",
    },
    {
      name: "Elevaciones laterales",
      muscle_group: "Hombro",
      equipment: "Máquina",
      difficulty_level: "Principiante",
    },
    {
      name: "Face pull",
      muscle_group: "Hombro",
      equipment: "Polea",
      difficulty_level: "Principiante",
    },
    {
      name: "Extensión de cuádriceps",
      muscle_group: "Cuádriceps",
      equipment: "Máquina",
      difficulty_level: "Principiante",
    },
    {
      name: "Curl femoral sentado",
      muscle_group: "Femoral",
      equipment: "Máquina",
      difficulty_level: "Principiante",
    },
    {
      name: "Curl femoral tumbado",
      muscle_group: "Femoral",
      equipment: "Máquina",
      difficulty_level: "Principiante",
    },
    {
      name: "Patada de glúteo",
      muscle_group: "Glúteo",
      equipment: "Polea",
      difficulty_level: "Principiante",
    },
    {
      name: "Abducción de cadera",
      muscle_group: "Glúteo",
      equipment: "Máquina",
      difficulty_level: "Principiante",
    },
    {
      name: "Curl martillo",
      muscle_group: "Bíceps",
      equipment: "Polea",
      difficulty_level: "Principiante",
    },
    {
      name: "Extensión de tríceps",
      muscle_group: "Tríceps",
      equipment: "Polea",
      difficulty_level: "Principiante",
    },
    {
      name: "Patada de tríceps",
      muscle_group: "Tríceps",
      equipment: "Polea",
      difficulty_level: "Principiante",
    },
    {
      name: "Elevaciones de talones de pie",
      muscle_group: "Gemelo",
      equipment: "Peso libre",
      difficulty_level: "Principiante",
    },
    {
      name: "Elevaciones de talones sentado",
      muscle_group: "Gemelo",
      equipment: "Peso libre",
      difficulty_level: "Principiante",
    },
    {
      name: "Planchas",
      muscle_group: "Core",
      equipment: "Peso corporal",
      difficulty_level: "Principiante",
    },
    {
      name: "Crunch en polea",
      muscle_group: "Core",
      equipment: "Polea",
      difficulty_level: "Principiante",
    },
  ];

  const intermediateExercises = [
    {
      name: "Press de banca plano",
      muscle_group: "Pecho",
      equipment: "Peso libre",
      difficulty_level: "Intermedio",
    },
    {
      name: "Cruces en polea",
      muscle_group: "Pecho",
      equipment: "Polea",
      difficulty_level: "Intermedio",
    },
    {
      name: "Remo con barra",
      muscle_group: "Espalda",
      equipment: "Peso libre",
      difficulty_level: "Intermedio",
    },
    {
      name: "Remo Gironda",
      muscle_group: "Espalda",
      equipment: "Máquina",
      difficulty_level: "Intermedio",
    },
    {
      name: "Press militar con mancuernas",
      muscle_group: "Hombro",
      equipment: "Peso libre",
      difficulty_level: "Intermedio",
    },
    {
      name: "Elevaciones laterales con polea",
      muscle_group: "Hombro",
      equipment: "Polea",
      difficulty_level: "Intermedio",
    },
    {
      name: "Pájaros con mancuernas",
      muscle_group: "Hombro",
      equipment: "Peso libre",
      difficulty_level: "Intermedio",
    },
    {
      name: "Hack",
      muscle_group: "Cuádriceps",
      equipment: "Peso libre",
      difficulty_level: "Intermedio",
    },
    {
      name: "Peso muerto rumano",
      muscle_group: "Femoral",
      equipment: "Peso libre",
      difficulty_level: "Intermedio",
    },
    {
      name: "Hip thrust con barra",
      muscle_group: "Glúteo",
      equipment: "Peso libre",
      difficulty_level: "Intermedio",
    },
    {
      name: "Curl bayesian",
      muscle_group: "Bíceps",
      equipment: "Polea",
      difficulty_level: "Intermedio",
    },
    {
      name: "Curl predicador",
      muscle_group: "Bíceps",
      equipment: "Polea",
      difficulty_level: "Intermedio",
    },
    {
      name: "Extensión tras nuca",
      muscle_group: "Tríceps",
      equipment: "Polea",
      difficulty_level: "Intermedio",
    },
    {
      name: "Elevaciones de piernas colgado",
      muscle_group: "Core",
      equipment: "Peso corporal",
      difficulty_level: "Intermedio",
    },
  ];

  const advancedExercises = [
    {
      name: "Press inclinado con mancuernas",
      muscle_group: "Pecho",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Fondos en paralelas para pecho",
      muscle_group: "Pecho",
      equipment: "Peso corporal",
      difficulty_level: "Avanzado",
    },
    {
      name: "Fondos en paralelas para tríceps",
      muscle_group: "Tríceps",
      equipment: "Peso corporal",
      difficulty_level: "Avanzado",
    },
    {
      name: "Dominadas",
      muscle_group: "Espalda",
      equipment: "Peso corporal",
      difficulty_level: "Avanzado",
    },
    {
      name: "Peso muerto convencional",
      muscle_group: "Espalda",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Press militar con barra",
      muscle_group: "Hombro",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Sentadilla con barra",
      muscle_group: "Cuádriceps",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Sentadilla con barra para glúteo",
      muscle_group: "Glúteo",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Prensa",
      muscle_group: "Cuádriceps",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Curl con barra",
      muscle_group: "Bíceps",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Curl alterno",
      muscle_group: "Bíceps",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Press francés con barra",
      muscle_group: "Tríceps",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
    {
      name: "Rueda abdominal",
      muscle_group: "Core",
      equipment: "Peso corporal",
      difficulty_level: "Avanzado",
    },
    {
      name: "Peso muerto convencional para cuádriceps",
      muscle_group: "Cuádriceps",
      equipment: "Peso libre",
      difficulty_level: "Avanzado",
    },
  ];

  const muscleGroups = [
    "Todos",
    "Pecho",
    "Hombro",
    "Tríceps",
    "Espalda",
    "Bíceps",
    "Cuádriceps",
    "Femoral",
    "Gemelo",
    "Glúteo",
    "Core",
  ];

  const getCustomExerciseLimit = () => {
    if (subscriptionTier === 'elite' || subscriptionTier === 'pro') {
      return 50;
    }
    return 5;
  };

  const customExerciseLimit = getCustomExerciseLimit();
  const hasEliteAccess = subscriptionTier === 'elite';

  useEffect(() => {
    if (user) {
      loadUserSubscription();
      loadData();
    }
  }, [user]);

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
    }
  };

  const loadData = async () => {
    await insertPredefinedExercisesIfNeeded();
    await insertIntermediateExercisesIfNeeded();
    await insertAdvancedExercisesIfNeeded();
    await fetchPredefinedExercises();
    await fetchIntermediateExercises();
    await fetchAdvancedExercises();
    await fetchCustomExercises();
  };

  const fetchCustomExercises = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_custom", true)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar ejercicios personalizados:", error);
        setCustomExercises([]);
        return;
      }

      setCustomExercises(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
      setCustomExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPredefinedExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_custom", false)
        .eq("difficulty_level", "Principiante")
        .order("muscle_group", { ascending: true });

      if (error) {
        console.error("Error al cargar ejercicios predefinidos:", error);
        setPredefinedExercisesFromDB([]);
        return;
      }

      setPredefinedExercisesFromDB(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
      setPredefinedExercisesFromDB([]);
    }
  };

  const fetchIntermediateExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_custom", false)
        .eq("difficulty_level", "Intermedio")
        .order("muscle_group", { ascending: true });

      if (error) {
        console.error("Error al cargar ejercicios intermedios:", error);
        setIntermediateExercisesFromDB([]);
        return;
      }

      setIntermediateExercisesFromDB(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
      setIntermediateExercisesFromDB([]);
    }
  };

  const fetchAdvancedExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_custom", false)
        .eq("difficulty_level", "Avanzado")
        .order("muscle_group", { ascending: true });

      if (error) {
        console.error("Error al cargar ejercicios avanzados:", error);
        setAdvancedExercisesFromDB([]);
        return;
      }

      setAdvancedExercisesFromDB(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
      setAdvancedExercisesFromDB([]);
    }
  };

  const insertPredefinedExercisesIfNeeded = async () => {
  try {
    const { data: existing, error: checkError } = await supabase
      .from("exercises")
      .select("name, difficulty_level")
      .eq("is_custom", false)
      .eq("difficulty_level", "Principiante");

    if (checkError) {
      console.error("Error al verificar ejercicios:", checkError);
      return;
    }

    if (existing && existing.length >= 20) {
      return; // Ya existen
    }

    const existingNames = existing.map((e) => e.name.toLowerCase().trim());
    const exercisesToInsert = predefinedExercises
      .filter((exercise) => !existingNames.includes(exercise.name.toLowerCase().trim()))
      .map((exercise) => ({
        name: exercise.name,
        muscle_group: exercise.muscle_group,
        equipment: exercise.equipment,
        difficulty_level: exercise.difficulty_level,
        is_custom: false,
        user_id: null,
      }));

    if (exercisesToInsert.length === 0) {
      return;
    }

    const { error: insertError } = await supabase
      .from("exercises")
      .insert(exercisesToInsert);

    if (insertError) {
      // ← Silenciosamente ignora errores de duplicados
      if (!insertError.message.includes('unique_predefined_exercise')) {
        console.error("Error al insertar ejercicios:", insertError);
      }
    }
  } catch (err) {
    console.error("Error inesperado:", err);
  }
  };

  const insertIntermediateExercisesIfNeeded = async () => {
  try {
    const { data: existing, error: checkError } = await supabase
      .from("exercises")
      .select("name, difficulty_level")
      .eq("is_custom", false)
      .eq("difficulty_level", "Intermedio");

    if (checkError) {
      console.error("Error al verificar ejercicios intermedios:", checkError);
      return;
    }

    if (existing && existing.length >= 14) {
      return; // Ya existen
    }

    const existingNames = existing.map((e) => e.name.toLowerCase().trim());
    const exercisesToInsert = intermediateExercises
      .filter((exercise) => !existingNames.includes(exercise.name.toLowerCase().trim()))
      .map((exercise) => ({
        name: exercise.name,
        muscle_group: exercise.muscle_group,
        equipment: exercise.equipment,
        difficulty_level: exercise.difficulty_level,
        is_custom: false,
        user_id: null,
      }));

    if (exercisesToInsert.length === 0) {
      return;
    }

    const { error: insertError } = await supabase
      .from("exercises")
      .insert(exercisesToInsert);

    if (insertError) {
      // Silenciosamente ignora errores de duplicados
      if (!insertError.message.includes('unique_predefined_exercise')) {
        console.error("Error al insertar ejercicios intermedios:", insertError);
      }
    }
  } catch (err) {
    console.error("Error inesperado al insertar intermedios:", err);
  }
  };

  const insertAdvancedExercisesIfNeeded = async () => {
    try {
      const { data: existing, error: checkError } = await supabase
        .from("exercises")
        .select("name, difficulty_level")
        .eq("is_custom", false)
        .eq("difficulty_level", "Avanzado");

      if (checkError) {
        console.error("Error al verificar ejercicios avanzados:", checkError);
        return;
      }

      if (existing && existing.length >= 14) {
        return; // Ya existen
      }

      const existingNames = existing.map((e) => e.name.toLowerCase().trim());
      const exercisesToInsert = advancedExercises
        .filter((exercise) => !existingNames.includes(exercise.name.toLowerCase().trim()))
        .map((exercise) => ({
          name: exercise.name,
          muscle_group: exercise.muscle_group,
          equipment: exercise.equipment,
          difficulty_level: exercise.difficulty_level,
          is_custom: false,
          user_id: null,
        }));

      if (exercisesToInsert.length === 0) {
        return;
      }

      const { error: insertError } = await supabase
        .from("exercises")
        .insert(exercisesToInsert);

      if (insertError) {
        // Silenciosamente ignora errores de duplicados
        if (!insertError.message.includes('unique_predefined_exercise')) {
          console.error("Error al insertar ejercicios avanzados:", insertError);
        }
      }
    } catch (err) {
      console.error("Error inesperado al insertar avanzados:", err);
    }
  };

  const handleToggleExercise = (exercise) => {
    if (isExerciseSelected(exercise.id)) {
      removeExercise(exercise.id);
    } else {
      addExercise(exercise);
    }
  };

  const handleNavigateToConfig = () => {
    navigate("/configExerciseFree");
  };

  const handleNavigateToSearch = () => {
    navigate("/exerciseSearchFree");
  };

  const handleCreateExercise = () => {
    if (customExercises.length >= customExerciseLimit) {
      if (subscriptionTier === 'free') {
        alert(
          "Has alcanzado el límite de 5 ejercicios personalizados en el plan Free. Actualiza a Pro o Elite para crear hasta 50 ejercicios.",
        );
      } else {
        alert(
          `Has alcanzado el límite de ${customExerciseLimit} ejercicios personalizados.`,
        );
      }
      return;
    }
    navigate("/createPersonalExercise");
  };

  const handleDeleteExercise = async (exercise) => {
    if (!user) return;

    if (window.confirm(`¿Eliminar "${exercise.name}" permanentemente?`)) {
      try {
        const { error } = await supabase
          .from("exercises")
          .delete()
          .eq("id", exercise.id)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error al eliminar:", error);
          alert("Error al eliminar el ejercicio");
          return;
        }

        if (isExerciseSelected(exercise.id)) {
          removeExercise(exercise.id);
        }

        await fetchCustomExercises();
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Error inesperado al eliminar");
      }
    }
  };

  const filteredCustomExercises = customExercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesMuscle =
      selectedMuscleFilter === "Todos" ||
      exercise.muscle_group === selectedMuscleFilter;
    return matchesSearch && matchesMuscle;
  });

  const filteredPredefinedExercises = predefinedExercisesFromDB.filter(
    (exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMuscle =
        selectedMuscleFilter === "Todos" ||
        exercise.muscle_group === selectedMuscleFilter;
      return matchesSearch && matchesMuscle;
    },
  );

  const filteredIntermediateExercises = intermediateExercisesFromDB.filter(
    (exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMuscle =
        selectedMuscleFilter === "Todos" ||
        exercise.muscle_group === selectedMuscleFilter;
      return matchesSearch && matchesMuscle;
    },
  );

  const filteredAdvancedExercises = advancedExercisesFromDB.filter(
    (exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMuscle =
        selectedMuscleFilter === "Todos" ||
        exercise.muscle_group === selectedMuscleFilter;
      return matchesSearch && matchesMuscle;
    },
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-text-low">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <section className="w-full flex flex-col items-center justify-between">
        <div className="w-55 h-11.25 bg-surf rounded-2xl border border-text-low p-2.5 gap-2.5 flex items-center">
          <button
            onClick={handleNavigateToSearch}
            className={`rounded-2xl transition-colors duration-200 ${
              isSearchActive ? "bg-primary" : "bg-transparent"
            }`}
          >
            <p
              className={`font-subheading font-bold text-[16px] px-3.75 py-1.25 ${
                isSearchActive ? "text-text-high" : "text-text-low"
              }`}
            >
              Buscar
            </p>
          </button>

          <button
            onClick={handleNavigateToConfig}
            className={`rounded-2xl transition-colors duration-200 ${
              isConfigActive ? "bg-primary" : "bg-transparent"
            }`}
          >
            <p
              className={`font-subheading font-bold text-[16px] px-3.75 py-1.25 ${
                isConfigActive ? "text-text-high" : "text-text-low"
              }`}
            >
              Configurar
            </p>
          </button>
        </div>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <p className="font-heading font-extrabold text-[18px] text-text-high">
            Añadir ejercicio
          </p>

          <button
            onClick={() => navigate(-1)}
            className="bg-surf h-10 w-10 rounded-lg border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-surface transition-colors"
          >
            X
          </button>
        </div>

        <div>
          <Input
            variant="outlined"
            p="p-[10px]"
            placeholder="Busca un ejercicio"
            type="text"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-1.25 overflow-x-auto scrollbar-hide">
          {muscleGroups.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscleFilter(muscle)}
              className={`px-2.5 py-px rounded-2xl border font-body text-[16px] whitespace-nowrap transition-colors ${
                selectedMuscleFilter === muscle
                  ? "bg-primary-bg border-primary text-primary"
                  : "bg-surf border-text-low text-text-low"
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>
      </section>

      {!hasEliteAccess && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <button
            onClick={() => navigate("/subscription")}
            className="h-20 rounded-2xl bg-primary-bg border border-primary p-4 flex justify-between hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <div className="w-[90%] flex items-center justify-center gap-3.75">
              <span className="text-primary text-[20px]">👑</span>
              <p className="font-body text-[16px] text-text-low text-left">
                Amplía tus posibilidades con el{" "}
                <span className="text-primary"> Plan Elite. </span>
                +28 ejercicios de nivel intermedio y avanzado.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3.75 text-primary">
              →
            </div>
          </button>
        </section>
      )}

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <button
          onClick={handleCreateExercise}
          className="h-17.5 rounded-2xl bg-primary border border-primary p-4 flex justify-between hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <div className="w-[90%] flex items-center justify-center gap-3.75">
            <span className="text-text-high text-[20px]">⚡</span>
            <p className="font-body text-[16px] text-text-high">
              Crea tus propios ejercicios{" "}
              {customExercises.length >= customExerciseLimit && (
                <span className="text-text-low">
                  ({customExercises.length}/{customExerciseLimit} - Límite alcanzado)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3.75 text-text-high">
            →
          </div>
        </button>
      </section>

      {filteredCustomExercises.length > 0 && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-primary">
            ⚡ MIS EJERCICIOS ({customExercises.length}/{customExerciseLimit})
          </p>

          {loading ? (
            <Card>
              <p className="text-text-low text-center">Cargando...</p>
            </Card>
          ) : (
            filteredCustomExercises.map((exercise) => {
              const isSelected = isExerciseSelected(exercise.id);
              return (
                <Card key={exercise.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="bg-primary-bg h-12.5 w-12.5 rounded-xl border border-primary font-heading font-extrabold text-[18px] text-primary flex items-center justify-center flex-shrink-0">
                        ⚡
                      </span>

                      <div className="flex flex-col">
                        <p className="font-subheading font-bold text-[16px] text-text-high">
                          {exercise.name}
                        </p>

                        <p className="font-body text-[12px] text-text-low">
                          {exercise.muscle_group} · {exercise.equipment}
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

                          <span className="bg-surface h-auto px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">
                            Personalizado
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleToggleExercise(exercise)}
                        className={`h-8 w-8 rounded-full border flex items-center justify-center text-[20px] transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-text-high"
                            : "bg-surf border-text-low text-text-low hover:bg-primary hover:border-primary hover:text-text-high"
                        }`}
                        title={
                          isSelected
                            ? "Quitar de la selección"
                            : "Añadir a la selección"
                        }
                      >
                        {isSelected ? "✓" : "+"}
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(exercise)}
                        className="h-8 w-8 rounded-[8px] border border-red bg-surf flex items-center justify-center text-red text-[18px] hover:bg-red/10 transition-colors"
                        title="Eliminar ejercicio permanentemente"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </section>
      )}

      {filteredPredefinedExercises.length > 0 && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-accent2">
            💪 PRINCIPIANTE
          </p>

          {filteredPredefinedExercises.map((exercise) => {
            const isSelected = isExerciseSelected(exercise.id);
            return (
              <Card key={exercise.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-green-bg2 h-12.5 w-12.5 rounded-xl border border-accent2 font-heading font-extrabold text-[18px] text-accent2 flex items-center justify-center">
                      💪
                    </span>

                    <div className="flex flex-col">
                      <p className="font-subheading font-bold text-[16px] text-text-high">
                        {exercise.name}
                      </p>

                      <p className="font-body text-[12px] text-text-low">
                        {exercise.muscle_group} · {exercise.equipment}
                      </p>

                      <div className="mt-0.75 flex gap-1.5">
                        <span className="bg-green-bg2 h-auto px-2.5 rounded-2xl border border-accent2 font-body text-[12px] text-accent2">
                          Principiante
                        </span>

                        <span className="bg-surface h-auto px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">
                          {exercise.equipment}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleToggleExercise(exercise)}
                      className={`h-8 w-8 rounded-full border flex items-center justify-center text-[20px] transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-text-high"
                          : "bg-surf border-text-low text-text-low hover:bg-primary hover:border-primary hover:text-text-high"
                      }`}
                    >
                      {isSelected ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {hasEliteAccess && filteredIntermediateExercises.length > 0 && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-orange">
            🔥 INTERMEDIO
          </p>

          {filteredIntermediateExercises.map((exercise) => {
            const isSelected = isExerciseSelected(exercise.id);
            return (
              <Card key={exercise.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-orange-bg2 h-12.5 w-12.5 rounded-xl border border-orange font-heading font-extrabold text-[18px] text-orange flex items-center justify-center">
                      🔥
                    </span>

                    <div className="flex flex-col">
                      <p className="font-subheading font-bold text-[16px] text-text-high">
                        {exercise.name}
                      </p>

                      <p className="font-body text-[12px] text-text-low">
                        {exercise.muscle_group} · {exercise.equipment}
                      </p>

                      <div className="mt-0.75 flex gap-1.5">
                        <span className="bg-orange-bg2 h-auto px-2.5 rounded-2xl border border-orange font-body text-[12px] text-orange">
                          Intermedio
                        </span>

                        <span className="bg-surface h-auto px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">
                          {exercise.equipment}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleToggleExercise(exercise)}
                      className={`h-8 w-8 rounded-full border flex items-center justify-center text-[20px] transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-text-high"
                          : "bg-surf border-text-low text-text-low hover:bg-primary hover:border-primary hover:text-text-high"
                      }`}
                    >
                      {isSelected ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {hasEliteAccess && filteredAdvancedExercises.length > 0 && (
        <section className="mt-4 pb-17.5 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-accent1">
            ⚡ AVANZADO
          </p>

          {filteredAdvancedExercises.map((exercise) => {
            const isSelected = isExerciseSelected(exercise.id);
            return (
              <Card key={exercise.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-accent1-bg1 h-12.5 w-12.5 rounded-xl border border-accent1 font-heading font-extrabold text-[18px] text-accent1 flex items-center justify-center">
                      ⚡
                    </span>

                    <div className="flex flex-col">
                      <p className="font-subheading font-bold text-[16px] text-text-high">
                        {exercise.name}
                      </p>

                      <p className="font-body text-[12px] text-text-low">
                        {exercise.muscle_group} · {exercise.equipment}
                      </p>

                      <div className="mt-0.75 flex gap-1.5">
                        <span className="bg-accent1-bg1 h-auto px-2.5 rounded-2xl border border-accent1 font-body text-[12px] text-accent1">
                          Avanzado
                        </span>

                        <span className="bg-surface h-auto px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">
                          {exercise.equipment}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleToggleExercise(exercise)}
                      className={`h-8 w-8 rounded-full border flex items-center justify-center text-[20px] transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-text-high"
                          : "bg-surf border-text-low text-text-low hover:bg-primary hover:border-primary hover:text-text-high"
                      }`}
                    >
                      {isSelected ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {!hasEliteAccess && (
        <>
          <section className="mt-4 w-full px-4 flex flex-col gap-2.5 opacity-50 pointer-events-none">
            <p className="font-subheading font-bold text-[16px] text-orange">
              🔒 INTERMEDIO
            </p>
            <Card>
              <div className="flex flex-col items-center justify-center py-7.5 gap-3">
                <span className="text-[40px]">🔒</span>
                <p className="font-heading font-bold text-[16px] text-text-high text-center">
                  Nivel bloqueado
                </p>
                <p className="font-body text-[13px] text-text-low text-center px-5">
                  Actualiza a Plan Elite para acceder a ejercicios de nivel intermedio
                </p>
              </div>
            </Card>
          </section>

          <section className="mt-4 pb-17.5 w-full px-4 flex flex-col gap-2.5 opacity-50 pointer-events-none">
            <p className="font-subheading font-bold text-[16px] text-accent1">
              🔒 AVANZADO
            </p>
            <Card>
              <div className="flex flex-col items-center justify-center py-7.5 gap-3">
                <span className="text-[40px]">🔒</span>
                <p className="font-heading font-bold text-[16px] text-text-high text-center">
                  Nivel bloqueado
                </p>
                <p className="font-body text-[13px] text-text-low text-center px-5">
                  Actualiza a Plan Elite para acceder a ejercicios de nivel avanzado
                </p>
              </div>
            </Card>
          </section>
        </>
      )}

      {filteredCustomExercises.length === 0 &&
        filteredPredefinedExercises.length === 0 &&
        filteredIntermediateExercises.length === 0 &&
        filteredAdvancedExercises.length === 0 &&
        !loading && (
          <section className="mt-4 pb-17.5 w-full px-4">
            <Card>
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <span className="text-[48px]">🔍</span>
                <p className="font-heading font-bold text-[18px] text-text-high text-center">
                  No se encontraron ejercicios
                </p>
                <p className="font-body text-[14px] text-text-low text-center">
                  Intenta con otra búsqueda o filtro
                </p>
              </div>
            </Card>
          </section>
        )}

      <section className="mt-4 w-full px-4 fixed bottom-1">
        <Button
          variant="outlined"
          text={
            selectedExercises.length > 0
              ? `Añadir ${selectedExercises.length} ejercicio${selectedExercises.length > 1 ? "s" : ""}`
              : "Selecciona ejercicios"
          }
          bgColor={"bg-primary"}
          textColor={"text-text-high"}
          borderColor={"border-primary"}
          w="w-[100%]"
          onClick={() => navigate(-1)}
        />
      </section>
    </div>
  );
};

export default ExerciseSearchFree;