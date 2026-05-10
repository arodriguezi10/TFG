import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";
import { Dumbbell, Users, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OnboardingDesktop = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    sex: "", height_cm: "", initial_weight_kg: "",
    bio: "", fitness_goal: "", activity_level: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sex) newErrors.sex = "Selecciona tu sexo";
    if (!formData.height_cm || formData.height_cm < 100 || formData.height_cm > 250) newErrors.height_cm = "Altura valida (100-250 cm)";
    if (!formData.initial_weight_kg || formData.initial_weight_kg < 30 || formData.initial_weight_kg > 300) newErrors.initial_weight_kg = "Peso valido (30-300 kg)";
    if (!formData.bio || formData.bio.trim().length < 10) newErrors.bio = "Al menos 10 caracteres";
    if (!formData.fitness_goal) newErrors.fitness_goal = "Selecciona tu objetivo";
    if (!formData.activity_level) newErrors.activity_level = "Selecciona tu nivel";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleSubmit = async () => {
        if (!role) return;
    setStep(2); // siempre va al paso 2
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);
  try {
    await supabase.from("users").update({
      role: role, // guarda el rol elegido (athlete o coach)
      sex: formData.sex,
      height_cm: parseInt(formData.height_cm),
      initial_weight_kg: parseFloat(formData.initial_weight_kg),
      bio: formData.bio.trim(),
      fitness_goal: formData.fitness_goal,
      activity_level: formData.activity_level,
      onboarding_completed: true
    }).eq("id", user.id);

    // Redirige según el rol
    navigate(role === "coach" ? "/coach" : "/dashboard", { replace: true });
  } catch (err) { console.error(err); alert("Error inesperado."); }
  finally { setLoading(false); }
};
  // PASO 1 — ROL
  if (step === 1) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* IZQUIERDA — BRANDING */}
        <div className="w-1/2 bg-surf border-r border-text-low/20 flex flex-col items-center justify-center p-12">
          <div className="bg-accent1 h-20 w-20 rounded-3xl flex items-center justify-center font-heading font-extrabold text-[40px] text-text-high mb-6">F</div>
          <h1 className="font-heading font-extrabold text-[40px] text-text-high mb-3 text-center">Bienvenido a FYLIOS</h1>
          <p className="font-body text-[16px] text-text-low text-center max-w-sm">La plataforma de entrenamiento que conecta atletas y entrenadores</p>

          <div className="mt-12 flex flex-col gap-4 w-full max-w-sm">
            {[
              "Registro de entrenamientos y progreso",
              "Planificacion de mesociclos",
              "Analisis de volumen y fatiga",
              "Conexion con tu entrenador",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-primary shrink-0" />
                <p className="font-body text-[14px] text-text-low">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DERECHA — SELECCION ROL */}
        <div className="w-1/2 flex flex-col items-center justify-center p-12">
          <div className="w-full max-w-md">
            <h2 className="font-heading font-extrabold text-[28px] text-text-high mb-2">Como vas a usar FYLIOS?</h2>
            <p className="font-body text-[14px] text-text-low mb-8">Selecciona tu rol para personalizar tu experiencia</p>

            <div className="flex flex-col gap-4 mb-8">
              <button onClick={() => setRole("athlete")}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-5 ${role === "athlete" ? "bg-primary/10 border-primary" : "bg-surf border-text-low hover:border-primary/50"}`}>
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${role === "athlete" ? "bg-primary" : "bg-background border border-text-low"}`}>
                  <Dumbbell size={26} className={role === "athlete" ? "text-text-high" : "text-text-low"} />
                </div>
                <div>
                  <p className="font-heading font-bold text-[20px] text-text-high">Soy atleta</p>
                  <p className="font-body text-[14px] text-text-low">Quiero entrenar, registrar mi progreso y mejorar</p>
                </div>
                {role === "athlete" && <CheckCircle2 size={20} className="text-primary ml-auto shrink-0" />}
              </button>

              <button onClick={() => setRole("coach")}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-5 ${role === "coach" ? "bg-orange-bg2 border-orange" : "bg-surf border-text-low hover:border-orange/50"}`}>
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${role === "coach" ? "bg-orange" : "bg-background border border-text-low"}`}>
                  <Users size={26} className={role === "coach" ? "text-text-high" : "text-text-low"} />
                </div>
                <div>
                  <p className="font-heading font-bold text-[20px] text-text-high">Soy entrenador</p>
                  <p className="font-body text-[14px] text-text-low">Quiero supervisar y gestionar a mis atletas</p>
                </div>
                {role === "coach" && <CheckCircle2 size={20} className="text-orange ml-auto shrink-0" />}
              </button>
            </div>

            <Button variant="outlined" text={loading ? "Cargando..." : "Continuar"} bgColor="bg-accent1" textColor="text-text-high" borderColor="border-accent1" w="w-full" onClick={handleRoleSubmit} disabled={!role || loading} />
          </div>
        </div>
      </div>
    );
  }

  // PASO 2 — DATOS ATLETA
  return (
    <div className="min-h-screen bg-background flex">
      {/* IZQUIERDA — INFO */}
      <div className="w-1/2 bg-surf border-r border-text-low/20 flex flex-col items-center justify-center p-12">
        <div className="bg-primary h-16 w-16 rounded-2xl flex items-center justify-center mb-6">
          <Dumbbell size={32} className="text-text-high" />
        </div>
        <h2 className="font-heading font-extrabold text-[32px] text-text-high mb-3 text-center">Perfil de atleta</h2>
        <p className="font-body text-[15px] text-text-low text-center max-w-sm mb-10">Estos datos nos permiten personalizar tu experiencia y darte recomendaciones precisas</p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {[
            { title: "Calculos precisos", desc: "Usamos tu altura y peso para calcular volumenes y cargas optimas" },
            { title: "Objetivos personalizados", desc: "Tu goal define como se estructuran tus entrenamientos" },
            { title: "Seguimiento real", desc: "Comparamos tu progreso con tu punto de partida" },
          ].map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-subheading font-bold text-[14px] text-text-high">{title}</p>
                <p className="font-body text-[12px] text-text-low">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DERECHA — FORMULARIO */}
      <div className="w-1/2 overflow-y-auto flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="font-heading font-extrabold text-[28px] text-text-high mb-6">Completa tu perfil</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide block mb-2">Sexo</label>
              <div className="flex gap-3">
                {["Masculino", "Femenino", "Otro"].map((option) => (
                  <button key={option} type="button" onClick={() => setFormData(prev => ({ ...prev, sex: option }))}
                    className={`flex-1 py-3 rounded-xl border font-subheading font-semibold text-[14px] transition-all ${formData.sex === option ? "bg-accent1 border-accent1 text-text-high" : "bg-surf border-text-low text-text-low hover:border-accent1"}`}>
                    {option}
                  </button>
                ))}
              </div>
              {errors.sex && <p className="text-red text-[12px] mt-1">{errors.sex}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide block mb-2">Altura (cm)</label>
                <input type="number" name="height_cm" placeholder="178" value={formData.height_cm} onChange={handleInputChange}
                  className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors" />
                {errors.height_cm && <p className="text-red text-[12px] mt-1">{errors.height_cm}</p>}
              </div>
              <div>
                <label className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide block mb-2">Peso (kg)</label>
                <input type="number" step="0.1" name="initial_weight_kg" placeholder="75.5" value={formData.initial_weight_kg} onChange={handleInputChange}
                  className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors" />
                {errors.initial_weight_kg && <p className="text-red text-[12px] mt-1">{errors.initial_weight_kg}</p>}
              </div>
            </div>

            <div>
              <label className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide block mb-2">Objetivo principal</label>
              <select name="fitness_goal" value={formData.fitness_goal} onChange={handleInputChange}
                className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors">
                <option value="">Selecciona tu objetivo</option>
                <option value="Volumen">Ganar musculo (Volumen)</option>
                <option value="Definicion">Perder grasa (Definicion)</option>
                <option value="Fuerza">Aumentar fuerza</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
              {errors.fitness_goal && <p className="text-red text-[12px] mt-1">{errors.fitness_goal}</p>}
            </div>

            <div>
              <label className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide block mb-2">Nivel de actividad</label>
              <select name="activity_level" value={formData.activity_level} onChange={handleInputChange}
                className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors">
                <option value="">Selecciona tu nivel</option>
                <option value="Sedentario">Sedentario (poco o ningun ejercicio)</option>
                <option value="Ligero">Ligero (1-3 dias/semana)</option>
                <option value="Moderado">Moderado (3-5 dias/semana)</option>
                <option value="Activo">Activo (6-7 dias/semana)</option>
                <option value="Muy Activo">Muy Activo (ejercicio intenso diario)</option>
              </select>
              {errors.activity_level && <p className="text-red text-[12px] mt-1">{errors.activity_level}</p>}
            </div>

            <div>
              <label className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide block mb-2">Cuentanos sobre ti</label>
              <textarea name="bio" placeholder="Me gusta entrenar porque..." value={formData.bio} onChange={handleInputChange} rows="4"
                className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors resize-none" />
              {errors.bio && <p className="text-red text-[12px] mt-1">{errors.bio}</p>}
            </div>

            <Button variant="outlined" text={loading ? "Guardando..." : "Completar perfil"} bgColor="bg-accent1" textColor="text-text-high" borderColor="border-accent1" w="w-full" onClick={handleSubmit} disabled={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDesktop;