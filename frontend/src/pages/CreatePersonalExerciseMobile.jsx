import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import { Zap, Info, AlertCircle } from "lucide-react";

const MUSCLES = ["Pecho", "Espalda", "Hombro", "Biceps", "Triceps", "Cuadriceps", "Femoral", "Gluteo", "Gemelo", "Core"];
const EQUIPMENT = ["Peso libre", "Maquina", "Polea", "Peso corporal", "Bandas"];

const CreatePersonalExerciseMobile = () => {
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

  const btnMuscle = (val, active) => `px-3 py-1.5 rounded-2xl border font-body text-[14px] transition-colors ${active ? "bg-primary-bg border-primary text-primary" : "bg-surf border-text-low text-text-low"}`;
  const diffBg = (d) => d === "Principiante" ? "bg-green-bg2 border-accent2 text-accent2" : d === "Intermedio" ? "bg-orange-bg2 border-orange text-orange" : "bg-accent1-bg1 border-accent1 text-accent1";

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <section className="w-full">
        <Header showback subtitle="Ejercicios" title="Crear ejercicio" />
      </section>

      {error && (
        <section className="mt-4 w-full px-4">
          <div className="rounded-2xl bg-red/10 border border-red p-3.5 flex items-center gap-2">
            <AlertCircle size={16} className="text-red shrink-0" />
            <p className="font-body text-[13px] text-red">{error}</p>
          </div>
        </section>
      )}

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <Card>
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[14px] text-text-low uppercase tracking-wide">Nombre del ejercicio</label>
              <Input variant="outlined" type="text" name="name" placeholder="Ej: Press inclinado con mancuernas" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="w-full h-px bg-border" />

            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[14px] text-text-low uppercase">Grupo muscular principal</label>
              <div className="flex gap-2 flex-wrap">
                {MUSCLES.map(m => <button key={m} onClick={() => setFormData({ ...formData, muscleGroup: m })} className={btnMuscle(m, formData.muscleGroup === m)}>{m}</button>)}
              </div>
            </div>

            <div className="w-full h-px bg-border" />

            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[14px] text-text-low uppercase">Tipo de equipamiento</label>
              <div className="flex gap-2 flex-wrap">
                {EQUIPMENT.map(e => <button key={e} onClick={() => setFormData({ ...formData, equipment: e })} className={btnMuscle(e, formData.equipment === e)}>{e}</button>)}
              </div>
            </div>

            <div className="w-full h-px bg-border" />

            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[14px] text-text-low uppercase">Nivel de dificultad</label>
              <div className="flex gap-2">
                {["Principiante", "Intermedio", "Avanzado"].map(d => (
                  <button key={d} onClick={() => setFormData({ ...formData, difficulty: d })} className={`flex-1 px-3 py-2 rounded-2xl border font-body text-[14px] transition-colors ${formData.difficulty === d ? diffBg(d) : "bg-surf border-text-low text-text-low"}`}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-4 w-full px-4">
        <div className="rounded-2xl bg-primary-bg/50 border border-primary/30 p-3.5 flex items-start gap-3">
          <Info size={20} className="text-primary shrink-0" />
          <p className="font-body text-[13px] text-text-low leading-relaxed">Los ejercicios personalizados se guardan en tu biblioteca y solo estaran disponibles para ti.</p>
        </div>
      </section>

      {formData.name && (
        <section className="mt-4 w-full px-4 pb-20">
          <p className="font-subheading font-bold text-[14px] text-text-low mb-2.5 uppercase">Vista previa</p>
          <Card>
            <div className="flex items-center gap-2.5">
              <span className="bg-primary-bg h-12.5 w-12.5 rounded-xl border border-primary text-primary flex items-center justify-center">
                <Zap size={20} className="text-orange" />
              </span>
              <div className="flex flex-col">
                <p className="font-subheading font-bold text-[16px] text-text-high">{formData.name}</p>
                <p className="font-body text-[12px] text-text-low">{formData.muscleGroup || "Grupo muscular"} · {formData.equipment || "Equipamiento"}</p>
                <div className="mt-0.75 flex gap-1.5">
                  {formData.difficulty && <span className={`px-2.5 rounded-2xl border font-body text-[12px] ${diffBg(formData.difficulty)}`}>{formData.difficulty}</span>}
                  <span className="bg-surface px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">Personalizado</span>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      <section className="mt-4 w-full px-4 fixed bottom-1">
        <Button variant="outlined" text={loading ? "Guardando..." : "Guardar ejercicio"} bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-full" onClick={handleSubmit} disabled={loading} />
      </section>
    </div>
  );
};

export default CreatePersonalExerciseMobile;