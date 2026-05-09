import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";
import { Zap, Info, AlertCircle, ChevronLeft } from "lucide-react";

const MUSCLES = ["Pecho", "Espalda", "Hombro", "Biceps", "Triceps", "Cuadriceps", "Femoral", "Gluteo", "Gemelo", "Core"];
const EQUIPMENT = ["Peso libre", "Maquina", "Polea", "Peso corporal", "Bandas"];

const CreatePersonalExerciseDesktop = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({ name: "", muscleGroup: "", equipment: "", difficulty: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!formData.name.trim()) { setError("El nombre del ejercicio es obligatorio"); return; }
    if (!formData.muscleGroup) { setError("Selecciona un grupo muscular"); return; }
    if (!formData.equipment) { setError("Selecciona el tipo de equipamiento"); return; }
    if (!formData.difficulty) { setError("Selecciona el nivel de dificultad"); return; }

    try {
      setLoading(true); setError("");
      const { error: insertError } = await supabase.from("exercises").insert([{
        name: formData.name.trim(), muscle_group: formData.muscleGroup,
        equipment: formData.equipment, difficulty_level: formData.difficulty,
        is_custom: true, user_id: user.id,
      }]).select();
      if (insertError) { setError("Error al guardar el ejercicio"); return; }
      navigate(-1);
    } catch { setError("Error inesperado"); }
    finally { setLoading(false); }
  };

  const btnActive = (active) => `px-3 py-1.5 rounded-xl border font-body text-[14px] transition-colors ${active ? "bg-primary-bg border-primary text-primary" : "bg-surf border-text-low text-text-low hover:bg-primary-bg hover:border-primary hover:text-primary"}`;
  const diffBg = (d) => d === "Principiante" ? "bg-green-bg2 border-accent2 text-accent2" : d === "Intermedio" ? "bg-orange-bg2 border-orange text-orange" : "bg-accent1-bg1 border-accent1 text-accent1";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Ejercicios</p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high leading-tight">Crear ejercicio</h1>
          </div>
        </div>
        <Button variant="outlined" text={loading ? "Guardando..." : "Guardar ejercicio"} bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-auto px-6" onClick={handleSubmit} disabled={loading} />
      </div>

      {error && (
        <div className="mx-8 mt-4 rounded-2xl bg-red/10 border border-red p-3.5 flex items-center gap-2">
          <AlertCircle size={16} className="text-red shrink-0" />
          <p className="font-body text-[13px] text-red">{error}</p>
        </div>
      )}

      {/* CONTENIDO DOS COLUMNAS */}
      <div className="flex-1 px-8 py-6 grid grid-cols-2 gap-8">

        {/* COLUMNA IZQUIERDA — FORMULARIO */}
        <div className="flex flex-col gap-5">

          {/* NOMBRE */}
          <div>
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Nombre del ejercicio</p>
            <Card>
              <input
                type="text"
                placeholder="Ej: Press inclinado con mancuernas"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full font-body text-[16px] text-text-high bg-transparent border-none outline-none placeholder-text-low"
              />
            </Card>
          </div>

          {/* GRUPO MUSCULAR */}
          <div>
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Grupo muscular principal</p>
            <Card>
              <div className="flex gap-2 flex-wrap">
                {MUSCLES.map(m => <button key={m} onClick={() => setFormData({ ...formData, muscleGroup: m })} className={btnActive(formData.muscleGroup === m)}>{m}</button>)}
              </div>
            </Card>
          </div>

          {/* EQUIPAMIENTO */}
          <div>
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Tipo de equipamiento</p>
            <Card>
              <div className="flex gap-2 flex-wrap">
                {EQUIPMENT.map(e => <button key={e} onClick={() => setFormData({ ...formData, equipment: e })} className={btnActive(formData.equipment === e)}>{e}</button>)}
              </div>
            </Card>
          </div>

          {/* DIFICULTAD */}
          <div>
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Nivel de dificultad</p>
            <Card>
              <div className="flex gap-3">
                {["Principiante", "Intermedio", "Avanzado"].map(d => (
                  <button key={d} onClick={() => setFormData({ ...formData, difficulty: d })} className={`flex-1 px-3 py-2.5 rounded-xl border font-body text-[14px] transition-colors ${formData.difficulty === d ? diffBg(d) : "bg-surf border-text-low text-text-low hover:bg-surf/50"}`}>{d}</button>
                ))}
              </div>
            </Card>
          </div>

          {/* INFO */}
          <div className="rounded-2xl bg-primary-bg/50 border border-primary/30 p-4 flex items-start gap-3">
            <Info size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="font-body text-[13px] text-text-low leading-relaxed">Los ejercicios personalizados se guardan en tu biblioteca y solo estaran disponibles para ti. Podras editarlos o eliminarlos en cualquier momento.</p>
          </div>
        </div>

        {/* COLUMNA DERECHA — PREVIEW */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-3">Vista previa</p>
            <Card>
              {formData.name ? (
                <div className="flex items-center gap-3">
                  <span className="bg-primary-bg h-14 w-14 rounded-xl border border-primary text-primary flex items-center justify-center shrink-0">
                    <Zap size={24} className="text-orange" />
                  </span>
                  <div className="flex flex-col">
                    <p className="font-subheading font-bold text-[18px] text-text-high">{formData.name}</p>
                    <p className="font-body text-[13px] text-text-low">{formData.muscleGroup || "Grupo muscular"} · {formData.equipment || "Equipamiento"}</p>
                    <div className="mt-1 flex gap-1.5">
                      {formData.difficulty && <span className={`px-2.5 rounded-2xl border font-body text-[12px] ${diffBg(formData.difficulty)}`}>{formData.difficulty}</span>}
                      <span className="bg-surface px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">Personalizado</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <span className="bg-primary-bg h-16 w-16 rounded-2xl border border-primary/30 text-primary/30 flex items-center justify-center">
                    <Zap size={28} />
                  </span>
                  <p className="font-body text-[14px] text-text-low text-center">Rellena el formulario para ver la vista previa</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePersonalExerciseDesktop;