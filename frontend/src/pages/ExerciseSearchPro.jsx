import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

const ExerciseSearchPro = () => {
    return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
        <section className="w-full flex flex-col items-center justify-between">
            <div className="w-[220px] h-[45px] bg-surf rounded-[16px] border border-text-low p-[10px] gap-[10px] flex items-center">
                <div className="bg-primary rounded-[16px]">
                    <p className="font-subheading font-bold text-[16px] text-text-high px-[15px] py-[5px] ">Buscar</p>
                </div>

                <div className="bg-primary rounded-[16px]">
                    <p className="font-subheading font-bold text-[16px] text-text-high px-[15px] py-[5px] ">Cnfigurar</p>
                </div>
            </div>
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">

            <div className="flex items-center justify-between">
                <p className="font-heading font-extrabold text-[18px] text-text-high">Añadir ejercicio</p>
                
                <button className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-text-low font-subheading font-bold text-[16px] text-text-low flex items-center justify-center">
                    X
                </button>
            </div>

            <div>
                <Input
                    variant="outlined"
                    p="p-[10px]"
                    placeholder="& Busca un ejercicio"
                    type="text"
                ></Input>
            </div>

            <div className="flex gap-[5px]"> {/* Barra de desplazamiento lateral de ejercicios por grupos musculares */}
                <button className="bg-primary-bg px-[10px] py-[1px] rounded-[16px] border border-primary font-body text-[16px] text-primary">
                    Todos
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Pecho
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Hombro
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Trícpes
                </button>
                {/*
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Espalda
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Bíceps
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Cuádriceps
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Femoral
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Glúteo
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Gemelo
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Core
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Trapecio
                </button>
                <button className="bg-surf px-[10px] py-[1px] rounded-[16px] border border-text-low font-body text-[16px] text-text-low">
                    Antebrazo
                </button>
                */}
            </div>
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            
            <div className="h-[77px] rounded-[16px] bg-primary-bg border border-primary p-[16px] flex justify-between">
                <div className="w-[90%] flex items-center justify-center gap-[15px]">
                    <span className="text-primary">&</span>

                    <p className="font-body text-[16px] text-text-low">Con 
                        <span className="text-primary"> Plan Pro </span>
                        desbloqueas 80+ ejercicios intermedios y avanzados</p>
                </div>

                <div className="flex items-center justify-center gap-[15px] text-primary">
                    v
                </div>
            </div>
            
        </section>
   
        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">

            <p className="font-subheading font-bold text-[16px] text-green">& PRINCIPANTE</p>
            
            <Card>
                <div className="flex items-center justify-between gap-[12px]">
                    
                    <div className="flex items-center justify-center gap-[10px]">
                        <span className="bg-primary-bg h-[50px] w-[50px] px-[10px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-text-high flex items-center justify-center">
                            A {/*! PONER EL ICONO */}
                        </span>

                        <div className="flex flex-col">
                            <p className="font-subheading font-bold text-[16px] text-text-high">Fondos en paralelas</p>

                            <p className="font-body text-[12px] text-text-low">Pecho · Tríceps · Hombro</p>

                            <div className="mt-[3px] flex gap-[10px]">
                                <span className="bg-green-bg2 h-auto px-[10px] rounded-[16px] border border-accent2 font-body text-[12px] text-accent2">
                                    Principiante
                                </span>

                                <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                                    Libre
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <span className="bg-surf h-[32px] w-[32px] px-[10px] rounded-[50px] border border-text-low font-body text-[18px] text-text-low flex items-center justify-center">
                            + {/*! PONER EL ICONO */}
                        </span>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center justify-between gap-[12px]">
                    
                    <div className="flex items-center justify-center gap-[10px]">
                        <span className="bg-primary-bg h-[50px] w-[50px] px-[10px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-text-high flex items-center justify-center">
                            A {/*! PONER EL ICONO */}
                        </span>

                        <div className="flex flex-col">
                            <p className="font-subheading font-bold text-[16px] text-text-high">Fondos en paralelas</p>

                            <p className="font-body text-[12px] text-text-low">Pecho · Tríceps · Hombro</p>

                            <div className="mt-[3px] flex gap-[10px]">
                                <span className="bg-green-bg2 h-auto px-[10px] rounded-[16px] border border-accent2 font-body text-[12px] text-accent2">
                                    Principiante
                                </span>

                                <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                                    Libre
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <span className="bg-surf h-[32px] w-[32px] px-[10px] rounded-[50px] border border-text-low font-body text-[18px] text-text-low flex items-center justify-center">
                            + {/*! PONER EL ICONO */}
                        </span>
                    </div>
                </div>
            </Card>
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">

            <p className="font-subheading font-bold text-[16px] text-orange">& INTERMEDIO</p>
            
            <Card>
                <div className="flex items-center justify-between gap-[12px]">
                    
                    <div className="flex items-center justify-center gap-[10px]">
                        <span className="bg-primary-bg h-[50px] w-[50px] px-[10px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-text-high flex items-center justify-center">
                            A {/*! PONER EL ICONO */}
                        </span>

                        <div className="flex flex-col">
                            <p className="font-subheading font-bold text-[16px] text-text-high">Fondos en paralelas</p>

                            <p className="font-body text-[12px] text-text-low">Pecho · Tríceps · Hombro</p>

                            <div className="mt-[3px] flex gap-[10px]">
                                <span className="bg-orange-bg2 h-auto px-[10px] rounded-[16px] border border-orange font-body text-[12px] text-orange">
                                    Intermedio
                                </span>

                                <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                                    Libre
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <span className="bg-surf h-[32px] w-[32px] px-[10px] rounded-[50px] border border-text-low font-body text-[18px] text-text-low flex items-center justify-center">
                            + {/*! PONER EL ICONO */}
                        </span>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center justify-between gap-[12px]">
                    
                    <div className="flex items-center justify-center gap-[10px]">
                        <span className="bg-primary-bg h-[50px] w-[50px] px-[10px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-text-high flex items-center justify-center">
                            A {/*! PONER EL ICONO */}
                        </span>

                        <div className="flex flex-col">
                            <p className="font-subheading font-bold text-[16px] text-text-high">Fondos en paralelas</p>

                            <p className="font-body text-[12px] text-text-low">Pecho · Tríceps · Hombro</p>

                            <div className="mt-[3px] flex gap-[10px]">
                                <span className="bg-orange-bg2 h-auto px-[10px] rounded-[16px] border border-orange font-body text-[12px] text-orange">
                                    Intermedio
                                </span>

                                <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                                    Libre
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <span className="bg-surf h-[32px] w-[32px] px-[10px] rounded-[50px] border border-text-low font-body text-[18px] text-text-low flex items-center justify-center">
                            + {/*! PONER EL ICONO */}
                        </span>
                    </div>
                </div>
            </Card>
        </section>

        <section className="mt-[16px] pb-[70px] w-full px-[16px] flex flex-col gap-[10px]">

            <p className="font-subheading font-bold text-[16px] text-accent1">& AVANZADO</p>
            
            <Card>
                <div className="flex items-center justify-between gap-[12px]">
                    
                    <div className="flex items-center justify-center gap-[10px]">
                        <span className="bg-primary-bg h-[50px] w-[50px] px-[10px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-text-high flex items-center justify-center">
                            A {/*! PONER EL ICONO */}
                        </span>

                        <div className="flex flex-col">
                            <p className="font-subheading font-bold text-[16px] text-text-high">Fondos en paralelas</p>

                            <p className="font-body text-[12px] text-text-low">Pecho · Tríceps · Hombro</p>

                            <div className="mt-[3px] flex gap-[10px]">
                                <span className="bg-accent1-bg1 h-auto px-[10px] rounded-[16px] border border-accent1 font-body text-[12px] text-accent1">
                                    Avanzado
                                </span>

                                <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                                    Libre
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <span className="bg-surf h-[32px] w-[32px] px-[10px] rounded-[50px] border border-text-low font-body text-[18px] text-text-low flex items-center justify-center">
                            + {/*! PONER EL ICONO */}
                        </span>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center justify-between gap-[12px]">
                    
                    <div className="flex items-center justify-center gap-[10px]">
                        <span className="bg-primary-bg h-[50px] w-[50px] px-[10px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-text-high flex items-center justify-center">
                            A {/*! PONER EL ICONO */}
                        </span>

                        <div className="flex flex-col">
                            <p className="font-subheading font-bold text-[16px] text-text-high">Fondos en paralelas</p>

                            <p className="font-body text-[12px] text-text-low">Pecho · Tríceps · Hombro</p>

                            <div className="mt-[3px] flex gap-[10px]">
                                <span className="bg-accent1-bg1 h-auto px-[10px] rounded-[16px] border border-accent1 font-body text-[12px] text-accent1">
                                    Avanzado
                                </span>

                                <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                                    Libre
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <span className="bg-surf h-[32px] w-[32px] px-[10px] rounded-[50px] border border-text-low font-body text-[18px] text-text-low flex items-center justify-center">
                            + {/*! PONER EL ICONO */}
                        </span>
                    </div>
                </div>
            </Card>
        </section>

        <section className="mt-[16px] w-full px-[16px] fixed bottom-1 gap-[10px]">
            <Button variant="outlined" text="& Añadir x ejercicios a la rutina" bgColor={"bg-primary"} textColor={"text-text-high"} borderColor={"border-primary"} w="w-[100%]"/>
        </section>
    </div>
  );
};

export default ExerciseSearchPro;