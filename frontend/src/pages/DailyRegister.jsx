import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";

const getLocalDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const DailyRegister = () => {
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
    if (!sleepQuality || !energyLevel) {
      alert("Por favor rellena al menos la calidad del sueño y el nivel de energía");
      return;
    }
    setSaving(true);
    try {
      const todayDate = getLocalDate();
      const { data: existing } = await supabase
        .from("daily_checkins")
        .select("id")
        .eq("user_id", user.id)
        .eq("checkin_date", todayDate)
        .single();

      const payload = {
        user_id: user.id,
        checkin_date: todayDate,
        sleep_quality: sleepQuality,
        energy_level: energyLevel,
        muscle_fatigue: muscleFatigue,
        joint_pain: jointPain,
        stress_level: stressLevel,
        trainer_note: trainerNote || null,
        body_fat_pct: bodyFat ? parseFloat(bodyFat) : null,
        waist_cm: waist ? parseFloat(waist) : null,
        chest_cm: chest ? parseFloat(chest) : null,
        arm_cm: arm ? parseFloat(arm) : null,
        leg_cm: leg ? parseFloat(leg) : null,
      };

      if (existing) {
        await supabase.from("daily_checkins").update(payload).eq("id", existing.id);
      } else {
        await supabase.from("daily_checkins").insert(payload);
      }

      alert("✅ Registro guardado correctamente");
      navigate(-1);
    } catch (err) {
      console.error("Error guardando checkin:", err);
      alert("❌ Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const NumberSelector = ({ value, onChange, color = "#ff6b9d" }) => (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className="h-8 w-8 rounded-full font-heading font-bold text-[14px] border transition-all"
          style={{
            backgroundColor: value === num ? color : "transparent",
            borderColor: value === num ? color : "#6b6b8a",
            color: value === num ? "#fff" : "#6b6b8a",
          }}
        >
          {num}
        </button>
      ))}
    </div>
  );

  const OptionSelector = ({ options, value, onChange, color = "#36d9b8" }) => (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-3 py-1 rounded-full font-subheading font-bold text-[13px] border transition-all"
          style={{
            backgroundColor: value === opt ? `${color}20` : "transparent",
            borderColor: value === opt ? color : "#6b6b8a",
            color: value === opt ? color : "#6b6b8a",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const MeasurementInput = ({ label, value, onChange, unit, placeholder }) => (
    <div className="flex flex-col gap-1">
      <p className="font-subheading font-bold text-[16px] text-text-low uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-center gap-1">
        <input
          type="number"
          step="0.1"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-background border border-text-low rounded-xl px-3 py-2.5 font-heading font-bold text-[18px] text-text-high outline-none focus:border-primary transition-colors"
        />
        <span className="font-body text-[13px] text-text-low w-6">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <div className="flex flex-col pb-28 px-4">

        {/* HEADER */}
        <div className="pt-4 pb-4 border-b border-text-low/20 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-surf h-10 w-10 rounded-lg border border-text-low flex items-center justify-center text-text-high shrink-0"
            >
              ←
            </button>
            <div className="flex flex-col">
              <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide">
                Progreso · Cuerpo
              </p>
              <h1 className="font-heading font-extrabold text-[20px] text-text-high leading-tight">
                Registro de hoy
              </h1>
            </div>
          </div>
        </div>

        {/* MEDIDAS CORPORALES */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide">
              Medidas corporales
            </p>
          </div>

          <div className="bg-surf border border-text-low rounded-2xl p-4 flex flex-col gap-4">
            {/* GRASA CORPORAL */}
            <div>
              <p className="font-subheading font-bold text-[16px] text-text-low uppercase tracking-wide mb-2">
                % Grasa corporal
              </p>
              <div className="flex items-center mb-3">
                <input
                  type="number"
                  step="0.1"
                  placeholder="14,5"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="flex-1 bg-background border border-text-low rounded-xl py-3 font-heading font-bold text-[24px] text-text-high outline-none focus:border-primary transition-colors text-center"
                />
              </div>
              <p className="font-subheading text-[14px] text-text-low mb-2">Selección rápida orientativa:</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Atlético", range: "8-12%",  value: "10" },
                  { label: "Fitness",  range: "12-18%", value: "15" },
                  { label: "Normal",   range: "18-25%", value: "21" },
                  { label: "Alto",     range: "25%+",   value: "27" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setBodyFat(opt.value)}
                    className={`px-2.5 py-1.5 rounded-xl border font-subheading font-bold text-[11px] transition-all ${
                      bodyFat === opt.value
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-text-low text-text-low"
                    }`}
                  >
                    {opt.label}
                    <span className="block font-body text-[10px] opacity-70">{opt.range}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-text-low/20" />

            <div className="flex gap-3 ">
              <MeasurementInput label="Cintura" value={waist} onChange={setWaist} unit="cm" placeholder="81" />
              <MeasurementInput label="Pecho"   value={chest} onChange={setChest} unit="cm" placeholder="100" />
            </div>

            <div className="flex gap-3 ">
              <MeasurementInput label="Brazo"   value={arm}   onChange={setArm}   unit="cm" placeholder="35" />
              <MeasurementInput label="Pierna"  value={leg}   onChange={setLeg}   unit="cm" placeholder="55" />
            </div>
          </div>
        </div>

        {/* SENSACIONES HOY */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide">
              Sensaciones hoy
            </p>
          </div>

          <div className="bg-surf border border-text-low rounded-2xl p-4 flex flex-col divide-y divide-text-low/20">

            <div className="pb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[16px]">🌙</span>
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                  Calidad del sueño
                </p>
              </div>
              <NumberSelector value={sleepQuality} onChange={setSleepQuality} color="#ff6b9d" />
            </div>

            <div className="py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[16px]">⚡</span>
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                  Nivel de energía
                </p>
              </div>
              <NumberSelector value={energyLevel} onChange={setEnergyLevel} color="#36d9b8" />
            </div>

            <div className="py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[16px]">😮‍💨</span>
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                  Fatiga muscular
                </p>
              </div>
              <OptionSelector
                options={["Ninguna", "Baja", "Media", "Alta"]}
                value={muscleFatigue}
                onChange={setMuscleFatigue}
                color="#36d9b8"
              />
            </div>

            <div className="py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[16px]">🦴</span>
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                  Molestias articulares
                </p>
              </div>
              <OptionSelector
                options={["Ninguna", "Leves", "Severas"]}
                value={jointPain}
                onChange={setJointPain}
                color="#36d9b8"
              />
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[16px]">🧠</span>
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                  Estrés percibido
                </p>
              </div>
              <NumberSelector value={stressLevel} onChange={setStressLevel} color="#f5a623" />
            </div>
          </div>
        </div>

        {/* NOTA AL ENTRENADOR */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[16px]">💬</span>
            <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide">
              Nota al entrenador
            </p>
          </div>
          <textarea
            placeholder="¿Cómo te has sentido hoy? ¿Alguna molestia, cambio en el plan de alimentación o algo que tu entrenador deba saber? Cuéntaselo aquí..."
            value={trainerNote}
            onChange={(e) => setTrainerNote(e.target.value)}
            rows={4}
            className="w-full bg-surf border border-text-low rounded-2xl px-4 py-3 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors resize-none placeholder:text-text-low/50"
          />
        </div>
      </div>

      {/* BOTON GUARDAR */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-background overflow-x-hidden">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-heading font-bold text-[16px] text-background flex items-center justify-center gap-2 transition-all"
          style={{ background: "linear-gradient(135deg, #ff6b9d, #f5a623)" }}
        >
          {saving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-background" />
          ) : (
            <>
              <span>✈</span>
              Guardar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DailyRegister;