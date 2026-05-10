import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { ChevronLeft, Moon, Zap, Wind, Bone, Brain, MessageCircle, Send } from "lucide-react";
import Card from "../components/Card";

const MeasurementInput = ({ label, value, onChange, unit, placeholder }) => (
  <div className="flex flex-col gap-1 flex-1 min-w-0">
    <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">{label}</p>
    <div className="flex items-center gap-2">
      <input type="text" inputMode="decimal" placeholder={placeholder} value={value}
        onChange={(e) => { const val = e.target.value.replace(",", "."); if (val === "" || /^\d*\.?\d*$/.test(val)) onChange(val); }}
        className="min-w-0 w-full bg-background border border-text-low rounded-xl px-2 py-2 font-heading font-bold text-[18px] text-text-high outline-none focus:border-primary transition-colors text-center" />
      <span className="font-body text-[12px] text-text-low shrink-0">{unit}</span>
    </div>
  </div>
);

const NumberSelector = ({ value, onChange, color = "#ff6b9d" }) => (
  <div className="flex gap-1.5 flex-wrap">
    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
      <button key={num} onClick={() => onChange(num)} className="h-8 w-8 rounded-full font-heading font-bold text-[13px] border transition-all"
        style={{ backgroundColor: value === num ? color : "transparent", borderColor: value === num ? color : "#6b6b8a", color: value === num ? "#fff" : "#6b6b8a" }}>
        {num}
      </button>
    ))}
  </div>
);

const OptionSelector = ({ options, value, onChange, color = "#36d9b8" }) => (
  <div className="flex gap-2 flex-wrap">
    {options.map((opt) => (
      <button key={opt} onClick={() => onChange(opt)} className="px-3 py-1 rounded-full font-subheading font-bold text-[13px] border transition-all"
        style={{ backgroundColor: value === opt ? `${color}20` : "transparent", borderColor: value === opt ? color : "#6b6b8a", color: value === opt ? color : "#6b6b8a" }}>
        {opt}
      </button>
    ))}
  </div>
);

