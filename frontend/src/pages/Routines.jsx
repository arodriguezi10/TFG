import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

const Routines = () => {
    return(
        <div className="min-h-screen bg-background flex flex-col mb-[10px] px-[16px]">
            <section className="w-[100%] flex justify-between">

                <div className="flex flex-col gap-[5px]">
                    <div className="flex gap-[15px]">
                        <p className="font-subheading text-[12px] text-text-low">
                            Biblioteca
                        </p>
                        <span className="bg-yellow-bg2 h-auto px-[10px] rounded-[16px] border border-yellow font-body text-[12px] text-yellow">
                            ◆ ÉLITE
                        </span>
                    </div>

                    <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
                        Rutinas
                    </h1>
                </div>

                <div className="flex gap-[10px]">
                    <div className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-low">
                        ←
                    </div>

                    <div className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-low">
                        ←
                    </div>

                    <div className="bg-accent1 h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-high">
                        ←
                    </div>
                </div>
            </section>
                
            <section className="mt-[16px] flex gap-[10px]">
                <Card>
                    <p className="font-subheading font-bold text-text-low text-[16px]"> 
                        · SIGUIENTE EN TU CICLO
                    </p>

                    <div className="mt-[16px]">
                        <p className="font-heading font-extrabold text-text-high text-[28px] mt[]">Push A</p>

                        <div className="flex space-x-2">
                            <span className="bg-surf h-[30px] py-[2px] px-[10px] rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                                8 ejercicios
                            </span>
                            
                            <span className="bg-surf h-[30px] py-[2px] px-[10px] rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                                Pecho · Hombro · Tríceps
                            </span>
                        </div>
                    </div>

                    <div className="mt-[16px] w-[95%] flex items-center justify-between">
                        <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                            120
                            <span className="font-subheading font-semibold text-[14px] text-text-low">
                                MINUTOS
                            </span>
                        </p>

                        <div className="w-[1px] h-[40px] bg-text-low"></div> {/**Esto es una linea de división */}

                        <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                            8
                            <span className="font-subheading font-semibold text-[14px] text-text-low">
                                EJERCICIOS
                            </span>
                        </p>

                        <div className="w-[1px] h-[40px] bg-text-low"></div> {/**Esto es una linea de división */}

                        <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                            3x
                            <span className="font-subheading font-semibold text-[14px] text-text-low">
                                SERIES
                            </span>
                        </p>
                    </div>

                    <div className="mt-[16px] flex items-center ">
                        <Button text="Empezar entrenamiento" color="bg-primary" variant="filled"></Button>
                    </div>
                </Card>
            </section>

            <section className="mt-[16px] flex flex-col gap-[10px]">
                <div className="w-[100%] flex justify-between">
                    <p className="font-subheading font-bold text-text-low text-[16px]">MIS RUTINAS</p>

                    <p className="font-body text-text-low text-[14px]">1 rutina</p>
                </div>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="bg-blue-bg2 px-[14px] py-[2px] rounded-[16px] border border-blue font-subheading font-semibold text-[16px] text-blue">
                                <span className="text-orange">
                                    & 
                                </span>  
                                Push / Pull / Leg
                            </div>
                        </div>
                        
                        <div className="bg-surface h-[33px] w-[33px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-low">
                            &
                        </div>
                    </div>
                    

                    <div className="mt-[8px]">
                        <p className="font-heading font-extrabold text-text-high text-[28px] mt[]">Push B</p>

                        <div className="flex space-x-2">
                            <span className="bg-surf h-[25px] py-[2px] px-[10px] rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                                Pecho
                            </span>

                            <span className="bg-surf h-[25px] py-[2px] px-[10px] rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                                Hombro
                            </span>
                            
                            <span className="bg-surf h-[25px] py-[2px] px-[10px] rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                                Tríceps
                            </span>
                        </div>
                    </div>

                    <div className="mt-[16px] w-full flex items-center justify-center gap-[30px] border border-text-low rounded-[16px]">
                        <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                            120
                            <span className="font-subheading font-semibold text-[12px] text-text-low">
                                MINUTOS
                            </span>
                        </p>

                        <div className="w-[1px] h-[40px] bg-text-low"></div>  {/**Esto es una linea de división */}

                        <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                            8
                            <span className="font-subheading font-semibold text-[12px] text-text-low">
                                EJERCICIOS
                            </span>
                        </p>

                        <div className="w-[1px] h-[40px] bg-text-low"></div> {/**Esto es una linea de división */}

                        <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                            3x
                            <span className="font-subheading font-semibold text-[12px] text-text-low">
                                SERIES
                            </span>
                        </p>
                    </div>

                    <div className="-mx-[16px] -mb-[23px] mt-[12px] bg-surface rounded-b-[16px] px-[14px] py-[10px] flex items-center justify-between border border-white/27">
                        <p className="font-body text-[14px] text-text-low">& Última vez hace 3 días</p>

                        <p className="text-text-low">→</p>
                    </div>
                </Card>
            </section>

            <section className="mt-[16px] flex flex-col gap-[10px]">
                <div className="w-[100%] flex justify-between">
                    <p className="font-subheading font-bold text-text-low text-[16px]">PROGRESIÓN</p>

                    <p className="font-body text-orange text-[14px]">Sem. 3 de 6</p>
                </div>

                <Card variant="elite">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-[15px] items-center justify-center">
                            <div className="bg-orange-bg2 h-[50px] w-[40px] rounded-[8px] border border-orange flex items-center justify-center text-orange">
                                &
                            </div>

                            <div>
                                <div className="font-subheading font-bold text-[16px] text-orange">EXCLUSIVO &</div>
                                
                                <div className=" font-heading font-extrabold text-[18px] text-text-high">
                                    <p>Progresión</p> de cargas
                                </div> 
                            </div>
                        </div>

                        <span className="bg-yellow-bg2 h-auto px-[10px] rounded-[16px] border border-yellow font-body text-[12px] text-yellow">
                            ◆ ÉLITE
                        </span>
                    </div>
                    
                    <div className="mt-[16px] flex flex-col items-center justify-center gap-[12px]">
                        <span className="bg-orange-bg2 h-[60px] w-[60px] px-[10px] rounded-[16px] border border-orange font-body text-[25px] text-orange flex items-center justify-center">
                            &
                        </span>

                        <p className="font-heading font-bold text-[16px] text-text-high">Ninguna progresión creada</p>

                        <div className="flex items-center justify-center">
                            <p className="font-body text-[16px] text-text-low text-center">
                                Diseña la evolución de tus cargas semana a semana y lleva tu rendimiento al siguiente nivel.
                            </p>
                        </div>
                    </div>

                    <div className="mt-[8px] flex flex-col items-center justify-center gap-[5px]">
                        <div className="bg-orange-bg2 px-[14px] py-[2px] rounded-[16px] border border-orange font-subheading font-semibold text-[16px] text-orange">
                            <span className="text-orange">
                                & 
                            </span>  Sobre carga progresiva
                        </div>
                        
                        <div className="bg-orange-bg2 px-[14px] py-[2px] rounded-[16px] border border-orange font-subheading font-semibold text-[16px] text-orange">
                            <span className="text-orange">
                                & 
                            </span>  Semana de descarga
                        </div>

                        <div className="bg-orange-bg2 px-[14px] py-[2px] rounded-[16px] border border-orange font-subheading font-semibold text-[16px] text-orange">
                            <span className="text-orange">
                                & 
                            </span>  Vista por bloque
                        </div>
                    </div>

                    <div className="mt-[16px] w-full flex items-center justify-center gap-[30px] border border-text-low rounded-[16px]">
                        <Button text="Crear progresión" color="bg-orange" variant="filled"></Button> {/*TODO poner icono*/}
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default Routines;