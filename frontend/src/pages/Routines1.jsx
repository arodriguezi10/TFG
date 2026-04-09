import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

const Routines1 = () => {
    return(
        <div className="min-h-screen bg-background flex flex-col mb-[10px] px-[16px]">
            <section className="w-[100%] flex items-center justify-between">

                <div className="flex flex-col gap-[5px]">
                    <div className="flex gap-[15px]">
                        <p className="font-subheading text-[12px] text-text-low">
                            Biblioteca
                        </p>
                    </div>

                    <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
                        Rutinas
                    </h1>
                </div>

                <div className="flex gap-[10px]">
                    <div className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-low">
                        ← {/*! PONER EL ICONO */}
                    </div>

                    <div className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-low">
                        ← {/*! PONER EL ICONO */}
                    </div>

                    <div className="bg-accent1 h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-high">
                        ← {/*! PONER EL ICONO */}
                    </div>
                </div>
            </section>
                
            <section className="mt-[50px] flex flex-col items-center justify-center gap-[15px]">
                <span className="bg-surf h-[110px] w-[110px] px-[10px] rounded-[35px] font-body text-[45px] text-primary flex items-center justify-center">
                    & {/*! PONER EL ICONO */}
                </span>

                <p className="mt-[20px] bg-surf px-[14px] py-[2px] rounded-[16px] border border-text-low font-subheading font-semibold text-[16px] text-text-low">  
                    Sin rutinas todavía
                </p>
                
                <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
                    Empieza a contruir tu
                    <span className="text-accent1">entrenamiento</span>                   
                </p>

                <p className="font-body text-[16px] text-text-low text-center">
                    Crea tu primera rutina y diseña cada sesión con los ejercicios que necestas.
                </p>
            </section>

            <section className="mt-[30px] flex flex-col gap-[10px]">
                <Button text="Crear rutina" color="bg-primary" variant="filled"></Button> {/*! PONER EL ICONO */}
            </section>

            <section className="mt-[16px]">
                <Card>
                    <div className="flex items-center justify-between gap-[15px]">
                        <span className="bg-orange-bg2 h-[60px] w-[60px] px-[10px] rounded-[16px] border border-orange font-body text-[25px] text-orange flex items-center justify-center">
                            & {/*! PONER EL ICONO */}
                        </span>

                        <div className="w-[70%] flex flex-col gap-[1px]">
                            <div className="flex gap-[2px]">
                                <div className="flex">
                                    <p className="font-heading font-semibold text-[20px] text-text-high leading-tight">
                                        Crear <br />progresión
                                    </p>
                                </div>

                                <span className="bg-yellow-bg2 h-[20px] px-[10px] rounded-[16px] border border-yellow font-body text-[12px] text-yellow">
                                    ◆ ÉLITE {/*! PONER EL ICONO */}
                                </span>
                            </div>
                            
                            <p className="font-body text-[14px] text-text-low">Planifica la evolución de cargas semana a semana</p>
                            
                        </div>
                        
                        <div className="bg-orange-bg2 h-[37px] w-[37px] px-[8px] rounded-[8px] border border-orange font-body text-[15px] text-orange flex items-center justify-center">
                            ← {/*! PONER EL ICONO */}
                        </div>                     
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default Routines1;