const DailyRegisterDesktop = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [saving, setSaving] = useState(false);
  const [bodyFat, setBodyFat] = useState("");
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [arm, setArm] = useState("");
  const [leg, setLeg] = useState("");
  const [sleepQuality, setSleepQuality] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(null);
  const [muscleFatigue, setMuscleFatigue] = useState(null);
  const [jointPain, setJointPain] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [trainerNote, setTrainerNote] = useState("");

  const handleSave = async () => {
    if (!sleepQuality || !energyLevel) { alert("Por favor rellena al menos la calidad del sueno y el nivel de energia"); return; }
    setSaving(true);
    try {
      const d = new Date();
      const day = d.getDay();
      const diff = d.getDate() - (day === 0 ? 6 : day - 1);
      d.setDate(diff);
      const weekStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const { data: existing } = await supabase.from("daily_checkins").select("id").eq("user_id", user.id).eq("checkin_date", weekStart).maybeSingle();

      const payload = { user_id: user.id, checkin_date: weekStart, sleep_quality: sleepQuality, energy_level: energyLevel, muscle_fatigue: muscleFatigue, joint_pain: jointPain, stress_level: stressLevel, trainer_note: trainerNote || null, body_fat_pct: bodyFat ? parseFloat(bodyFat) : null, waist_cm: waist ? parseFloat(waist) : null, chest_cm: chest ? parseFloat(chest) : null, arm_cm: arm ? parseFloat(arm) : null, leg_cm: leg ? parseFloat(leg) : null };

      if (existing) { await supabase.from("daily_checkins").update(payload).eq("id", existing.id); }
      else { await supabase.from("daily_checkins").insert(payload); }

      alert("Registro guardado correctamente");
      navigate(-1);
    } catch (err) { console.error("Error guardando checkin:", err); alert("Error al guardar"); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Progreso · Cuerpo</p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high">Registro semanal</h1>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="px-8 py-3 rounded-2xl font-heading font-bold text-[15px] text-background flex items-center gap-2 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #ff6b9d, #f5a623)" }}>
          {saving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-background" /> : <><Send size={16} /> Guardar</>}
        </button>
      </div>

      <div className="flex-1 px-8 py-6 grid grid-cols-2 gap-6">

        {/* COLUMNA IZQUIERDA — MEDIDAS */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Medidas corporales</p>

            <div className="mb-4">
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">% Grasa corporal</p>
              <input type="text" inputMode="decimal" placeholder="14.5" value={bodyFat}
                onChange={(e) => { const val = e.target.value.replace(",", "."); if (val === "" || /^\d*\.?\d*$/.test(val)) setBodyFat(val); }}
                className="w-full bg-background border border-text-low rounded-xl py-3 font-heading font-bold text-[28px] text-text-high outline-none focus:border-primary transition-colors text-center mb-3" />
              <p className="font-subheading text-[11px] text-text-low mb-2">Seleccion rapida orientativa:</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Atletico", range: "8-12%", value: "10" },
                  { label: "Fitness", range: "12-18%", value: "15" },
                  { label: "Normal", range: "18-25%", value: "21" },
                  { label: "Alto", range: "25%+", value: "27" },
                ].map((opt) => (
                  <button key={opt.label} onClick={() => setBodyFat(opt.value)}
                    className={`px-3 py-1.5 rounded-xl border font-subheading font-bold text-[11px] transition-all ${bodyFat === opt.value ? "bg-primary/10 border-primary text-primary" : "bg-background border-text-low text-text-low"}`}>
                    {opt.label}<span className="block font-body text-[10px] opacity-70">{opt.range}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-text-low/20 mb-4" />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <MeasurementInput label="Cintura" value={waist} onChange={setWaist} unit="cm" placeholder="81" />
              <MeasurementInput label="Pecho" value={chest} onChange={setChest} unit="cm" placeholder="100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MeasurementInput label="Brazo" value={arm} onChange={setArm} unit="cm" placeholder="35" />
              <MeasurementInput label="Pierna" value={leg} onChange={setLeg} unit="cm" placeholder="55" />
            </div>
          </Card>

          {/* NOTA AL ENTRENADOR */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={16} className="text-text-low" />
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Nota al entrenador</p>
            </div>
            <textarea placeholder="Como te has sentido esta semana? Alguna molestia, cambio en el plan de alimentacion o algo que tu entrenador deba saber?"
              value={trainerNote} onChange={(e) => setTrainerNote(e.target.value)} rows={5}
              className="w-full bg-background border border-text-low rounded-xl px-4 py-3 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors resize-none placeholder:text-text-low/50" />
          </Card>
        </div>

        {/* COLUMNA DERECHA — SENSACIONES */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Sensaciones de la semana</p>
            <div className="flex flex-col divide-y divide-text-low/20">

              <div className="pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Moon size={16} className="text-primary" />
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Calidad del sueno</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">{sleepQuality || "--"}<span className="font-body text-[14px] text-text-low">/10</span></p>
                </div>
                <NumberSelector value={sleepQuality} onChange={setSleepQuality} color="#ff6b9d" />
              </div>

              <div className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className="text-orange" />
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Nivel de energia</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">{energyLevel || "--"}<span className="font-body text-[14px] text-text-low">/10</span></p>
                </div>
                <NumberSelector value={energyLevel} onChange={setEnergyLevel} color="#36d9b8" />
              </div>

              <div className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wind size={16} className="text-accent2" />
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Fatiga muscular</p>
                </div>
                <OptionSelector options={["Ninguna", "Baja", "Media", "Alta"]} value={muscleFatigue} onChange={setMuscleFatigue} color="#36d9b8" />
              </div>

              <div className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bone size={16} className="text-text-low" />
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Molestias articulares</p>
                </div>
                <OptionSelector options={["Ninguna", "Leves", "Severas"]} value={jointPain} onChange={setJointPain} color="#36d9b8" />
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={16} className="text-red" />
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Estres percibido</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">{stressLevel || "--"}<span className="font-body text-[14px] text-text-low">/10</span></p>
                </div>
                <NumberSelector value={stressLevel} onChange={setStressLevel} color="#f5a623" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyRegisterDesktop;