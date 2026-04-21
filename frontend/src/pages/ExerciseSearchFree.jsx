import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

const ExerciseSearchFree = () => {
  const { addExercise, removeExercise, isExerciseSelected, selectedExercises } =
    useRoutine();
  const navigate = useNavigate();
  const location = useLocation();

  const [customExercises, setCustomExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSearchActive =
    location.pathname === "/exerciseSearchFree" ||
    !location.pathname.includes("config");
  const isConfigActive = location.pathname.includes("config");

  useEffect(() => {
    fetchCustomExercises();
  }, []);

  const fetchCustomExercises = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_custom", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar ejercicios personalizados:", error);
        return;
      }

      setCustomExercises(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
      <section className="w-full flex flex-col items-center justify-between">
        <div className="w-[220px] h-[45px] bg-surf rounded-[16px] border border-text-low p-[10px] gap-[10px] flex items-center">
          <button
            onClick={handleNavigateToSearch}
            className={`rounded-[16px] transition-colors duration-200 ${
              isSearchActive ? "bg-primary" : "bg-transparent"
            }`}
          >
            <p
              className={`font-subheading font-bold text-[16px] px-[15px] py-[5px] ${
                isSearchActive ? "text-text-high" : "text-text-low"
              }`}
            >
              Buscar
            </p>
          </button>

          <button
            onClick={handleNavigateToConfig}
            className={`rounded-[16px] transition-colors duration-200 ${
              isConfigActive ? "bg-primary" : "bg-transparent"
            }`}
          >
            <p
              className={`font-subheading font-bold text-[16px] px-[15px] py-[5px] ${
                isConfigActive ? "text-text-high" : "text-text-low"
              }`}
            >
              Configurar
            </p>
          </button>
        </div>
      </section>

      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <p className="font-heading font-extrabold text-[18px] text-text-high">
            Añadir ejercicio
          </p>

          <button
            onClick={() => navigate(-1)}
            className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-surface transition-colors"
          >
            X
          </button>
        </div>

        <div>
          <Input
            variant="outlined"
            p="p-[10px]"
            placeholder="& Busca un ejercicio"
            type="text"
          />
        </div>

        <div className="flex gap-[5px] overflow-x-auto scrollbar-hide">
          <button className="bg-primary-bg px-[10px] py-[1px] rounded-[16px] border border-primary font-body text-[16px] text-primary whitespace-nowrap">
            Todos
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Pecho
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Hombro
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Tríceps
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Espalda
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Bíceps
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Cuádriceps
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Femoral
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Gemelo
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Glúteo
          </button>
          <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low whitespace-nowrap">
            Core
          </button>
        </div>
      </section>

      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
        <button
          onClick={() => navigate("/suscription")}
          className="h-[80px] rounded-[16px] bg-primary-bg border border-primary p-[16px] flex justify-between hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <div className="w-[90%] flex items-center justify-center gap-[15px]">
            <span className="text-primary text-[20px]">👑</span>
            <p className="font-body text-[16px] text-text-low text-left">
              Amplía tus posibilidades con el <span className="text-primary"> Plan Pro. </span>
              +80 ejercicios de nivel intermedio y avanzado.
            </p>
          </div>
          <div className="flex items-center justify-center gap-[15px] text-primary">
            →
          </div>
        </button>

        <button
          onClick={() => navigate("/create-personal-exercise")}
          className="h-[70px] rounded-[16px] bg-primary border border-primary p-[16px] flex justify-between hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <div className="w-[90%] flex items-center justify-center gap-[15px]">
            <span className="text-text-high text-[20px]">& </span>
            <p className="font-body text-[16px] text-text-high">
              Crea tus propios ejercicios
            </p>
          </div>
          <div className="flex items-center justify-center gap-[15px] text-text-high">
            →
          </div>
        </button>
      </section>

      {/* MIS EJERCICIOS PERSONALIZADOS */}
      {customExercises.length > 0 && (
        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
          <p className="font-subheading font-bold text-[16px] text-primary">
            ⚡ MIS EJERCICIOS
          </p>

          {loading ? (
            <Card>
              <p className="text-text-low text-center">Cargando...</p>
            </Card>
          ) : (
            customExercises.map((exercise) => {
              const isSelected = isExerciseSelected(exercise.id);
              return (
                <Card key={exercise.id}>
                  <div className="flex items-center justify-between gap-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <span className="bg-primary-bg h-[50px] w-[50px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-primary flex items-center justify-center flex-shrink-0">
                        ⚡
                      </span>

                      <div className="flex flex-col">
                        <p className="font-subheading font-bold text-[16px] text-text-high">
                          {exercise.name}
                        </p>

                        <p className="font-body text-[12px] text-text-low">
                          {exercise.muscle_group} · {exercise.equipment}
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

                          <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                            Personalizado
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col items-center gap-[8px]">
                      {/* Botón seleccionar/deseleccionar */}
                      <button
                        onClick={() => handleToggleExercise(exercise)}
                        className={`h-[32px] w-[32px] rounded-full border flex items-center justify-center text-[20px] transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-text-high"
                            : "bg-surf border-text-low text-text-low hover:bg-primary hover:border-primary hover:text-text-high"
                        }`}
                        title={isSelected ? "Quitar de la selección" : "Añadir a la selección"}
                      >
                        {isSelected ? "✓" : "+"}
                      </button>
                      {/* Botón eliminar permanente */}
                      <button
                        onClick={async () => {
                          if (window.confirm(`¿Eliminar "${exercise.name}" permanentemente?`)) {
                            try {
                              const { error } = await supabase
                                .from('exercises')
                                .delete()
                                .eq('id', exercise.id);

                              if (error) {
                                console.error('Error al eliminar:', error);
                                alert('Error al eliminar el ejercicio');
                                return;
                              }

                              // Actualizar la lista local
                              setCustomExercises(customExercises.filter(ex => ex.id !== exercise.id));
                              
                              // Si estaba seleccionado, quitarlo de la selección también
                              if (isSelected) {
                                removeExercise(exercise.id);
                              }
                            } catch (err) {
                              console.error('Error inesperado:', err);
                              alert('Error inesperado al eliminar');
                            }
                          }
                        }}
                        className="h-[32px] w-[32px] rounded-[8px] border border-red bg-surf flex items-center justify-center text-red text-[18px] hover:bg-red/10 transition-colors"
                        title="Eliminar ejercicio permanentemente"
                      >
                        X
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </section>
      )}

      {/* PRINCIPIANTE */}
      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
        <p className="font-subheading font-bold text-[16px] text-green">
          💪 PRINCIPIANTE
        </p>

        {/* Ejercicio 1 */}
        {(() => {
          const exercise = {
            id: 101,
            name: "Fondos en paralelas",
            muscle_group: "Pecho",
            equipment: "Peso corporal",
            difficulty_level: "Principiante",
          };
          const isSelected = isExerciseSelected(exercise.id);
          return (
            <Card>
              <div className="flex items-center justify-between gap-[12px]">
                <div className="flex items-center gap-[10px]">
                  <span className="bg-primary-bg h-[50px] w-[50px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-text-high flex items-center justify-center">
                    💪
                  </span>

                  <div className="flex flex-col">
                    <p className="font-subheading font-bold text-[16px] text-text-high">
                      {exercise.name}
                    </p>

                    <p className="font-body text-[12px] text-text-low">
                      Pecho · Tríceps · Hombro
                    </p>

                    <div className="mt-[3px] flex gap-[6px]">
                      <span className="bg-green-bg2 h-auto px-[10px] rounded-[16px] border border-accent2 font-body text-[12px] text-accent2">
                        Principiante
                      </span>

                      <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                        Peso corporal
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleToggleExercise(exercise)}
                    className={`h-[32px] w-[32px] rounded-full border flex items-center justify-center text-[20px] transition-colors ${
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
        })()}

        {/* Ejercicio 2 */}
        {(() => {
          const exercise = {
            id: 102,
            name: "Press de banca",
            muscle_group: "Pecho",
            equipment: "Peso libre",
            difficulty_level: "Principiante",
          };
          const isSelected = isExerciseSelected(exercise.id);
          return (
            <Card>
              <div className="flex items-center justify-between gap-[12px]">
                <div className="flex items-center gap-[10px]">
                  <span className="bg-primary-bg h-[50px] w-[50px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-text-high flex items-center justify-center">
                    💪
                  </span>

                  <div className="flex flex-col">
                    <p className="font-subheading font-bold text-[16px] text-text-high">
                      {exercise.name}
                    </p>

                    <p className="font-body text-[12px] text-text-low">
                      Pecho · Tríceps · Hombro
                    </p>

                    <div className="mt-[3px] flex gap-[6px]">
                      <span className="bg-green-bg2 h-auto px-[10px] rounded-[16px] border border-accent2 font-body text-[12px] text-accent2">
                        Principiante
                      </span>

                      <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                        Peso libre
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleToggleExercise(exercise)}
                    className={`h-[32px] w-[32px] rounded-full border flex items-center justify-center text-[20px] transition-colors ${
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
        })()}
      </section>

      {/* INTERMEDIO - bloqueado */}
      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px] opacity-50 pointer-events-none">
        <p className="font-subheading font-bold text-[16px] text-orange">
          🔒 INTERMEDIO
        </p>
        {/* ... mantén el resto igual ... */}
      </section>

      {/* AVANZADO - bloqueado */}
      <section className="mt-[16px] pb-[70px] w-full px-[16px] flex flex-col gap-[10px] opacity-50 pointer-events-none">
        <p className="font-subheading font-bold text-[16px] text-accent1">
          🔒 AVANZADO
        </p>
        {/* ... mantén el resto igual ... */}
      </section>

      {/* BOTÓN STICKY */}
      <section className="mt-[16px] w-full px-[16px] fixed bottom-1">
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
          onClick={() => navigate("/createRoutines1")}
        />
      </section>
    </div>
  );
};

export default ExerciseSearchFree;
