import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Header from "../components/Header";
import Button from "../components/Button";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Obtener datos del plan desde location.state
  const planData = location.state || {
    plan: 'pro',
    planName: 'Pro',
    billingPeriod: 'mes',
    price: '9,99',
    billingText: 'mensual'
  };

  // Estados para los datos de la tarjeta
  const [cardData, setCardData] = useState({
    number: '1234 5678 9101 1234',
    holder: 'Santiago Segura',
    expiry: '12 / 28',
    cvv: '123'
  });

  const [isEditingCard, setIsEditingCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular fecha de cobro (7 días desde hoy)
  const getChargeDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const day = date.getDate();
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Calcular subscription_ends_at según el billing period
  const getSubscriptionEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 días de prueba gratuita
    
    if (planData.billingPeriod === 'mes') {
      date.setMonth(date.getMonth() + 1); // +1 mes desde el inicio del pago
    } else {
      date.setFullYear(date.getFullYear() + 1); // +1 año desde el inicio del pago
    }
    
    return date.toISOString();
  };

  // Calcular fecha actual para el pago
  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Features según el plan
  const planFeatures = {
    pro: [
      'Hasta 4 rutinas',
      'Registro del peso corporal',
      'Rutinas predefinidas por nivel'
    ],
    elite: [
      'Hasta 4 rutinas',
      'Registro del peso corporal',
      'Rutinas predefinidas por nivel',
      'Planificación de mesociclos',
      'Chat directo con el entrenador'
    ]
  };

  const planIcons = {
    pro: '⚡',
    elite: '👑'
  };

  const planColors = {
    pro: 'bg-orange-bg2',
    elite: 'bg-surface'
  };

  const handleCardInputChange = (field, value) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
    handleCardInputChange('number', formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
    }
    handleCardInputChange('expiry', value);
  };

  const getLastFourDigits = () => {
    return cardData.number.slice(-4);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    try {
      // Actualizar suscripción en la base de datos
      const { error: updateError } = await supabase
        .from('users')
        .update({
          subscription_tier: planData.plan,
          subscription_ends_at: getSubscriptionEndDate()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error al actualizar suscripción:', updateError);
        alert('Error al procesar el pago. Por favor, intenta de nuevo.');
        setIsProcessing(false);
        return;
      }

      // Generar ID de transacción único
      const transactionId = 'AUR-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      // Navegar a confirmación con todos los datos
      navigate('/paymentConfirmation', {
        state: {
          plan: planData.plan,
          planName: planData.planName,
          billingPeriod: planData.billingPeriod,
          billingText: planData.billingText,
          price: planData.price,
          cardLastFour: getLastFourDigits(),
          paymentDate: getCurrentDate(),
          nextBillingDate: getChargeDate(),
          transactionId: transactionId
        }
      });

    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado. Por favor, intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">

      {/* HEADER */}
      <section className="w-full flex items-center justify-between">
        <Header showback subtitle={"suscripción"} title={"Confirmar pago"} />
      </section>

      {/* PLAN CARDS */}
      <section className="mx-5 pt-5 flex flex-col gap-3">
        <p className="font-subheading font-bold text-[16px] text-text-low">TU PLAN</p>
        
        <Card>
          <div className="w-full text-left">
            <div className="flex flex-col gap-3.5">

              <div className="flex items-start justify-between">
                <div className="w-full flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className={`w-10 h-12.5 rounded-[10px] ${planColors[planData.plan]} flex items-center justify-center text-[17px]`}>
                      {planIcons[planData.plan]}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {planData.plan === 'pro' && (
                        <span className="items-center bg-yellow-bg2 border border-orange rounded-full px-3.5 py-0.5 text-[16px] text-orange font-subheading font-semibold">
                          🔥 Más popular
                        </span>
                      )}

                      <p className="font-heading font-extrabold text-[17px] text-text-high">
                        {planData.planName}
                      </p>
                    </div> 
                  </div>

                  <div className="flex gap-3">
                    <p className="font-heading font-extrabold text-[17px] text-text-high flex flex-col items-end">
                        {planData.price.split(',')[0]},{planData.price.split(',')[1]} <br /> 
                        <span>€</span>
                        <span className="font-body font-normal text-[16px] text-text-low">al mes</span>
                    </p>
                  </div>         
                </div>
              </div>

              <div className="flex items-end gap-3">
                <span className="items-center bg-primary-bg-bg2 border border-primary rounded-full px-3.5 py-0.5 text-[16px] text-primary font-subheading font-semibold">
                  📅 {planData.billingText === 'mensual' ? 'Mensual' : 'Anual'}
                </span>

                <span className="items-center bg-accent2-bg2 border border-accent2 rounded-full px-3.5 py-0.5 text-[16px] text-accent2 font-subheading font-semibold">
                  🎁 7 días gratis
                </span>
              </div>

              <div className="w-full h-px bg-text-low mb-1.5"></div>

              <div className="flex flex-col gap-2">
                {planFeatures[planData.plan].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="bg-green w-4.5 h-4.5 rounded-[5px] bg-accent3/12 flex items-center justify-center shrink-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="font-subheading font-bold text-[16px] text-text-high">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </Card>
      </section>

      {/* CREDIT CARD PREVIEW */}
      {!isEditingCard && (
        <section className="mx-5 pt-5 flex flex-col gap-3">
          <p className="font-subheading font-bold text-[16px] text-text-low">MÉTODO DE PAGO</p>

          <div className="w-full max-w-sm bg-linear-to-br from-surf to-surface rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 bg-linear-to-br from-orange to-accent2/70 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              
              <span className="text-white text-2xl font-heading font-extrabold tracking-wider">VISA</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between gap-3 text-white text-xl font-mono tracking-widest">
                <span>····</span>
                <span>····</span>
                <span>····</span>
                <span className="text-white/60">{getLastFourDigits()}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="font-subheading font-bold text-white/50 text-[12px] uppercase tracking-wider mb-1">
                  Titular
                </p>
                <p className="text-white text-sm font-subheading font-bold tracking-wide uppercase">
                  {cardData.holder}
                </p>
              </div>

              <div className="text-right">
                <p className="font-subheading font-bold text-white/50 text-[12px] uppercase tracking-wider mb-1">
                  Expira
                </p>
                <p className="text-white text-sm font-subheading font-bold tracking-wide">
                  {cardData.expiry}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button 
                onClick={() => setIsEditingCard(true)}
                className="flex items-center gap-2 text-accent1 text-sm font-medium hover:text-accent1/80 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Cambiar tarjeta
              </button>
            </div>
          </div>
        </section>
      )}

      {/* DATOS DE PAGO - EDITABLE */}
      {isEditingCard && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-text-low">DATOS DE PAGO</p>

          <Card>
            <div className="flex flex-col gap-3.75">
                <div className="flex flex-col gap-1.25">
                    <label className="font-subheading font-bold text-[14px] text-text-low uppercase">NÚMERO DE LA TARJETA</label>

                    <div className="flex items-center gap-5">
                        <div className="text-text-low text-[20px] flex items-center justify-center">💳</div>
                        <input 
                          type="text" 
                          placeholder="1234 5678 9101 1234" 
                          className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" 
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                        />
                    </div>           
                </div>

                <div className="w-full h-px bg-text-low"></div>

                <div className="flex flex-col gap-1.25">
                    <label className="font-subheading font-bold text-[14px] text-text-low uppercase">NOMBRE DEL TITULAR</label>

                    <div className="flex items-center gap-5">
                        <div className="text-text-low text-[20px] flex items-center justify-center">👤</div>
                        <input 
                          type="text" 
                          placeholder="Como aparece en la tarjeta" 
                          className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" 
                          value={cardData.holder}
                          onChange={(e) => handleCardInputChange('holder', e.target.value)}
                        />
                    </div>  
                </div>

                <div className="w-full h-px bg-text-low"></div>

                <div className="flex items-center justify-between gap-6.25">

                    <div className="flex flex-col gap-1.25">
                        <label className="font-subheading font-bold text-[14px] text-text-low uppercase">CADUCIDAD</label>
                        
                        <div className="flex items-center gap-5">
                            <input 
                              type="text" 
                              className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" 
                              placeholder="MM / AA"
                              value={cardData.expiry}
                              onChange={handleExpiryChange}
                              maxLength={7}
                            />
                        </div>
                    </div>
                    
                    <div className="w-px h-12.5 bg-text-low"></div>

                    <div className="flex flex-col gap-1.25">
                        <label className="font-subheading font-bold text-[14px] text-text-low uppercase">CVV 🔒</label>
                        <input 
                          type="text" 
                          placeholder="123" 
                          className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" 
                          value={cardData.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                          maxLength={3}
                        />
                    </div>
                </div>

                <button
                  onClick={() => setIsEditingCard(false)}
                  className="mt-2 w-full py-2 bg-primary rounded-lg text-text-high font-subheading font-bold text-[14px] hover:bg-primary/80 transition-colors"
                >
                  Guardar tarjeta
                </button>
            </div>
          </Card>            
        </section>
      )}

      {/* RESUMEN DE LA SUSCRIPCIÓN */}
      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-[16px] text-text-low">RESUMEN DE LA SUSCRIPCIÓN</p>

        <Card>
          <div className="flex flex-col gap-2.5">

            <div className="flex items-center justify-between">            
              <p className="font-subheading font-bold text-[16px] text-text-low">
                Plan {planData.planName} {planData.billingText}
              </p>

              <p className="font-subheading font-bold text-[16px] flex items-center justify-center text-text-high">
                {planData.price} €
              </p>
            </div>

            <div className="w-full h-px bg-text-low"></div>

            <div className="flex items-center justify-between">            
              <p className="font-subheading font-bold text-[16px] text-text-low">Prueba gratuita (7 días)</p>

              <p className="font-subheading font-bold text-[16px] flex items-center justify-center text-accent2">
                -{planData.price} €
              </p>
            </div>

            <div className="w-full h-px bg-text-low"></div>

            <div className="flex items-center justify-between">            
              <p className="font-subheading font-bold text-[16px] text-text-low">IVA (21%)</p>

              <p className="font-body text-[16px] flex items-center justify-center text-text-low">Incluido</p>
            </div>

            <div className="-mx-4 -mb-5.75 mt-3 bg-yellow-bg3 rounded-b-2xl px-3.5 py-2.5 flex items-center justify-between border border-yellow/27">
              <p className="font-heading font-semibold text-[20px] text-text-high">Hoy pagas</p>

              <p className="font-heading font-extrabold text-[18px] text-accent3">0,00 €</p>
            </div>
            
          </div>
        </Card>
      </section>

      {/* INFORMACIÓN */}
      <section className="mt-5.5 pb-5">
        <p className="font-body text-[14px] text-text-low text-center px-4">
          Al confirmar aceptas los
          <span className="text-primary"> Términos de uso </span>
          y la 
          <span className="text-primary"> Política de privacidad. </span>
          Se te cobrará 
          <span className="text-text-high"> {planData.price}€ </span>
          el <br />
          <span className="text-text-high"> {getChargeDate()} </span> 
          salvo que canceles antes del <br />fin de periodo.
        </p>
      </section>

      {/* STICKY CTA */}
      <div className="w-full px-4 fixed bottom-1 gap-2.5">
        <Button
          variant="outlined"
          text={isProcessing ? "Procesando..." : "✓ Confirmar pago"}
          bgColor={"bg-orange"}
          textColor={"text-text-high"}
          borderColor={"border-orange"}
          w="w-[100%]"
          onClick={handleConfirmPayment}
          disabled={isProcessing}
        />

        <p className="text-center mt-2 text-[11px] text-text-low font-light">
          🔒 Pago cifrado SSL · Sin compromiso
        </p>
      </div>
    </div>
  );
};

export default Checkout;