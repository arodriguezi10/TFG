import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Header from "../components/Header";
import Button from "../components/Button";

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener datos del pago desde location.state
  const paymentData = location.state || {
    plan: 'pro',
    planName: 'Pro',
    billingPeriod: 'mes',
    billingText: 'mensual',
    price: '9,99',
    cardLastFour: '4242',
    paymentDate: '26 abr 2026',
    nextBillingDate: '3 may 2026',
    transactionId: 'AUR-5AMHP79L'
  };

  const planIcons = {
    pro: '⚡',
    elite: '👑'
  };

  const planColors = {
    pro: 'bg-orange-bg2',
    elite: 'bg-surface'
  };

  const getDuration = () => {
    return paymentData.billingText === 'mensual' ? '1 mes' : '1 año';
  };

  const handleDownloadReceipt = () => {
    alert('Descargando recibo en PDF...');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">

        {/* HEADER */}
        <section className="mt-[10px] flex flex-col items-center justify-center gap-[11px]">
        <span className="bg-accent2-bg2 h-[105px] w-[105px] px-[10px] rounded-full border border-accent2 font-heading font-bold text-[50px] text-accent2 flex items-center justify-center">
            ✓
        </span>

        <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
            ¡Pago
            <span className="text-primary">confirmado!</span>
        </p>

        <p className="font-body text-[16px] text-text-low text-center px-4">
            Tu suscripción está activa. Hemos enviado el recibo a tu correo electrónico
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
                    <div className={`w-[40px] h-[50px] rounded-[10px] ${planColors[paymentData.plan]} flex items-center justify-center text-[17px]`}>
                        {planIcons[paymentData.plan]}
                    </div>

                    <div className="flex flex-col">

                        <p className="font-heading font-extrabold text-[17px] text-text-high">
                            {paymentData.planName}
                        </p>
                        <p className="font-body text-[16px] text-text-low text-left">
                            Plan {paymentData.billingText} <br />
                            {paymentData.plan === 'elite' && 'Entrenador personal'}
                        </p>
                        
                    </div> 
                    </div>

                    <div className="flex">
                    <span className="items-center bg-accent2-bg2 border border-accent2 rounded-full px-3.5 py-0.5 text-[16px] text-accent2 font-subheading font-semibold">
                        ✓ Activo
                    </span>
                    </div>         
                </div>
            </div>

            <div className="w-full h-px bg-text-low"></div>

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Importe</p>

                <p className="font-subheading font-bold text-[16px] flex items-center justify-center text-orange">
                  {paymentData.price} €
                </p>
            </div>

            <div className="w-full h-px bg-text-low"></div>

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Duración</p>

                <p className="font-subheading text-[16px] flex items-center justify-center text-text-high">
                  {getDuration()}
                </p>
            </div>

            <div className="w-full h-px bg-text-low"></div>

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Método de pago</p>

                <p className="font-body text-[16px] flex items-center justify-center text-text-high">
                  ····{paymentData.cardLastFour}
                </p>
            </div>

            <div className="w-full h-px bg-text-low"></div>

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Fecha de pago</p>

                <p className="font-body text-[16px] flex items-center justify-center text-text-high">
                  {paymentData.paymentDate}
                </p>
            </div>

            <div className="w-full h-px bg-text-low"></div>

            <div className="flex items-center justify-between">            
                <p className="font-subheading font-bold text-[16px] text-text-low">Próxima renovación</p>

                <p className="font-body text-[16px] flex items-center justify-center text-accent2">
                  {paymentData.nextBillingDate}
                </p>
            </div>

            <div className="-mx-[16px] -mb-[23px] mt-[12px] bg-yellow-bg3 px-[14px] py-[10px] flex items-center justify-between border border-yellow/27">
                <div className="flex flex-col gap-1">
                    <p className="font-heading font-semibold text-[20px] text-text-high">Total hoy</p>

                    <p className="font-body text-[16px] text-text-low">IVA (21%) incluido</p>
                </div>

                <p className="font-heading font-extrabold text-[18px] text-orange">0,00 €</p>
            </div>

            <div className="-mx-[16px] -mb-[17px] mt-[12px] rounded-b-[16px] px-[14px] py-[10px] flex items-center justify-between border border-yellow/27">
                <p className="font-subheading font-bold text-[16px] text-text-low">ID TRANSACCIÓN</p>

                <p className="font-body text-[12px] text-text-low">
                  {paymentData.transactionId} <span className="text-primary">📋</span>
                </p>
            </div>
            
            </div>
        </Card>
        </section>

        {/* INFORMACIÓN */}
        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
                
            <div className="h-auto rounded-[16px] bg-accent2-bg3 border border-accent2 p-[10px] flex items-center justify-between gap-[10px]">
                    
                <span className="text-accent2 text-[20px]">ℹ️</span>

                <p className="font-body text-[14px] text-text-high">
                  Tu suscripción se renueva el 
                    <span className="text-accent2"> {paymentData.nextBillingDate} </span>
                    . Si no quieres continuar, cancela antes para no ser cobrado
                </p>
                    
            </div>
                
        </section>

        {/* PROXIMO PAGO */}
        <section className="mx-5 pt-5 flex flex-col gap-3">
            <p className="font-subheading font-bold text-[16px] text-text-low">PRÓXIMO PAGO</p>
            
            <Card>
                <div className="flex gap-[10px]">
                    <div className="w-full flex">
                        <div className="flex gap-3 items-center justify-between">
                            <div className="w-[60px] h-[60px] rounded-[16px] bg-orange-bg2 text-orange flex items-center justify-center text-[24px]">
                                📅
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="font-subheading font-bold text-[14px] text-text-low uppercase">
                                  Facturación {paymentData.billingText}
                                </p>

                                <p className="font-heading font-extrabold text-[17px] text-text-high">
                                    {paymentData.price}€
                                </p>
                                <p className="font-body text-[14px] text-text-low text-left">
                                    el {paymentData.nextBillingDate}
                                </p>
                            </div> 
                        </div>
                    </div>
                </div>
            </Card>
        </section>

        {/* ENTRENADOR ASIGNADO - Solo para plan Elite */}
        {paymentData.plan === 'elite' && (
          <section className="mx-5 pt-5 pb-[70px] flex flex-col gap-3">
              <p className="font-subheading font-bold text-[16px] text-text-low">TU ENTRENADOR ASIGNADO</p>
              
              <Card>
                  <div className="flex">
                      <div className="w-full flex items-center justify-between">
                          <div className="flex gap-5 items-center justify-between">
                              <div className="w-[75px] h-[75px] rounded-[16px] bg-primary-bg border border-primary flex items-center justify-center text-[17px]">
                                  <p className="font-heading font-extrabold text-[28px] text-accent1">CS</p>
                              </div>

                              <div className="flex flex-col gap-1">
                                  <p className="font-body font-semibold text-[24px] text-text-high">Carlos Sainz</p>

                                  <p className="font-body text-[14px] text-primary">
                                      Entrenador personal · <br /> 5 años exp.
                                  </p>
                                  <p className="font-body text-[16px] text-yellow text-left">
                                      ⭐⭐⭐⭐⭐
                                  </p>
                              </div> 
                          </div>

                          <div className="flex items-center justify-center gap-[15px] text-text-low text-[20px]">
                              →
                          </div>
                      </div>
                  </div>
              </Card>
          </section>
        )}

        {/* STICKY CTA */}
        <div className="w-full px-[16px] fixed bottom-3">
            <div className="flex flex-col gap-1">
                <Button
                    variant="outlined"
                    text="✨ Comenzar a disfrutar"
                    bgColor={"bg-accent2"}
                    textColor={"text-background"}
                    borderColor={"border-accent2"}
                    w="w-[100%]"
                    onClick={() => navigate('/dashboard')}
                />
                <Button
                    variant="filled"
                    text="📄 Descargar recibo en PDF"
                    bgColor={"bg-surf"}
                    textColor={"text-text-low"}
                    borderColor={"bg-[text-text-low]"}
                    w="w-[100%]"
                    onClick={handleDownloadReceipt}
                />
            </div>

        </div>
    </div>
  );
};

export default PaymentConfirmation;