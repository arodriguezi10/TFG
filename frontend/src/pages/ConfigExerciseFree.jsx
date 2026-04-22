import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";
import { useRoutine } from "../context/RoutinesContext";

const ConfigExerciseFree = () => {
  const navigate = useNavigate();
  const { selectedExercises, removeExercise, saveRoutineConfiguration } = useRoutine();

  const [exercisesSeries, setExercisesSeries] = useState(() => {
    const initialSeries = {};
    selectedExercises.forEach(exercise => {
      initialSeries[exercise.id] = [
        { id: 1, reps: "", weight: "" },
        { id: 2, reps: "", weight: "" },
        { id: 3, reps: "", weight: "" }
      ];
    });
    return initialSeries;
  });

  const [exercisesRest, setExercisesRest] = useState(() => {
    const initialRest = {};
    selectedExercises.forEach(exercise => {
      initialRest[exercise.id] = "";
    });
    return initialRest;
  });

  const addSerie = (exerciseId) => {
    setExercisesSeries(prev => {
      const currentSeries = prev[exerciseId] || [];
      const newSerieId = currentSeries.length + 1;
      return {
        ...prev,
        [exerciseId]: [...currentSeries, { id: newSerieId, reps: "", weight: "" }]
      };
    });
  };

  const deleteSerie = (exerciseId, serieId) => {
    setExercisesSeries(prev => {
      const filteredSeries = prev[exerciseId].filter(serie => serie.id !== serieId);
      const renumberedSeries = filteredSeries.map((serie, index) => ({
        ...serie,
        id: index + 1
      }));
      return {
        ...prev,
        [exerciseId]: renumberedSeries
      };
    });
  };

  const updateSerie = (exerciseId, serieId, field, value) => {
    setExercisesSeries(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map(serie =>
        serie.id === serieId ? { ...serie, [field]: value } : serie
      )
    }));
  };

  const updateRest = (exerciseId, value) => {
    setExercisesRest(prev => ({
      ...prev,
      [exerciseId]: value
    }));
  };

  const handleRemoveExercise = (exerciseId) => {
    if (window.confirm("¿Eliminar este ejercicio de la rutina?")) {
      removeExercise(exerciseId);
      setExercisesSeries(prev => {
        const newState = { ...prev };
        delete newState[exerciseId];
        return newState;
      });
      setExercisesRest(prev => {
        const newState = { ...prev };
        delete newState[exerciseId];
        return newState;
      });
    }
  };

  const handleSaveRoutine = () => {
    const routineData = {
      exercises: selectedExercises,
      series: exercisesSeries,
      rest: exercisesRest,
      timestamp: new Date().toISOString()
    };

    // Guardar en el contexto
    saveRoutineConfiguration(routineData);

    // Log para debug
    console.log("Configuración guardada:", routineData);

    // Navegar a la pantalla de crear rutina
    navigate("/createRoutines1");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
      <section className="w-full flex items-center justify-between">
        <Header showback title={<>Configurar<br/>ejercicio</>}/>
      </section>

      {/* Renderizar ejercicios seleccionados dinámicamente */}
      {selectedExercises.length === 0 ? (
        <section className="mt-[16px] w-full px-[16px]">
          <Card>
            <div className="flex flex-col items-center justify-center py-[40px] gap-[16px]">
              <span className="text-[48px]">💪</span>
              <p className="font-heading font-bold text-[18px] text-text-high text-center">
                Sin ejercicios añadidos
              </p>
              <p className="font-body text-[14px] text-text-low text-center">
                Vuelve a la pantalla anterior y añade ejercicios para configurar series y repeticiones.
              </p>
            </div>
          </Card>
        </section>
      ) : (
        selectedExercises.map((exercise, index) => (
          <section key={exercise.id} className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            <Card>
              <div className="flex items-center gap-[15px]">
                <p className="bg-primary-bg min-w-[35px] h-[35px] rounded-[8px] border border-primary font-heading font-bold text-[22px] text-primary text-center flex items-center justify-center px-[8px]">
                  {index + 1}
                </p>

                <div className="flex items-center gap-[10px]">
                  <div className="flex flex-col">
                    <p className="font-heading font-extrabold text-[18px] text-text-high">
                      {exercise.name}
                    </p>

                    <p className="font-body text-[12px] text-text-low">
                      {exercise.muscle_group} - {exercise.equipment}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-[5px] ml-auto">
                  <p className="font-body text-[12px] text-text-low">Descanso</p>

                  <input
                    type="text"
                    name={`descanso-${exercise.id}`}
                    value={exercisesRest[exercise.id] || ""}
                    onChange={(e) => updateRest(exercise.id, e.target.value)}
                    className="bg-green-bg2 w-[57px] h-[29px] rounded-[8px] border border-accent2 font-heading font-bold text-[22px] text-accent2 text-center"
                    placeholder="90"
                  />
                </div>
              </div>

              <hr className="text-text-low -mx-[16px] mt-[5px] mb-[5px]" />

              <div className="flex flex-col gap-[8px]">
                {/* HEADER */}
                <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">
                  <p className="font-body text-[12px] text-text-low text-center">#</p>
                  <p className="font-body text-[12px] text-text-low text-center">REPS</p>
                  <p className="font-body text-[12px] text-text-low text-center">PESO (KG)</p>
                  <div className="flex items-center justify-center gap-[2px]">
                    <p className="font-body text-[12px] text-text-low text-center">RIR</p>
                    <p className="bg-orange-bg2 h-[14px] w-[14px] rounded-[4px] border border-orange font-body text-[10px] text-orange text-center flex items-center justify-center">🔒</p>
                  </div>   
                  <div></div> {/* Espacio para el botón eliminar */}
                </div>

                <hr className="text-text-low -mx-[16px]" />

                {/* SERIES DINÁMICAS */}
                {(exercisesSeries[exercise.id] || []).map((serie, serieIndex) => (
                  <React.Fragment key={serie.id}>
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">
                      <p className="font-heading font-bold text-[22px] text-text-high text-center">
                        S{serie.id}
                      </p>

                      <input
                        type="text"
                        name={`reps-${exercise.id}-${serie.id}`}
                        value={serie.reps}
                        onChange={(e) => updateSerie(exercise.id, serie.id, 'reps', e.target.value)}
                        className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"
                        placeholder="12"
                      />

                      <input
                        type="text"
                        name={`weight-${exercise.id}-${serie.id}`}
                        value={serie.weight}
                        onChange={(e) => updateSerie(exercise.id, serie.id, 'weight', e.target.value)}
                        className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"
                        placeholder="60"
                      />

                      <span className="bg-orange-bg2 w-[65px] h-[25px] rounded-[8px] border border-orange font-body text-[12px] text-orange flex items-center justify-center opacity-55 cursor-not-allowed">
                        🔒 RIR
                      </span>

                      <button
                        onClick={() => deleteSerie(exercise.id, serie.id)}
                        className="bg-surface w-[25px] h-[25px] rounded-[8px] border border-red font-body text-[16px] text-red flex items-center justify-center hover:bg-red/10 transition-colors"
                      >
                        x
                      </button>
                    </div>

                    {serieIndex < (exercisesSeries[exercise.id] || []).length - 1 && (
                      <hr className="text-text-low h-[1px]"/>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <hr className="text-text-low -mx-[16px] mt-[5px] mb-[5px]" />

              {/* Técnicas bloqueadas */}
              <div className="flex gap-[8px] mt-[8px] items-center">
                <p className="font-body text-[12px] text-text-low flex-shrink-0">Técnica</p>
                
                <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
                  <button className="bg-orange-bg2 px-[10px] py-[1px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Dropset
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Rest-pause
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Topset
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 TS/BO
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Parciales
                  </button>

                  <button className="bg-orange-bg2 px-[12px] py-[4px] rounded-[16px] border border-orange font-body text-[12px] text-orange opacity-55 cursor-not-allowed whitespace-nowrap">
                    🔒 Myo-reps
                  </button>
                </div>
              </div>

              <hr className="text-text-low -mx-[16px] mt-[8px] mb-[5px]" />

              {/* Footer: Añadir serie y Eliminar */}
              <div className="flex items-center justify-between items-center mt-[8px]">
                <button
                  onClick={() => addSerie(exercise.id)}
                  className="font-body font-bold text-[14px] text-primary hover:text-primary/80 transition-colors"
                >
                  + Añadir serie
                </button>

                <button
                  onClick={() => handleRemoveExercise(exercise.id)}
                  className="font-body font-semibold text-[14px] text-red hover:text-red/80 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </Card>
          </section>
        ))
      )}

      {/* Card de upgrade (solo si hay ejercicios) */}
      {selectedExercises.length > 0 && (
        <section className="mt-[16px] pb-[70px] w-full px-[16px] flex flex-col gap-[10px]">
          <button
            onClick={() => window.location.href = '/suscription'}
            className="w-full"
          >
            <Card variant="outlined">
              <div className="flex items-center justify-between gap-[12px] cursor-pointer hover:bg-surface/50 transition-colors rounded-[16px] -m-[16px] p-[16px]">
                <div className="flex items-center justify-center gap-[10px]">
                  <span className="bg-brown-bg h-[55px] w-[55px] px-[16px] rounded-[12px] border border-orange font-heading font-extrabold text-[18px] text-orange flex items-center justify-center">
                    👑
                  </span>

                  <div className="flex flex-col">
                    <p className="font-heading font-semibold text-[20px] text-text-high leading-tight text-left">
                      Desbloquea RIR y técnicas avanzadas
                    </p>

                    <p className="font-body text-[12px] text-text-low text-left">
                      Con <span className="text-orange">Plan Élite</span> activa control de intensidad por RIR, Dropsets, Rest-pause y más funciones.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center text-orange text-[20px]">
                  →
                </div>
              </div>
            </Card>
          </button>
        </section>
      )}

      {/* Botón guardar (solo si hay ejercicios) */}
      {selectedExercises.length > 0 && (
        <section className="mt-[16px] w-full px-[16px] fixed bottom-1 gap-[10px]">
          <Button
            variant="outlined"
            text="Guardar rutina"
            bgColor={"bg-primary"}
            textColor={"text-text-high"}
            borderColor={"border-primary"}
            w="w-[100%]"
            onClick={handleSaveRoutine}
          />
        </section>
      )}
    </div>
  );
};

export default ConfigExerciseFree;