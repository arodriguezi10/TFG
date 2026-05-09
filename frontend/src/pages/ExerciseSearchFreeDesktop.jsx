import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { Search, X, Plus, Check, Trash2, Lock, Crown, Zap, Dumbbell, Flame, ChevronRight, Swords, ChevronLeft } from "lucide-react";

const PREDEFINED = [
  { name: "Peck deck", muscle_group: "Pecho", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Press plano", muscle_group: "Pecho", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Flexiones", muscle_group: "Pecho", equipment: "Peso corporal", difficulty_level: "Principiante" },
  { name: "Jalon al pecho", muscle_group: "Espalda", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Pull over", muscle_group: "Espalda", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Hiperextensiones lumbares", muscle_group: "Espalda", equipment: "Peso libre", difficulty_level: "Principiante" },
  { name: "Elevaciones laterales", muscle_group: "Hombro", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Face pull", muscle_group: "Hombro", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Extension de cuadriceps", muscle_group: "Cuádriceps", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Curl femoral sentado", muscle_group: "Femoral", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Curl femoral tumbado", muscle_group: "Femoral", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Patada de gluteo", muscle_group: "Glúteo", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Abduccion de cadera", muscle_group: "Glúteo", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Curl martillo", muscle_group: "Bíceps", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Extension de triceps", muscle_group: "Tríceps", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Patada de triceps", muscle_group: "Tríceps", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Elevaciones de talones de pie", muscle_group: "Gemelo", equipment: "Peso libre", difficulty_level: "Principiante" },
  { name: "Elevaciones de talones sentado", muscle_group: "Gemelo", equipment: "Peso libre", difficulty_level: "Principiante" },
  { name: "Planchas", muscle_group: "Core", equipment: "Peso corporal", difficulty_level: "Principiante" },
  { name: "Crunch en polea", muscle_group: "Core", equipment: "Polea", difficulty_level: "Principiante" },
];

