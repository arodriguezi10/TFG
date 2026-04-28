import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";

const Onboarding = () => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    sex: "",
    height_cm: "",
    initial_weight_kg: "",
    bio: "",
    fitness_goal: "",
    activity_level: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sex) {
      newErrors.sex = "Selecciona tu sexo";
    }

    if (!formData.height_cm || formData.height_cm < 100 || formData.height_cm > 250) {
      newErrors.height_cm = "Introduce una altura válida (100-250 cm)";
    }

    if (!formData.initial_weight_kg || formData.initial_weight_kg < 30 || formData.initial_weight_kg > 300) {
      newErrors.initial_weight_kg = "Introduce un peso válido (30-300 kg)";
    }

    if (!formData.bio || formData.bio.trim().length < 10) {
      newErrors.bio = "Escribe al menos 10 caracteres sobre ti";
    }

    if (!formData.fitness_goal) {
      newErrors.fitness_goal = "Selecciona tu objetivo";
    }

    if (!formData.activity_level) {
      newErrors.activity_level = "Selecciona tu nivel de actividad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          sex: formData.sex,
          height_cm: parseInt(formData.height_cm),
          initial_weight_kg: parseFloat(formData.initial_weight_kg),
          bio: formData.bio.trim(),
          fitness_goal: formData.fitness_goal,
          activity_level: formData.activity_level,
          onboarding_completed: true
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error guardando datos:", error);
        alert("Error al guardar tus datos. Inténtalo de nuevo.");
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading font-extrabold text-[32px] text-text-high mb-2">
            Completa tu perfil
          </h1>
          <p className="font-body text-[14px] text-text-low">
            Necesitamos estos datos para personalizar tu experiencia en FYLIOS
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* SEXO */}
            <div>
              <label className="font-subheading font-bold text-[14px] text-text-high mb-2 block">
                Sexo
              </label>
              <div className="flex gap-3">
                {["Masculino", "Femenino", "Otro"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, sex: option }))}
                    className={`flex-1 py-3 rounded-lg border font-subheading font-semibold text-[14px] transition-all ${
                      formData.sex === option
                        ? "bg-accent1 border-accent1 text-text-high"
                        : "bg-surf border-text-low text-text-low hover:border-accent1"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {errors.sex && (
                <p className="text-red text-[12px] mt-1">{errors.sex}</p>
              )}
            </div>

            {/* ALTURA */}
            <div>
              <label className="font-subheading font-bold text-[14px] text-text-high mb-2 block">
                Altura (cm)
              </label>
              <input
                type="number"
                name="height_cm"
                placeholder="178"
                value={formData.height_cm}
                onChange={handleInputChange}
                className="w-full bg-surf border border-text-low rounded-lg px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors"
              />
              {errors.height_cm && (
                <p className="text-red text-[12px] mt-1">{errors.height_cm}</p>
              )}
            </div>

            {/* PESO INICIAL */}
            <div>
              <label className="font-subheading font-bold text-[14px] text-text-high mb-2 block">
                Peso inicial (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="initial_weight_kg"
                placeholder="75.5"
                value={formData.initial_weight_kg}
                onChange={handleInputChange}
                className="w-full bg-surf border border-text-low rounded-lg px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors"
              />
              {errors.initial_weight_kg && (
                <p className="text-red text-[12px] mt-1">{errors.initial_weight_kg}</p>
              )}
            </div>

            {/* OBJETIVO FITNESS */}
            <div>
              <label className="font-subheading font-bold text-[14px] text-text-high mb-2 block">
                Objetivo principal
              </label>
              <select
                name="fitness_goal"
                value={formData.fitness_goal}
                onChange={handleInputChange}
                className="w-full bg-surf border border-text-low rounded-lg px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors"
              >
                <option value="">Selecciona tu objetivo</option>
                <option value="Volumen">Ganar músculo (Volumen)</option>
                <option value="Definición">Perder grasa (Definición)</option>
                <option value="Fuerza">Aumentar fuerza</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
              {errors.fitness_goal && (
                <p className="text-red text-[12px] mt-1">{errors.fitness_goal}</p>
              )}
            </div>

            {/* NIVEL DE ACTIVIDAD */}
            <div>
              <label className="font-subheading font-bold text-[14px] text-text-high mb-2 block">
                Nivel de actividad física
              </label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleInputChange}
                className="w-full bg-surf border border-text-low rounded-lg px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors"
              >
                <option value="">Selecciona tu nivel</option>
                <option value="Sedentario">Sedentario (poco o ningún ejercicio)</option>
                <option value="Ligero">Ligero (1-3 días/semana)</option>
                <option value="Moderado">Moderado (3-5 días/semana)</option>
                <option value="Activo">Activo (6-7 días/semana)</option>
                <option value="Muy Activo">Muy Activo (ejercicio intenso diario)</option>
              </select>
              {errors.activity_level && (
                <p className="text-red text-[12px] mt-1">{errors.activity_level}</p>
              )}
            </div>

            {/* BIO */}
            <div>
              <label className="font-subheading font-bold text-[14px] text-text-high mb-2 block">
                Cuéntanos sobre ti
              </label>
              <textarea
                name="bio"
                placeholder="Me gusta entrenar porque..."
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-surf border border-text-low rounded-lg px-4 py-3 text-text-high font-body text-[14px] outline-none focus:border-accent1 transition-colors resize-none"
              />
              {errors.bio && (
                <p className="text-red text-[12px] mt-1">{errors.bio}</p>
              )}
            </div>

            <Button
              variant="outlined"
              text={loading ? "Guardando..." : "Completar perfil"}
              bgColor="bg-accent1"
              textColor="text-text-high"
              borderColor="border-accent1"
              w="w-full"
              onClick={handleSubmit}
              disabled={loading}
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;