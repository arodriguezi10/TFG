import React from "react";
import { useNavigate } from "react-router-dom";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";

const CreateRoutines1 = () => {

  const navigate = useNavigate();
  const { selectedExercises, removeExercise } = useRoutine();

  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">

      <section className="w-full flex items-center justify-between">
        <Header showback subtitle={"rutinas"} title={"Crear rutinas"} />
      </section>

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
              <p className="text-text-low">&</p>

              <input
                className="font-body text-[16px] text-text-low bg-transparent border-none outline-none w-full"
                type="text"
                placeholder="Ej: Push A, Piernas Fuerza..."
              />
            </div>
          </div>
          <div className="w-full h-[1px] bg-text-low mt-[15px]"></div>
          <div className="mt-[15px] flex flex-col justify-between">
            <label className="font-subheading font-bold text-text-low text-[14px] uppercase tracking-wider">
              DESCRIPCIÓN
              <span className="font-subheading font-semibold text-[12px]">
                {" "}
                (opcional)
              </span>
            </label>

            <div className="flex gap-[15px]">
              <p className="text-text-low">&</p>

              <textarea
                className="w-full font-body text-[16px] text-text-low bg-transparent border-none outline-none resize-none"
                type="text"
                placeholder="Ej: Rutina de empuje enfocada en pecho"
                rows="3"
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
            <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Push
            </button>

            <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Pull
            </button>

            <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Legs
            </button>
          </div>
          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Upper
            </button>

            <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Lower
            </button>

            <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Cardio
            </button>

            <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Otro
            </button>
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
              <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
                L
              </button>
              <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
                M
              </button>

              <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
                X
              </button>

              <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
                J
              </button>
            </div>

            <div className="mt-[10px] flex gap-[10px] flex items-center justify-center">
              <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
                V
              </button>

              <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
                S
              </button>

              <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
                D
              </button>
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
                  45
                  <span className="font-body text-[16px] text-text-low ml-[5px]">
                    min
                  </span>
                </p>
              </div>
              <div className="mt-[10px] flex justify-end align-end gap-[10px]">
                <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors">
                  -
                </button>

                <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center hover:bg-primary hover:text-text-high transition-colors">
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
                text="& Añadir ejercicios"
                bgColor={"bg-primary-bg"}
                textColor={"text-primary"}
                borderColor={"border-primary"}
                w="w-[65%]"
              />
            </div>
          </Card>
        ) : (
          // Lista de ejercicios seleccionados
          <div className="flex flex-col gap-[10px]">
            {selectedExercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <div className="flex items-center gap-[12px]">
                  {/* Número de orden */}
                  <div className="bg-primary-bg h-[35px] w-[35px] rounded-[8px] border border-primary font-heading font-bold text-[22px] text-primary flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>

                  {/* Info del ejercicio */}
                  <div className="flex-1 flex items-center gap-[10px]">
                    <span className="bg-primary-bg h-[50px] w-[50px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-primary flex items-center justify-center flex-shrink-0">
                      {exercise.is_custom ? '⚡' : '💪'}
                    </span>

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
                  </div>

                  {/* Botón eliminar */}
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
            & SELECCIONA LOS QUE TRABAJES
          </p>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Pecho
            </button>

            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Hombro
            </button>

            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Tríceps
            </button>
          </div>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Espalda
            </button>

            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Bíceps
            </button>

            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Cuádricep
            </button>
          </div>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Femoral
            </button>

            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Glúteo
            </button>

            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Gemelo
            </button>
          </div>

          <div className="mt-[10px] flex gap-[10px] items-center justify-center">
            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Core
            </button>

            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Trapecios
            </button>

            <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary transition-colors">
              Antebrazo
            </button>
          </div>
        </Card>
      </section>

      <section className="mt-[16px] w-full px-[16px] fixed bottom-1 gap-[10px]">
        <Button
          variant="outlined"
          text="& Guardar rutina"
          bgColor={"bg-primary"}
          textColor={"text-text-high"}
          borderColor={"border-primary"}
          w="w-[100%]"
        />
      </section>
    </div>
  );
};

export default CreateRoutines1;