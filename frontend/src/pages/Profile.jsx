import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [userData, setUserData] = useState({
    fullName: "",
    subscription_tier: "free",
    height_cm: null,
    initial_weight_kg: null,
    age: null,
    fitness_goal: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const loadUserData = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('first_name, last_name, subscription_tier, height_cm, initial_weight_kg, fitness_goal')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error cargando datos del usuario:', userError);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('birth_date')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error cargando perfil del usuario:', profileError);
      }

      const firstName = userData?.first_name || "";
      const lastName = userData?.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim() || "Usuario";
      const age = calculateAge(profileData?.birth_date);

      setUserData({
        fullName: fullName,
        subscription_tier: userData?.subscription_tier || "free",
        height_cm: userData?.height_cm || null,
        initial_weight_kg: userData?.initial_weight_kg || null,
        age: age,
        fitness_goal: userData?.fitness_goal || "Volumen"
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeByTier = (tier) => {
    switch (tier) {
      case 'elite':
        return {
          icon: '👑',
          text: 'Atleta Elite',
          bgColor: 'bg-accent1-bg1',
          borderColor: 'border-accent1',
          textColor: 'text-accent1'
        };
      case 'pro':
        return {
          icon: '⭐',
          text: 'Atleta Pro',
          bgColor: 'bg-primary-bg',
          borderColor: 'border-primary',
          textColor: 'text-primary'
        };
      case 'free':
      default:
        return {
          icon: '🌱',
          text: 'Atleta Free',
          bgColor: 'bg-surf',
          borderColor: 'border-text-low',
          textColor: 'text-text-low'
        };
    }
  };

  const getGoalEmoji = (goal) => {
    switch (goal) {
      case 'Volumen':
        return '🔥';
      case 'Definición':
        return '⚡';
      case 'Fuerza':
        return '💪';
      case 'Mantenimiento':
        return '✨';
      default:
        return '🔥';
    }
  };

  const formatWeight = (weight) => {
    if (!weight) return { integer: '--', decimal: '--' };
    const integerPart = Math.floor(weight);
    const decimalPart = ((weight % 1) * 100).toFixed(0).padStart(2, '0');
    return { integer: integerPart, decimal: decimalPart };
  };

  const badge = getBadgeByTier(userData.subscription_tier);
  const weightFormatted = formatWeight(userData.initial_weight_kg);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-text-low">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <Header 
        showback 
        onBackClick={() => navigate("/dashboard")}
      />

      <section className="mt-2.5 flex flex-col items-center justify-center gap-3.75">
        <span className="bg-accent1 h-27.5 w-27.5 px-2.5 rounded-[35px] font-heading font-bold text-[50px] text-primary flex items-center justify-center">
          {userData.fullName.charAt(0).toUpperCase()}
        </span>

        <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
          {userData.fullName}                 
        </p>

        <div className="flex gap-2.5">
          <span className={`${badge.bgColor} h-7.5 py-0.5 px-3 rounded-2xl border ${badge.borderColor} text-[16px] ${badge.textColor} font-subheading font-semibold`}>
            {badge.icon} {badge.text}
          </span>
          <span className="bg-orange-bg4 h-7.5 py-0.5 px-3 rounded-2xl border border-orange text-[16px] text-orange font-subheading font-semibold ">
            {getGoalEmoji(userData.fitness_goal)} {userData.fitness_goal}
          </span>
        </div>
      </section>

      <section className="mt-4 flex flex-col px-4 gap-4">
        <div className="flex gap-3.75">
          <Card>
            <div className="flex flex-col h-auto ">
                <div className="bg-surface h-10 w-10 rounded-lg text-text-low items-center flex justify-center">📋</div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-2.5">PLANIFICACIÓN</p>
                <p className="font-heading font-semibold text-primary text-[20px] mt-1.25">Microciclo 2</p>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-1.25">8 días / 2 sem.</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col h-auto">
                <div className="bg-brown-bg2 h-10 w-10 rounded-lg text-brown flex items-center justify-center">⚖️</div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-2.5">PESO INICIAL</p>
                <div className="flex items-baseline gap-1 mt-1.25">
                  <p className="font-heading font-semibold text-accent1 text-[20px] leading-none">
                    {weightFormatted.integer}
                  </p>
                  <p className="font-heading font-semibold text-accent1 text-[14px] leading-none">
                    ,{weightFormatted.decimal}
                  </p>
                </div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-1.25">kg · hace 6 m.</p>
            </div>
          </Card>
        </div>
        <div className="flex gap-3.75">
          <Card>
            <div className="flex flex-col h-auto ">
                <div className="bg-accent2-bg1 h-10 w-10 rounded-lg text-accent2 flex items-center justify-center">📏</div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-2.5">ALTURA</p>
                <p className="font-heading font-semibold text-accent2 text-[20px] mt-1.25">
                  {userData.height_cm || '--'}
                </p>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-1.25">cm</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col h-auto">
                <div className="bg-orange-bg4 h-10 w-10 rounded-lg text-orange flex items-center justify-center">🎂</div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-2.5">EDAD</p>
                <p className="font-heading font-semibold text-orange text-[20px] mt-1.25">
                  {userData.age || '--'}
                </p>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-1.25">años</p>
            </div>
          
          </Card>
        </div>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">

        <Card>
          <div className="flex flex-col gap-3.75">
            <button 
              onClick={() => navigate("/personalSettings")}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center justify-center">
                  <div className="bg-primary-bg h-10 w-10 rounded-lg text-primary flex items-center justify-center">⚙️</div>

                  <div className="flex flex-col text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">Ajustes y datos personales</p>

                    <p className="font-subheading font-bold text-[16px] text-text-low">Edita tu foto y tus datos</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.75 text-text-low">
                      →
                </div>
              </div>
            </button>

            <div className="w-full h-px bg-text-low"></div>

            <button 
              onClick={() => navigate("#")}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center justify-center">
                  <div className="bg-primary-bg h-10 w-10 rounded-lg text-yellow flex items-center justify-center">⭐</div>

                  <div className="flex flex-col text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">Suscripción y pagos</p>

                    <p className="font-subheading font-bold text-[16px] text-text-low">
                      Plan {userData.subscription_tier === 'elite' ? 'Elite' : userData.subscription_tier === 'pro' ? 'Pro' : 'Free'} · Activo
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.75 text-text-low">
                      →
                </div>
              </div>
            </button>

            <div className="w-full h-px bg-text-low"></div>

            <button 
              onClick={() => navigate("#")}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center justify-center">
                  <div className="bg-primary-bg h-10 w-10 rounded-lg text-accent2 flex items-center justify-center">💬</div>

                  <div className="flex flex-col text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">Soporte / Ayuda</p>

                    <p className="font-subheading font-bold text-[16px] text-text-low">FAQ y contacto</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.75 text-text-low">
                      →
                </div>
              </div>
            </button>
          </div>
        </Card>

        <Card>
          <button className="w-full">
              <div className="flex items-center justify-between">  
                  <div className="flex gap-5 items-center justify-center">
                      <div className="bg-red-bg1 h-10 w-10 rounded-lg text-red flex items-center justify-center">
                          🚪
                      </div>

                      <div className="flex flex-col text-left">
                          <p className="font-heading font-semibold text-[20px] text-red">
                              Cerrar sesión
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-3.75 text-red">
                      →
                  </div>      
              </div>
          </button>
        </Card>
      </section>
    </div>
  );
};

export default Profile;