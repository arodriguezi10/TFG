import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";

const CreateRoutines1 = () => {
    return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
        <section className="w-full flex items-center justify-between">
            <Header showback subtitle={"rutinas"} title={"Crear rutinas"}/>
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
                
                    <p className="font-subheading font-bold text-text-low text-[16px]">INFORMACIÓN BÁSICA</p>
                

                <Card>
                    <div className="flex flex-col justify-between">
                        <label className="font-subheading font-bold text-text-low text-[14px] uppercase tracking-wider">
                            NOMBRE DE LA RUTINA
                        </label>

                        <div className="flex gap-[15px]">
                            <p className="text-text-low">&</p>
                            <input className="font-body text-[16px] text-text-low" type="text" placeholder="Ej: Push A, Piernas Fuerza..."/>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-text-low mt-[15px]"></div>  {/**Esto es una linea de división */}  

                    <div className="mt-[15px] flex flex-col justify-between">
                        <label className="font-subheading font-bold text-text-low text-[14px] uppercase tracking-wider">
                            DESCRIPCIÓN 
                            <span className="font-subheading font-semibold text-[12px]"> (opcional)</span>
                        </label>

                        <div className="flex gap-[15px]">
                            <p className="text-text-low">&</p>

                            <textarea className="w-full font-body text-[16px] text-text-low" type="text" placeholder="Ej: Push A, Piernas Fuerza..."/>
                        </div>
                    </div>
                </Card>
        </section>
   
        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">

            <p className="font-subheading font-bold text-[16px] text-text-low">TIPO DE ENTRENAMIENTO</p>
            
            <Card>
                <div className="flex gap-[10px] items-center justify-center">
                    <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                        Push
                    </button>

                    <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                        Pull
                    </button>

                    <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                        Legs
                    </button>
                </div>
                <div className="mt-[10px] flex gap-[10px] items-center justify-center">
                    <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                        Upper
                    </button>

                    <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                        Lower
                    </button>

                    <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                        Cardio
                    </button>

                    <button className="bg-surface px-[10px] py-[3px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                        Otro
                    </button>
                </div>
            </Card>
        </section>

        <section className="mt-[16px] w-full px-[16px] w-full flex gap-[10px]">
            <div className="w-full flex flex-col">
                <p className="font-subheading font-bold text-[16px] text-text-low">DÍA</p>
                <Card>
                    <div className="flex gap-[10px]">
                        <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center">
                            L
                        </button>
                        <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center">
                            M
                        </button>

                        <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center">
                            X
                        </button>

                        <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center">
                            J
                        </button>
                    </div>

                    <div className="mt-[10px] flex gap-[10px] flex items-center justify-center">
                        <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center">
                            V
                        </button>

                        <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center">
                            S
                        </button>

                        <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center">
                            D
                        </button>
                    </div>                
                </Card>
            </div>

            <div className="w-full flex flex-col">
                <p className="font-subheading font-bold text-[16px] text-text-low">DURACIÓN</p>
                <Card>
                    <div className="flex flex-col">
                        <div>
                            <p className="font-heading font-bold text-[22px] text-primary">45
                                <span className="font-body text-[16px] text-text-low ml-[5px]">min</span>
                            </p>
                        </div>
                        <div className="mt-[10px] flex justify-end align-end gap-[10px]">
                            <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center">
                                -
                            </button>

                            <button className="bg-surface h-[35px] w-[35px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-high flex items-center justify-center">
                                +
                            </button>
                        </div>
                    </div>
                </Card>
            </div>            
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            <div className="w-[100%] flex gap-[10px]">
                <p className="font-subheading font-bold text-text-low text-[16px]">EJERCICIOS</p>

                <p className="font-body text-text-low text-[14px]">0 añadidos</p>
            </div>

            <Card>
                <div className="mt-[16px] flex flex-col items-center justify-center gap-[12px]">
                    <span className="bg-primary-bg h-[60px] w-[60px] px-[10px] rounded-[16px] border border-primary font-body text-[25px] text-primary flex items-center justify-center">
                        & {/*! PONER EL ICONO */}
                    </span>

                    <p className="font-heading font-bold text-[16px] text-text-high">Sin ejercicios todavía</p>

                    <div className="flex items-center justify-center">
                        <p className="font-body text-[16px] text-text-low text-center">
                            Añade los ejercicios que componen esta sesión. Podrás ordenarlos y configuar series y repeticiones
                        </p>
                    </div>
                    <Button variant="outlined" text="& Añadir ejercicios" bgColor={"bg-primary-bg"} textColor={"text-primary"} borderColor={"border-primary"} w="w-[65%]"/>           
                </div>
            </Card>
        </section>

        <section className="mt-[16px] pb-[70px] w-full px-[16px] flex flex-col gap-[10px]">

            <p className="font-subheading font-bold text-[16px] text-text-low">GRUPOS MUSCULARES</p>
            
            <Card>
                <p className="font-subheading font-semibold text-[12px] text-text-low">& SELECCIONA LOS QUE TRABAJES</p>

                <div className="mt-[10px] flex gap-[10px] items-center justify-center">
                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Pecho
                    </button>
                    
                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Hombro
                    </button>

                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Tríceps
                    </button>
                </div>

                <div className="mt-[10px] flex gap-[10px] items-center justify-center">
                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Espalda
                    </button>
                    
                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Bíceps
                    </button>

                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Cuádricep
                    </button>
                </div>

                <div className="mt-[10px] flex gap-[10px] items-center justify-center">
                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Femoral
                    </button>
                    
                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Glúteo
                    </button>

                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Gemelo
                    </button>
                </div>

                <div className="mt-[10px] flex gap-[10px] items-center justify-center">
                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Core
                    </button>
                    
                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Trapecios
                    </button>

                    <button className="w-[98px] px-[10px] py-[5px] rounded-[8px] border border-text-low font-subheading text-[16px] text-text-low">
                        Antebrazo
                    </button>
                </div>
            </Card>
        </section>

        <section className="mt-[16px] w-full px-[16px] fixed bottom-1 gap-[10px]">
            <Button variant="outlined" text="& Guardar rutina" bgColor={"bg-primary"} textColor={"text-text-high"} borderColor={"border-primary"} w="w-[100%]"/>
        </section>
    </div>
  );
};

export default CreateRoutines1;
