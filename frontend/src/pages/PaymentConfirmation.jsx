import React from "react";
import Card from "../components/Card";
import Header from "../components/Header";
import Button from "../components/Button";

const PaymentConfirmation = () => {

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">

        {/* HEADER */}
        <section className="mt-[10px] flex flex-col items-center justify-center gap-[11px]">
        <span className="bg-accent2-bg2 h-[105px] w-[105px] px-[10px] rounded-full border border-accent2 font-heading font-bold text-[50px] text-accent2 flex items-center justify-center">
            & {/*! PONER EL ICONO */}
        </span>

        <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
            !Pago
            <span className="text-primary">confirmado!</span>
        </p>

        <p className="font-body text-[16px] text-text-low text-center">
            Tus suscripción esta activa. Hemos enviado el recibo a tu correo electrónico
        </p>
        </section>

        {/* DETALLES DEL PAGO */}
        <section className="mx-5 pt-5 flex flex-col gap-3">
        <p className="font-subheading font-bold text-[16px] text-text-low">DETALLES DEL PAGO</p>
        
        <Card>
            <div className="flex flex-col gap-[10px]">

            <div className="flex items-start justify-between">
                <div className="w-full flex items-center justify-between">
                    <div className="flex gap-3">
                    <div className="w-[40px] h-[50px] rounded-[10px] bg-orange-bg2 flex items-center justify-center text-[17px]">
                        ⚡
                    </div>

                    <div className="flex flex-col">

                        <p className="font-heading font-extrabold text-[17px] text-text-high">
                            Autónomo
                        </p>
                        <p className="font-body text-[16px] text-text-low text-left">
                            Entrenador personal <br />
                            Mesual
                        </p>
                        
                    </div> 
                    </div>

                    <div className="flex">
                    <span className="items-center bg-accent2-bg2 border border-accent2 rounded-full px-3.5 py-0.5 text-[16px] text-accent2 font-subheading font-semibold">
                        & Activo
                    </span>
                    </div>         
                </div>
            </div>

            <div className="w-full h-px bg-text-low"></div> {/**Esto es una linea de división */}

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Impote</p>

                <p className="font-subheading font-bold text-[16px] flex items-center justify-center text-orange">9,99 €</p>
            </div>

            <div className="w-full h-px bg-text-low"></div> {/**Esto es una linea de división */}

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Duración</p>

                <p className="font-subheading text-[16px] flex items-center justify-center text-text-high">1 mes</p>
            </div>

            <div className="w-full h-px bg-text-low"></div> {/**Esto es una linea de división */}

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Método de pago</p>

                <p className="font-body text-[16px] flex items-center justify-center text-text-high">····4242</p>
            </div>

            <div className="w-full h-px bg-text-low"></div> {/**Esto es una linea de división */}

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Fecha de pago</p>

                <p className="font-body text-[16px] flex items-center justify-center text-text-high">17 mar 2026</p>
            </div>

            <div className="w-full h-px bg-text-low"></div> {/**Esto es una linea de división */}

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Próxima renovación</p>

                <p className="font-body text-[16px] flex items-center justify-center text-accent2">17 abr 2026</p>
            </div>

            <div className="-mx-[16px] -mb-[23px] mt-[12px] bg-yellow-bg3 px-[14px] py-[10px] flex items-center justify-between border border-yellow/27">
                <div className="flex flex-col gap-1">
                    <p className="font-heading font-semibold text-[20px] text-text-high">Total hoy</p>

                    <p className="font-body text-[16px] text-text-low">IVA (21%) incluido</p>
                </div>

                <p className="font-heading font-extrabold text-[18px] text-orange">9,99 €</p> {/*! PONER EL ICONO */}
            </div>

            <div className="-mx-[16px] -mb-[17px] mt-[12px] rounded-b-[16px] px-[14px] py-[10px] flex items-center justify-between border border-yellow/27">
                <p className="font-subheading font-bold text-[16px] text-text-low">ID TRANSACCIÓN</p>

                <p className="font-body text-[12px] text-text-low">AUR- 5AMHP79L <span className="text-primary">&</span></p> {/*! PONER EL ICONO */}
            </div>
            
            </div>
        </Card>
        </section>

        {/* INFORMACIÓN */}
        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
                
            <div className="h-auto rounded-[16px] bg-accent2-bg3 border border-accent2 p-[10px] flex items-center justify-between gap-[10px]">
                    
                <span className="text-accent2">&</span>

                <p className="font-body text-[16px] text-text-high">Tu suscripción se renueva el 
                    <span className="text-accent2"> 17 de abril de 2026 </span>
                    . Si no quieres continuar, cancela antes para no ser cobrado</p>
                    
            </div>
                
        </section>

        {/* PROXIMO PAGO */}
        <section className="mx-5 pt-5 flex flex-col gap-3">
            <p className="font-subheading font-bold text-[16px] text-text-low">PRÓXIMO PAGO</p>
            
            <Card>
                <div className="flex gap-[10px]">
                    <div className="w-full flex">
                        <div className="flex gap-3 items-center justify-between">
                            <div className="w-[60px] h-[60px] rounded-[16px] bg-orange-bg2 text-orange flex items-center justify-center text-[17px]">
                                &
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="font-subheading font-bold text-[16px] text-text-low">FACTURACIÓN MENSUAL</p>

                                <p className="font-heading font-extrabold text-[17px] text-text-high">
                                    9,99€
                                </p>
                                <p className="font-body text-[16px] text-text-low text-left">
                                    el 17 de abril de 2026
                                </p>
                            </div> 
                        </div>
                    </div>
                </div>
            </Card>
        </section>

        {/* ENTRENADOR ASIGNADO */}
        <section className="mx-5 pt-5 pb-[70px] flex flex-col gap-3">
            <p className="font-subheading font-bold text-[16px] text-text-low">TU ENTRENADO ASIGNADO</p>
            
            <Card>
                <div className="flex">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex gap-5 items-center justify-between">
                            <div className="w-[75px] h-[75px] rounded-[16px] bg-primary-bg border border-primary flex items-center justify-center text-[17px]">
                                <p className="font-heading font-extrabold text-[28px] text-accent1">AR</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="font-body font-semiboldbold text-[24px] text-text-high">Carlos Sainz</p>

                                <p className="font-body text-[16px] text-primary">
                                    Entrenador pesonal · <br /> 5 años exp.
                                </p>
                                <p className="font-body text-[16px] text-yellow text-left">
                                    *****
                                </p>
                            </div> 
                        </div>

                        <div className="flex items-center justify-center gap-[15px] text-text-low">
                            v
                        </div>
                    </div>
                </div>
            </Card>
        </section>

        {/* STICKY CTA */}
        <div className="w-full px-[16px] fixed bottom-3">
            <div className="flex flex-col gap-1">
                <Button
                    variant="outlined"
                    text="& Comenzar a disfrutar"
                    bgColor={"bg-accent2"}
                    textColor={"text-surf"}
                    borderColor={"border-accent2"}
                    w="w-[100%]"
                />
                <Button
                    variant="filled"
                    text="& Descargar recibo en PDF"
                    bgColor={"bg-surf"}
                    textColor={"text-text-low"}
                    borderColor={"bg-[text-text-low]"}
                    w="w-[100%]"
                />
            </div>

        </div>
    </div>
  );
};

export default PaymentConfirmation;