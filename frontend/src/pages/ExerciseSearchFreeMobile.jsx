import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRoutine } from "../context/RoutinesContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { Search, X, Plus, Check, Trash2, Lock, Crown, Zap, Dumbbell, Flame, ChevronRight, Swords } from "lucide-react";

const PREDEFINED = [
  { name: "Peck deck", muscle_group: "Pecho", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Press plano", muscle_group: "Pecho", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Flexiones", muscle_group: "Pecho", equipment: "Peso corporal", difficulty_level: "Principiante" },
  { name: "Jalon al pecho", muscle_group: "Espalda", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Pull over", muscle_group: "Espalda", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Hiperextensiones lumbares", muscle_group: "Espalda", equipment: "Peso libre", difficulty_level: "Principiante" },
  { name: "Elevaciones laterales", muscle_group: "Hombro", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Face pull", muscle_group: "Hombro", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Extension de cuadriceps", muscle_group: "Cuadriceps", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Curl femoral sentado", muscle_group: "Femoral", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Curl femoral tumbado", muscle_group: "Femoral", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Patada de gluteo", muscle_group: "Gluteo", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Abduccion de cadera", muscle_group: "Gluteo", equipment: "Maquina", difficulty_level: "Principiante" },
  { name: "Curl martillo", muscle_group: "Biceps", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Extension de triceps", muscle_group: "Triceps", equipment: "Polea", difficulty_level: "Principiante" },
  { name: "Patada de triceps", muscle_group: "Triceps", equipment: "Polea", difficulty_level: "Principiante" },
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
  { name: "Hack", muscle_group: "Cuadriceps", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Peso muerto rumano", muscle_group: "Femoral", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Hip thrust con barra", muscle_group: "Gluteo", equipment: "Peso libre", difficulty_level: "Intermedio" },
  { name: "Curl bayesian", muscle_group: "Biceps", equipment: "Polea", difficulty_level: "Intermedio" },
  { name: "Curl predicador", muscle_group: "Biceps", equipment: "Polea", difficulty_level: "Intermedio" },
  { name: "Extension tras nuca", muscle_group: "Triceps", equipment: "Polea", difficulty_level: "Intermedio" },
  { name: "Elevaciones de piernas colgado", muscle_group: "Core", equipment: "Peso corporal", difficulty_level: "Intermedio" },
];

const ADVANCED = [
  { name: "Press inclinado con mancuernas", muscle_group: "Pecho", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Fondos en paralelas para pecho", muscle_group: "Pecho", equipment: "Peso corporal", difficulty_level: "Avanzado" },
  { name: "Fondos en paralelas para triceps", muscle_group: "Triceps", equipment: "Peso corporal", difficulty_level: "Avanzado" },
  { name: "Dominadas", muscle_group: "Espalda", equipment: "Peso corporal", difficulty_level: "Avanzado" },
  { name: "Peso muerto convencional", muscle_group: "Espalda", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Press militar con barra", muscle_group: "Hombro", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Sentadilla con barra", muscle_group: "Cuadriceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Sentadilla con barra para gluteo", muscle_group: "Gluteo", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Prensa", muscle_group: "Cuadriceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Curl con barra", muscle_group: "Biceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Curl alterno", muscle_group: "Biceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Press frances con barra", muscle_group: "Triceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
  { name: "Rueda abdominal", muscle_group: "Core", equipment: "Peso corporal", difficulty_level: "Avanzado" },
  { name: "Peso muerto convencional para cuadriceps", muscle_group: "Cuadriceps", equipment: "Peso libre", difficulty_level: "Avanzado" },
];

const MUSCLE_GROUPS = ["Todos", "Pecho", "Hombro", "Triceps", "Espalda", "Biceps", "Cuadriceps", "Femoral", "Gemelo", "Gluteo", "Core"];

const ExerciseSearchFreeMobile = () => {
  const { user } = useContext(AuthContext);
  const { addExercise, removeExercise, isExerciseSelected, selectedExercises } = useRoutine();
  const navigate = useNavigate();
  const location = useLocation();

  const [customExercises, setCustomExercises] = useState([]);
  const [predefinedFromDB, setPredefinedFromDB] = useState([]);
  const [intermediateFromDB, setIntermediateFromDB] = useState([]);
  const [advancedFromDB, setAdvancedFromDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("Todos");
  const [subscriptionTier, setSubscriptionTier] = useState("free");

  const isSearchActive = location.pathname === "/exerciseSearchFree" || !location.pathname.includes("config");
  const isConfigActive = location.pathname.includes("config");
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

  const handleCreateExercise = () => {
    if (customExercises.length >= customLimit) { alert(`Limite de ${customLimit} ejercicios alcanzado`); return; }
    navigate("/createPersonalExercise");
  };

  const ExerciseCard = ({ exercise, iconEl, iconBg, iconBorder, iconColor, badgeBg, badgeBorder, badgeColor, isCustom = false }) => {
    const isSelected = isExerciseSelected(exercise.id);
    return (
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`${iconBg} h-12.5 w-12.5 rounded-xl border ${iconBorder} ${iconColor} flex items-center justify-center flex-shrink-0`}>{iconEl}</span>
            <div className="flex flex-col">
              <p className="font-subheading font-bold text-[16px] text-text-high">{exercise.name}</p>
              <p className="font-body text-[12px] text-text-low">{exercise.muscle_group} · {exercise.equipment}</p>
              <div className="mt-0.75 flex gap-1.5">
                <span className={`px-2.5 rounded-2xl border font-body text-[12px] ${badgeBg} ${badgeBorder} ${badgeColor}`}>{exercise.difficulty_level}</span>
                {isCustom && <span className="bg-surface px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">Personalizado</span>}
                {!isCustom && <span className="bg-surface px-2.5 rounded-2xl border border-text-low font-body text-[12px] text-text-low">{exercise.equipment}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button onClick={() => handleToggle(exercise)} className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary text-text-high" : "bg-surf border-text-low text-text-low hover:bg-primary hover:border-primary hover:text-text-high"}`}>
              {isSelected ? <Check size={16} /> : <Plus size={16} />}
            </button>
            {isCustom && (
              <button onClick={() => handleDelete(exercise)} className="h-8 w-8 rounded-lg border border-red bg-surf flex items-center justify-center text-red hover:bg-red/10 transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="font-body text-text-low">Cargando...</p></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <section className="w-full flex flex-col items-center">
        <div className="w-55 h-11.25 bg-surf rounded-2xl border border-text-low p-2.5 gap-2.5 flex items-center">
          <button onClick={() => navigate("/exerciseSearchFree")} className={`rounded-2xl transition-colors duration-200 ${isSearchActive ? "bg-primary" : "bg-transparent"}`}>
            <p className={`font-subheading font-bold text-[16px] px-3.75 py-1.25 ${isSearchActive ? "text-text-high" : "text-text-low"}`}>Buscar</p>
          </button>
          <button onClick={() => navigate("/configExerciseFree")} className={`rounded-2xl transition-colors duration-200 ${isConfigActive ? "bg-primary" : "bg-transparent"}`}>
            <p className={`font-subheading font-bold text-[16px] px-3.75 py-1.25 ${isConfigActive ? "text-text-high" : "text-text-low"}`}>Configurar</p>
          </button>
        </div>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <p className="font-heading font-extrabold text-[18px] text-text-high">Anadir ejercicio</p>
          <button onClick={() => navigate(-1)} className="bg-surf h-10 w-10 rounded-lg border border-text-low flex items-center justify-center text-text-low hover:bg-surface transition-colors">
            <X size={18} />
          </button>
        </div>
        <Input variant="outlined" p="p-[10px]" placeholder="Busca un ejercicio" type="text" name="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <div className="flex gap-1.25 overflow-x-auto scrollbar-hide">
          {MUSCLE_GROUPS.map(m => (
            <button key={m} onClick={() => setMuscleFilter(m)} className={`px-2.5 py-px rounded-2xl border font-body text-[16px] whitespace-nowrap transition-colors ${muscleFilter === m ? "bg-primary-bg border-primary text-primary" : "bg-surf border-text-low text-text-low"}`}>{m}</button>
          ))}
        </div>
      </section>

      {!hasEliteAccess && (
        <section className="mt-4 w-full px-4">
          <button onClick={() => navigate("/subscription")} className="w-full h-20 rounded-2xl bg-primary-bg border border-primary p-4 flex justify-between hover:bg-primary/5 transition-colors">
            <div className="w-[90%] flex items-center gap-3.75">
              <Crown size={20} className="text-orange shrink-0" />
              <p className="font-body text-[16px] text-text-low text-left">Amplia tus posibilidades con el <span className="text-primary">Plan Elite.</span> +28 ejercicios de nivel intermedio y avanzado.</p>
            </div>
            <div className="flex items-center text-primary"><ChevronRight size={20} /></div>
          </button>
        </section>
      )}

      <section className="mt-4 w-full px-4">
        <button onClick={handleCreateExercise} className="w-full h-17.5 rounded-2xl bg-primary border border-primary p-4 flex justify-between hover:opacity-90 transition-opacity">
          <div className="w-[90%] flex items-center gap-3.75">
            <Zap size={20} className="text-text-high shrink-0" />
            <p className="font-body text-[16px] text-text-high">Crea tus propios ejercicios {customExercises.length >= customLimit && <span className="text-text-high/60">({customExercises.length}/{customLimit} - Limite alcanzado)</span>}</p>
          </div>
          <div className="flex items-center text-text-high"><ChevronRight size={20} /></div>
        </button>
      </section>

      {filter(customExercises).length > 0 && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-primary flex items-center gap-1.5"><Zap size={18} className="text-orange" /> MIS EJERCICIOS ({customExercises.length}/{customLimit})</p>
          {loading ? <Card><p className="text-text-low text-center">Cargando...</p></Card> : filter(customExercises).map(e => (
            <ExerciseCard key={e.id} exercise={e} iconEl={<Zap size={20} />} iconBg="bg-primary-bg" iconBorder="border-primary" iconColor="text-orange" badgeBg={e.difficulty_level === "Principiante" ? "bg-green-bg2" : e.difficulty_level === "Intermedio" ? "bg-orange-bg2" : "bg-accent1-bg1"} badgeBorder={e.difficulty_level === "Principiante" ? "border-accent2" : e.difficulty_level === "Intermedio" ? "border-orange" : "border-accent1"} badgeColor={e.difficulty_level === "Principiante" ? "text-accent2" : e.difficulty_level === "Intermedio" ? "text-orange" : "text-accent1"} isCustom />
          ))}
        </section>
      )}

      {filter(predefinedFromDB).length > 0 && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-accent2 flex items-center gap-1.5"><Dumbbell size={18} /> PRINCIPIANTE</p>
          {filter(predefinedFromDB).map(e => (
            <ExerciseCard key={e.id} exercise={e} iconEl={<Dumbbell size={20} />} iconBg="bg-green-bg2" iconBorder="border-accent2" iconColor="text-accent2" badgeBg="bg-green-bg2" badgeBorder="border-accent2" badgeColor="text-accent2" />
          ))}
        </section>
      )}

      {hasEliteAccess && filter(intermediateFromDB).length > 0 && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-orange flex items-center gap-1.5"><Flame size={18} /> INTERMEDIO</p>
          {filter(intermediateFromDB).map(e => (
            <ExerciseCard key={e.id} exercise={e} iconEl={<Flame size={20} />} iconBg="bg-orange-bg2" iconBorder="border-orange" iconColor="text-orange" badgeBg="bg-orange-bg2" badgeBorder="border-orange" badgeColor="text-orange" />
          ))}
        </section>
      )}

      {hasEliteAccess && filter(advancedFromDB).length > 0 && (
        <section className="mt-4 pb-17.5 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-accent1 flex items-center gap-1.5"><Swords size={18} /> AVANZADO</p>
          {filter(advancedFromDB).map(e => (
            <ExerciseCard key={e.id} exercise={e} iconEl={<Swords size={20} />} iconBg="bg-accent1-bg1" iconBorder="border-accent1" iconColor="text-accent1" badgeBg="bg-accent1-bg1" badgeBorder="border-accent1" badgeColor="text-accent1" />
          ))}
        </section>
      )}

      {!hasEliteAccess && (
        <>
          <section className="mt-4 w-full px-4 flex flex-col gap-2.5 opacity-50 pointer-events-none">
            <p className="font-subheading font-bold text-[16px] text-orange flex items-center gap-1.5"><Lock size={18} /> INTERMEDIO</p>
            <Card>
              <div className="flex flex-col items-center justify-center py-7.5 gap-3">
                <Lock size={40} className="text-orange" />
                <p className="font-heading font-bold text-[16px] text-text-high text-center">Nivel bloqueado</p>
                <p className="font-body text-[13px] text-text-low text-center px-5">Actualiza a Plan Elite para acceder a ejercicios de nivel intermedio</p>
              </div>
            </Card>
          </section>
          <section className="mt-4 pb-17.5 w-full px-4 flex flex-col gap-2.5 opacity-50 pointer-events-none">
            <p className="font-subheading font-bold text-[16px] text-accent1 flex items-center gap-1.5"><Lock size={18} /> AVANZADO</p>
            <Card>
              <div className="flex flex-col items-center justify-center py-7.5 gap-3">
                <Lock size={40} className="text-accent1" />
                <p className="font-heading font-bold text-[16px] text-text-high text-center">Nivel bloqueado</p>
                <p className="font-body text-[13px] text-text-low text-center px-5">Actualiza a Plan Elite para acceder a ejercicios de nivel avanzado</p>
              </div>
            </Card>
          </section>
        </>
      )}

      {filter(customExercises).length === 0 && filter(predefinedFromDB).length === 0 && filter(intermediateFromDB).length === 0 && filter(advancedFromDB).length === 0 && !loading && (
        <section className="mt-4 pb-17.5 w-full px-4">
          <Card>
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <Search size={48} className="text-text-low" />
              <p className="font-heading font-bold text-[18px] text-text-high text-center">No se encontraron ejercicios</p>
              <p className="font-body text-[14px] text-text-low text-center">Intenta con otra busqueda o filtro</p>
            </div>
          </Card>
        </section>
      )}

      <section className="mt-4 w-full px-4 fixed bottom-1">
        <Button variant="outlined" text={selectedExercises.length > 0 ? `Anadir ${selectedExercises.length} ejercicio${selectedExercises.length > 1 ? "s" : ""}` : "Selecciona ejercicios"} bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-[100%]" onClick={() => navigate(-1)} />
      </section>
    </div>
  );
};

export default ExerciseSearchFreeMobile;