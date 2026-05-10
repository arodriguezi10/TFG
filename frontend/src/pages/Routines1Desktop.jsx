import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";
import ModalRoutineOptions from "../components/ModalRoutineOptions";
import { useTargetUser } from "../hooks/useTargetUser"; 
import { Search, Plus, Calendar, Clock, Lock, Crown, MoreVertical, ClipboardList, ChevronRight, Filter } from "lucide-react";

const Routines1Desktop = () => {
  const navigate = useNavigate();
  //const { user } = useContext(AuthContext);
  const { targetUserId } = useTargetUser();

  const [routines, setRoutines] = useState([]);
  const [filteredRoutines, setFilteredRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    if (targetUserId) { fetchRoutines(); loadUserSubscription(); }
  }, [targetUserId]);

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await supabase.from("users").select("subscription_tier").eq("id", targetUserId).single();
      if (error) { setSubscriptionTier("free"); return; }
      setSubscriptionTier(data?.subscription_tier || "free");
    } catch { setSubscriptionTier("free"); }
  };

  useEffect(() => {
    const base = showHidden ? routines : routines.filter(r => !r.is_hidden);
    if (searchQuery.trim() === "") { setFilteredRoutines(base); return; }
    setFilteredRoutines(base.filter(r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.training_type?.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [searchQuery, routines, showHidden]);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("routines")
        .select(`*, routine_exercises(id, exercise_id, order_index, target_sets, exercises(name, muscle_group))`)
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });
      if (error) { console.error(error); return; }
      setRoutines(data || []);
      setFilteredRoutines(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDeleteRoutine = async (routineId) => {
    if (!window.confirm("Seguro que quieres eliminar esta rutina permanentemente?")) return;
    try {
      const { error } = await supabase.from("routines").delete().eq("id", routineId).eq("user_id", targetUserId);
      if (error) { alert("Error al eliminar la rutina"); return; }
      setRoutines(routines.filter(r => r.id !== routineId));
      setFilteredRoutines(filteredRoutines.filter(r => r.id !== routineId));
    } catch (err) { console.error(err); }
  };

  const handleOpenOptions = (e, routine) => {
    e.stopPropagation();
    setSelectedRoutine(routine);
    setModalOpen(true);
  };

  const handleDuplicate = async () => {
    try {
      const { data: original, error: fetchError } = await supabase.from("routines").select(`*, routine_exercises(*)`).eq("id", selectedRoutine.id).single();
      if (fetchError) throw fetchError;
      const { data: newRoutine, error: insertError } = await supabase.from("routines").insert({
        user_id: original.user_id, name: `${original.name} (copia)`, description: original.description,
        training_type: original.training_type, estimated_duration_min: original.estimated_duration_min,
        assigned_days: original.assigned_days, target_muscle_groups: original.target_muscle_groups,
      }).select().single();
      if (insertError) throw insertError;
      if (original.routine_exercises?.length > 0) {
        const { error: exError } = await supabase.from("routine_exercises").insert(
          original.routine_exercises.map(ex => ({
            routine_id: newRoutine.id, exercise_id: ex.exercise_id, order_index: ex.order_index,
            target_sets: ex.target_sets, target_reps: ex.target_reps, target_weight: ex.target_weight,
            target_rir: ex.target_rir, rest_seconds: ex.rest_seconds, intensity_technique: ex.intensity_technique,
          }))
        );
        if (exError) throw exError;
      }
      await fetchRoutines();
    } catch (err) { alert("Error al duplicar: " + err.message); }
  };

  const handleHide = async () => {
    try {
      const newHiddenState = !selectedRoutine.is_hidden;
      const { error } = await supabase.from("routines").update({ is_hidden: newHiddenState }).eq("id", selectedRoutine.id).eq("user_id", targetUserId);
      if (error) { alert("Error al ocultar la rutina"); return; }
      setRoutines(prev => prev.map(r => r.id === selectedRoutine.id ? { ...r, is_hidden: newHiddenState } : r));
    } catch (err) { console.error(err); }
  };

  const getRoutineStats = (routine) => ({
    exerciseCount: routine.routine_exercises?.length || 0,
    totalSets: routine.routine_exercises?.reduce((sum, ex) => sum + (ex.target_sets || 0), 0) || 0,
    duration: routine.estimated_duration_min || 0,
  });

  const parseDays = (daysJson) => {
    try {
      const days = JSON.parse(daysJson);
      return Array.isArray(days) && days.length > 0 ? days.map(d => d.substring(0, 3)).join(", ") : "No asignado";
    } catch { return "No asignado"; }
  };

  const parseMuscles = (musclesJson) => {
    try {
      const muscles = JSON.parse(musclesJson);
      return Array.isArray(muscles) && muscles.length > 0
        ? muscles.slice(0, 3).join(", ") + (muscles.length > 3 ? "..." : "")
        : "Sin especificar";
    } catch { return "Sin especificar"; }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-body text-text-low">Cargando rutinas...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-1">Biblioteca</p>
          <h1 className="font-heading font-extrabold text-[36px] text-text-high leading-tight">Rutinas</h1>
          {routines.length > 0 && (
            <p className="font-body text-[14px] text-text-low mt-1">
              {routines.filter(r => !r.is_hidden).length} {routines.filter(r => !r.is_hidden).length === 1 ? "rutina" : "rutinas"}
              {routines.filter(r => r.is_hidden).length > 0 && (
                <button onClick={() => setShowHidden(!showHidden)} className="ml-3 text-accent1 underline text-[13px]">
                  {showHidden ? "Ocultar ocultas" : `+ ${routines.filter(r => r.is_hidden).length} ocultas`}
                </button>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* BUSCADOR */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-low" />
            <input
              type="text"
              placeholder="Buscar rutina..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surf border border-text-low rounded-xl pl-9 pr-4 py-2.5 font-body text-[14px] text-text-high placeholder-text-low outline-none focus:border-accent1 transition-colors w-64"
            />
          </div>

          {subscriptionTier !== "elite" && (
            <button onClick={() => navigate("/subscription")} className="flex items-center gap-2 bg-orange-bg2 border border-orange px-4 py-2.5 rounded-xl font-subheading font-bold text-[13px] text-orange hover:opacity-80 transition-opacity">
              <Lock size={14} />
              Progresion Elite
            </button>
          )}

          {subscriptionTier === "elite" && (
            <button onClick={() => navigate("/progression")} className="flex items-center gap-2 bg-surf border border-text-low px-4 py-2.5 rounded-xl font-subheading font-bold text-[13px] text-text-low hover:border-accent1 hover:text-accent1 transition-colors">
              Progresion
            </button>
          )}

          <button onClick={() => navigate("/createRoutines1")} className="flex items-center gap-2 bg-accent1 px-4 py-2.5 rounded-xl font-subheading font-bold text-[13px] text-text-high hover:opacity-80 transition-opacity">
            <Plus size={16} />
            Nueva rutina
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-8 py-6">
        {routines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="bg-surf h-24 w-24 rounded-3xl border border-accent1/20 text-accent1 flex items-center justify-center">
              <ClipboardList size={48} />
            </div>
            <p className="bg-surf px-4 py-1 rounded-2xl border border-text-low font-subheading font-semibold text-[16px] text-text-low">Sin rutinas todavia</p>
            <p className="font-heading font-extrabold text-[32px] text-text-high text-center leading-tight">
              Empieza a construir tu <span className="text-accent1">entrenamiento</span>
            </p>
            <p className="font-body text-[16px] text-text-low text-center max-w-md">Crea tu primera rutina y disena cada sesion con los ejercicios que necesitas.</p>
            <button onClick={() => navigate("/createRoutines1")} className="mt-2 flex items-center gap-2 bg-accent1 px-6 py-3 rounded-xl font-subheading font-bold text-[15px] text-text-high hover:opacity-80 transition-opacity">
              <Plus size={18} />
              Crear rutina
            </button>
          </div>
        ) : filteredRoutines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Search size={48} className="text-text-low" />
            <p className="font-heading font-bold text-[20px] text-text-high">No se encontraron rutinas</p>
            <p className="font-body text-[14px] text-text-low">Intenta con otra busqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRoutines.map((routine) => {
              const stats = getRoutineStats(routine);
              return (
                <div key={routine.id} className="bg-surf border border-text-low/30 rounded-2xl p-5 flex flex-col gap-4 hover:border-accent1/30 transition-colors">
                  {/* CABECERA */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-heading font-bold text-[18px] text-text-high">{routine.name}</h3>
                        {routine.training_type && (
                          <span className="bg-accent1-bg1 px-2 py-0.5 rounded-xl border border-accent1 font-body text-[11px] text-accent1">{routine.training_type}</span>
                        )}
                      </div>
                      {routine.description && <p className="font-body text-[13px] text-text-low">{routine.description}</p>}
                    </div>
                    <button onClick={(e) => handleOpenOptions(e, routine)} className="bg-background h-8 w-8 rounded-lg border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors shrink-0 ml-2">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {/* META */}
                  <div className="flex gap-3 text-[12px] text-text-low">
                    <span className="flex items-center gap-1"><Calendar size={12} />{parseDays(routine.assigned_days)}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{stats.duration} min</span>
                  </div>

                  <hr className="border-text-low/30" />

                  {/* STATS */}
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="font-heading font-bold text-[22px] text-accent1">{stats.exerciseCount}</p>
                      <p className="font-body text-[11px] text-text-low">Ejercicios</p>
                    </div>
                    <div className="w-px bg-text-low/30" />
                    <div className="text-center">
                      <p className="font-heading font-bold text-[22px] text-accent1">{stats.totalSets}</p>
                      <p className="font-body text-[11px] text-text-low">Series</p>
                    </div>
                    <div className="w-px bg-text-low/30" />
                    <div className="text-center">
                      <p className="font-heading font-bold text-[22px] text-accent1">{stats.duration}</p>
                      <p className="font-body text-[11px] text-text-low">Minutos</p>
                    </div>
                  </div>

                  {routine.target_muscle_groups && (
                    <div className="bg-background rounded-lg p-2.5">
                      <p className="font-body text-[11px] text-text-low mb-1">Grupos musculares:</p>
                      <p className="font-body text-[12px] text-text-high">{parseMuscles(routine.target_muscle_groups)}</p>
                    </div>
                  )}

                  <button onClick={() => navigate(`/editRoutine/${routine.id}`)} className="w-full bg-accent1 py-2.5 rounded-xl font-body text-[13px] text-text-high hover:bg-accent1/80 transition-colors mt-auto">
                    Ver rutina
                  </button>
                </div>
              );
            })}

            {/* CARD CREAR */}
            <button onClick={() => navigate("/createRoutines1")} className="bg-surf border border-dashed border-text-low/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-accent1/50 hover:bg-accent1/5 transition-colors min-h-48">
              <div className="h-12 w-12 rounded-xl bg-accent1/10 border border-accent1/30 flex items-center justify-center">
                <Plus size={24} className="text-accent1" />
              </div>
              <p className="font-subheading font-bold text-[14px] text-accent1">Nueva rutina</p>
            </button>
          </div>
        )}
      </div>

      <ModalRoutineOptions
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        routine={selectedRoutine}
        onDelete={() => handleDeleteRoutine(selectedRoutine?.id)}
        onDuplicate={handleDuplicate}
        onHistory={() => navigate(`/routineHistory/${selectedRoutine?.id}`)}
        onShare={() => alert("Funcion de compartir proximamente")}
        onHide={handleHide}
      />
    </div>
  );
};

export default Routines1Desktop;