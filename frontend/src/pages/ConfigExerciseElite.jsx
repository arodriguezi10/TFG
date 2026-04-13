import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";

const ConfigExerciseElite = () => {
    return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
        <section className="w-full flex items-center justify-between">
            <Header showback title={<>Configura<br/>ejercicio</>}/>
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            <Card>
                <div className="flex items-center gap-[15px]">
                    <p className="bg-primary-bg h-[35px] w-[35px] rounded-[8px] border border-primary font-heading font-bold text-[22px] text-primary text-center">1</p>

                    <div className="flex items-center gap-[10px]">
                        <div className="flex flex-col">
                            <p className="font-heading font-extrabold text-[18px] text-text-high">Press de Banca</p>

                            <p className="font-body text-[12px] text-text-low">Pecho - Peso libre</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[5px] ml-auto">
                        <p className="font-body text-[12px] text-text-low">Descanso</p>

                        <input type="text" name="descanso" id="descanso" className="bg-green-bg2 w-[57px] h-[29px] rounded-[8px] border border-accent2 font-heading font-bold text-[22px] text-accent2 text-center"/>
                    </div>
                </div>

                <hr className="text-text-low -mx-[16px] mt-[5px] mb-[5px]" />

                <div className="flex flex-col gap-[8px]">
                    {/* HEADER */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">
                        <p className="font-body text-[12px] text-text-low text-center">#</p>
                        <p className="font-body text-[12px] text-text-low text-center">REPS</p>
                        <p className="font-body text-[12px] text-text-low text-center">PESO (KG)</p>
                        <p className="font-body text-[12px] text-text-low text-center">RIR</p> 
                        <div></div> {/* Espacio para el botón eliminar */}
                    </div>

                    <hr className="text-text-low -mx-[16px]" />

                    {/* SERIE 1 */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">

                        <p className="font-heading font-bold text-[22px] text-text-high text-center">S1</p>

                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <button className="bg-surface w-[25px] h-[25px] rounded-[8px] border border-red font-body text-[16px] text-red flex items-center justify-center">
                            x
                        </button>
                    </div>

                    <hr className="text-text-low h-[1px]"/>

                    {/* SERIE 2 */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">

                        <p className="font-heading font-bold text-[22px] text-text-high text-center">S2</p>

                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <button className="bg-surface w-[25px] h-[25px] rounded-[8px] border border-red font-body text-[16px] text-red flex items-center justify-center">
                            x
                        </button>
                    </div>

                    <hr className="text-text-low h-[1px]"/>
                    
                    {/* SERIE 3 */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">

                        <p className="font-heading font-bold text-[22px] text-text-high text-center">S3</p>

                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <button className="bg-surface w-[25px] h-[25px] rounded-[8px] border border-red font-body text-[16px] text-red flex items-center justify-center">
                            x
                        </button>
                    </div>
                </div>

                <hr className="text-text-low -mx-[16px] mt-[5px] mb-[5px]" />

                {/* Técnicas */}
                <div className="flex gap-[8px] flex-wrap mt-[8px] items-center justify-center">
                    <p className="font-body text-[12px] text-text-low">Técnica</p>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Dropset
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Rest-pause
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Topset
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & TS/BO
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Parciales
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Myo-reps
                    </button>
                </div>

                <hr className="text-text-low -mx-[16px] mt-[8px] mb-[5px]" />

                {/* Footer: Añadir serie y Eliminar */}
                <div className="flex items-center justify-between items-center mt-[8px]">
                    <button className="font-body font-bold text-[14px] text-primary">
                        + Añadir serie
                    </button>

                    <button className="font-body font-semibold text-[14px] text-red">
                        Eliminar
                    </button>
                </div>
                
            </Card>
        </section>

        <section className="mt-[16px] pb-[70px] w-full px-[16px] flex flex-col gap-[10px]">
            <Card>
                <div className="flex items-center gap-[15px]">
                    <p className="bg-primary-bg h-[35px] w-[35px] rounded-[8px] border border-primary font-heading font-bold text-[22px] text-primary text-center">2</p>

                    <div className="flex items-center gap-[10px]">
                        <div className="flex flex-col">
                            <p className="font-heading font-extrabold text-[18px] text-text-high">Curl bayesian</p>

                            <p className="font-body text-[12px] text-text-low">Bíceps - Polea</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[5px] ml-auto">
                        <p className="font-body text-[12px] text-text-low">Descanso</p>

                        <input type="text" name="descanso" id="descanso" className="bg-green-bg2 w-[57px] h-[29px] rounded-[8px] border border-accent2 font-heading font-bold text-[22px] text-accent2 text-center"/>
                    </div>
                </div>

                <hr className="text-text-low -mx-[16px] mt-[5px] mb-[5px]" />

                <div className="flex flex-col gap-[8px]">
                    {/* HEADER */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">
                        <p className="font-body text-[12px] text-text-low text-center">#</p>
                        <p className="font-body text-[12px] text-text-low text-center">REPS</p>
                        <p className="font-body text-[12px] text-text-low text-center">PESO (KG)</p>
                        <p className="font-body text-[12px] text-text-low text-center">RIR</p>
                        <div></div> {/* Espacio para el botón eliminar */}
                    </div>

                    <hr className="text-text-low -mx-[16px]" />

                    {/* SERIE 1 */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">

                        <p className="font-heading font-bold text-[22px] text-text-high text-center">S1</p>

                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <button className="bg-surface w-[25px] h-[25px] rounded-[8px] border border-red font-body text-[16px] text-red flex items-center justify-center">
                            x
                        </button>
                    </div>

                    <hr className="text-text-low h-[1px]"/>

                    {/* SERIE 2 */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">

                        <p className="font-heading font-bold text-[22px] text-text-high text-center">S2</p>

                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <button className="bg-surface w-[25px] h-[25px] rounded-[8px] border border-red font-body text-[16px] text-red flex items-center justify-center">
                            x
                        </button>
                    </div>

                    <hr className="text-text-low h-[1px]"/>
                    
                    {/* SERIE 3 */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-[8px] items-center">

                        <p className="font-heading font-bold text-[22px] text-text-high text-center">S3</p>

                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <input type="text" name="reps" id="reps" className="w-[65px] h-[25px] rounded-[8px] border border-text-low font-body text-[12px] text-text-high text-center"/>
                        <button className="bg-surface w-[25px] h-[25px] rounded-[8px] border border-red font-body text-[16px] text-red flex items-center justify-center">
                            x
                        </button>
                    </div>
                </div>

                <hr className="text-text-low -mx-[16px] mt-[5px] mb-[5px]" />

                {/* Técnicas */}
                <div className="flex gap-[8px] flex-wrap mt-[8px] items-center justify-center">
                    <p className="font-body text-[12px] text-text-low">Técnica</p>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Dropset
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Rest-pause
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Topset
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & TS/BO
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Parciales
                    </button>

                    <button className="px-[12px] py-[4px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low opacity-55">
                    & Myo-reps
                    </button>
                </div>

                <hr className="text-text-low -mx-[16px] mt-[8px] mb-[5px]" />

                {/* Footer: Añadir serie y Eliminar */}
                <div className="flex items-center justify-between items-center mt-[8px]">
                    <button className="font-body font-bold text-[14px] text-primary">
                        + Añadir serie
                    </button>

                    <button className="font-body font-semibold text-[14px] text-red">
                        Eliminar
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

export default ConfigExerciseElite;