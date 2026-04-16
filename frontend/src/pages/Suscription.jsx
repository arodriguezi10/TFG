import React, { useState} from 'react';
import Card from '../components/Card';
import Header from '../components/Header';
import Button from '../components/Button';

const Subscription = () => {
  const [billingPeriod, setBillingPeriod] = useState('mes');

  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">

      <section className="w-full flex items-center justify-between">
          <Header showback subtitle={"perfil"} title={"Suscripción y pagos"}/>
      </section>

      <section className="mt-[25px] flex flex-col items-center justify-center gap-[15px]">
          <span className="bg-yellow-bg3 h-[110px] w-[110px] px-[10px] rounded-[35px] border border-yellow font-heading font-bold text-[50px] text-yellow flex items-center justify-center">
              & {/*! PONER EL ICONO */}
          </span>

          <span className="items-center bg-text-low/8 border border-text-low rounded-full px-3.5 py-0.5 text-[16px] text-text-low font-subheading font-semibold">
            Sin plan activo
          </span>

          <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
            Desbloquea tu
            
            <span className="bg-gradient-to-r from-orange to-orange-bg3 bg-clip-text text-transparent">pontencial</span>
            <span className="bg-gradient-to-l from-accent1 to-accent1-bg1 bg-clip-text text-transparent">completo</span>                   
          </p>

          <p className="font-subheading text-[16px] p-[16px] text-text-low text-center">
              Actualmente estás en el plan gratuito. Elige  <br/>
              un plan y accede a todas las funciones de FYLIOS.                  
          </p>
      </section>

      <section className="mt-[10px] mx-5 mb-5">
        <div className="bg-surf rounded-[16px] border border-text-low p-1.5 flex">
          <button
            onClick={() => setBillingPeriod('mes')}
            className={`flex-1 py-2.5 rounded-[16px] font-subheading font-bold text-[16px] transition-all duration-200 ${
              billingPeriod === 'mes'
                ? 'bg-surface text-text-high shadow-lg'
                : 'text-text-low'
            }`}
          >
            Mensual
          </button>

          <button
            onClick={() => setBillingPeriod('annual')}
            className={`flex-1 py-2.5 rounded-[10px] font-subheading font-bold text-[16px] transition-all duration-200 ${
              billingPeriod === 'annual'
                ? 'bg-surface text-text-high shadow-lg'
                : 'text-text-low'
            }`}
          >
            Anual{' '}
            <span className="inline-flex bg-accent2-bg2 border border-accent2 rounded-full px-1.5 text-[12px] text-accent2 ml-1">
              −40%
            </span>
          </button>

        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="mx-5 flex flex-col gap-3">
        
        {/* FREE PLAN */}
        <Card>
          <button className="w-full text-left">
            <div className="flex flex-col gap-3.5">

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-text-low/8 flex items-center justify-center text-[17px]">
                    🌱
                  </div>
                  <p className="font-heading font-extrabold text-[17px] text-text-high">
                    Free
                  </p>
                </div>
                <span className="items-center border border-text-low rounded-full px-3.5 py-0.5 text-[16px] text-text-low font-subheading font-semibold">
                  Activo
                </span>
              </div>

              <div className="flex items-end gap-1">
                <span className="font-heading font-extrabold text-[30px] text-text-high tracking-tighter leading-none">0</span>

                <span className="font-subheading font-semibold text-base text-text-low mb-0.5">€</span>
              </div>

              <p className="text-[16px] text-text-low font-body mb-1.5">
                  Para siempre · Sin tarjeta
              </p>

              <div className="w-full h-px bg-text-low mb-1.5"></div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Hasta 4 rutinas</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Registro del peso corporal</span>
                </div>

                <div className="flex items-center gap-2.5 opacity-50">
                  <div className=" w-[18px] h-[18px] rounded-[5px] bg-background flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-low">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-low  line-through">Rutinas predefinidas por nivel</span>
                </div>

                <div className="flex items-center gap-2.5 opacity-50">
                  <div className=" w-[18px] h-[18px] rounded-[5px] bg-background flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-low">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-low  line-through">Planificación de mesociclos</span>
                </div>

                <div className="flex items-center gap-2.5 opacity-50">
                  <div className=" w-[18px] h-[18px] rounded-[5px] bg-background flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-low">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-low  line-through">Chat directo con el entrenador</span>
                </div>
              </div>

              <div className="w-full h-px bg-text-low mb-1.5"></div>

              <div className='flex gap-2'>
                <div className="w-5 h-5 rounded-full border-[1.5px] border-text-low flex items-center justify-center" ></div>

                <span className="font-subheading font-bold text-[16px] text-text-low">
                  Seleccionar Free
                </span>
              </div>

            </div>
          </button>
        </Card>

        {/* PRO PLAN */}
        <Card>
          <button className="w-full text-left">
            <div className="flex flex-col gap-3.5">

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-orange-bg2 flex items-center justify-center text-[17px]">⚡</div>

                  <p className="font-heading font-extrabold text-[17px] text-text-high">Pro</p>
                </div>

                <span className="items-center bg-yellow-bg2 border border-orange rounded-full px-3.5 py-0.5 text-[16px] text-orange font-subheading font-semibold">
                  & Más popular
                </span>
              </div>

              <div className="flex items-end gap-1">
                <span className="font-heading font-extrabold text-[30px] text-text-high tracking-tighter leading-none">9</span>

                <span className="font-subheading font-semibold text-base text-text-low mb-0.5">,99€</span>
              </div>

              <p className="text-[16px] text-text-low font-body mb-1.5">
                  Por mes · cancela cuando quieras
              </p>

              <div className="w-full h-px bg-text-low mb-1.5"></div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Hasta 4 rutinas</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Registro del peso corporal</span>
                </div>

                 <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Rutinas predefinidas por nivel</span>
                </div>

                <div className="flex items-center gap-2.5 opacity-50">
                  <div className=" w-[18px] h-[18px] rounded-[5px] bg-background flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-low">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-low  line-through">Planificación de mesociclos</span>
                </div>

                <div className="flex items-center gap-2.5 opacity-50">
                  <div className=" w-[18px] h-[18px] rounded-[5px] bg-background flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-low">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-low  line-through">Chat directo con el entrenador</span>
                </div>
              </div>

              <div className="w-full h-px bg-text-low mb-1.5"></div>

              <div className='flex gap-2'>
                <div className="w-5 h-5 rounded-full border-[1.5px] border-text-low flex items-center justify-center" ></div>

                <span className="font-subheading font-bold text-[16px] text-text-low">
                  Seleccionar Pro
                </span>
              </div>

            </div>
          </button>
        </Card>

        {/* ELITE PLAN */}
        <Card>
          <button className="w-full text-left">
            <div className="flex flex-col gap-3.5">

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-surface flex items-center justify-center text-[17px]">👑</div>

                  <p className="font-heading font-extrabold text-[17px] text-text-high">Élite</p>
                </div>

                {/*<span className="items-center bg-yellow-bg2 border border-orange rounded-full px-3.5 py-0.5 text-[16px] text-orange font-subheading font-semibold">
                  & Más popular
                </span>*/}
              </div>

              <div className="flex items-end gap-1">
                <span className="font-heading font-extrabold text-[30px] text-text-high tracking-tighter leading-none">19</span>

                <span className="font-subheading font-semibold text-base text-text-low mb-0.5">,99€</span>
              </div>

              <p className="text-[16px] text-text-low font-body mb-1.5">
                  Por mes · cancela cuando quieras
              </p>

              <div className="w-full h-px bg-text-low mb-1.5"></div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Hasta 4 rutinas</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Registro del peso corporal</span>
                </div>

                 <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Rutinas predefinidas por nivel</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Planificación de mesociclos</span>
                </div>

                 <div className="flex items-center gap-2.5">
                  <div className="bg-green w-[18px] h-[18px] rounded-[5px] bg-accent3/12 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="font-subheading font-bold text-[16px] text-text-high ">Chat directo con el entrenador</span>
                </div>

                <div className="w-full h-px bg-text-low mb-1.5"></div>

                <div className='flex gap-2'>
                  <div className="w-5 h-5 rounded-full border-[1.5px] border-text-low flex items-center justify-center" ></div>

                  <span className="font-subheading font-bold text-[16px] text-text-low">
                    Seleccionar Élite
                  </span>
                </div>
              </div>
            </div>
          </button>
        </Card>

      </section>

      {/* PAYMENT METHODS */}
      <section className='mt-[10px] flex flex-col items-center justify-center gap-2'>
          <div className='flex gap-1'>
              <span className="items-center bg-text-low/8 border border-text-low rounded-full px-3.5 py-0.5 text-[14px] text-text-low font-body">
                & Tarjeta
              </span>

              <span className="items-center bg-text-low/8 border border-text-low rounded-full px-3.5 py-0.5 text-[14px] text-text-low font-body">
                & Tarjeta
              </span>

              <span className="items-center bg-text-low/8 border border-text-low rounded-full px-3.5 py-0.5 text-[14px] text-text-low font-body">
                & Tarjeta
              </span>
          </div>

          <p className='font-body text-[12px] text-text-low'> & Pago 100% seguro. Cancela cuando quieras</p>        
      </section>

      {/* STICKY CTA */}
      <div className="w-full px-[16px] fixed bottom-1 gap-[10px]">
          <Button variant="outlined" text="& Activa plan Élite" bgColor={"bg-orange"} textColor={"text-text-high"} borderColor={"border-orange"} w="w-[100%]"/>

          <p className="text-center mt-2 text-[11px] text-text-low font-light">
            Prueba 7 días gratis · Sin compromiso
        </p>
      </div>
    </div>
  );
};

export default Subscription;