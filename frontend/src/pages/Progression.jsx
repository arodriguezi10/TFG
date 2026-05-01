import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";

const Progression = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  //const [progressions, setProgressions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState('free');

  useEffect(() => {
    if (user) {
      loadUserSubscription();
      fetchProgressions();
    }
  }, [user]);

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error cargando suscripción:', error);
        setSubscriptionTier('free');
      } else {
        setSubscriptionTier(data?.subscription_tier || 'free');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubscriptionTier('free');
    }
  };

  const fetchProgressions = async () => {
    try {
      setLoading(true);
      
      // TODO: Aquí irá la lógica para cargar progresiones desde la base de datos
      // const { data, error } = await supabase
      //   .from('progressions')
      //   .select('*')
      //   .eq('user_id', user.id);
      
      // Por ahora simular que no hay progresiones
      //setProgressions([]);
      
    } catch (error) {
      console.error('Error cargando progresiones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgression = () => {
        navigate("/createProgression");
  };

  const handleNavigateToSubscription = () => {
    navigate("/subscription");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-text-low">Cargando progresiones...</p>
      </div>
    );
  }

  // Si el usuario no es Elite, mostrar pantalla de upgrade
  if (subscriptionTier !== 'elite') {
    return (
      <div className="min-h-screen bg-background flex flex-col mb-2.5 px-4">
        <section className="w-full flex items-center justify-between">
          <div className="flex flex-col gap-1.25">
            <div className="flex gap-3.75">
              <p className="font-subheading text-[12px] text-text-low">
                Biblioteca
              </p>
            </div>

            <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
              Progresión
            </h1>
          </div>

          <button
            onClick={() => navigate('/routines1')}
            className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-low hover:bg-surface transition-colors cursor-pointer"
          >
            ←
          </button>
        </section>

        {/* TABS */}
        <section className="mt-3 w-full border-b border-text-low">
          <div className="flex gap-8">
            <button
              onClick={() => navigate('/routines1')}
              className="pb-2 font-subheading font-semibold text-[15px] transition-all text-text-low hover:text-text-high"
            >
              Rutinas
            </button>
            
            <button
              className="pb-2 font-subheading font-semibold text-[15px] transition-all text-accent1 relative"
            >
              Progresión
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent1"></div>
            </button>
          </div>
        </section>

        {/* PANTALLA DE UPGRADE */}
        <section className="mt-16 flex flex-col items-center justify-center gap-3.75 px-4">
          <div className="relative">
            <span className="bg-linear-to-br from-yellow/20 to-orange/20 h-32 w-32 rounded-[40px] font-body text-[70px] flex items-center justify-center border border-yellow/30">
              👑
            </span>
            <div className="absolute -top-2 -right-2 bg-yellow h-8 w-8 rounded-full flex items-center justify-center text-[16px] animate-pulse">
              ✨
            </div>
          </div>

          <p className="mt-2 bg-yellow-bg2 px-3.5 py-1 rounded-2xl border border-yellow font-subheading font-bold text-[14px] text-yellow">
            ◆ FUNCIÓN ÉLITE
          </p>

          <p className="font-heading font-extrabold text-[32px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
            Desbloquea la
            <span className="text-yellow">progresión automática</span>
          </p>

          <p className="font-body text-[15px] text-text-low text-center max-w-sm">
            Planifica la evolución de tus cargas semana a semana con progresiones inteligentes diseñadas por tu entrenador.
          </p>

          {/* BENEFICIOS */}
          <div className="mt-4 w-full flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent1/10 border border-accent1 flex items-center justify-center text-[18px] shrink-0">
                📈
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[15px] text-text-high mb-0.5">
                  Progresión inteligente
                </p>
                <p className="font-body text-[13px] text-text-low">
                  Incrementa peso y volumen de forma óptima cada semana
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent2/10 border border-accent2 flex items-center justify-center text-[18px] shrink-0">
                🎯
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[15px] text-text-high mb-0.5">
                  Ciclos personalizados
                </p>
                <p className="font-body text-[13px] text-text-low">
                  Crea mesociclos de 4-12 semanas adaptados a tus objetivos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent3/10 border border-accent3 flex items-center justify-center text-[18px] shrink-0">
                ⚡
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[15px] text-text-high mb-0.5">
                  Automatización completa
                </p>
                <p className="font-body text-[13px] text-text-low">
                  Olvídate de calcular, el sistema ajusta todo por ti
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA UPGRADE */}
        <section className="mt-8 flex flex-col gap-3">
          <Button
            variant="outlined"
            text="👑 Mejorar a Élite"
            bgColor={"bg-yellow"}
            textColor={"text-background"}
            borderColor={"border-yellow"}
            w="w-[100%]"
            onClick={handleNavigateToSubscription}
          />

          <button
            onClick={() => navigate('/routines1')}
            className="w-full"
          >
            <p className="font-body text-[14px] text-text-low text-center">
              Volver a rutinas
            </p>
          </button>
        </section>
      </div>
    );
  }

  // PANTALLA VACÍA (usuario Elite sin progresiones)
  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5 px-4">
      <section className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-1.25">
          <div className="flex gap-3.75">
            <p className="font-subheading text-[12px] text-text-low">
              Biblioteca
            </p>
          </div>

          <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
            Progresión
          </h1>
        </div>

        <div className="flex gap-2.5">
          <div className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-low">
            ⚙️
          </div>

          <button
            onClick={handleCreateProgression}
            className="bg-accent1 h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-high cursor-pointer hover:opacity-80 transition-opacity"
          >
            +
          </button>
        </div>
      </section>

      {/* TABS */}
      <section className="mt-3 w-full border-b border-text-low">
        <div className="flex gap-8">
          <button
            onClick={() => navigate('/routines1')}
            className="pb-2 font-subheading font-semibold text-[15px] transition-all text-text-low hover:text-text-high"
          >
            Rutinas
          </button>
          
          <button
            className="pb-2 font-subheading font-semibold text-[15px] transition-all text-accent1 relative"
          >
            Progresión
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent1"></div>
          </button>
        </div>
      </section>

      <section className="mt-2">
        <p className="font-body text-[14px] text-text-low">
          0 progresiones activas
        </p>
      </section>

      {/* EMPTY STATE */}
      <section className="mt-12.5 flex flex-col items-center justify-center gap-3.75">
        <div className="relative">
          <span className="bg-surf h-27.5 w-27.5 px-2.5 rounded-[35px] font-body text-[45px] text-accent1 flex items-center justify-center border border-accent1/20">
            📈
          </span>
          <div className="absolute -bottom-1 -right-1 bg-yellow h-9 w-9 rounded-full flex items-center justify-center text-[18px] border-2 border-background">
            ✨
          </div>
        </div>

        <p className="mt-5 bg-surf px-3.5 py-0.5 rounded-2xl border border-text-low font-subheading font-semibold text-[16px] text-text-low">
          Sin progresiones todavía
        </p>

        <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
          Crea tu primera
          <span className="text-accent1">progresión automática</span>
        </p>

        <p className="font-body text-[16px] text-text-low text-center max-w-sm">
          Diseña un plan de 4-12 semanas con incrementos automáticos de carga y volumen para maximizar tu progreso.
        </p>
      </section>

      {/* INFORMACIÓN ADICIONAL */}
      <section className="mt-8">
        <Card>
          <div className="flex items-start gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-[20px] shrink-0">
              💡
            </div>
            <div className="flex-1">
              <p className="font-heading font-bold text-[16px] text-text-high mb-1">
                ¿Cómo funciona?
              </p>
              <p className="font-body text-[13px] text-text-low leading-relaxed">
                Una progresión es un plan estructurado que incrementa automáticamente tus cargas semana a semana basándose en rutinas existentes o nuevas.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-text-low">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[14px]">📋</span>
              <p className="font-body text-[13px] text-text-low">
                <span className="text-text-high font-semibold">Paso 1:</span> Elige rutinas existentes o crea nuevas
              </p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[14px]">⏰</span>
              <p className="font-body text-[13px] text-text-low">
                <span className="text-text-high font-semibold">Paso 2:</span> Define duración del mesociclo (4-12 semanas)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px]">🎯</span>
              <p className="font-body text-[13px] text-text-low">
                <span className="text-text-high font-semibold">Paso 3:</span> Configura incrementos de peso y volumen
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="mt-7.5 flex flex-col gap-2.5">
        <Button
          variant="outlined"
          text="Crear progresión"
          bgColor={"bg-accent1"}
          textColor={"text-text-high"}
          borderColor={"border-accent1"}
          w="w-[100%]"
          onClick={handleCreateProgression}
        />
      </section>
    </div>
  );
};

export default Progression;