const INTERMEDIATE = [
  { name: "Press de banca plano", muscle_group: "Pecho", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Cruces en polea", muscle_group: "Pecho", equipment: "Polea", difficulty_level: "Intermedio" },
  { name: "Remo con barra", muscle_group: "Espalda", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Remo Gironda", muscle_group: "Espalda", equipment: "Maquina", difficulty_level: "Intermedio" },
  { name: "Press militar con mancuernas", muscle_group: "Hombro", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Elevaciones laterales con polea", muscle_group: "Hombro", equipment: "Polea", difficulty_level: "Intermedio" },
  { name: "Pajaros con mancuernas", muscle_group: "Hombro", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Hack", muscle_group: "Cuádriceps", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Peso muerto rumano", muscle_group: "Femoral", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Hip thrust con barra", muscle_group: "Glúteo", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Curl bayesian", muscle_group: "Bíceps", equipment: "Polea", difficulty_level: "Intermedio" },
  { name: "Curl predicador", muscle_group: "Bíceps", equipment: "Polea", difficulty_level: "Intermedio" },
  { name: "Extension tras nuca", muscle_group: "Tríceps", equipment: "Polea", difficulty_level: "Intermedio" },
  { name: "Elevaciones de piernas colgado", muscle_group: "Core", equipment: "Peso corporal", difficulty_level: "Intermedio" },
];

const ADVANCED = [
  { name: "Press inclinado con mancuernas", muscle_group: "Pecho", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Fondos en paralelas para pecho", muscle_group: "Pecho", equipment: "Peso corporal", difficulty_level: "Avanzado" },
  { name: "Fondos en paralelas para triceps", muscle_group: "Tríceps", equipment: "Peso corporal", difficulty_level: "Avanzado" },
  { name: "Dominadas", muscle_group: "Espalda", equipment: "Peso corporal", difficulty_level: "Avanzado" },
  { name: "Peso muerto convencional", muscle_group: "Espalda", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Press militar con barra", muscle_group: "Hombro", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Sentadilla con barra", muscle_group: "Cuádriceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Sentadilla con barra para gluteo", muscle_group: "Glúteo", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Prensa", muscle_group: "Cuádriceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Curl con barra", muscle_group: "Bíceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Curl alterno", muscle_group: "Bíceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Press frances con barra", muscle_group: "Tríceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Rueda abdominal", muscle_group: "Core", equipment: "Peso corporal", difficulty_level: "Avanzado" },
  { name: "Peso muerto convencional para cuadriceps", muscle_group: "Cuádriceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
];

const MUSCLE_GROUPS = ["Todos", "Pecho", "Hombro", "Tríceps", "Espalda", "Bíceps", "Cuádriceps", "Femoral", "Gemelo", "Glúteo", "Core"];

const ExerciseSearchFreeDesktop = () => {
  const { user } = useContext(AuthContext);
  const { addExercise, removeExercise, isExerciseSelected, selectedExercises } = useRoutine();
  const navigate = useNavigate();

  const [customExercises, setCustomExercises] = useState([]);
  const [predefinedFromDB, setPredefinedFromDB] = useState([]);
  const [intermediateFromDB, setIntermediateFromDB] = useState([]);
  const [advancedFromDB, setAdvancedFromDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("Todos");
  const [subscriptionTier, setSubscriptionTier] = useState("free");

  const hasEliteAccess = subscriptionTier === "elite";
  const customLimit = subscriptionTier === "free" ? 5 : 50;

  useEffect(() => {
    if (user) { loadUserSubscription(); loadData(); }
  }, [user]);

  const loadUserSubscription = async () => {
    try {
      const { data } = await supabase.from("users").select("subscription_tier").eq("id", user.id).single();
      setSubscriptionTier(data?.subscription_tier || "free");
    } catch { setSubscriptionTier("free"); }
  };

  const loadData = async () => {
    await insertIfNeeded(PREDEFINED, "Principiante", 20);
    await insertIfNeeded(INTERMEDIATE, "Intermedio", 14);
    await insertIfNeeded(ADVANCED, "Avanzado", 14);
    await fetchByLevel("Principiante", setPredefinedFromDB);
    await fetchByLevel("Intermedio", setIntermediateFromDB);
    await fetchByLevel("Avanzado", setAdvancedFromDB);
    await fetchCustom();
  };

  const insertIfNeeded = async (exercises, level, minCount) => {
    try {
      const { data: existing } = await supabase.from("exercises").select("name").eq("is_custom", false).eq("difficulty_level", level);
      if (existing && existing.length >= minCount) return;
      const existingNames = existing.map(e => e.name.toLowerCase().trim());
      const toInsert = exercises.filter(e => !existingNames.includes(e.name.toLowerCase().trim())).map(e => ({ ...e, is_custom: false, user_id: null }));
      if (toInsert.length === 0) return;
      await supabase.from("exercises").insert(toInsert);
    } catch (err) { console.error(err); }
  };

  const fetchByLevel = async (level, setter) => {
    try {
      const { data } = await supabase.from("exercises").select("*").eq("is_custom", false).eq("difficulty_level", level).order("muscle_group");
      setter(data || []);
    } catch { setter([]); }
  };

  const fetchCustom = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from("exercises").select("*").eq("is_custom", true).eq("user_id", user.id).order("created_at", { ascending: false });
      setCustomExercises(data || []);
    } catch { setCustomExercises([]); }
    finally { setLoading(false); }
  };

  const filter = (list) => list.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMuscle = muscleFilter === "Todos" || e.muscle_group === muscleFilter;
    return matchSearch && matchMuscle;
  });

  const handleToggle = (exercise) => {
    isExerciseSelected(exercise.id) ? removeExercise(exercise.id) : addExercise(exercise);
  };

  const handleDelete = async (exercise) => {
    if (!window.confirm(`Eliminar "${exercise.name}" permanentemente?`)) return;
    try {
      await supabase.from("exercises").delete().eq("id", exercise.id).eq("user_id", user.id);
      if (isExerciseSelected(exercise.id)) removeExercise(exercise.id);
      await fetchCustom();
    } catch (err) { console.error(err); }
  };

  const ExerciseRow = ({ exercise, iconEl, iconBg, iconBorder, iconColor, badgeBg, badgeBorder, badgeColor, isCustom = false }) => {
    const isSelected = isExerciseSelected(exercise.id);
    return (
      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surf transition-colors">
        <span className={`${iconBg} h-10 w-10 rounded-xl border ${iconBorder} ${iconColor} flex items-center justify-center shrink-0`}>{iconEl}</span>
        <div className="flex flex-col flex-1 min-w-0">
          <p className="font-subheading font-bold text-[14px] text-text-high truncate">{exercise.name}</p>
          <p className="font-body text-[11px] text-text-low">{exercise.muscle_group} · {exercise.equipment}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded-full border font-body text-[10px] ${badgeBg} ${badgeBorder} ${badgeColor}`}>{exercise.difficulty_level}</span>
          {isCustom && (
            <button onClick={() => handleDelete(exercise)} className="h-7 w-7 rounded-lg border border-red bg-surf flex items-center justify-center text-red hover:bg-red/10 transition-colors">
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={() => handleToggle(exercise)} className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary text-text-high" : "bg-surf border-text-low text-text-low hover:bg-primary hover:border-primary hover:text-text-high"}`}>
            {isSelected ? <Check size={15} /> : <Plus size={15} />}
          </button>
        </div>
      </div>
    );
  };

  const SectionBlock = ({ title, icon, exercises, iconBg, iconBorder, iconColor, badgeBg, badgeBorder, badgeColor, isCustom = false }) => {
    const filtered = filter(exercises);
    if (filtered.length === 0) return null;
    return (
      <div>
        <p className={`font-subheading font-bold text-[12px] uppercase tracking-wide mb-2 flex items-center gap-1.5 ${iconColor}`}>{icon} {title}</p>
        <div className="bg-surf border border-text-low/20 rounded-2xl overflow-hidden divide-y divide-text-low/10">
          {filtered.map(e => <ExerciseRow key={e.id} exercise={e} iconEl={icon} iconBg={iconBg} iconBorder={iconBorder} iconColor={iconColor} badgeBg={badgeBg} badgeBorder={badgeBorder} badgeColor={badgeColor} isCustom={isCustom} />)}
        </div>
      </div>
    );
  };

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="font-body text-text-low">Cargando...</p></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Rutinas</p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high leading-tight">Anadir ejercicio</h1>
          </div>
        </div>
        <Button variant="outlined" text={selectedExercises.length > 0 ? `Anadir ${selectedExercises.length} ejercicio${selectedExercises.length > 1 ? "s" : ""}` : "Selecciona ejercicios"} bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-auto px-6" onClick={() => navigate(-1)} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR FILTROS */}
        <aside className="w-56 shrink-0 border-r border-text-low/20 p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-low" />
            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-text-low rounded-xl pl-8 pr-3 py-2 font-body text-[13px] text-text-high placeholder-text-low outline-none focus:border-primary transition-colors" />
          </div>

           <button onClick={() => { if (customExercises.length >= customLimit) { alert(`Limite de ${customLimit} ejercicios`); return; } navigate("/createPersonalExercise"); }}
              className="w-full bg-primary rounded-xl p-3 flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Zap size={16} className="text-text-high shrink-0" />
              <p className="font-body text-[13px] text-text-high">Crear ejercicio</p>
            </button>

          <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mt-2">Grupo muscular</p>
          <div className="flex flex-col gap-1">
            {MUSCLE_GROUPS.map(m => (
              <button key={m} onClick={() => setMuscleFilter(m)} className={`w-full text-left px-3 py-2 rounded-xl font-subheading font-bold text-[13px] transition-colors ${muscleFilter === m ? "bg-primary/10 text-primary border border-primary/20" : "text-text-low hover:bg-surf hover:text-text-high"}`}>{m}</button>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-2">
            {!hasEliteAccess && (
              <button onClick={() => navigate("/subscription")} className="w-full bg-orange-bg2 border border-orange rounded-xl p-3 flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Crown size={16} className="text-orange shrink-0" />
                <p className="font-body text-[12px] text-text-low text-left">Desbloquea ejercicios <span className="text-orange">Elite</span></p>
              </button>
            )}
          </div>
        </aside>

        {/* LISTA EJERCICIOS */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {customExercises.length > 0 && (
            <SectionBlock title={`MIS EJERCICIOS (${customExercises.length}/${customLimit})`} icon={<Zap size={14} />} exercises={customExercises} iconBg="bg-primary-bg" iconBorder="border-primary" iconColor="text-orange" badgeBg="bg-primary-bg" badgeBorder="border-primary" badgeColor="text-primary" isCustom />
          )}

          <SectionBlock title="PRINCIPIANTE" icon={<Dumbbell size={14} />} exercises={predefinedFromDB} iconBg="bg-green-bg2" iconBorder="border-accent2" iconColor="text-accent2" badgeBg="bg-green-bg2" badgeBorder="border-accent2" badgeColor="text-accent2" />

          {hasEliteAccess ? (
            <>
              <SectionBlock title="INTERMEDIO" icon={<Flame size={14} />} exercises={intermediateFromDB} iconBg="bg-orange-bg2" iconBorder="border-orange" iconColor="text-orange" badgeBg="bg-orange-bg2" badgeBorder="border-orange" badgeColor="text-orange" />
              <SectionBlock title="AVANZADO" icon={<Swords size={14} />} exercises={advancedFromDB} iconBg="bg-accent1-bg1" iconBorder="border-accent1" iconColor="text-accent1" badgeBg="bg-accent1-bg1" badgeBorder="border-accent1" badgeColor="text-accent1" />
            </>
          ) : (
            <>
              {[{ title: "INTERMEDIO", color: "text-orange" }, { title: "AVANZADO", color: "text-accent1" }].map(({ title, color }) => (
                <div key={title} className="opacity-50 pointer-events-none">
                  <p className={`font-subheading font-bold text-[12px] uppercase tracking-wide mb-2 flex items-center gap-1.5 ${color}`}><Lock size={14} /> {title}</p>
                  <div className="bg-surf border border-text-low/20 rounded-2xl p-8 flex flex-col items-center gap-3">
                    <Lock size={32} className="text-text-low" />
                    <p className="font-heading font-bold text-[15px] text-text-high">Nivel bloqueado</p>
                    <p className="font-body text-[13px] text-text-low text-center">Actualiza a Plan Elite para desbloquear</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {filter(customExercises).length === 0 && filter(predefinedFromDB).length === 0 && filter(intermediateFromDB).length === 0 && filter(advancedFromDB).length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Search size={48} className="text-text-low" />
              <p className="font-heading font-bold text-[18px] text-text-high">No se encontraron ejercicios</p>
              <p className="font-body text-[14px] text-text-low">Intenta con otra busqueda o filtro</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExerciseSearchFreeDesktop;